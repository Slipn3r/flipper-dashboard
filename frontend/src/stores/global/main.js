import { ref } from 'vue'
import { defineStore } from 'pinia'
import useSetProperty from 'composables/useSetProperty'
import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'
import { rpcErrorHandler } from 'composables/useRpcUtils'
import { useRouter } from 'vue-router'
import { fetchFirmwareTar } from 'src/util/fetch'
// eslint-disable-next-line no-unused-vars
import { Platform } from 'quasar'
import { init as bridgeControllerInit, emitter as bridgeEmitter, getCurrentFlipper, getList, setCurrentFlipper } from 'src/flipper-js/bridgeController'
const Flipper = await import(`src/flipper-js/${Platform.is.electron ? 'flipperElectron' : 'flipper'}`).then(m => m.default)

bridgeEmitter.on('exit', () => {
  // the safest way to restart everything, could be done rewritten to a graceful bridge respawn later
  // basically, bridge respawn works well, but at least virtual diplay sessions need to be restarted
  location.reload()
})

export const useMainStore = defineStore('main', () => {
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
  const autoReconnectFlipperName = ref(null)
  const componentName = 'Main'

  const availableFlippers = ref([])
  const reconnectLoop = ref(null)

  const connectionStatus = ref('Ready to connect')
  const findKnownDevices = async () => {
    if (!flags.value.isElectron) {
      const filters = [
        { usbVendorId: 0x0483, usbProductId: 0x5740 }
      ]
      return navigator.serial.getPorts({ filters })
    } else {
      return await window.serial.list()
    }
  }
  // eslint-disable-next-line no-unused-vars
  const connect = async (path) => {
    return new Promise((resolve, reject) => {
      (async () => {
        if (flags.value.isElectron) {
          try {
            setCurrentFlipper(path)
            flipperConnect()

            resolve()
          } catch (error) {
            reject(error)
          }
        } else {
          await flipper.value.connect(path)
            .then(() => {
              connectionStatus.value = 'Flipper connected'

              flags.value.portSelectRequired = false
              flags.value.connected = true
              flags.value.flipperOccupiedDialog = false

              log({
                level: 'info',
                message: `${componentName}: Flipper connected`
              })

              resolve()
            })
            .catch(error => {
              if (error.toString() === 'Error: No known ports') {
                flags.value.portSelectRequired = true

                reject([path, { message: 'Error: No known ports' }])
              } else if (error.toString().includes('Failed to open serial port')) {
                flags.value.portSelectRequired = true
                flags.value.flipperOccupiedDialog = true

                reject([path, { message: 'Failed to open serial port' }])
              } else {
                log({
                  level: 'error',
                  message: `${componentName}: Failed to connect: ${error}`
                })
                connectionStatus.value = error.toString()

                reject([path, { message: `Cannot open ${path}` }])
              }
            })
        }
      })()
    })
  }
  const selectPort = async (onShowDialog) => {
    if (!flags.value.isElectron) {
      const filters = [
        { usbVendorId: 0x0483, usbProductId: 0x5740 }
      ]
      await navigator.serial.requestPort({ filters })
    }
    return start(true, undefined, onShowDialog)
  }
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

  // eslint-disable-next-line no-unused-vars
  // const getDeviceInfo = async (port) => {
  //   let info = {
  //     doneReading: false,
  //     storage: {
  //       sdcard: {
  //         status: {}
  //       },
  //       databases: {},
  //       internal: {}
  //     }
  //   }
  //   await flipper.value.connect(port.path)
  //   await flipper.value.startRPCSession()
  //   await asyncSleep(500)
  //   if (isOldProtobuf()) {
  //     await flipper.value.RPC('systemDeviceInfo')
  //       .then(devInfo => {
  //         info = { ...info, ...devInfo }
  //       })
  //   } else {
  //     await flipper.value.RPC('propertyGet', { key: 'devinfo' })
  //       .then(devInfo => {
  //         info = { ...info, ...devInfo }
  //       })
  //   }
  //   info.port = port

  //   return info
  // }

  const reconnectTimeouts = ref([])
  const setReconnectTimeout = () => {
    reconnectTimeouts.value[reconnectTimeouts.value.length] = {
      name: autoReconnectFlipperName.value,
      timeout: setTimeout(() => {
        showNotif({
          message: 'Couldn\'t connect to Flipper after the update', // NOTE: ${this.name}
          color: 'negative'
        })
        onUpdateStage('end')
        connectToFirstFlipper()
      }, 2 * 60 * 1000)
    }
  }

  const clearReconnectTimeout = (name) => {
    const currentTimeout = reconnectTimeouts.value.find(timeout => {
      return timeout.name === name
    })
    clearTimeout(currentTimeout.timeout)
  }

  const connectToFirstFlipper = () => {
    const _list = getList()
    const availableList = _list.filter(e => e.mode !== 'dfu')
    const notAvailableList = _list.filter(e => e.mode === 'dfu')
    if (availableList.length) {
      setCurrentFlipper(availableList[0].name)
      flipperConnect()
    } else if (notAvailableList.length) {
      flags.value.dialogMultiflipper = true
    }
  }

  const listInit = () => {
    bridgeEmitter.on('list', async data => {
      availableFlippers.value = data
      console.log('availableFlippers', availableFlippers.value)

      if (availableFlippers.value.length > 1) {
        flags.value.multiflipper = true
      } else {
        flags.value.multiflipper = false
      }

      if (!flags.value.updateInProgress && !availableFlippers.value.find(item => flipper.value?.name === item.name)) {
        flags.value.connected = false
        flags.value.rpcActive = false
        setInfo(null)
        setCurrentFlipper(null)
      }

      if (flags.value.updateInProgress) {
        const updatingFlipper = data.find(flipper => flipper.name === autoReconnectFlipperName.value)

        if (updatingFlipper) {
          clearReconnectTimeout(updatingFlipper.name)
          setCurrentFlipper(updatingFlipper.name)
          onUpdateStage('end')
          flipperConnect()
        }
      } else {
        const _currentFlipper = getCurrentFlipper()
        if (!_currentFlipper) {
          connectToFirstFlipper()
        }
      }
    })
  }

  const flipperConnect = async () => {
    const _currentFlipper = getCurrentFlipper()
    flipper.value = new Flipper(_currentFlipper.name, _currentFlipper.emitter)

    if (flipper.value) {
      flags.value.connected = true
      flags.value.rpcActive = true

      log({
        level: 'info',
        message: `${componentName}: Flipper ${flipper.value.name} connected`
      })

      await readInfo(flipper.value.name)
      await setTime()
    }
  }

  const start = async (manual, path) => {
    toggleAutoReconnectCondition()

    if (flags.value.isElectron) {
      bridgeEmitter.on('spawn', () => {
        setTimeout(() => {
          flags.value.isBridgeReady = true
        }, 1000)
      })
      bridgeEmitter.on('exit', e => {
        flags.value.isBridgeReady = false
      })
      listInit()
      await bridgeControllerInit()

      if (flags.value.autoReconnect && flipper.value?.name) {
        autoReconnectFlipperName.value = flipper.value.name
      } else {
        autoReconnectFlipperName.value = null
      }
    } else {
      if (!path) {
        /* const ports = await findKnownDevices()
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
        } */ // Old connection method

        const ports = await findKnownDevices()

        availableFlippers.value = []
        flags.value.multiflipper = false

        if (!ports || ports.length === 0) {
          if (flags.value.autoReconnect) {
            autoReconnect()
          }

          flags.value.portSelectRequired = true

          if (manual) {
            return selectPort()
          }
          return
        }

        if (ports.length === 1 || !flags.value.isElectron) {
          path = ports[0].path
        }
      }
    }

    /* await connect(path)
      .then(async () => {
        if (reconnectLoop.value) {
          clearInterval(reconnectLoop.value)
          reconnectLoop.value = null
        }

        flags.value.dialogMultiflipper = false
        autoReconnectRestore()

        if (flags.value.isElectron) {
          function onDisconnect (path) {
            flags.value.connected = false
            if (flags.value.autoReconnect) {
              autoReconnect(path)
            }
            unbind()
          }
          const unbind = flipper.value.emitter.on('disconnect', path => onDisconnect(path))
        }

        await startRpc()
        await readInfo(path)
        await setTime()
      })
      .catch(([path, error]) => {
        const index = availableFlippers.value.findIndex((flipper) => flipper.port.path === path)
        if (index !== -1) {
          availableFlippers.value.splice(index, 1)

          flags.value.multiflipper = false

          Notify.create({
            type: 'negative',
            message: error.message
          })
        }

        if (availableFlippers.value.length === 1) {
          start(false, availableFlippers.value[0].port.path)
          return
        }

        start()
      }) */
  }

  const updateStage = ref('')
  const recoveryLogs = ref([])
  const recoveryProgress = ref(0)

  const resetRecovery = (clearLogs = false) => {
    updateStage.value = ''
    recoveryProgress.value = 0
    if (clearLogs) {
      recoveryLogs.value = []
    }
  }
  const recovery = async (info) => {
    if (!flags.value.isElectron) {
      return
    }
    flags.value.dialogMultiflipper = false
    flags.value.dialogRecovery = true
    flags.value.recovery = true
    autoReconnectCondition.value = flags.value.autoReconnect
    flags.value.autoReconnect = false
    autoReconnectFlipperName.value = info.name

    console.log(info)
    const firmwareTar = await fetchFirmwareTar(`https://update.flipperzero.one/firmware/release/f${info.target}/update_tgz`)
    console.log(firmwareTar.buffer)
    const saved = await window.fs.saveToTemp({
      filename: 'update.tar',
      buffer: firmwareTar
    })
    console.log(saved)
    if (saved.status !== 'ok') {
      return
    }

    window.bridge.send({
      type: 'repair',
      name: info.name,
      data: {
        file: saved.path
      }
    })

    const unbindLogs = bridgeEmitter.on('log', stderr => {
      const logLines = stderr.data.split('\n')
      logLines.pop()
      logLines.forEach(line => {
        recoveryLogs.value.push(line)
        let level = 'debug'
        if (line.includes('[E]')) {
          level = 'error'
        } else if (line.includes('[W]')) {
          level = 'warn'
        } else if (line.includes('[I]')) {
          level = 'info'
        }
        log({
          level,
          message: line
        })
      })
    })

    const unbindStatus = bridgeEmitter.on('status', status => {
      if (status.message) {
        updateStage.value = status.message
      }
      if (status.progress) {
        recoveryProgress.value = status.progress / 100
      }
      if (status.finished) {
        unbindLogs()
        unbindStatus()
        flags.value.recovery = false
        flags.value.dialogMultiflipper = false
        flags.value.autoReconnect = autoReconnectCondition.value
        updateStage.value = 'Finished'
        setCurrentFlipper(info.name)
        if (getList().includes(e => e.name === info.name)) {
          setCurrentFlipper(info.name)
          flipperConnect()
        }
        if (!flags.value.showRecoveryLog) {
          flags.value.dialogRecovery = false
        }
        onUpdateStage('end')
      }
    })
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
    availableFlippers,

    selectPort,
    connect,
    start,
    startRpc,
    setRpcStatus,
    autoReconnect,
    autoReconnectRestore,

    updateStage,
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
