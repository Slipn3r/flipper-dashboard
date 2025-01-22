if ('serial' in navigator) {
  console.log('Serial API supported.')
} else {
  console.error('Serial API not supported.')
}

import asyncSleep from 'simple-async-sleep'

import Flipper from './flipper'
import FrameRenderer from './frameRenderer'

import {
  LineBreakTransformer,
  PromptBreakTransformer,
  ProtobufTransformer
} from './transformers'

import { createNanoEvents } from 'nanoevents'

export default class FlipperWeb extends Flipper {
  constructor() {
    const emitter = createNanoEvents()
    super(emitter)

    this.emitter = emitter

    this.serialWorker = new Worker(new URL('./worker.ts', import.meta.url))
    this.serialWorker.onmessage = (e) => {
      switch (e.data.message) {
        case 'connectionStatus':
          if (e.data.error) {
            this.emitter.emit(e.data.operation + 'Status', e.data.error)
          } else if (e.data.status) {
            this.emitter.emit(e.data.operation + 'Status', e.data.status)
          }
          break

        case 'error':
          if (e.data.error) {
            console.error(e.data.error)
          }
          break

        case 'getReadableStream':
          this.readable = e.data.stream
          this.getReader()
          this.emitter.emit('getReadableStream')
          break

        case 'getWritableStream':
          this.writable = e.data.stream
          this.getWriter()
          this.emitter.emit('getWritableStream')
          break
      }
    }

    this.port = null

    this.readingMode = {
      type: 'text',
      transform: 'promptBreak'
    }
    this.reader = null
    this.readable = null

    this.writer = null
    this.writable = null

    this.frameRenderer = new FrameRenderer()
  }

  async findKnownDevices() {
    return navigator.serial
      .getPorts()
      .then((ports) => {
        const filteredPorts = ports.filter((port) => {
          const info = port.getInfo()

          return (
            info.usbVendorId === this.filters[0].usbVendorId &&
            info.usbProductId === this.filters[0].usbProductId
          )
        })

        return filteredPorts
      })
      .catch((e) => {
        console.error(e)

        throw e
      })
  }

  async connect({ type = 'CLI', autoReconnect = false }) {
    const ports = await this.findKnownDevices()

    if (ports.length) {
      this.serialWorker.postMessage({
        operation: 'connect'
      })
    } else if (!autoReconnect) {
      await navigator.serial
        .requestPort({
          filters: this.filters
        })
        .catch((e) => {
          console.error(e)
          throw e
        })

      this.serialWorker.postMessage({
        operation: 'connect'
      })
    }

    if (ports.length) {
      return new Promise((resolve, reject) => {
        const unbind = this.emitter.on('connectStatus', (status) => {
          unbind()
          if (status === 'success') {
            const unbindReadable = this.emitter.on('getReadableStream', () => {
              unbindReadable()
              const unbindWritable = this.emitter.on(
                'getWritableStream',
                async () => {
                  unbindWritable()

                  if (type === 'RPC') {
                    await this.startRPCSession()
                    await this.getInfo()
                    await this.ensureCommonPaths()

                    if (
                      this.info &&
                      this.info.doneReading &&
                      this.readingMode.type === 'rpc' &&
                      this.readingMode.transform === 'protobuf'
                    ) {
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

                  this.emitter.on('portDisconnectStatus', () => {
                    if (this.flipperReady) {
                      this.disconnect({
                        portDisconnect: true
                      })
                      this.serialWorker.postMessage({
                        operation: 'disconnect'
                      })
                    } else {
                      this.emitter.emit('disconnect')
                    }
                  })

                  resolve(true)
                }
              )
            })
          } else {
            if (!this.updating) {
              this.info = null
              this.name = null
            }
            this.connected = false

            reject(status)
          }
        })
      })
    } else {
      if (!this.updating) {
        this.info = null
        this.name = null
      }
      this.connected = false

      return Promise.reject('No available port')
    }
  }

  async disconnect({
    isUserAction = false,
    reopenPort = false,
    portDisconnect = false
  }) {
    if (isUserAction || portDisconnect) {
      if (!this.updating) {
        this.info = null
        this.name = null
        this.installedApps = []
        this.flipperReady = false
      }
      this.connected = false
      this.commandQueue = []
    }

    this.rpcActive = false
    this.clearQueue()

    try {
      if (this.reader) {
        await this.reader.cancel()
      }
      if (this.readableStreamClosed) {
        await this.readableStreamClosed.catch(() => {})
      }

      if (this.writer) {
        this.writer.ready
          .then(async () => {
            await this.writer.close()
            await this.writer.releaseLock()
          })
          .catch((err) => {
            console.log('Stream error:', err)
          })
      }

      if (reopenPort) {
        setTimeout(() => {
          this.serialWorker.postMessage({
            operation: 'reopenPort'
          })
        }, 5)

        return new Promise((resolve, reject) => {
          setTimeout(() => reject('Serial connection timeout'), 4000)
          const unbindDisconnect = this.emitter.on(
            'reopenDisconnectStatus',
            (status) => {
              unbindDisconnect()
              if (status === 'success') {
                const unbindConnect = this.emitter.on(
                  'reopenConnectStatus',
                  (status) => {
                    unbindConnect()
                    if (status === 'success') {
                      resolve(true)
                    } else {
                      reject(status)
                    }
                  }
                )
              } else {
                reject(status)
              }
            }
          )
        })
      }

      if (!portDisconnect) {
        this.serialWorker.postMessage({
          operation: 'disconnect'
        })

        return new Promise((resolve, reject) => {
          setTimeout(() => reject('Serial disconnection timeout'), 4000)
          const unbind = this.emitter.on('disconnectStatus', (status) => {
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
    } catch (error) {
      console.error('disconnect', error)
    }

    this.emitter.emit('disconnect', {
      isUserAction
    })
  }

  getReader() {
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
    } else if (this.readingMode.type === 'rpc') {
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
  async read() {
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
            if (!value.guiScreenFrame.data) {
              return
            }

            this.frameRenderer.renderFrame({
              data: value.guiScreenFrame.data
            })

            this.emitter.emit(
              'screenStream/frame',
              this.frameRenderer.getCanvas(),
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
            command.chunks.push(value[value.content])
          }
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

  async startRPCSession(attempts = 1) {
    await this.setReadingMode('rpc', 'protobuf')
    await asyncSleep(300)
    await this.write('start_rpc_session\r')
    await this.RPC('systemPing', { timeout: 1000 }).catch(async (error) => {
      if (attempts > 3) {
        throw error
      }
      console.error(error)
      await asyncSleep(500)
      return this.startRPCSession(attempts + 1)
    })
  }

  getWriter() {
    this.writer = this.writable.getWriter()
  }

  async write(message) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(message, { stream: true })

    await this.writer.write(encoded)
  }

  async writeRaw(message) {
    await this.writer.write(message)
  }

  async setReadingMode(type, transform = '') {
    if (!type) {
      return
    }

    this.readingMode.type = type
    this.readingMode.transform = transform

    await this.disconnect({
      reopenPort: true
    })

    if (
      this.readingMode.type === 'rpc' &&
      this.readingMode.transform === 'protobuf'
    ) {
      this.rpcActive = true
    } else {
      this.rpcActive = false
    }
  }
}
