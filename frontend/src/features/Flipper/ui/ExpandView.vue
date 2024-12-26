<template>
  <q-dialog class="expandView" maximized @show="showDialog" @hide="hideDialog">
    <q-card class="fit column expandView__wrapper">
      <span class="scanLine absolute fit" />
      <canvas
        id="gridBackground"
        class="absolute-center"
        style="opacity: 0.15"
      />
      <q-card-section class="row col items-center justify-center">
        <div class="row justify-center items-center">
          <div
            class="relative-position bg-primary q-pa-sm rounded-borders q-mr-lg"
            style="border: 3px solid #9e5823"
          >
            <canvas
              v-show="isScreenStream"
              :width="128 * screenScale"
              :height="64 * screenScale"
              style="image-rendering: pixelated"
              :style="`rotate: ${
                90 * rotationCalculation
              }deg; scale: ${scaleCalculation};`"
              ref="screenStreamExpandCanvas"
            />
          </div>
          <div class="controls column items-end">
            <div class="controls__dpad dpad q-mb-md">
              <FlipperKeypadButton
                class="dpad__top"
                icon="flipper:control-triangle"
                iconHover="flipper:control-triangle-hover"
                iconActive="flipper:control-triangle-down"
                size="32px"
                @onLongPress="
                  onInputEvent({
                    key: 'UP',
                    type: 'LONG'
                  })
                "
                @onShortPress="
                  onInputEvent({
                    key: 'UP',
                    type: 'SHORT'
                  })
                "
                :keys="['ArrowUp', 'KeyW']"
              />
              <FlipperKeypadButton
                class="dpad__right"
                icon="flipper:control-triangle"
                iconHover="flipper:control-triangle-hover"
                iconActive="flipper:control-triangle-down"
                size="32px"
                @onLongPress="
                  onInputEvent({
                    key: 'RIGHT',
                    type: 'LONG'
                  })
                "
                @onShortPress="
                  onInputEvent({
                    key: 'RIGHT',
                    type: 'SHORT'
                  })
                "
                :keys="['ArrowRight', 'KeyD']"
              />
              <FlipperKeypadButton
                class="dpad__bottom"
                icon="flipper:control-triangle"
                iconHover="flipper:control-triangle-hover"
                iconActive="flipper:control-triangle-down"
                size="32px"
                @onLongPress="
                  onInputEvent({
                    key: 'DOWN',
                    type: 'LONG'
                  })
                "
                @onShortPress="
                  onInputEvent({
                    key: 'DOWN',
                    type: 'SHORT'
                  })
                "
                :keys="['ArrowDown', 'KeyS']"
              />
              <FlipperKeypadButton
                class="dpad__left"
                icon="flipper:control-triangle"
                iconHover="flipper:control-triangle-hover"
                iconActive="flipper:control-triangle-down"
                size="32px"
                @onLongPress="
                  onInputEvent({
                    key: 'LEFT',
                    type: 'LONG'
                  })
                "
                @onShortPress="
                  onInputEvent({
                    key: 'LEFT',
                    type: 'SHORT'
                  })
                "
                :keys="['ArrowLeft', 'KeyA']"
              />
              <FlipperKeypadButton
                class="dpad__center"
                icon="flipper:control-circle"
                iconHover="flipper:control-circle-hover"
                iconActive="flipper:control-circle-down"
                size="52px"
                @onLongPress="
                  onInputEvent({
                    key: 'OK',
                    type: 'LONG'
                  })
                "
                @onShortPress="
                  onInputEvent({
                    key: 'OK',
                    type: 'SHORT'
                  })
                "
                :keys="['Space', 'Enter']"
              />
            </div>
            <FlipperKeypadButton
              icon="flipper:control-back"
              iconHover="flipper:control-back-hover"
              iconActive="flipper:control-back-down"
              size="52px"
              @onLongPress="
                onInputEvent({
                  key: 'BACK',
                  type: 'LONG'
                })
              "
              @onShortPress="
                onInputEvent({
                  key: 'BACK',
                  type: 'SHORT'
                })
              "
              :keys="['Backspace']"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="items-end" align="between">
        <q-btn
          outline
          label="Back"
          icon="flipper:chevron-left"
          color="primary"
          @click="hideDialog"
          v-close-popup
        />
        <q-btn
          outline
          label="Save screenshot"
          icon="flipper:save-symbolic"
          color="primary"
          @click="saveImage()"
        />
        <div class="column items-end">
          <q-btn flat padding="sm" icon="flipper:info-big" color="primary">
            <q-tooltip class="bg-black" style="border: 1px solid #662c00">
              <q-icon
                name="flipper:steaming-help-mac"
                style="width: 207px; height: 102px"
              />
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { exportFile } from 'quasar'
import { FlipperKeypadButton } from 'entities/Flipper'
import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'
import { showNotif } from 'shared/lib/utils/useShowNotif'

type Props = {
  isScreenStream?: boolean
  orientation?: number
  screenScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  isScreenStream: false,
  orientation: 0,
  screenScale: 4
})

const componentName = 'ExpandView'

const rotationCalculation = computed(() => {
  switch (props.orientation) {
    case 1:
      return 2

    case 2:
      return 1

    case 3:
      return 3

    default:
      return 0
  }
})

const scaleCalculation = computed(() => {
  switch (props.orientation) {
    case 2:
      return 0.5

    case 3:
      return 0.5

    default:
      return 1
  }
})

const onInputEvent = ({ key, type }: FlipperModel.InputEvent) => {
  // emit('inputEvent', {
  //   key,
  //   type
  // })
  flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key, type: 'PRESS' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )

  flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key, type })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )

  flipperStore.flipper
    ?.RPC('guiSendInputEvent', { key, type: 'RELEASE' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'guiSendInputEvent' })
    )
}

const hideDialog = () => {
  window.removeEventListener('resize', resizeCanvas)
  document.removeEventListener('keydown', copyToClipboard)
}

const screenStreamExpandCanvas = ref<HTMLCanvasElement>()
defineExpose({
  screenStreamExpandCanvas
})

const saveImage = (isClipboard = false) => {
  if (screenStreamExpandCanvas.value) {
    screenStreamExpandCanvas.value.toBlob(
      async (blob) => {
        if (blob) {
          if (isClipboard) {
            const clipboardItem = new ClipboardItem({ 'image/png': blob })
            await navigator.clipboard.write([clipboardItem])

            showNotif({
              message: 'Flipper screen copied to clipboard',
              color: 'info',
              timeout: 500
            })
          } else {
            exportFile(`Screenshot-${new Date().toISOString()}.png`, blob)
          }
        }
      },
      'image/png',
      1
    )
  }
}

const resizeCanvas = () => {
  const gridBackground: HTMLCanvasElement = document.getElementById(
    'gridBackground'
  ) as HTMLCanvasElement

  if (gridBackground) {
    const width = (gridBackground.width = window.innerWidth)
    const height = (gridBackground.height = window.innerHeight)

    const numCells = 40
    const cellSize = width / numCells

    const ctx = gridBackground.getContext('2d')

    if (ctx) {
      ctx.strokeStyle = '#aa5115'
      ctx.lineWidth = 2

      for (let yPos = cellSize; yPos < height; yPos += cellSize) {
        const pos = Math.floor(yPos)
        ctx.moveTo(0, pos)
        ctx.lineTo(width, pos)
      }

      for (let xPos = cellSize; xPos < width; xPos += cellSize) {
        const pos = Math.floor(xPos)
        ctx.moveTo(pos, 0)
        ctx.lineTo(pos, height)
      }

      ctx.stroke()
    }
  }
}

const copyToClipboard = (event: KeyboardEvent) => {
  if (event.metaKey && event.code === 'KeyC') {
    saveImage(true)
  }
}

const showDialog = async () => {
  await nextTick()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('keydown', copyToClipboard)
}
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
