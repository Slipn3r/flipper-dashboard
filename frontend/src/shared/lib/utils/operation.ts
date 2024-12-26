import { untar } from './untar/untar.js'
import pako from 'pako'
import { camelCaseDeep } from './camelCaseDeep'

class Operation {
  private resolve: ((value: string | PromiseLike<string>) => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reject: ((reason?: any) => void) | undefined

  constructor() {
    this.resolve = undefined
    this.reject = undefined
  }

  create(worker: Worker, operation: string, data: JSON): Promise<string> {
    return new Promise((resolve, reject) => {
      worker.postMessage({ operation: operation, data: data })
      this.resolve = resolve
      this.reject = reject
    })
  }

  terminate(event: { status: number; data: string; error: string }) {
    if (event.status === 1) {
      if (this.resolve) {
        this.resolve(event.data)
      }
    } else {
      if (this.reject) {
        this.reject(event.error)
      }
    }
  }
}

function ungzip(buffer: ArrayBuffer) {
  return pako.ungzip(new Uint8Array(buffer))
}

function unpack(buffer: ArrayBuffer) {
  const ungzipped = ungzip(buffer)
  return untar(ungzipped.buffer)
}

function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return 'n/a'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)}${sizes[i]}`
}

export { camelCaseDeep, Operation, unpack, ungzip, bytesToSize }
