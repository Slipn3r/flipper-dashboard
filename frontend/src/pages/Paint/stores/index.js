import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Platform } from 'quasar'

import { imageDataToXBM } from 'util/pixeleditor/xbm'
import showNotif from 'composables/useShowNotif'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

import { usePaintWebStore } from './store-web'
import { usePaintElectronStore } from './store-electron'

export const usePaintMainStore = defineStore('PaintMain', () => {
  const platformStore = Platform.is.electron ? usePaintElectronStore(usePaintMainStore()) : usePaintWebStore(usePaintMainStore())

  const flipper = computed(() => mainStore.flipper)

  const componentName = 'Paint'
  // const flags = ref({
  //   restarting: false,
  //   pixelGrid: false
  // })
  const autoStreaming = ref({
    enabled: true,
    interval: null,
    delay: 500
  })
  // let backlightInterval = null
  const editor = ref(null)

  const setEditorRef = (ref) => {
    editor.value = ref
  }

  const startVirtualDisplay = async () => {
    await flipper.value.RPC('guiStartVirtualDisplay')
      .then(async () => {
        // await enableBacklight()
        // backlightInterval = setInterval(enableBacklight, 1000)
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'guiStartVirtualDisplay')
        showNotif({
          message: 'Couldn\'t start virtual display session',
          color: 'negative'
        })
      })

    if (autoStreaming.value.enabled) {
      autoStream()
    }
  }
  const stopVirtualDisplay = async () => {
    await flipper.value.RPC('guiStopVirtualDisplay')
      .catch(error => rpcErrorHandler(componentName, error, 'guiStopVirtualDisplay'))
  }
  const enableBacklight = async () => {
    await flipper.value.RPC('guiSendInputEvent', { key: 'OK', type: 'PRESS' })
      .catch(error => rpcErrorHandler(componentName, error, 'guiSendInputEvent'))
    await flipper.value.RPC('guiSendInputEvent', { key: 'OK', type: 'SHORT' })
      .catch(error => rpcErrorHandler(componentName, error, 'guiSendInputEvent'))
    await flipper.value.RPC('guiSendInputEvent', { key: 'OK', type: 'RELEASE' })
      .catch(error => rpcErrorHandler(componentName, error, 'guiSendInputEvent'))
  }
  const sendFrame = async () => {
    const imageData = editor.value.pe.toImageData()
    const xbmBytes = imageDataToXBM(imageData)
    await flipper.value.RPC('guiScreenFrame', { data: new Uint8Array(xbmBytes) })
  }
  const autoStream = () => {
    if (autoStreaming.value.enabled) {
      if (autoStreaming.value.interval) {
        clearInterval(autoStreaming.value.interval)
      }
      autoStreaming.value.interval = setInterval(sendFrame, autoStreaming.value.delay)
    } else {
      clearInterval(autoStreaming.value.interval)
    }
  }

  const start = platformStore.start

  return { autoStreaming, /* backlightInterval, */ editor, setEditorRef, startVirtualDisplay, stopVirtualDisplay, enableBacklight, autoStream, start }
})
