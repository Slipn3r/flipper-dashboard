<template>
  <div class="column items-center">
    <h5 class="q-mb-md q-mt-none text-bold">{{ props.flipperName }}</h5>
    <div class="flipper relative-position" :class="flipperBodyClass">
      <img
        v-if="showScreenUpdating"
        class="flipper__image"
        src="~/assets/flipper-screen-updating.png"
        style=""
      />
      <div
        v-else
        class="flipper__display-wrapper relative-position"
        :style="`width: ${128 * screenScale}px; height: ${
          64 * screenScale
        }px; rotate: ${90 * rotationCalculation}deg;`"
      >
        <div
          class="flipper__expand-wrapper absolute-center cursor-pointer"
          @click="expandView"
        >
          <div class="dimmed" />
          <q-icon
            class="absolute-center"
            name="mdi-arrow-expand"
            size="64px"
            color="primary"
          />
        </div>
        <canvas
          v-show="isScreenStream"
          :width="128 * screenScale"
          :height="64 * screenScale"
          style="image-rendering: pixelated"
          ref="screenStreamCanvas"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Props = {
  flipperName?: string
  flipperColor?: string
  showScreenUpdating: boolean
  isScreenStream?: boolean
  screenScale?: number
  orientation?: number
}

const props = withDefaults(defineProps<Props>(), {
  flipperColor: '2',
  showScreenUpdating: false,
  isScreenStream: false,
  screenScale: 1,
  orientation: 0
})

const emit = defineEmits(['expandView'])

const flipperBodyClass = computed(() => {
  switch (props.flipperColor) {
    case '1':
      return 'body-black'
    case '3':
      return 'body-transparent'
    default:
      return 'body-white'
  }
})

const rotationCalculation = computed(() => {
  switch (props.orientation) {
    case 1:
      return 2

    default:
      return 0
  }
})
const expandView = () => {
  emit('expandView')
}

const screenStreamCanvas = ref<HTMLCanvasElement>()
defineExpose({
  screenStreamCanvas
})
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
