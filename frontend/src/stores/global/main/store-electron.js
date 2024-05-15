import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'

import { fetchFirmwareTar } from 'src/util/fetch'
import { init as bridgeControllerInit, emitter as bridgeEmitter, getCurrentFlipper, getList, setCurrentFlipper } from 'src/flipper-js/bridgeController'

import { useMainStore } from 'stores/global/main'

import { useRouter, useRoute } from 'vue-router'

// import { rpcErrorHandler } from 'composables/useRpcUtils'

export const useMainElectronStore = defineStore('MainElectron', () => {
  const mainStore = useMainStore()

  const router = useRouter()
  const route = useRoute()

  const flags = computed(() => mainStore.flags)

  const flipper = computed(() => mainStore.flipper)

  const findKnownDevices = async () => {
    return await window.serial.list()
  }

  const readInfo = computed(() => mainStore.readInfo)
  const setTime = computed(() => mainStore.setTime)
  const setFlipper = computed(() => mainStore.setFlipper)
  const flipperConnect = async () => {
    flags.value.connected = false
    flags.value.rpcActive = false
    const _currentFlipper = getCurrentFlipper()

    if (_currentFlipper) {
      if (flipper.value?.emitter) {
        flipper.value.emitter.events = {}
      }
      setFlipper.value(_currentFlipper.name, _currentFlipper.emitter)

      flags.value.connected = true
      flags.value.rpcActive = true

      await initializeFlipper()
      // await readInfo.value(flipper.value.name)
      // await setTime.value()

      // flags.value.dialogMultiflipper = false
      flags.value.disableButtonMultiflipper = true

      if (availableFlippers.value.length === 1) {
        flags.value.dialogMultiflipper = false
      }

      setTimeout(() => {
        flags.value.disableButtonMultiflipper = false
      }, 1500)
    } else {
      flags.value.disableButtonMultiflipper = false
    }
  }

  const initializeFlipperName = ref(null)
  const initializeFlipper = async (attempts = 0) => {
    if (!initializeFlipperName.value) {
      initializeFlipperName.value = flipper.value.name
    }

    flags.value.flipperInitializationInProgress = true
    try {
      await readInfo.value()
      await setTime.value()
      flags.value.flipperInitializationInProgress = false
    } catch (error) {
      if (attempts < 3) {
        setTimeout(() => {
          initializeFlipper(attempts + 1)
        }, 300)
      } else {
        flags.value.flipperInitializationInProgress = false
        showNotif({
          message: `Failed to connect to Flipper ${initializeFlipperName.value}. Replug the device and try again.`,
          color: 'negative'
        })

        initializeFlipperName.value = false
      }
    }
  }

  const connect = async (name) => {
    setCurrentFlipper(name)
    await flipperConnect()
  }
  const selectPort = async (onShowDialog) => {
    return start(true, undefined, onShowDialog)
  }

  const onUpdateStage = computed(() => mainStore.onUpdateStage)
  const setUpdateStage = computed(() => mainStore.setUpdateStage)
  const autoReconnectFlipperName = ref(null)
  const timedOutAutoReconnectFlipperName = ref(null)
  const reconnectTimeouts = ref([])
  const dismissReconnectTimeoutNotif = ref(null)
  const setReconnectTimeout = (name) => {
    reconnectTimeouts.value[reconnectTimeouts.value.length] = {
      name,
      timeout: setTimeout(() => {
        dismissReconnectTimeoutNotif.value = showNotif({
          message: `Couldn't connect to Flipper ${name} after the update`,
          color: 'negative'
        })
        timedOutAutoReconnectFlipperName.value = name
        flags.value.connected = false
        flags.value.rpcActive = false
        onUpdateStage.value('end')
        connectToFirstFlipper()
      }, 2 * 60 * 1000)
    }
  }

  const connectToFirstFlipper = async () => {
    const _list = getList()
    const availableList = _list.filter(e => e.mode !== 'dfu')
    const notAvailableList = _list.filter(e => e.mode === 'dfu')
    if (availableList.length) {
      setCurrentFlipper(availableList[0].name)
      await flipperConnect()
    } else if (notAvailableList.length) {
      flags.value.dialogMultiflipper = true
    }
  }

  const clearReconnectTimeout = (name) => {
    const currentTimeout = reconnectTimeouts.value.find(timeout => {
      return timeout.name === name
    })
    clearTimeout(currentTimeout.timeout)
  }

  const availableFlippers = computed(() => mainStore.availableFlippers)
  const setAvailableFlippers = computed(() => mainStore.setAvailableFlippers)
  const setInfo = computed(() => mainStore.setInfo)
  const dismissSuccessUpdateNotif = ref(null)
  const dismissTimedOutSuccessUpdateNotif = ref(null)
  const listInit = () => {
    bridgeEmitter.on('list', async data => {
      if (flags.value.recovery) {
        flags.value.connected = false
        flags.value.rpcActive = false
        setInfo.value(null)
        setCurrentFlipper(null)
        return
      }

      if (!data.length) {
        flags.value.disableButtonMultiflipper = false
      }

      setAvailableFlippers.value(data)
      console.log('availableFlippers', availableFlippers.value)

      if (availableFlippers.value.length > 1) {
        flags.value.multiflipper = true
      } else {
        flags.value.multiflipper = false
      }

      if (!flags.value.updateInProgress && !availableFlippers.value.find(item => flipper.value?.name === item.name)) {
        flags.value.connected = false
        flags.value.rpcActive = false
        setInfo.value(null)
        setCurrentFlipper(null)
      }

      if (flags.value.updateInProgress) {
        const updatingFlipper = data.find(flipper => reconnectTimeouts.value.map(timeout => timeout.name).includes(flipper.name))
        const updatingFlipperReconnectTimeout = reconnectTimeouts.value.find(timeout => timeout.name === updatingFlipper?.name)

        if (updatingFlipper && updatingFlipperReconnectTimeout) {
          clearReconnectTimeout(updatingFlipper.name)
          setCurrentFlipper(updatingFlipper.name)
          onUpdateStage.value('end')
          dismissSuccessUpdateNotif.value = showNotif({
            message: `Flipper ${updatingFlipper.name} successfully updated. Do you want to update apps too?`,
            color: 'positive',
            actions: [
              {
                label: 'Yes',
                color: 'white',
                handler: async () => {
                  const _currentFlipper = getCurrentFlipper()
                  if (_currentFlipper?.name !== updatingFlipper.name) {
                    await connect(updatingFlipper.name)
                  }
                  router.push({ name: 'InstalledApps' })
                }
              }
            ]
          })
          flipperConnect()
        }
      } else {
        if (repairedFlipperName.value) {
          const _name = repairedFlipperName.value
          repairedFlipperName.value = null
          flags.value.shouldUpdateAfterRepair = true
          if (route.name !== 'Device') {
            router.push({ name: 'Device' })
          }
          await connect(_name)
          return
        } else if (data.find(flipper => flipper.mode === 'dfu')) {
          flags.value.dialogMultiflipper = true
          return
        }

        const _currentFlipper = getCurrentFlipper()
        console.log('currentFlipper', _currentFlipper)
        if (!_currentFlipper || _currentFlipper.mode === 'dfu') {
          await connectToFirstFlipper()
        } else {
          /* if (_currentFlipper.mode === 'cli') {
            try {
              console.log('Device in CLI mode, sending RPC ping...')
              await flipper.value.RPC('systemPing', { timeout: 3000 })
              console.log('Ping success')
            } catch {
              console.log('Ping failed')
            }
          } */
          /* const _list = getList()
          const _flipper = _list.find(e => e.name === _currentFlipper.name)
          flipper.value.emitter = _flipper.emitter */

          // flags.value.connected = true
          // flags.value.rpcActive = true
          console.log(flipper.value)

          /* try {
            await flipper.value.write('?\r')
            const CLIPromise = new Promise((resolve, reject) => {
              const rejectTimeout = setTimeout(() => {
                reject('CLI timeout')
              }, 3000)
              flipper.value.emitter.on('CLIRead', () => {
                clearTimeout(rejectTimeout)
                resolve()
              })
            })
            await CLIPromise

            await flipper.value.RPC('systemPing', { timeout: 3000 })
              .catch(error => {
                rpcErrorHandler('Main/electron', error, 'systemPing')
                throw error
              })
          } catch (error) {
            log({ level: 'error', message: `Failed to restart RPC: ${error.message || error}` })
            flags.value.connected = false
            flags.value.rpcActive = false
            await connect(_currentFlipper.name, true)
          } */

          // flags.value.connected = false
          // flags.value.rpcActive = false
          // await connect(_currentFlipper.name)
        }

        if (timedOutAutoReconnectFlipperName.value && data.map(flipper => flipper.name).includes(timedOutAutoReconnectFlipperName.value)) {
          if (dismissReconnectTimeoutNotif.value) {
            dismissReconnectTimeoutNotif.value()
          }
          dismissTimedOutSuccessUpdateNotif.value = showNotif({
            message: `Flipper ${timedOutAutoReconnectFlipperName.value} is back online. Do you want to update apps?`,
            color: 'positive',
            actions: [
              {
                label: 'Yes',
                color: 'white',
                handler: async () => {
                  if (_currentFlipper?.name !== timedOutAutoReconnectFlipperName.value) {
                    await connect(timedOutAutoReconnectFlipperName.value)
                  }
                  router.push({ name: 'InstalledApps' })
                  timedOutAutoReconnectFlipperName.value = null
                }
              }
            ]
          })
        }
      }
    })
  }

  const autoReconnectCondition = computed(() => mainStore.autoReconnectCondition)
  const setAutoReconnectCondition = computed(() => mainStore.setAutoReconnectCondition)
  const toggleAutoReconnectCondition = computed(() => mainStore.toggleAutoReconnectCondition)
  const start = async () => {
    toggleAutoReconnectCondition.value()

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
  }

  const recoveryLogs = ref([])
  const recoveryProgress = ref(0)
  const repairedFlipperName = ref(null)
  const resetRecovery = (clearLogs = false) => {
    setUpdateStage.value('')
    recoveryProgress.value = 0
    if (clearLogs) {
      recoveryLogs.value = []
    }
  }
  const recovery = async (info) => {
    if (!flags.value.isElectron) {
      return
    }
    flags.value.recoveryError = false
    flags.value.dialogMultiflipper = false
    flags.value.dialogRecovery = true
    flags.value.recovery = true
    setAutoReconnectCondition.value(flags.value.autoReconnect)
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

    let inactivityTimeout
    const onTimeout = () => {
      const messageLong = 'Error: Operation timed out. Please check USB connection and try again.'
      const messageShort = `Failed to repair ${info.name}: Repair timeout`
      showNotif({
        message: messageShort,
        color: 'negative'
      })
      log({
        level: 'error',
        message: messageShort
      })
      unbindLogs()
      unbindStatus()
      setUpdateStage.value(messageLong)
      flags.value.recoveryError = true
    }
    const updateInactivityTimeout = (stop = false) => {
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout)
      }

      if (stop) {
        return
      }

      inactivityTimeout = setTimeout(onTimeout, 60 * 1000)
    }

    window.bridge.send({
      type: 'repair',
      name: info.name,
      data: {
        file: saved.path
      }
    })

    updateInactivityTimeout()

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

    const unbindStatus = bridgeEmitter.on('status', async status => {
      if (status.error) {
        updateInactivityTimeout(true)
        let messageLong = `Failed to repair ${info.name}: ${status.error.message}`
        let messageShort = messageLong
        switch (status.error.message) {
          case 'UnknownError':
            messageLong = 'Unknown error! Please try again. If the error persists, please contact support.'
            messageShort = `Failed to repair ${info.name}: Unknown error`
            break
          case 'InvalidDevice':
            messageLong = 'Error: Cannot determine device type. Please try again.'
            messageShort = `Failed to repair ${info.name}: Invalid device`
            break
          case 'DiskError':
            messageLong = 'Error: Cannot read/write to disk. The app may be missing permissions.'
            messageShort = `Failed to repair ${info.name}: Disk error`
            break
          case 'DataError':
            messageLong = 'Error: Necessary files are corrupted. Please try again.'
            messageShort = `Failed to repair ${info.name}: Data error`
            break
          case 'SerialAccessError':
            messageLong = 'Error: Cannot access device in Serial mode. Please check USB connection and permissions and try again.'
            messageShort = `Failed to repair ${info.name}: Serial access error`
            break
          case 'RecoveryAccessError':
            messageLong = 'Error: Cannot access device in Recovery mode. Please check USB connection and permissions and try again.'
            messageShort = `Failed to repair ${info.name}: Recovery access error`
            break
          case 'OperationError':
            messageLong = 'Error: Current operation was interrupted. Please try again.'
            messageShort = `Failed to repair ${info.name}: Operation error`
            break
          case 'SerialError':
            messageLong = 'Error: Serial port error. Please check USB connection and try again.'
            messageShort = `Failed to repair ${info.name}: Serial error`
            break
          case 'RecoveryError':
            messageLong = 'Error: Recovery mode error. Please check USB connection and try again.'
            messageShort = `Failed to repair ${info.name}: Recovery error`
            break
          case 'ProtocolError':
            messageLong = 'Error: Protocol error. Please try again. If the error persists, please contact support.'
            messageShort = `Failed to repair ${info.name}: Protocol error`
            break
          case 'TimeoutError':
            messageLong = 'Error: Operation timed out. Please check USB connection and try again.'
            messageShort = `Failed to repair ${info.name}: Timeout error`
            break
        }
        showNotif({
          message: messageShort,
          color: 'negative'
        })
        unbindLogs()
        unbindStatus()
        setUpdateStage.value(messageLong)
        flags.value.recoveryError = true
      }
      if (status.message) {
        updateInactivityTimeout()
        setUpdateStage.value(status.message)
      }
      if (status.progress) {
        updateInactivityTimeout()
        recoveryProgress.value = status.progress / 100
      }
      if (status.finished) {
        updateInactivityTimeout(true)
        unbindLogs()
        unbindStatus()
        flags.value.recovery = false
        flags.value.dialogMultiflipper = false
        flags.value.autoReconnect = autoReconnectCondition.value
        autoReconnectFlipperName.value = info.name
        repairedFlipperName.value = info.name

        setUpdateStage.value('Finished')
        if (getList().includes(e => e.name === info.name)) {
          await connect(info.name)
        }
        flags.value.dialogRecovery = false
        onUpdateStage.value('end')
      }
    })
  }

  return {
    connect,
    connectToFirstFlipper,
    selectPort,
    findKnownDevices,
    flipperConnect,
    start,
    setReconnectTimeout,
    recoveryLogs,
    recoveryProgress,
    resetRecovery,
    recovery,
    dismissSuccessUpdateNotif,
    dismissTimedOutSuccessUpdateNotif
  }
})
