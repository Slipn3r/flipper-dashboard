import { untar } from './untar/untar.js'
import pako from 'pako'
import _ from 'lodash'

function camelCaseDeep (object) {
  return Object.fromEntries(Object.entries(object).map(e => {
    if (!!e[1] && typeof e[1] === 'object') {
      e[1] = camelCaseDeep(e[1])
    }
    return [_.camelCase(e[0]), e[1]]
  }))
}

class Operation {
  constructor () {
    this.resolve = undefined
    this.reject = undefined
  }

  create (worker, operation, data) {
    return new Promise((resolve, reject) => {
      worker.postMessage({ operation: operation, data: data })
      this.resolve = resolve
      this.reject = reject
    })
  }

  terminate (event) {
    if (event.status === 1) {
      this.resolve(event.data)
    } else {
      this.reject(event.error)
    }
  }
}

function ungzip (buffer) {
  return pako.ungzip(new Uint8Array(buffer))
}

function unpack (buffer) {
  const ungzipped = ungzip(buffer)
  return untar(ungzipped.buffer)
}

function bytesToSize (bytes) {
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return 'n/a'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)}${sizes[i]}`
}

export {
  camelCaseDeep,
  Operation,
  unpack,
  ungzip,
  bytesToSize
}
