import { LineBreakTransformer, PromptBreakTransformer, ProtobufTransformer } from './transformers'
import { PB } from './protobufCompiled'
import { createNanoEvents } from 'nanoevents'
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
  constructor () {
    this.path = null
    this.readable = null
    this.reader = null
    this.readingMode = {
      type: 'text',
      transform: 'promptBreak'
    }
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

  defaultInfo () {
    this.path = null
    this.readable = null
    this.reader = null
    this.readingMode = {
      type: 'text',
      transform: 'promptBreak'
    }
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
      this.readableStreamClosed = this.readable.pipeTo(textDecoder.writable)

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

    await this.disconnect()
    await this.connect(this.path)
  }

  async connect (path) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!path) {
          const ports = await window.serial.list()
          path = ports[0].path
        }
        this.path = path

        this.readable = new ReadableStream({
          start (controller) {
            window.serial.onData(data => {
              controller.enqueue(data)
            })
          }
        })

        await window.serial.open(path)
          .catch(async error => {
            if (error.message.endsWith('Port is already open')) {
              await this.disconnect()
              resolve(window.serial.open(path))
            }

            reject(error)
          })

        window.serial.onClose(path => this.emitter.emit('disconnect', path))

        resolve(this.getReader())
      })()
    })
  }

  async disconnect () {
    if (this.reader) {
      this.reader.cancel()
      await this.readableStreamClosed.catch(() => {})
    }
    await window.serial.close(this.path)
  }

  async read () {
    let keepReading = true
    while (keepReading) {
      try {
        const { value, done } = await this.reader.read()
        if (done) {
          this.reader.releaseLock()
          keepReading = false
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
        if (!error.toString().includes('Releasing Default reader')) {
          console.error(error)
        }
        keepReading = false
      }
    }
  }

  write (message) {
    return window.serial.write({ path: this.path, message })
  }

  writeRaw (message) {
    return window.serial.write({ path: this.path, message })
  }

  async startRPCSession (attempts = 1) {
    await this.setReadingMode('raw', 'protobuf')
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
