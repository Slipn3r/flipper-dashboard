import { PB } from './protobufCompiled'
import * as protobuf from 'protobufjs/minimal'

export class LineBreakTransformer {
  constructor () {
    this.chunks = ''
  }

  transform (chunk, controller) {
    this.chunks += chunk
    const lines = this.chunks.split('\r\n')
    this.chunks = lines.pop()
    lines.forEach((line) => controller.enqueue(line))
  }

  flush (controller) {
    controller.enqueue(this.chunks)
  }
}

export class PromptBreakTransformer {
  constructor () {
    this.chunks = ''
  }

  transform (chunk, controller) {
    this.chunks += chunk
    const outputs = this.chunks.split('>:')
    this.chunks = outputs.pop()
    outputs.forEach((output) => controller.enqueue(output))
  }

  flush (controller) {
    controller.enqueue(this.chunks)
  }
}

export class ProtobufTransformer {
  constructor (rpcStarted = false) {
    this.chunks = new Uint8Array(0)
    this.decoder = new TextDecoder()
    this.rpcStarted = rpcStarted
  }

  transform (chunk, controller) {
    const newBuffer = new Uint8Array(this.chunks.length + chunk.length)
    newBuffer.set(this.chunks)
    newBuffer.set(chunk, this.chunks.length)
    this.chunks = newBuffer

    if (!this.rpcStarted && this.decoder.decode(this.chunks) === 'start_rpc_session\r\n') {
      this.rpcStarted = true
      this.chunks = new Uint8Array(0)
      return
    }

    try {
      const reader = protobuf.Reader.create(this.chunks)
      const results = []
      while (reader.pos < reader.len) {
        const res = PB.Main.decodeDelimited(reader)
        results.push(res)
      }
      this.chunks = this.chunks.slice(reader.pos)
      results.forEach(res => controller.enqueue(res))
      this.decodeInProgress = false
    } catch (error) {
      if (!error.message.includes('index out of range')) {
        if (!this.rpcStarted) {
          this.chunks = new Uint8Array(0)
        }
      }
    }
  }

  flush (controller) {
    controller.enqueue(this.chunks)
  }
}
