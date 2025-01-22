<template>
  <template v-if="!flipperStore.loadingInfo">
    <template v-if="flipperStore.info">
      <div class="column items-center">
        <div class="flex items-start q-gutter-x-xl q-mb-md">
          <FlipperInfo class="q-mt-sm" v-bind="info" />
          <FlipperBody
            ref="refFlipperBody"
            v-bind="flipperBody"
            :showScreenUpdating="flipperStore.flags.updateInProgress"
            :isScreenStream="isScreenStream"
            :orientation="orientation"
            @expandView="expandView"
          />
        </div>

        <FlipperUpdate @updateInProgress="stopScreenStream" />
      </div>

      <FlipperExpandView
        v-model="expand"
        ref="refFlipperExpandView"
        :isScreenStream="isScreenStream"
        :orientation="orientation"
      />
    </template>
  </template>
  <template v-else>
    <div class="row justify-center q-my-md">
      <Loading label="Loading info..." />
    </div>
  </template>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  /* onBeforeMount, */ onMounted,
  onBeforeUnmount,
  watch
} from 'vue'

import { logger } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { Loading } from 'shared/components/Loading'
import { FlipperUpdate, FlipperExpandView } from 'features/Flipper'
import { FlipperBody, FlipperInfo, FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { bytesToSize } from 'shared/lib/utils/bytesToSize'

// import { FlipperElectron } from 'src/shared/lib/flipperJs'

// onBeforeMount(() => {
//   if (flipperStore.isElectron) {
//     if (flipperStore.info) {
//       if (flipperStore.flipper) {
//         flipperStore.flipper.info = null
//       }
//     }
//   }
// })

const componentName = 'DeviceInfo'

const sdCardUsage = computed(() => {
  if (
    flipperStore.info?.storage.sdcard?.totalSpace &&
    flipperStore.info?.storage.sdcard?.freeSpace
  ) {
    return `${bytesToSize(
      flipperStore.info?.storage.sdcard?.totalSpace -
        flipperStore.info?.storage.sdcard?.freeSpace
    )} / ${bytesToSize(flipperStore.info?.storage.sdcard?.totalSpace)}`
  }

  return 'No SD card'
})

const hardwareVersion = computed(() => {
  return (
    flipperStore.info?.hardware.ver +
    '.F' +
    flipperStore.info?.hardware.target +
    'B' +
    flipperStore.info?.hardware.body +
    'C' +
    flipperStore.info?.hardware.connect
  )
})

const radioVersion = computed(() => {
  return flipperStore.info?.radio.alive !== 'false'
    ? flipperStore.info?.radio.stack.major +
        '.' +
        flipperStore.info?.radio.stack.minor +
        '.' +
        flipperStore.info?.radio.stack.sub
    : 'corrupt'
})

const info = ref({
  firmwareVersion: computed(() => {
    if (flipperStore.info?.firmware.branch.name === 'dev') {
      return `Dev ${flipperStore.info?.firmware.commit.hash}`
    }
    return flipperStore.info?.firmware.version
  }),
  buildDate: computed(() => flipperStore.info?.firmware.build.date),
  sdCardUsage: computed(() => sdCardUsage.value),
  databaseStatus: computed(() => flipperStore.info?.storage.databases?.status),
  hardwareVersion: computed(() => hardwareVersion.value),
  radioVersion: computed(() => radioVersion.value),
  radioStackType: computed(() => flipperStore.info?.radio.stack.type)
})

const flipperBody = ref({
  flipperName: computed(() => flipperStore.info?.hardware.name),
  flipperColor: computed(() => flipperStore.info?.hardware.color)
})

const refFlipperBody = ref<typeof FlipperBody>()
const screenStreamCanvas = computed<HTMLCanvasElement>(
  () => refFlipperBody.value?.screenStreamCanvas
)

const refFlipperExpandView = ref<typeof FlipperExpandView>()
const screenStreamExpandCanvas = computed<HTMLCanvasElement>(
  () => refFlipperExpandView.value?.screenStreamExpandCanvas
)

const expand = ref(false)
const expandView = async () => {
  expand.value = true
}

const unbindFrame = ref()
const isScreenStream = ref(false)
const orientation = ref(0)

const renderToCanvas = ({
  targetCanvas,
  sourceCanvas,
  scale
}: {
  targetCanvas: HTMLCanvasElement
  sourceCanvas: HTMLCanvasElement
  scale: number
}) => {
  const targetCtx = targetCanvas.getContext('2d')!
  targetCtx.imageSmoothingEnabled = false
  targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height)

  targetCtx.drawImage(
    sourceCanvas,
    0,
    0,
    targetCanvas.width,
    targetCanvas.height,
    0,
    0,
    targetCanvas.width * scale,
    targetCanvas.height * scale
  )
}

const startScreenStream = async (attempts = 0) => {
  await flipperStore.flipper
    ?.RPC('guiStartScreenStream')
    .catch((error: Error) => {
      rpcErrorHandler({ componentName, error, command: 'guiStartScreenStream' })
      if (attempts < 3) {
        return startScreenStream(attempts + 1)
      } /* else {
        location.reload()
      } */
    })
    .then(() => {
      logger.debug({
        context: componentName,
        message: 'guiStartScreenStream: OK'
      })

      console.log('Started screen streaming')
    })
  isScreenStream.value = true

  unbindFrame.value = flipperStore.flipper?.emitter.on(
    'screenStream/frame',
    (frameCanvas: HTMLCanvasElement, frameOrientation: string) => {
      orientation.value = Number(frameOrientation)

      if (screenStreamCanvas.value) {
        renderToCanvas({
          targetCanvas: screenStreamCanvas.value,
          sourceCanvas: frameCanvas,
          scale: 1
        })
      }

      if (screenStreamExpandCanvas.value) {
        renderToCanvas({
          targetCanvas: screenStreamExpandCanvas.value,
          sourceCanvas: frameCanvas,
          scale: 4
        })
      }
    }
  )
}

const stopScreenStream = async () => {
  await flipperStore.flipper
    ?.RPC('guiStopScreenStream')
    .catch((error: Error) => {
      rpcErrorHandler({ componentName, error, command: 'guiStopScreenStream' })
      throw new Error(`Stop screen stream RPC error: ${error.message || error}`)
    })
    .then((/* value */) => {
      logger.debug({
        context: componentName,
        message: 'guiStartScreenStream: OK'
      })
      if (unbindFrame.value) {
        unbindFrame.value()
      }
      isScreenStream.value = false

      console.log('Stopped screen streaming')
    })
}

onMounted(async () => {
  // if (flipperStore.oldFlipper) {
  //   if (flipperStore.oldFlipper instanceof FlipperElectron) {
  //     flipperStore.oldFlipper.stopScreenStream()
  //   }
  // }

  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      await flipperStore.flipper?.startRPCSession()
    }

    if (!flipperStore.info) {
      await flipperStore.flipper?.getInfo()
    }

    if (flipperStore.rpcActive) {
      if (!isScreenStream.value) {
        await startScreenStream()
      }
    }
  }
})

watch(
  () => flipperStore.flipperReady,
  async (newValue) => {
    if (newValue) {
      if (!isScreenStream.value) {
        await startScreenStream()
      }
    }
  }
)

onBeforeUnmount(async () => {
  if (!flipperStore.flags.switchFlipper) {
    await stopScreenStream().catch((error) => {
      console.error(error)
    })
  }
})
</script>
