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
            :isLeftHanded="isLeftHanded"
            :screenScale="screenScale"
          />
        </div>

        <FlipperUpdate @updateInProgress="stopScreenStream" />
      </div>
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

import { log } from 'shared/lib/utils/useLog'

import { Loading } from 'shared/components/Loading'
import { FlipperUpdate } from 'features/Flipper'
import { FlipperBody, FlipperInfo, FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { bytesToSize } from 'shared/lib/utils/bytesToSize'
import { FlipperWeb } from 'src/shared/lib/flipperJs'
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

  return 'NaN / NaN'
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
  firmwareVersion: computed(() => flipperStore.info?.firmware.version),
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
const screenStreamCanvas = computed(
  () => refFlipperBody.value?.screenStreamCanvas
)
const screenScale = ref(1)
const unbindFrame = ref()
const isScreenStream = ref(false)
const isLeftHanded = ref(false)
const startScreenStream = async (attempts = 0) => {
  await flipperStore.flipper
    ?.RPC('guiStartScreenStream')
    .catch((/* error */) => {
      // rpcErrorHandler(componentName, error, 'guiStartScreenStream')
      if (attempts < 3) {
        return startScreenStream(attempts + 1)
      } /* else {
        location.reload()
      } */
    })
    .then(() => {
      log({
        level: 'debug',
        message: `${componentName}: guiStartScreenStream: OK`
      })

      console.log('Started screen streaming')
    })
  isScreenStream.value = true

  const ctx = screenStreamCanvas.value.getContext('2d')
  ctx.lineWidth = 1
  ctx.lineCap = 'square'
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = '#ff8201'
  ctx.fillRect(0, 0, 128 * screenScale.value, 64 * screenScale.value)
  ctx.fillStyle = 'black'

  unbindFrame.value = flipperStore.flipper?.emitter.on(
    'screenStream/frame',
    (data: Uint8Array, orientation: string) => {
      if (!data) {
        return
      } else {
        if (orientation && !isLeftHanded.value) {
          isLeftHanded.value = true
        } else if (!orientation && isLeftHanded.value) {
          isLeftHanded.value = false
        }

        for (let x = 0; x < 128; x++) {
          for (let y = 0; y < 64; y++) {
            const i = Math.floor(y / 8) * 128 + x
            const z = y & 7

            const dataAt = data.at(i)
            if (dataAt && dataAt & (1 << z)) {
              ctx.fillStyle = 'black'
              ctx.fillRect(
                x * screenScale.value,
                y * screenScale.value,
                1 * screenScale.value,
                1 * screenScale.value
              )
            } else {
              ctx.fillStyle = '#ff8201'
              ctx.fillRect(
                x * screenScale.value,
                y * screenScale.value,
                1 * screenScale.value,
                1 * screenScale.value
              )
            }
          }
        }
      }
    }
  )
}

const stopScreenStream = async () => {
  await flipperStore.flipper
    ?.RPC('guiStopScreenStream')
    .catch((error: Error) => {
      // rpcErrorHandler('Device', error, 'guiStopScreenStream')
      throw new Error(`Stop screen stream RPC error: ${error.message || error}`)
    })
    .then((/* value */) => {
      log({
        level: 'debug',
        message: `${componentName}: guiStartScreenStream: OK`
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
      if (!flipperStore.isElectron) {
        if (flipperStore.flipper instanceof FlipperWeb) {
          await flipperStore.flipper?.startRPCSession()
        }
      } else {
        flipperStore.flipper?.setReadingMode('rpc')
      }
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
