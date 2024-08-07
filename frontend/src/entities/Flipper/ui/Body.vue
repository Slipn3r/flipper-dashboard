<template>
  <div class="column items-center">
    <h5 class="q-mb-md q-mt-none text-bold">{{ props.flipperName }}</h5>
    <div class="flipper relative-position" :class="flipperBodyClass">
      <!-- <canvas
        v-show="flags.screenStream"
        :width="128 * screenScale"
        :height="64 * screenScale"
        style="image-rendering: pixelated;"
        :style="`rotate: ${flags.leftHanded ? 180 : 0}deg`"
        ref="screenStreamCanvas"
      ></canvas>
      -->
      <img
        v-if="showScreenUpdating"
        class="flipper__image"
        src="~/assets/flipper-screen-updating.png"
        style=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  flipperName: string
  flipperColor: string
  showScreenUpdating: boolean
}

const props = withDefaults(defineProps<Props>(), {
  flipperColor: '2',
  showScreenUpdating: false
})

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
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
