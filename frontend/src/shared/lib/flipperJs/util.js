import { PB } from './protobufCompiled'

export const SERIAL_TIMEOUT = 5000
export const RPC_TIMEOUT = 4000

export function watch(callback, emitter, requestType) {
  const validator = {
    set: (target, key, value) => {
      target[key] = value
      if (typeof value === 'object') {
        if (emitter) {
          emitter.emit(requestType + '/progress', key)
        }
        if (!value.hasNext) {
          delete value.hasNext
          callback(target)
        }
      }
      delete value.hasNext
      return true
    }
  }
  return validator
}

function watchStatus(callback) {
  return {
    set: (target, key, value) => {
      callback(value)
      return true
    }
  }
}

export function createRPCPromise(requestType, args, format, emitter, timeout) {
  return new Promise((resolve, reject) => {
    const rejectTimeout = setTimeout(
      () => reject(`RPC timeout: ${requestType}`),
      timeout || RPC_TIMEOUT
    )
    function callback(chunks) {
      let result
      if (format) {
        result = format(chunks)
      } else {
        if (chunks.length === 1) {
          result = chunks[0]
        } else {
          result = chunks
        }
      }
      clearTimeout(rejectTimeout)
      resolve(result)
    }
    const [data, command] = this.encodeRPCRequest(requestType, args)

    command.commandStatus = new Proxy(
      { value: 0 },
      watchStatus((value) => {
        if (value !== 0) {
          reject(PB.CommandStatus[value])
        }
      })
    )

    command.chunks = new Proxy([], watch(callback, emitter, requestType))
    this.writeRaw(data)
  })
}

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return mergeDeep(target, ...sources)
}

export function expand(str, separator, defaultVal = {}) {
  return str.split(separator).reduceRight((acc, currentVal) => {
    return {
      [currentVal]: acc
    }
  }, defaultVal)
}
