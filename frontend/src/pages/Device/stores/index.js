import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Platform } from 'quasar'

import { bytesToSize } from 'util/util'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

import { useDeviceWebStore } from './store-web'
import { useDeviceElectronStore } from './store-electron'

export const useDeviceMainStore = defineStore('DeviceMain', () => {
  const platformStore = Platform.is.electron ? useDeviceElectronStore() : useDeviceWebStore()

  const flipper = computed(() => mainStore.flipper)
  const info = computed(() => mainStore.info)

  const componentName = 'Device'
  const flags = ref({
    restarting: false,
    rpcActive: false,
    rpcToggling: false,
    screenStream: false,
    leftHanded: false
  })
  const screenScale = ref(1)
  const screenStreamCanvas = ref(null)

  const setScreenStreamCanvas = (ref) => {
    screenStreamCanvas.value = ref
  }

  const radioStackType = computed(() => {
    switch (parseInt(info.value.radio.stack.type)) {
      case 0x01:
        return 'full'
      case 0x02:
        return 'BLE_HCI'
      case 0x03:
        return 'light'
      case 0x04:
        return 'BLE_BEACON'
      case 0x05:
        return 'BLE_BASIC'
      case 0x06:
        return 'BLE_FULL_EXT_ADV'
      case 0x07:
        return 'BLE_HCI_EXT_ADV'
      case 0x10:
        return 'THREAD_FTD'
      case 0x11:
        return 'THREAD_MTD'
      case 0x30:
        return 'ZIGBEE_FFD'
      case 0x31:
        return 'ZIGBEE_RFD'
      case 0x40:
        return 'MAC'
      case 0x50:
        return 'BLE_THREAD_FTD_STATIC'
      case 0x51:
        return 'BLE_THREAD_FTD_DYAMIC'
      case 0x60:
        return '802154_LLD_TESTS'
      case 0x61:
        return '802154_PHY_VALID'
      case 0x62:
        return 'BLE_PHY_VALID'
      case 0x63:
        return 'BLE_LLD_TESTS'
      case 0x64:
        return 'BLE_RLV'
      case 0x65:
        return '802154_RLV'
      case 0x70:
        return 'BLE_ZIGBEE_FFD_STATIC'
      case 0x71:
        return 'BLE_ZIGBEE_RFD_STATIC'
      case 0x78:
        return 'BLE_ZIGBEE_FFD_DYNAMIC'
      case 0x79:
        return 'BLE_ZIGBEE_RFD_DYNAMIC'
      case 0x80:
        return 'RLV'
      case 0x90:
        return 'BLE_MAC_STATIC'
      default:
        return info.value.radio.stack.type
    }
  })
  const sdCardUsage = computed(() => {
    const sdCard = info.value.storage.sdcard
    if (!sdCard.status.isInstalled) {
      return sdCard.status.label
    }
    return `${bytesToSize(sdCard.totalSpace - sdCard.freeSpace)} / ${bytesToSize(sdCard.totalSpace)}`
  })
  const flipperBodyClass = computed(() => {
    switch (info.value.hardware.color) {
      case '1':
        return 'body-black'
      case '3':
        return 'body-transparent'
      default:
        return 'body-white'
    }
  })

  const startScreenStream = async (attempts = 0) => {
    await flipper.value.RPC('guiStartScreenStream')
      .catch(error => {
        rpcErrorHandler(componentName, error, 'guiStartScreenStream')
        if (attempts < 3) {
          return startScreenStream(attempts + 1)
        } else {
          location.reload()
        }
      })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: guiStartScreenStream: OK`
        })
      })
    flags.value.screenStream = true

    const ctx = screenStreamCanvas.value.getContext('2d')
    ctx.lineWidth = 1
    ctx.lineCap = 'square'
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#ff8201'
    ctx.fillRect(0, 0, 128 * screenScale.value, 64 * screenScale.value)
    ctx.fillStyle = 'black'

    const unbind = flipper.value.emitter.on('screenStream/frame', (data, orientation) => {
      if (!data) {
        return
      }

      if (orientation && !flags.value.leftHanded) {
        flags.value.leftHanded = true
      } else if (!orientation && flags.value.leftHanded) {
        flags.value.leftHanded = false
      }

      for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 64; y++) {
          const i = Math.floor(y / 8) * 128 + x
          const z = y & 7
          if (data.at(i) & (1 << z)) {
            ctx.fillStyle = 'black'
            ctx.fillRect(x * screenScale.value, y * screenScale.value, 1 * screenScale.value, 1 * screenScale.value)
          } else {
            ctx.fillStyle = '#ff8201'
            ctx.fillRect(x * screenScale.value, y * screenScale.value, 1 * screenScale.value, 1 * screenScale.value)
          }
        }
      }

      const unbindStop = flipper.value.emitter.on('screenStream/stop', () => {
        flags.value.screenStream = false
        unbind()
        unbindStop()
      })
    })
  }

  const start = platformStore.start

  return { flags, radioStackType, sdCardUsage, flipperBodyClass, screenScale, startScreenStream, setScreenStreamCanvas, start }
})
