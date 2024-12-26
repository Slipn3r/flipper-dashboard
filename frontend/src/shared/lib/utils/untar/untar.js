import { ProgressivePromise } from './ProgressivePromise'

const global = window || this

/**
Returns a ProgressivePromise.
*/
export function untar (arrayBuffer) {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new TypeError('arrayBuffer is not an instance of ArrayBuffer.')
  }

  if (!global.Worker) {
    throw new Error('Worker implementation is not available in this environment.')
  }

  return new ProgressivePromise(function (resolve, reject, progress) {
    const worker = new Worker(new URL('./untar-worker.js', import.meta.url))

    const files = []

    worker.onerror = function (err) {
      reject(err)
    }

    worker.onmessage = function (message) {
      message = message.data
      let file
      switch (message.type) {
        case 'log':
          console[message.data.level]('Worker: ' + message.data.msg)
          break
        case 'extract':
          file = decorateExtractedFile(message.data)
          if (file.name.endsWith('\x00')) {
            file.name = file.name.slice(0, -1)
          }
          files.push(file)
          progress(file)
          break
        case 'complete':
          worker.terminate()
          resolve(files)
          break
        case 'error':
          worker.terminate()
          reject(new Error(message.data.message))
          break
        default:
          worker.terminate()
          reject(new Error('Unknown message from worker: ' + message.type))
          break
      }
    }

    // console.info("Sending arraybuffer to worker for extraction.");
    worker.postMessage({ type: 'extract', buffer: arrayBuffer }, [arrayBuffer])
  })
}

const decoratedFileProps = {
  blob: {
    get: function () {
      return this._blob || (this._blob = new Blob([this.buffer]))
    }
  },
  getBlobUrl: {
    value: function () {
      return this._blobUrl || (this._blobUrl = URL.createObjectURL(this.blob))
    }
  },
  readAsString: {
    value: function () {
      const buffer = this.buffer
      const charCount = buffer.byteLength
      const charSize = 1
      const bufferView = new DataView(buffer)

      const charCodes = []

      for (let i = 0; i < charCount; ++i) {
        const charCode = bufferView.getUint8(i * charSize, true)
        charCodes.push(charCode)
      }

      return (this._string = String.fromCharCode.apply(null, charCodes))
    }
  },
  readAsJSON: {
    value: function () {
      return JSON.parse(this.readAsString())
    }
  }
}

function decorateExtractedFile (file) {
  Object.defineProperties(file, decoratedFileProps)
  return file
}
