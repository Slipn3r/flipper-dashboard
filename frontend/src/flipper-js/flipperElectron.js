import { ProtobufTransformer } from './transformers'
import { PB } from './protobufCompiled'
import { createNanoEvents } from 'nanoevents'
import { encode, decode } from 'base64-arraybuffer'

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
  constructor (name) {
    this.name = name
    this.emitter = createNanoEvents()

    // RPC
    this.readableRPC = new ReadableStream({
      start (controller) {
        window.bridge.onRPCRead(payload => {
          // console.log('read/rpc', payload)
          if (payload.name === name) {
            const decoded = new Uint8Array(decode(payload.data))
            controller.enqueue(decoded)
            // console.log('payload', decoded)
          }
        })
      }
    })
    this.readerRPC = this.readableRPC
      .pipeThrough(new TransformStream(new ProtobufTransformer(true)))
      .getReader()
    this.readRPC()

    this.commandQueue = [
      {
        commandId: 0,
        requestType: 'unsolicited',
        chunks: [],
        error: undefined
      }
    ]

    // CLI
    window.bridge.onCLIRead(payload => {
      console.log('read/cli', payload)
      if (payload.name === name) {
        const decoded = atob(payload.data)
        this.emitter.emit('cli/output', decoded)
      }
    })

    // REMOVE
    /* this.bridgeListener = function (message) {
      if (message.type === 'stdout') {
        const payload = JSON.parse(message.data)
        if (payload.type === 'read' && payload.data) {
          if (payload.mode === 'cli') {
            console.log(atob(payload.data))
          } else {
            console.log(decode(payload.data))
          }
        } else if (payload.type === 'list') {
          this.list = payload.data
        } else {
          console.log(payload)
        }
      } else {
        console.log(message)
      }
    }
    window.bridge.onMessage(this.bridgeListener) */
    window.bridge.onLog(console.log)
    window.bridge.onExit(console.log)
    window.bridge.onList(console.log)
    window.bridge.spawn()
  }

  async readRPC () {
    let keepReading = true
    while (keepReading) {
      try {
        const { value, done } = await this.readerRPC.read()
        if (done) {
          this.readerRPC.releaseLock()
          keepReading = false
          break
        }

        if (value.content && value.content === 'guiScreenFrame') {
          this.emitter.emit('screenStream/frame', value.guiScreenFrame.data, value.guiScreenFrame.orientation)
        }
        const command = this.commandQueue.find(c => c.commandId === value.commandId)
        value[value.content].hasNext = value.hasNext
        command.chunks.push(value[value.content])
      } catch (error) {
        if (!error.toString().includes('Releasing Default reader')) {
          console.error(error)
        }
        keepReading = false
      }
    }
  }

  write (text) {
    const encoded = new TextEncoder().encode(text)
    return this.writeRaw(encoded, 'cli')
  }

  writeRaw (data, mode = 'rpc') {
    console.log(data)
    const payload = {
      id: 1,
      type: 'write',
      name: this.name,
      data: encode(data),
      mode
    }
    console.log('write', payload)
    return window.bridge.send(payload)
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
