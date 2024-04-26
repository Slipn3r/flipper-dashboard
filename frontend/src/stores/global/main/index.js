import { ref } from 'vue'
import { defineStore } from 'pinia'
import useSetProperty from 'composables/useSetProperty'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'
import { useRouter } from 'vue-router'
import asyncSleep from 'simple-async-sleep'
// eslint-disable-next-line no-unused-vars
import { Platform } from 'quasar'
const Flipper = await import(`src/flipper-js/${Platform.is.electron ? 'flipperElectron' : 'flipper'}`).then(m => m.default)

import { useMainWebStore } from './store-web'
import { useMainElectronStore } from './store-electron'

export const useMainStore = defineStore('main', () => {
  const platformStore = Platform.is.electron ? useMainElectronStore() : useMainWebStore()

  const router = useRouter()

  const flags = ref({
    isElectron: Platform.is.electron,

    multiflipper: false,
    loadingMultiflipper: false,
    dialogMultiflipper: false,

    dialogRecovery: false,
    recovery: false,
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
  const getProtobufVersion = async () => {
    return await flipper.value.RPC('systemProtobufVersion')
  }
  const isOldProtobuf = async () => {
    const protobufVersion = getProtobufVersion()
    return protobufVersion.major === 0 && protobufVersion.minor < 14
  }
  // eslint-disable-next-line no-unused-vars
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
    // if (path) {
    //   defaultInfo.port = {
    //     path
    //   }
    // }
    setInfo(defaultInfo)
    if (isOldProtobuf()) {
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
  const recoveryLogs = ref([])
  const recoveryProgress = ref(0)
  const updateStages = ref([
    {
      name: 'Set Recovery boot mode',
      ended: false
    },
    {
      name: 'Co-Processor Firmware Download',
      ended: false
    },
    {
      name: 'Firmware Download',
      ended: false
    },
    {
      name: 'Correct Option Bytes',
      ended: false
    },
    {
      name: 'Assets Download',
      ended: false
    },
    {
      name: 'Region Provisioning',
      ended: false
    }
  ])
  const stageIndex = ref(0)
  const recoveryRestart = ref(false)

  const path = ref('')
  const resetRecovery = (clearLogs = false) => {
    stageIndex.value = 0
    recoveryProgress.value = 0
    updateStages.value.forEach(stage => {
      stage.ended = false
    })
    if (clearLogs) {
      recoveryLogs.value = []
    }
  }
  const logCallback = async (message) => {
    if (message.type === 'exit' && message.code === 0) {
      flags.value.recovery = false

      if (!recoveryRestart.value) {
        if (!flags.value.showRecoveryLog) {
          flags.value.dialogRecovery = false
        }
        flags.value.autoReconnect = autoReconnectCondition.value
        onUpdateStage('end')
        await asyncSleep(1000)
        return start(false, path.value)
      }

      onUpdateStage('end')
      recoveryRestart.value = false
    }

    const lines = message.data.split('\n')
    lines.forEach(line => {
      let level = 'info'

      if (line.length > 0) {
        recoveryLogs.value.push(line)

        if (line.includes(updateStages.value[stageIndex.value]?.name)) {
          if (line.endsWith('START')) {
            setUpdateStage(updateStages.value[stageIndex.value].name)
          } else {
            updateStages.value[stageIndex.value].ended = true
            stageIndex.value++
            recoveryProgress.value = stageIndex.value / updateStages.value.length
          }
        } else if (!recoveryRestart.value && (line.toLowerCase().includes('failed') || line.includes('ERROR'))) {
          level = 'error'

          recoveryRestart.value = true

          resetRecovery()

          recovery(logCallback)
        }

        log({
          level,
          message: line
        })
      }
    })
  }
  const recovery = async (logCallback) => {
    flags.value.dialogRecovery = true
    path.value = flipper.value.path
    flags.value.recovery = true
    autoReconnectCondition.value = flags.value.autoReconnect
    flags.value.autoReconnect = false

    updateStage.value = updateStages.value[stageIndex.value].name

    onUpdateStage('start')

    if (!flags.value.isElectron) {
      return
    }
    if (flags.value.connected) {
      if (!flags.value.rpcActive) {
        flipper.value.write('power reboot2dfu')
      } else {
        flipper.value.RPC('systemReboot', { mode: 'DFU' })
      }
      await asyncSleep(1000)
    }
    if (!logCallback) {
      logCallback = (data) => {
        console.log(data)
      }
    }
    window.qFlipper.onLog(logCallback)
    await window.qFlipper.spawn([])
  }

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
      flags.value.updateInProgress = true

      stopScreenStream()
      if (!flags.value.isElectron) {
        navigator.serial.addEventListener('connect', () => {
          flags.value.updateInProgress = false
        })
      }
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
    setFlipper,

    availableFlippers,
    setAvailableFlippers,

    readInfo,

    selectPort,
    connect,
    start,
    startRpc,
    setRpcStatus,
    setTime,
    autoReconnect,
    autoReconnectRestore,
    toggleAutoReconnectCondition,

    updateStage,
    onUpdateStage,

    setReconnectTimeout,

    recoveryLogs,
    recoveryProgress,
    logCallback,
    recovery,
    resetRecovery,

    fileToPass,
    openFileIn,

    info,
    setInfo,
    setPropertyInfo
  }
})
