import { /* RPC_TIMEOUT, */ createRPCPromise } from '../util'

function start ({ name, args }) {
  return createRPCPromise.bind(this)('applicationStartRequest', { name, args })
}

function lockStatus () {
  return createRPCPromise.bind(this)('applicationLockStatusRequest', {}, (chunks) => chunks[0].locked)
}

function appExit () {
  return createRPCPromise.bind(this)('applicationAppExitRequest')
}

function appLoadFile ({ path }) {
  return createRPCPromise.bind(this)('applicationAppLoadFileRequest', { path })
}

function appButtonPress ({ args }) {
  return createRPCPromise.bind(this)('applicationAppButtonPressRequest', { args })
}

function appButtonRelease () {
  return createRPCPromise.bind(this)('applicationAppButtonReleaseRequest')
}

// TODO: AppStateResponse

function getErrorRequest () {
  return createRPCPromise.bind(this)('applicationGetErrorRequest')
}

// TODO: DataExchangeRequest
/* async function dataExchangeRequest ({ path, buffer }) {
  let commandId, command
  const requestType = 'applicationDataExchangeRequest'
  const file = new Uint8Array(buffer)

  for (let i = 0; i <= file.byteLength; i += 512) {
    const chunk = file.slice(i, i + 512)
    const writeChunk = new Promise((resolve, reject) => {
      setTimeout(() => reject(`RPC timeout: ${requestType}`), RPC_TIMEOUT)
      const [data, currentCommand] = this.encodeRPCRequest(
        requestType,
        { path, file: { data: chunk } },
        i + 512 <= file.byteLength,
        commandId
      )
      if (!command) {
        command = currentCommand
        command.chunks = []
        commandId = command.commandId
      }
      resolve(this.writeRaw(data))
    })
    await writeChunk
    this.emitter.emit(requestType + '/progress', {
      progress: Math.min(file.byteLength, (i + 512 - 1)),
      total: file.byteLength
    })
  }
  return true
} */

export {
  start,
  lockStatus,
  appExit,
  appLoadFile,
  appButtonPress,
  appButtonRelease,
  getErrorRequest
}
