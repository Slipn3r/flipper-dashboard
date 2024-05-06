import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { log } from 'composables/useLog'

import { useMainStore } from 'stores/global/main'

export const useMainWebStore = defineStore('MainWeb', () => {
  const mainStore = useMainStore()

  const flags = computed(() => mainStore.flags)

  const flipper = computed(() => mainStore.flipper)

  const findKnownDevices = async () => {
    const filters = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 }
    ]
    return navigator.serial.getPorts({ filters })
  }

  const connectionStatus = ref('Ready to connect')
  const componentName = computed(() => mainStore.componentName)
  const connect = async (path) => {
    return new Promise((resolve, reject) => {
      (async () => {
        await flipper.value.connect()
          .then(() => {
            connectionStatus.value = 'Flipper connected'

            flags.value.portSelectRequired = false
            flags.value.connected = true
            flags.value.flipperOccupiedDialog = false

            log({
              level: 'info',
              message: `${componentName.value}: Flipper connected`
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
                message: `${componentName.value}: Failed to connect: ${error}`
              })
              connectionStatus.value = error.toString()

              reject([path, { message: `Cannot open ${path}` }])
            }
          })
      })()
    })
  }
  const selectPort = async (onShowDialog) => {
    const filters = [
      { usbVendorId: 0x0483, usbProductId: 0x5740 }
    ]
    await navigator.serial.requestPort({ filters })
    return start(true, undefined, onShowDialog)
  }

  const autoReconnect = computed(() => mainStore.autoReconnect)
  const toggleAutoReconnectCondition = computed(() => mainStore.toggleAutoReconnectCondition)
  const startRpc = computed(() => mainStore.startRpc)
  const readInfo = computed(() => mainStore.readInfo)
  const setTime = computed(() => mainStore.setTime)
  const start = async (manual) => {
    toggleAutoReconnectCondition.value()

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

    if (ports && ports.length > 0) {
      await connect()
      await startRpc.value()
      await readInfo.value()
      await setTime.value()
    } else {
      if (flags.value.autoReconnect) {
        autoReconnect.value()
      }

      flags.value.portSelectRequired = true

      if (manual) {
        return selectPort()
      }
    }
  }

  return { findKnownDevices, connect, selectPort, start }
})
