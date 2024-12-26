import { createRPCPromise } from '../util'
import asyncSleep from 'simple-async-sleep'

function info ({ path }) {
  return createRPCPromise.bind(this)('storageInfoRequest', { path })
}

function timestamp ({ path }) {
  return createRPCPromise.bind(this)('storageTimestampRequest', { path }, (chunks) => chunks[0].timestamp)
}

function stat ({ path }) {
  return createRPCPromise.bind(this)('storageStatRequest', { path }, (chunks) => chunks[0].file)
}

function list ({ path }) {
  function format (chunks) {
    if (Object.keys(chunks[0]).length) {
      const list = chunks.flatMap(e => e.file)
      list.sort((a, b) => a.type < b.type ? 1 : -1)
      const index = list.findIndex(e => e.type === 0)
      const dirs = list.slice(0, index)
      dirs.sort((a, b) => a.name[0].toUpperCase() > b.name[0].toUpperCase() ? 1 : -1)
      const files = list.slice(index)
      files.sort((a, b) => a.name[0].toUpperCase() > b.name[0].toUpperCase() ? 1 : -1)
      return dirs.concat(files)
    }

    return []
  }
  return createRPCPromise.bind(this)('storageListRequest', { path }, format)
}

function read ({ path }) {
  function format (chunks) {
    let buffer = new Uint8Array(0)
    for (const chunk of chunks) {
      if (!chunk.file) {
        return
      }
      const newBuffer = new Uint8Array(buffer.length + chunk.file.data.length)
      newBuffer.set(buffer)
      newBuffer.set(chunk.file.data, buffer.length)
      buffer = newBuffer
    }
    return buffer
  }
  return createRPCPromise.bind(this)('storageReadRequest', { path }, format, this.emitter, 60 * 60 * 1000)
}

async function write ({ path, buffer }) {
  let commandId, command
  const requestType = 'storageWriteRequest'
  const file = new Uint8Array(buffer)

  for (let i = 0; i <= file.byteLength; i += 512) {
    const chunk = file.slice(i, i + 512)
    const writeChunk = new Promise((resolve, reject) => {
      setTimeout(() => reject(`RPC timeout: ${requestType}`), 60 * 60 * 1000)
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
    await asyncSleep(7)
    await writeChunk
    this.emitter.emit(requestType + '/progress', {
      progress: Math.min(file.byteLength, (i + 512 - 1)),
      total: file.byteLength
    })
  }
  return true
}

function remove ({ path, recursive }) {
  return createRPCPromise.bind(this)('storageDeleteRequest', { path, recursive })
}

function mkdir ({ path }) {
  return createRPCPromise.bind(this)('storageMkdirRequest', { path })
}

function md5sum ({ path }) {
  return createRPCPromise.bind(this)('storageMd5sumRequest', { path }, (chunks) => chunks[0].md5sum)
}

function rename ({ oldPath, newPath }) {
  return createRPCPromise.bind(this)('storageRenameRequest', { oldPath, newPath })
}

function backupCreate ({ archivePath }) {
  return createRPCPromise.bind(this)('storageBackupCreateRequest', { archivePath })
}

function backupRestore ({ archivePath }) {
  return createRPCPromise.bind(this)('storageBackupRestoreRequest', { archivePath })
}

export {
  info,
  timestamp,
  stat,
  list,
  read,
  write,
  remove,
  mkdir,
  md5sum,
  rename,
  backupCreate,
  backupRestore
}
