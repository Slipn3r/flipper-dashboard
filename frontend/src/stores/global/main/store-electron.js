import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'

import { fetchFirmwareTar } from 'src/util/fetch'
import { init as bridgeControllerInit, emitter as bridgeEmitter, getCurrentFlipper, getList, setCurrentFlipper } from 'src/flipper-js/bridgeController'

import { useMainStore } from 'stores/global/main'

export const useMainElectronStore = defineStore('MainElectron', () => {
  const mainStore = useMainStore()

  const flags = computed(() => mainStore.flags)

  const flipper = computed(() => mainStore.flipper)

  const findKnownDevices = async () => {
    return await window.serial.list()
  }

  const readInfo = computed(() => mainStore.readInfo)
  const setTime = computed(() => mainStore.setTime)
  const setFlipper = computed(() => mainStore.setFlipper)
  const flipperConnect = async () => {
    const _currentFlipper = getCurrentFlipper()
    setFlipper.value(_currentFlipper.name, _currentFlipper.emitter)

    if (flipper.value) {
      flags.value.connected = true
      flags.value.rpcActive = true

      await readInfo.value(flipper.value.name)
      await setTime.value()
    }
  }

  const connect = async (path) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          setCurrentFlipper(path)
          flipperConnect()

          resolve()
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
  const selectPort = async (onShowDialog) => {
    return start(true, undefined, onShowDialog)
  }

  const onUpdateStage = computed(() => mainStore.onUpdateStage)
  const setUpdateStage = computed(() => mainStore.setUpdateStage)
  const autoReconnectFlipperName = ref(null)
  const reconnectTimeouts = ref([])
  const setReconnectTimeout = () => {
    reconnectTimeouts.value[reconnectTimeouts.value.length] = {
      name: autoReconnectFlipperName.value,
      timeout: setTimeout(() => {
        showNotif({
          message: 'Couldn\'t connect to Flipper after the update', // NOTE: ${this.name}
          color: 'negative'
        })
        onUpdateStage.value('end')
        connectToFirstFlipper()
      }, 2 * 60 * 1000)
    }
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

  const clearReconnectTimeout = (name) => {
    const currentTimeout = reconnectTimeouts.value.find(timeout => {
      return timeout.name === name
    })
    clearTimeout(currentTimeout.timeout)
  }

  const availableFlippers = computed(() => mainStore.availableFlippers)
  const setAvailableFlippers = computed(() => mainStore.setAvailableFlippers)
  const setInfo = computed(() => mainStore.setInfo)
  const listInit = () => {
    bridgeEmitter.on('list', async data => {
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
        const updatingFlipper = data.find(flipper => flipper.name === autoReconnectFlipperName.value)

        if (updatingFlipper) {
          clearReconnectTimeout(updatingFlipper.name)
          setCurrentFlipper(updatingFlipper.name)
          onUpdateStage.value('end')
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
      if (status.error) {
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
        setUpdateStage.value(status.message)
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
        setUpdateStage.value('Finished')
        setCurrentFlipper(info.name)
        if (getList().includes(e => e.name === info.name)) {
          setCurrentFlipper(info.name)
          flipperConnect()
        }
        if (!flags.value.showRecoveryLog) {
          flags.value.dialogRecovery = false
        }
        onUpdateStage.value('end')
      }
    })
  }

  return { connect, selectPort, findKnownDevices, flipperConnect, start, setReconnectTimeout, recoveryLogs, recoveryProgress, resetRecovery, recovery }
})
