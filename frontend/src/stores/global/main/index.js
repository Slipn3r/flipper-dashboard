import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import useSetProperty from 'composables/useSetProperty'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'
import { useRouter } from 'vue-router'
// eslint-disable-next-line no-unused-vars
import { Platform } from 'quasar'
const Flipper = await import(`src/flipper-js/${Platform.is.electron ? 'flipperElectron' : 'flipper'}`).then(m => m.default)
import { emitter as bridgeEmitter } from 'src/flipper-js/bridgeController'

import { useMainWebStore } from './store-web'
import { useMainElectronStore } from './store-electron'

bridgeEmitter.on('exit', () => {
  // the safest way to restart everything, could be done rewritten to a graceful bridge respawn later
  // basically, bridge respawn works well, but at least virtual display sessions need to be restarted
  location.reload()
})

export const useMainStore = defineStore('main', () => {
  const platformStore = Platform.is.electron ? useMainElectronStore() : useMainWebStore()

  const router = useRouter()

  const flags = ref({
    isElectron: Platform.is.electron,

    disableNavigation: false,

    multiflipper: false,
    loadingMultiflipper: false,
    dialogMultiflipper: false,
    disableButtonMultiflipper: true,

    flipperInitializationInProgress: false,

    dialogRecovery: false,
    recovery: false,
    recoveryError: false,
    showRecoveryLog: false,

    serialSupported: true,
    serialUnsupportedDialog: false,
    connectionRequired: true,
    portSelectRequired: false,
    connected: false,
    rpcActive: false,
    rpcToggling: false,
    connectOnStart: true,
    autoReconnect: true,
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

  // TODO
  const flipper = ref(null)
  const setFlipper = (name, emitter) => {
    flipper.value = new Flipper(name, emitter)
  }

  const componentName = 'Main'

  const availableFlippers = ref([])
  const setAvailableFlippers = (flippers) => {
    availableFlippers.value = flippers
  }
  const reconnectLoop = ref(null)

  const findKnownDevices = platformStore.findKnownDevices
  const connect = platformStore.connect
  const selectPort = platformStore.selectPort

  const startRpc = async () => {
    if (!flags.value.connected) {
      return
    }
    flags.value.rpcToggling = true

    await flipper.value.startRPCSession()
      .catch(error => {
        log({
          level: 'error',
          message: `${componentName}: Failed to start RPC: ${error.toString()}`
        })
      })
    flags.value.rpcActive = true
    flags.value.rpcToggling = false

    log({
      level: 'info',
      message: `${componentName}: RPC started`
    })
  }
  const isOldProtobuf = async () => {
    const protobufVersion = await flipper.value.RPC('systemProtobufVersion')
      .catch(error => {
        rpcErrorHandler(componentName, error, 'systemProtobufVersion')
        throw error
      })
    return protobufVersion.major === 0 && protobufVersion.minor < 14
  }
  const readInfo = async () => {
    if (!flags.value.connected) {
      return
    }
    const defaultInfo = {
      doneReading: false,
      storage: {
        sdcard: {
          status: {}
        },
        databases: {},
        internal: {}
      }
    }
    setInfo(defaultInfo)

    /* await flipper.value.RPC('systemPing', { timeout: 2000 })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'systemPing')
        throw error
      }) */

    if (await isOldProtobuf()) {
      await flipper.value.RPC('systemDeviceInfo')
        .then(devInfo => {
          log({
            level: 'debug',
            message: `${componentName}: deviceInfo: OK`
          })
          setInfo({ ...info.value, ...devInfo })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'systemDeviceInfo')
          throw error
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
        .catch(error => {
          rpcErrorHandler(componentName, error, 'propertyGet')
          throw error
        })

      await flipper.value.RPC('propertyGet', { key: 'pwrinfo' })
        .then(powerInfo => {
          log({
            level: 'debug',
            message: `${componentName}: propertyGet: OK`
          })
          setPropertyInfo({ power: powerInfo })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'propertyGet')
          throw error
        })
    }

    const ext = await flipper.value.RPC('storageList', { path: '/ext' })
      .then(list => {
        log({
          level: 'debug',
          message: `${componentName}: storageList: /ext`
        })
        return list
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageList')
        throw error
      })

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
        .catch(error => {
          rpcErrorHandler(componentName, error, 'storageInfo')
          throw error
        })
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
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageInfo')
        throw error
      })
    setPropertyInfo({ doneReading: true })
  }
  // eslint-disable-next-line no-unused-vars
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

  const autoReconnectCondition = ref(null)
  const autoReconnect = (path) => {
    if (reconnectLoop.value) {
      clearInterval(reconnectLoop.value)
      reconnectLoop.value = null
    }

    if (flags.value.autoReconnect) {
      reconnectLoop.value = setInterval(async () => {
        if (flags.value.autoReconnect) {
          const ports = await findKnownDevices()
          if (ports && ports.length > 0) {
            if (path && !ports.find(e => e.path === path)) {
              return
            }
            clearInterval(reconnectLoop.value)
            reconnectLoop.value = null
            return await start(false, path)
          }
        } else {
          clearInterval(reconnectLoop.value)
          reconnectLoop.value = null
        }
      }, 1000)
    }
  }

  const setAutoReconnectCondition = (condition) => {
    autoReconnectCondition.value = condition
  }
  const toggleAutoReconnectCondition = () => {
    if (!autoReconnectCondition.value) {
      if (localStorage.getItem('autoReconnect') !== 'false') {
        autoReconnectCondition.value = true
      } else {
        autoReconnectCondition.value = false
      }
    }
  }

  const autoReconnectRestore = () => {
    toggleAutoReconnectCondition()
    flags.value.autoReconnect = autoReconnectCondition.value
    localStorage.setItem('autoReconnect', flags.value.autoReconnect)
    autoReconnectCondition.value = null
  }

  const setReconnectTimeout = flags.value.isElectron ? platformStore.setReconnectTimeout : () => true

  const start = platformStore.start

  const updateStage = ref('')
  const setUpdateStage = (str) => {
    updateStage.value = str
  }
  const recoveryLogs = computed(() => platformStore.recoveryLogs || [])
  const recoveryProgress = computed(() => platformStore.recoveryProgress || 0)

  const resetRecovery = platformStore.resetRecovery
  const recovery = platformStore.recovery

  const setRpcStatus = (s) => {
    flags.value.rpcActive = s
  }

  const stopScreenStream = async () => {
    await flipper.value.RPC('guiStopScreenStream')
      .catch(error => rpcErrorHandler(componentName, error, 'guiStopScreenStream'))
      .finally(() => {
        log({
          level: 'debug',
          message: `${componentName}: guiStopScreenStream: OK`
        })
      })
    flags.value.screenStream = false
  }
  const onUpdateStage = (stage) => {
    if (stage === 'start') {
      flags.value.disableNavigation = true
      flags.value.updateInProgress = true

      stopScreenStream()
      if (!flags.value.isElectron) {
        navigator.serial.addEventListener('connect', () => {
          flags.value.updateInProgress = false
        })
      }
    } else if (stage === 'end') {
      flags.value.disableNavigation = false
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
    setFlipper,

    availableFlippers,

    setAvailableFlippers,

    readInfo,

    bridgeEmitter,

    selectPort,
    connect,
    start,
    startRpc,
    setRpcStatus,
    setTime,
    autoReconnect,
    autoReconnectRestore,

    autoReconnectCondition,
    setAutoReconnectCondition,
    toggleAutoReconnectCondition,

    updateStage,
    setUpdateStage,
    onUpdateStage,

    setReconnectTimeout,

    recoveryLogs,
    recoveryProgress,
    recovery,
    resetRecovery,

    fileToPass,
    openFileIn,

    info,
    setInfo,
    setPropertyInfo
  }
})
