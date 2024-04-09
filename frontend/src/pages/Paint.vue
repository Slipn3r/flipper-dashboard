<template>
  <q-page class="column items-center full-width">
    <div
      v-if="!mainFlags.connected || !flags.rpcActive || flags.rpcToggling"
      class="column flex-center q-my-xl"
    >
      <q-spinner
        color="primary"
        size="3em"
        class="q-mb-md"
      ></q-spinner>
      <p>Waiting for Flipper...</p>
    </div>
    <PixelEditor v-else ref="editor"/>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PixelEditor from 'src/components/PixelEditor.vue'
import { imageDataToXBM } from '../util/pixeleditor/xbm'
import showNotif from 'composables/useShowNotif'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'src/stores/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)
const flipper = computed(() => mainStore.flipper)
const info = computed(() => mainStore.info)

const componentName = 'Paint'
const flags = ref({
  restarting: false,
  rpcActive: false,
  rpcToggling: false,
  pixelGrid: false
})
const autoStreaming = ref({
  enabled: true,
  interval: null,
  delay: 500
})
let backlightInterval = null
const editor = ref(null)

const startVirtualDisplay = async () => {
  await flipper.value.RPC('guiStartVirtualDisplay')
    .catch(error => {
      rpcErrorHandler(componentName, error, 'guiStartVirtualDisplay')
      showNotif({
        message: 'Couldn\'t start virtual display session',
        color: 'negative'
      })
    })

  await enableBacklight()
  backlightInterval = setInterval(enableBacklight, 1000)

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

const start = async () => {
  flags.value.rpcActive = mainFlags.value.rpcActive
  if (!mainFlags.value.rpcActive) {
    await mainStore.startRpc()
  }
}

onMounted(async () => {
  if (mainFlags.value.connected && info.value !== null && info.value.doneReading) {
    await start()
  }

  startVirtualDisplay()
})

const onDisconnect = (unbind) => {
  if (autoStreaming.value.interval) {
    clearInterval(autoStreaming.value.interval)
  }
  clearInterval(backlightInterval)
  if (unbind) {
    unbind()
  }
}
if (window.serial) {
  const unbind = flipper.value.emitter.on('disconnect', () => onDisconnect(unbind))
} else {
  navigator.serial.addEventListener('disconnect', () => onDisconnect())
}

onBeforeUnmount(() => {
  if (autoStreaming.value.interval) {
    clearInterval(autoStreaming.value.interval)
  }
  clearInterval(backlightInterval)
  stopVirtualDisplay()
})
</script>
