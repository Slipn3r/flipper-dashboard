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
      <img
        v-if="mainFlags.updateInProgress"
        src="~/assets/flipper-screen-updating.png"
        style="image-rendering: pixelated;position: absolute;top: 25px;left: 96px;"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  flipperName: {
    type: String,
    required: true
  },
  flipperColor: {
    type: String,
    default: '2'
  }
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
.flipper {
  width: 370px;
  height: 165px;
  padding: 26px 0 0 97px;
  background-size: 370px;
  background-repeat: no-repeat;
  background-position: center;

  &.body-black {
    background-image: url(assets/flipper_black.svg);
  }
  &.body-transparent {
    background-image: url(assets/flipper_transparent.svg);
  }
  &.body-white {
    background-image: url(assets/flipper_white.svg);
  }
}
</style>
