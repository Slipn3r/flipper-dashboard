import { createRPCPromise, mergeDeep, expand } from '../util'

function ping () {
  return createRPCPromise.bind(this)('systemPingRequest')
}

async function reboot ({ mode = 'OS' }) {
  const rebootModes = {
    OS: 0,
    DFU: 1,
    UPDATE: 2
  }
  const [data] = this.encodeRPCRequest('systemRebootRequest', { mode: rebootModes[mode] })
  return this.writeRaw(data)
}

function deviceInfo () {
  function format (chunks) {
    const accumulator = {}
    let result = {}
    for (const chunk of chunks) {
      if (chunk.key) {
        accumulator[chunk.key] = chunk.value
      }
    }
    for (const line of Object.keys(accumulator)) {
      const expanded = expand(line, '_', accumulator[line])
      result = mergeDeep(result, expanded)
    }
    return result
  }
  return createRPCPromise.bind(this)('systemDeviceInfoRequest', {}, format)
}

async function factoryReset () {
  //! This erases ALL USER DATA, use at your own risk!
  const [data] = this.encodeRPCRequest('systemFactoryResetRequest')
  return this.writeRaw(data)
}

function getDatetime () {
  function format (chunks) {
    let result = {}
    for (const chunk of chunks) {
      result = { ...result, ...chunk.datetime }
    }
    return new Date(result.year, result.month - 1, result.day, result.hour, result.minute, result.second)
  }
  return createRPCPromise.bind(this)('systemGetDatetimeRequest', {}, format)
}

function setDatetime ({ date }) {
  const datetime = {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    weekday: date.getDay() || 7
  }
  return createRPCPromise.bind(this)('systemSetDatetimeRequest', { datetime })
}

function playAudiovisualAlert () {
  return createRPCPromise.bind(this)('systemPlayAudiovisualAlertRequest')
}

function protobufVersion () {
  return createRPCPromise.bind(this)('systemProtobufVersionRequest', {})
}

function update ({ path }) {
  const updateResultCodes = {
    OK: 0,
    ManifestPathInvalid: 1,
    ManifestFolderNotFound: 2,
    ManifestInvalid: 3,
    StageMissing: 4,
    StageIntegrityError: 5,
    ManifestPointerError: 6,
    TargetMismatch: 7,
    OutdatedManifestVersion: 8,
    IntFull: 9,
    UnspecifiedError: 10
  }
  return createRPCPromise.bind(this)('systemUpdateRequest', { updateManifest: path }, (chunks) => Object.keys(updateResultCodes).find(key => updateResultCodes[key] === chunks[0].code))
}

function powerInfo () {
  function format (chunks) {
    const result = {}
    for (const chunk of chunks) {
      result[chunk.key] = chunk.value
    }
    return result
  }
  return createRPCPromise.bind(this)('systemPowerInfoRequest', {}, format)
}

export {
  ping,
  reboot,
  deviceInfo,
  factoryReset,
  getDatetime,
  setDatetime,
  playAudiovisualAlert,
  protobufVersion,
  update,
  powerInfo
}
