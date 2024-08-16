<template>
  <q-page class="column">
    <div class="col fit column items-center paint" @mouseup="mouseUp">
      <q-page-sticky position="top" :offset="[16, 16]">
        <PaintPixelControls />
      </q-page-sticky>

      <PaintPixelEditor class="col" />

      <q-page-sticky position="bottom-right" :offset="[8, 8]">
        <PaintMirror />
      </q-page-sticky>

      <q-dialog v-model="paintStore.flags.ditherDialog">
        <PaintDitherCard
          :img="paintStore.uploadedImage"
          @cancel="paintStore.flags.ditherDialog = false"
          @select="drawImage"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { imageDataToXBM } from 'shared/lib/utils/pixeleditor/xbm'

import {
  PaintPixelEditor,
  PaintPixelControls
} from 'features/Paint/PixelEditor'
import { PaintDitherCard } from 'features/Paint/Dither'
import { PaintMirror, PaintModel } from 'entities/Paint'
const paintStore = PaintModel.usePaintStore()
const pe = computed(() => paintStore.pe)

import { FlipperModel } from 'entities/Flipper'
import { FlipperWeb } from 'src/shared/lib/flipperJs'
const flipperStore = FlipperModel.useFlipperStore()

const componentName = 'Paint'

const mouseUp = () => {
  if (!pe.value) {
    return
  }
  if (pe.value.drawing) {
    if (pe.value.mode === 'line') {
      pe.value.save()
      pe.value.plotLine(pe.value.p0, pe.value.p1)
      pe.value.draw()
      pe.value.updated()
    } else if (pe.value.mode === 'rect') {
      pe.value.save()
      pe.value.plotRect(pe.value.p0, pe.value.p1)
      pe.value.draw()
      pe.value.updated()
    }
    pe.value.drawing = false
  }
}

const drawImage = (imageData: ImageData) => {
  paintStore.flags.ditherDialog = false
  const pixelData = []
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2] ===
      0
    ) {
      pixelData.push(1)
    } else {
      pixelData.push(0)
    }
  }
  pe.value?.setData(pixelData)
}

const autoStreaming = ref<{
  enabled: boolean
  interval: NodeJS.Timeout | undefined
  delay: number
}>({
  enabled: true,
  interval: undefined,
  delay: 500
})
let backlightInterval = ref<NodeJS.Timeout>()
const startVirtualDisplay = async () => {
  await flipperStore.flipper
    ?.RPC('guiStartVirtualDisplay')
    .then(() => {
      console.log('guiStartVirtualDisplay enable')
    })
    .catch((error: Error) => {
      rpcErrorHandler({
        componentName,
        error,
        command: 'guiStartVirtualDisplay'
      })
      showNotif({
        message: "Couldn't start virtual display session",
        color: 'negative'
      })
      throw error
    })

  await enableBacklight()
  backlightInterval.value = setInterval(enableBacklight, 1000)

  if (autoStreaming.value.enabled) {
    autoStream()
  }
}
const stopVirtualDisplay = async () => {
  if (autoStreaming.value.interval) {
    clearInterval(autoStreaming.value.interval)
  }
  if (backlightInterval.value) {
    clearInterval(backlightInterval.value)
  }

  // if (flipperStore.isElectron) {
  //   for (let index = 0; index < flipperStore.availableFlippers.length; index++) {
  //     const flipper = flipperStore.availableFlippers[index];

  //     if (flipper.name !== flipperStore.flipper?.name) {
  //       await flipper
  //         ?.RPC('guiStopVirtualDisplay')
  //         .then(() => {
  //           console.log('guiStartVirtualDisplay disabled')
  //         })
  //         .catch(/* (error: Error) => rpcErrorHandler({ componentName, error, command: 'guiStopVirtualDisplay' }) */)
  //     }
  //   }
  // } else {
  await flipperStore.flipper
    ?.RPC('guiStopVirtualDisplay')
    .then(() => {
      console.log('guiStartVirtualDisplay disabled')
    })
    .catch((error: Error) =>
      rpcErrorHandler({
        componentName,
        error,
        command: 'guiStopVirtualDisplay'
      })
    )
  // }
}
const enableBacklight = async () => {
  await flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key: 'OK', type: 'PRESS' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )
  await flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key: 'OK', type: 'SHORT' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )
  await flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key: 'OK', type: 'RELEASE' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )
}
const sendFrame = async () => {
  if (pe.value) {
    const imageData = pe.value.toImageData()
    const xbmBytes = imageDataToXBM(imageData)
    await flipperStore.flipper?.RPC('guiScreenFrame', {
      data: new Uint8Array(xbmBytes)
    })
  }
}
const autoStream = () => {
  if (autoStreaming.value.enabled) {
    clearInterval(autoStreaming.value.interval)
    autoStreaming.value.interval = setInterval(
      sendFrame,
      autoStreaming.value.delay
    )
  } else {
    clearInterval(autoStreaming.value.interval)
  }
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      if (!flipperStore.isElectron) {
        if (flipperStore.flipper instanceof FlipperWeb) {
          await flipperStore.flipper?.startRPCSession()
        }
      } else {
        flipperStore.flipper?.setReadingMode('rpc')
      }
    }

    await startVirtualDisplay()
  }
})

watch(
  () => flipperStore.flipper?.flipperReady,
  async (newValue) => {
    if (newValue) {
      await startVirtualDisplay()
    } else {
      if (!flipperStore.isElectron) {
        await stopVirtualDisplay()
      }
    }
  }
)

watch(
  () => flipperStore.flags.switchFlipper,
  async (newValue, oldValue) => {
    if (newValue !== oldValue && newValue === true && oldValue === false) {
      await stopVirtualDisplay()
    }
  }
)

onBeforeUnmount(() => {
  stopVirtualDisplay()
})
</script>

<style src="shared/lib/utils/pixeleditor/pixeleditor.css"></style>
<style lang="scss" scoped>
.paint {
  // background: #00000014;
  background: $grey-3;
}

:deep(.paint .pE) {
  border: none;
}
:deep(.paint .pE .pE__drawing) {
  cursor: none;
}
</style>
