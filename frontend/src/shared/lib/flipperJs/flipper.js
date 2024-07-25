import { LineBreakTransformer, PromptBreakTransformer, ProtobufTransformer } from './transformers'
import { PB } from './protobufCompiled'
import { createNanoEvents } from 'nanoevents'
import { RPC_TIMEOUT } from './util'
import asyncSleep from 'simple-async-sleep'

import * as storage from './commands/storage'
import * as system from './commands/system'
import * as application from './commands/application'
import * as gui from './commands/gui'
import * as gpio from './commands/gpio'
import * as property from './commands/property'

const RPCSubSystems = {
  storage,
  system,
  application,
  gui,
  gpio,
  property
}

export default class Flipper {
  constructor ({
    filters = [{ usbVendorId: 1155, usbProductId: 22336 }]
  } = {}) {
    // Device VID/PID
    this.filters = filters
    // Serial
    this.serialWorker = new Worker(new URL('./serialWorker.js', import.meta.url))
    this.serialWorker.onmessage = (e) => {
      switch (e.data.message) {
        case 'connectionStatus':
          if (e.data.error) {
            this.emitter.emit(e.data.operation + 'Status', e.data.error)
          } else if (e.data.status) {
            this.emitter.emit(e.data.operation + 'Status', e.data.status)
          }
          break
        case 'getReadableStream':
          console.log('getReadableStream')
          this.emitter.emit('getReadableStream')
          this.readable = e.data.stream
          this.getReader()
          break
        case 'getWritableStream':
          this.emitter.emit('getWritableStream')
          this.writable = e.data.stream
          this.getWriter()
          break
      }
    }
    this.readable = null
    this.reader = null
    this.readingMode = {
      type: 'text',
      transform: 'promptBreak'
    }
    this.writable = null
    this.writer = null
    // RPC
    this.commandQueue = [
      {
        commandId: 0,
        requestType: 'unsolicited',
        chunks: [],
        error: undefined
      }
    ]
    this.emitter = createNanoEvents()
  }

  getReader () {
    if (this.readingMode.type === 'text') {
      // eslint-disable-next-line no-undef
      const textDecoder = new TextDecoderStream()
      console.log('Is this.readable locked?', this.readable.locked);
      this.readableStreamClosed = this.readable.pipeTo(textDecoder.writable)
        // .then((d) => {
        //   console.log('pipeTo succeeded.');

        //   return d
        // })
        // .catch((e) => {
        //   console.error('pipeTo error:', e);

        //   return e
        // })
        // .finally(() => {
        //   console.log('pipeTo operation complete.');
        // });

      if (this.readingMode.transform.length) {
        let transformer
        switch (this.readingMode.transform) {
          case 'lineBreak':
            transformer = new LineBreakTransformer()
            break
          case 'promptBreak':
            transformer = new PromptBreakTransformer()
            break
          default:
            throw new Error('Invalid reading mode')
        }

        this.reader = textDecoder.readable
          .pipeThrough(new TransformStream(transformer))
          .getReader()
      } else {
        this.reader = textDecoder.readable.getReader()
      }
    } else if (this.readingMode.type === 'raw') {
      if (this.readingMode.transform.length) {
        let transformer
        switch (this.readingMode.transform) {
          case 'protobuf':
            transformer = new ProtobufTransformer()
            break
          default:
            throw new Error('Invalid reading mode')
        }

        this.reader = this.readable
          .pipeThrough(new TransformStream(transformer))
          .getReader()
      } else {
        this.reader = this.readable.getReader()
      }
    } else {
      throw new Error('Invalid reading mode')
    }

    this.read()
  }

  async setReadingMode (type, transform = '') {
    if (!type) {
      return
    }
    this.readingMode.type = type
    this.readingMode.transform = transform

    if (this.reader) {
      this.reader.cancel()
    }
    // if (this.readableStreamClosed) {
    //   await this.readableStreamClosed.catch((e) => {
    //     console.error(e)
    //   })
    // }

    if (this.writer) {
      await this.writer.close()
      await this.writer.releaseLock()
    }

    setTimeout(() => this.serialWorker.postMessage({ message: 'reopenPort' }), 1)
    // TODO: resolve when mode has actually changed
  }

  getWriter () {
    this.writer = this.writable.getWriter()
  }

  async connect () {
    const ports = await navigator.serial.getPorts({ filters: this.filters })
    if (ports.length === 0) {
      throw new Error('No known ports')
    }
    return new Promise((resolve, reject) => {
      this.serialWorker.postMessage({ message: 'connect' })
      setTimeout(() => reject('Serial connection timeout'), RPC_TIMEOUT)
      const unbind = this.emitter.on('connectStatus', status => {
        unbind()
        if (status === 'success') {
          const unbindReadable = this.emitter.on('getReadableStream', () => {
            unbindReadable()
            const unbindWritable = this.emitter.on('getWritableStream', () => {
              unbindWritable()
              resolve(true)
            })
          })
        } else {
          reject(status)
        }
      })
    })
  }

  async disconnect () {
    this.reader.cancel()
    // if (this.readableStreamClosed) {
    //   await this.readableStreamClosed.catch((e) => {
    //     console.error(e)
    //   })
    // }

    await this.writer.close()
    await this.writer.releaseLock()

    // for some reason sometimes reader and writer don't get unlocked immediately
    setTimeout(() => this.serialWorker.postMessage({ message: 'disconnect' }), 1)

    return new Promise((resolve, reject) => {
      setTimeout(() => reject('Serial disconnection timeout'), RPC_TIMEOUT)
      const unbind = this.emitter.on('disconnectStatus', status => {
        unbind()
        if (status === 'success') {
          this.readingMode = {
            type: 'text',
            transform: 'promptBreak'
          }
          resolve(true)
        } else {
          reject(status)
        }
      })
    })
  }

  async read () {
    let keepReading = true
    while (keepReading) {
      try {
        const { value, done } = await this.reader.read()
        if (done) {
          this.reader.releaseLock()
          break
        }

        if (this.readingMode.transform === 'protobuf') {
          if (value.content && value.content === 'guiScreenFrame') {
            this.emitter.emit('screenStream/frame', value.guiScreenFrame.data, value.guiScreenFrame.orientation)
          }
          const command = this.commandQueue.find(c => c.commandId === value.commandId)
          value[value.content].hasNext = value.hasNext
          command.chunks.push(value[value.content])
        } else {
          this.emitter.emit('cli/output', value)
        }
      } catch (error) {
        if (!error.toString().includes('device has been lost')) {
          console.error(error)
        }
        keepReading = false
      }
    }
  }

  write (message) {
    console.log(message)
    const encoder = new TextEncoder()
    const encoded = encoder.encode(message)
    return this.writer.write(encoded)
  }

  writeRaw (message) {
    return this.writer.write(message)
  }

  async startRPCSession (attempts = 1) {
    await this.setReadingMode('raw', 'protobuf')
    await asyncSleep(300)
    this.write('start_rpc_session\r')
    await this.RPC('systemPing', { timeout: 1000 })
      .catch(async error => {
        if (attempts > 3) {
          throw error
        }
        console.error(error)
        await asyncSleep(500)
        return this.startRPCSession(attempts + 1)
      })
  }

  encodeRPCRequest (requestType, args, hasNext, commandId) {
    let command
    const options = { hasNext }
    options[requestType] = args || {}
    if (commandId) {
      options.commandId = commandId
      command = this.commandQueue.find(c => c.commandId === options.commandId)
    } else {
      options.commandId = this.commandQueue.length
    }

    if (!command) {
      const i = this.commandQueue.push({
        commandId: options.commandId,
        requestType: requestType,
        args: hasNext ? [args] : args
      })
      command = this.commandQueue[i - 1]
    }

    const message = PB.Main.create(options)
    const data = new Uint8Array(PB.Main.encodeDelimited(message).finish())
    return [data, command]
  }

  RPC (requestType, args) {
    const [subSystem, command] = splitRequestType(requestType)
    return RPCSubSystems[subSystem][command].bind(this)(args)
    // TODO: commandStatus
  }
}

function splitRequestType (requestType) {
  const index = requestType.search(/[A-Z]/g)
  const command = requestType.slice(index)
  return [requestType.slice(0, index), command[0].toLowerCase() + command.slice(1)]
}
