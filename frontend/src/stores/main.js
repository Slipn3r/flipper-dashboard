import { ref } from 'vue'
import Flipper from 'src/flipper-js/flipper'
import { defineStore } from 'pinia'
import useSetProperty from 'composables/useSetProperty'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'
import { useRouter } from 'vue-router'

export const useMainStore = defineStore('main', () => {
  const router = useRouter()

  const flags = ref({
    serialSupported: true,
    serialUnsupportedDialog: false,
    connectionRequired: true,
    portSelectRequired: false,
    connected: false,
    rpcActive: false,
    rpcToggling: false,
    connectOnStart: true,
    autoReconnect: false,
    updateInProgress: false,
    installFromFile: false,
    logsPopup: false,
    settingsView: false,
    flipperOccupiedDialog: false,
    microSDcardMissingDialog: false,

    catalogCanBeEnabled: false,
    catalogCanSwitchChannel: false,
    catalogEnabled: true,
    catalogChannelProduction: true
  })

  const flipper = ref(new Flipper())
  const componentName = 'Main'

  const connectionStatus = ref('Ready to connect')
  const findKnownDevices = () => {
    const filters = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 }
    ]
    return navigator.serial.getPorts({ filters })
  }
  const connect = async () => {
    await flipper.value.connect()
      .then(() => {
        connectionStatus.value = 'Flipper connected'

        flags.value.portSelectRequired = false
        flags.value.connected = true
        flags.value.flipperOccupiedDialog = false

        log({
          level: 'info',
          message: `${componentName}: Flipper connected`
        })
      })
      .catch(error => {
        if (error.toString() === 'Error: No known ports') {
          flags.value.portSelectRequired = true
        } else if (error.toString().includes('Failed to open serial port')) {
          flags.value.portSelectRequired = true
          flags.value.flipperOccupiedDialog = true
        } else {
          log({
            level: 'error',
            message: `${componentName}: Failed to connect: ${error}`
          })
          connectionStatus.value = error.toString()
        }
      })
  }
  const selectPort = async () => {
    const filters = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 }
    ]
    await navigator.serial.requestPort({ filters })
    return start(true)
  }
  const startRpc = async () => {
    if (!flags.value.connected) {
      return
    }
    flags.value.rpcToggling = true

    await flipper.value.startRPCSession()
      .catch(error => {
        console.error(error)
        log({
          level: 'error',
          message: `${componentName}: Error while starting RPC: ${error.toString()}`
        })
      })
    flags.value.rpcActive = true
    flags.value.rpcToggling = false

    log({
      level: 'info',
      message: `${componentName}: RPC started`
    })
  }
  const getProtobufVersion = async () => {
    return await flipper.value.RPC('systemProtobufVersion')
  }
  const isOldProtobuf = async () => {
    const protobufVersion = await getProtobufVersion()
    return protobufVersion.major === 0 && protobufVersion.minor < 14
  }
  const readInfo = async () => {
    if (!flags.value.connected) {
      return
    }
    setInfo({
      doneReading: false,
      storage: {
        sdcard: {
          status: {}
        },
        databases: {},
        internal: {}
      }
    })
    const isOld = await isOldProtobuf()
    if (isOld) {
      await flipper.value.RPC('systemDeviceInfo')
        .then(devInfo => {
          log({
            level: 'debug',
            message: `${componentName}: deviceInfo: OK`
          })
          setInfo({ ...info.value, ...devInfo })
        })
    } else {
      await flipper.value.RPC('propertyGet', { key: 'devinfo' })
        .then(devInfo => {
          log({
            level: 'debug',
            message: `${componentName}: propertyGet: OK`
          })
          setInfo({ ...info.value, ...devInfo })
        })
        .catch(error => rpcErrorHandler(componentName, error, 'propertyGet'))

      await flipper.value.RPC('propertyGet', { key: 'pwrinfo' })
        .then(powerInfo => {
          log({
            level: 'debug',
            message: `${componentName}: propertyGet: OK`
          })
          setPropertyInfo({ power: powerInfo })
        })
        .catch(error => rpcErrorHandler(componentName, error, 'propertyGet'))
    }
    const ext = await flipper.value.RPC('storageList', { path: '/ext' })
      .then(list => {
        log({
          level: 'debug',
          message: `${componentName}: storageList: /ext`
        })
        return list
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageList'))

    if (ext && ext.length) {
      const manifest = ext.find(e => e.name === 'Manifest')
      let status
      if (manifest) {
        status = 'installed'
      } else {
        status = 'missing'
      }
      setPropertyInfo({
        storage: {
          databases: {
            status
          }
        }
      })

      await flipper.value.RPC('storageInfo', { path: '/ext' })
        .then(extInfo => {
          log({
            level: 'debug',
            message: `${componentName}: storageInfo: /ext`
          })
          setPropertyInfo({
            storage: {
              sdcard: {
                status: {
                  label: 'installed',
                  isInstalled: true
                },
                totalSpace: extInfo.totalSpace,
                freeSpace: extInfo.freeSpace
              }
            }
          })
        })
        .catch(error => rpcErrorHandler(componentName, error, 'storageInfo'))
    } else {
      setPropertyInfo({
        storage: {
          sdcard: {
            status: {
              label: 'missing',
              isInstalled: false
            }
          },
          databases: {
            status: 'missing'
          }
        }
      })
    }

    await flipper.value.RPC('storageInfo', { path: '/int' })
      .then(intInfo => {
        log({
          level: 'debug',
          message: `${componentName}: storageInfo: /int`
        })
        setPropertyInfo({
          storage: {
            internal: {
              totalSpace: intInfo.totalSpace,
              freeSpace: intInfo.freeSpace
            }
          }
        })
        log({
          level: 'info',
          message: `${componentName}: Fetched device info`
        })
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageInfo'))
    setPropertyInfo({ doneReading: true })
    console.log(info.value)
  }
  const setTime = async () => {
    if (!flags.value.connected) {
      return
    }
    await flipper.value.RPC('systemSetDatetime', { date: new Date() })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: systemSetDatetime: OK`
        })
      })
      .catch(error => rpcErrorHandler(componentName, error, 'systemSetDatetime'))
  }
  const start = async (manual) => {
    const ports = await findKnownDevices()
    if (ports && ports.length > 0) {
      await connect()
      setTimeout(async () => {
        await startRpc()
        await readInfo()
        await setTime()
      }, 500)
    } else {
      flags.value.portSelectRequired = true
      if (manual) {
        return selectPort()
      }
    }
  }

  const setRpcStatus = (s) => {
    flags.value.rpcActive = s
  }
  const onUpdateStage = (stage) => {
    if (stage === 'start') {
      flags.value.updateInProgress = true
    } else if (stage === 'end') {
      flags.value.updateInProgress = false
    }
  }

  const fileToPass = ref(null)
  const openFileIn = ({ path, file }) => {
    log({
      level: 'info',
      message: `${componentName}: Passing file ${file.name} to ${path}`
    })
    fileToPass.value = file
    router.push(path)
  }

  const info = ref(null)
  const setInfo = (options) => {
    info.value = options
  }

  const setPropertyInfo = (options) => {
    info.value = useSetProperty(info.value, options)
  }

  return {
    flags,

    flipper,

    start,
    setRpcStatus,
    onUpdateStage,

    fileToPass,
    openFileIn,

    info,
    setInfo,
    setPropertyInfo
  }
})
