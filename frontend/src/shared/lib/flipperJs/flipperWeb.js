if ('serial' in navigator) {
  console.log('Serial API supported.')
} else {
  console.error('Serial API not supported.')
}

import { LineBreakTransformer, PromptBreakTransformer, ProtobufTransformer } from './transformers'

import { PB } from './protobufCompiled'
import asyncSleep from 'simple-async-sleep'
import { createNanoEvents } from 'nanoevents'

import readInfo from './utils/readInfo'
import { getInstalledApps, onClearInstalledAppsList } from './utils/getInstalledApps'

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
  constructor() {
    this.port = null
    this.filters = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 }
    ]

    this.readingMode = {
      type: 'text',
      transform: 'promptBreak'
    }
    this.reader = null
    this.readable = null

    this.writer = null
    this.writable = null

    this.commandQueue = [
      {
        commandId: 0,
        requestType: 'unsolicited',
        chunks: [],
        error: undefined
      }
    ]

    this.flipperReady = false

    this.info = null
    this.loadingInfo = false

    this.name = null
    this.connected = false
    this.updating = false
    this.rpcActive = false

    this.installedApps = []

    this.emitter = createNanoEvents()
  }

  async findKnownDevices () {
    return navigator.serial.getPorts()
      .then((ports) => {
        const filteredPorts = ports.filter(port => {
          const info = port.getInfo()

          return info.usbVendorId === this.filters[0].usbVendorId &&
            info.usbProductId === this.filters[0].usbProductId;
        })

        return filteredPorts
      })
      .catch((e) => {
        console.error(e)

        throw e
      })
  }

  async connect ({
    type = 'CLI'
  } = {}) {
    const ports = await this.findKnownDevices()

    if (ports.length > 1) {
      this.port = await navigator.serial.requestPort({
        filters: this.filters
      })
        .catch((e) => {
          console.error(e)
          throw e
        })
    } else if (ports.length === 1) {
      this.port = ports[0]
    } else {
      this.port = null
    }

    if (this.port) {
      await this.openPort()

      if (type === 'RPC') {
        await this.startRPCSession()
        await this.getInfo()

        if (this.info &&
          this.info.doneReading &&
          this.readingMode.type === 'raw' &&
          this.readingMode.transform === 'protobuf') {
          this.name = this.info.hardware.name
          this.rpcActive = true
        } else {
          this.name = null
          this.rpcActive = false
        }
      } else {
        this.rpcActive = false
      }

      this.flipperReady = true
      this.connected = true
    } else {
      if (!this.updating) {
        this.info = null
        this.name = null
      }
      this.connected = false

      throw new Error('No available port')
    }
  }

  async openPort () {
    await this.port.open({ baudRate: 1 })

    this.port.onconnect = () => {
      console.log('connect')
      this.connect({
        type: 'RPC'
      })
    }

    this.port.ondisconnect = () => {
      if (this.flipperReady) {
        this.disconnect()
      } else {
        this.emitter.emit('disconnect')
      }
    }

    this.readable = this.port.readable
    this.getReader()

    this.writable = this.port.writable
    this.getWriter()
  }

  async disconnect ({
    isUserAction = false
  } = {}) {
    if (isUserAction) {
      if (!this.updating) {
        this.info = null
        this.name = null
        this.installedApps = []
      }
      this.flipperReady = false
      this.connected = false
      this.commandQueue = []
    }

    this.rpcActive = false

    try {
      await this.reader.cancel()
      if (this.readableStreamClosed) {
        // eslint-disable-next-line
        await this.readableStreamClosed.catch(() => {})
      }

      await this.writer.close()
      this.writer.releaseLock()

      await this.port.close()
    } catch (error) {
      console.error('disconnect', error)
    }

    this.emitter.emit('disconnect', {
      isUserAction
    })
  }

  getReader () {
    if (this.readingMode.type === 'text') {
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
            break;

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

  // async read () {
  //   let keepReading = true
  //   while (keepReading) {
  //     try {
  //       const { value, done } = await this.reader.read();
  //       console.log('flipper read', value, done)
  //       if (done) {
  //         // |reader| has been canceled.
  //         this.reader.releaseLock()
  //         break;
  //       }
  //       // Do something with |value|…
  //       if (this.readingMode.transform === 'protobuf') {
  //         // if (value.content && value.content === 'guiScreenFrame') {
  //         //   this.emitter.emit('screenStream/frame', value.guiScreenFrame.data, value.guiScreenFrame.orientation)
  //         // }
  //         const command = this.commandQueue.find(c => c.commandId === value.commandId)
  //         // if (value.commandStatus) {
  //         //   command.status = value.commandStatus
  //         //   this.emitter.emit(`commandStatus_${value.commandId}`, value.commandStatus)
  //         //   console.log('status', command)
  //         //   return
  //         // }
  //         value[value.content].hasNext = value.hasNext
  //         command.chunks.push(value[value.content])
  //       } else {
  //         // console.log('value', value)
  //         this.emitter.emit('cli/output', value)
  //       }
  //     } catch (error) {
  //       // Handle |error|…
  //       console.error('read error', error)
  //       keepReading = false
  //     }
  //   }
  // }
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

  async setReadingMode (type, transform = '') {
    if (!type) {
      return
    }
    this.readingMode.type = type
    this.readingMode.transform = transform

    await this.disconnect()

    await this.openPort()

    if (this.readingMode.type === 'raw' &&
          this.readingMode.transform === 'protobuf') {
      this.rpcActive = true
    } else {
      this.rpcActive = false
    }

    // this.flipperReady = true
    // this.connected = true
  }

  getWriter () {
    this.writer = this.writable.getWriter()
  }

  async write (message) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(message)

    await this.writer.write(encoded)
  }

  async writeRaw (message) {
    await this.writer.write(message)
  }

  async getInfo () {
    this.loadingInfo = true
    this.info = await readInfo.bind(this)()
    this.loadingInfo = false
  }
  async getInstalledApps () {
    onClearInstalledAppsList()
    this.installedApps = await getInstalledApps.bind(this)()
  }

  async startRPCSession (attempts = 1) {
    await this.setReadingMode('raw', 'protobuf')
    await asyncSleep(300)
    await this.write('start_rpc_session\r')
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
    try {
      const [subSystem, command] = splitRequestType(requestType)
      return RPCSubSystems[subSystem][command].bind(this)(args)
    } catch (e) {
      console.error('test', e)
    }
  }
}

function splitRequestType (requestType) {
  const index = requestType.search(/[A-Z]/g)
  const command = requestType.slice(index)
  return [requestType.slice(0, index), command[0].toLowerCase() + command.slice(1)]
}
