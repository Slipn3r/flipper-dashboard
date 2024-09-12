import { ProtobufTransformer } from './transformers'
import { encode, decode } from 'base64-arraybuffer'

import Flipper from './flipper'

import type { Emitter, DefaultEvents, Unsubscribe } from 'nanoevents'

// import asyncSleep from 'simple-async-sleep'

// import { FlipperModel } from 'entities/Flipper'

type ContentValue = {
  hasNext: boolean
}

type CustomValueBase = {
  content: string
  commandId: number
  commandStatus?: number
  guiScreenFrame: {
    data: Uint8Array
    orientation: string
  }
  hasNext: boolean
}

type CustomValue = CustomValueBase & {
  [key: string]: ContentValue
}

export default class FlipperElectron extends Flipper {
  isBridgeReady?: boolean
  recovering?: boolean
  readableRPC: ReadableStream<Uint8Array>
  readerRPC: ReadableStreamDefaultReader<CustomValue>
  readingMode: {
    type: string
  }

  unbindCli: Unsubscribe
  unbindRpc?: Unsubscribe
  unbindScreenStream?: Unsubscribe
  // emitter: Emitter<DefaultEvents>

  constructor /* name: string,
    emitter: Emitter<DefaultEvents>,
    info?:
      | FlipperModel.DataFlipperElectron['info']
      | FlipperModel.DataDfuFlipperElectron['info'] */(
    name: string,
    emitter: Emitter<DefaultEvents>
  ) {
    super(emitter)

    this.name = name

    this.isBridgeReady = false
    this.recovering = false

    // RPC
    // this.readableRPC = undefined
    // this.readerRPC = undefined

    this.readingMode = {
      type: 'cli'
    }

    // this.unbindCli = undefined
    // this.unbindRpc = undefined

    // RPC
    this.unbindRpc
    this.readableRPC = new ReadableStream({
      start: (controller) => {
        this.unbindRpc = emitter.on('RPCRead', (buffer) => {
          const decoded = new Uint8Array(decode(buffer))
          controller.enqueue(decoded)
        })
      }
    })
    // this.unbindRpc = unbindRpc

    this.readerRPC = this.readableRPC
      .pipeThrough(new TransformStream(new ProtobufTransformer(true)))
      .getReader()
    this.readRPC()

    // CLI
    this.unbindCli = this.emitter.on('CLIRead', (buffer: string) => {
      const decoded = atob(buffer)

      this.emitter.emit('cli/output', decoded)
    })

    this.unbindScreenStream

    // this.emitter = emitter

    // this.info = null
    // if (info) {
    //   this.info = info
    // }

    // this.init()
  }

  // async stopScreenStream() {
  //   console.log('oldFlipper stopScreenStream')
  //   this.RPC('guiStopScreenStream').then(() => {
  //     console.log('guiStopScreenStream disabled')
  //   })
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   .catch(() => {})
  // }

  // async stopVirtualDisplay() {
  //   this.RPC('guiStopVirtualDisplay')
  //     .then(() => {
  //       console.log('guiStartVirtualDisplay disabled')
  //     })
  //     // eslint-disable-next-line @typescript-eslint/no-empty-function
  //     .catch(() => {})
  // }

  async connect(/* name: string, emitter: Emitter<DefaultEvents> */) {
    // this.RPC('guiStopVirtualDisplay')

    // this.connected = false
    // this.flipperReady = false

    // this.setName(name)
    // this.setEmitter(emitter)

    this.connected = true

    if (this.readingMode.type === 'cli') {
      this.flipperReady = true
    }

    // if (this.readingMode.type === 'rpc') {
    //   await this.getInfo()
    // }
  }
  async disconnect() {
    this.connected = false
    this.flipperReady = false

    if (this.unbindCli) {
      this.unbindCli()
    }
    if (this.unbindRpc) {
      this.unbindRpc()
    }
    if (this.unbindScreenStream) {
      this.unbindScreenStream()
    }
  }

  async setReadingMode(mode: string) {
    this.readingMode.type = mode

    if (mode === 'cli') {
      this.rpcActive = false
    }

    if (mode === 'rpc') {
      this.rpcActive = true
    }
  }

  setName(name: string) {
    this.name = name
  }

  // setEmitter(emitter: Emitter<DefaultEvents>) {
  //   // this.emitter = emitter

  //   // RPC
  //   if (this.unbindRpc) {
  //     this.unbindRpc()
  //   }
  //   let unbindRpc
  //   this.readableRPC = new ReadableStream({
  //     start(controller) {
  //       unbindRpc = emitter?.on('RPCRead', (buffer) => {
  //         const decoded = new Uint8Array(decode(buffer))
  //         controller.enqueue(decoded)
  //       })
  //     }
  //   })
  //   this.unbindRpc = unbindRpc

  //   this.readerRPC = this.readableRPC
  //     .pipeThrough(new TransformStream(new ProtobufTransformer(true)))
  //     .getReader()
  //   this.readRPC()

  //   // CLI
  //   if (this.unbindCli) {
  //     this.unbindCli()
  //   }
  //   this.unbindCli = this.emitter?.on('CLIRead', (buffer: string) => {
  //     const decoded = atob(buffer)

  //     this.emitter?.emit('cli/output', decoded)
  //   })
  // }

  async readRPC() {
    if (this.readerRPC) {
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
            this.emitter.emit(
              'screenStream/frame',
              value.guiScreenFrame.data,
              value.guiScreenFrame.orientation
            )
          }
          const command = this.commandQueue.find(
            (c) => c.commandId === value.commandId
          )

          value[value.content].hasNext = value.hasNext
          if (command) {
            if (!command.commandStatus) {
              command.commandStatus = {
                value: 0
              }
            }
            if (value.commandStatus) {
              command.commandStatus.value = value.commandStatus
            }

            if (!command.chunks) {
              command.chunks = []
            }
            command.chunks.push(value[value.content] as never) // FIXME: there shouldn't be a never
            // console.log(command.requestType, command.commandId, value)
          } else {
            // console.log(value)
          }
        } catch (error) {
          const errorMessage: string =
            typeof error === 'string'
              ? error
              : error instanceof Error
              ? error.message
              : String(error)

          if (!errorMessage.includes('Releasing Default reader')) {
            console.error(errorMessage)
          }
          keepReading = false
        }
      }
    }
  }

  write(text: string) {
    const encoded = new TextEncoder().encode(text)
    return this.writeRaw(encoded, 'cli')
  }

  writeRaw(buffer: ArrayBuffer, mode = 'rpc') {
    const payload = {
      type: 'write',
      name: this.name,
      data: {
        buffer: encode(buffer),
        mode
      }
    }

    return window.bridge.send(payload)
  }
}
