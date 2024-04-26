import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import showNotif from 'composables/useShowNotif'

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
    if (_list.length) {
      setCurrentFlipper(_list[0].name)
      flipperConnect()
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

    if (flags.value.autoReconnect) {
      autoReconnectFlipperName.value = flipper.value.name
    } else {
      autoReconnectFlipperName.value = null
    }
  }

  return { connect, selectPort, findKnownDevices, start, setReconnectTimeout }
})
