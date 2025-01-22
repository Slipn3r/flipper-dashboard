<template>
  <div class="col drawing-board fit flex flex-center">
    <div class="pe-container">
      <div
        v-if="paintStore.flags.checkerboard"
        class="checkerboard"
        :style="`background-size: ${paintStore.zoomLevel * 2}px ${paintStore.zoomLevel * 2}px`"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { PaintModel } from 'entity/Paint'
const paintStore = PaintModel.usePaintStore()

onMounted(() => {
  paintStore.createEditor()
})
</script>

<style lang="scss" scoped>
.drawing-board {
  padding: 78px 8px 80px 8px;
}

.pe-container {
  position: relative;

  .checkerboard {
    width: calc(100% - 1px);
    height: calc(100% - 1px);
    position: absolute;
    top: 1px;
    left: 1px;
    background-position: 0px 0px;
    background-image: repeating-conic-gradient(
      #fff0 0deg 90deg,
      #00000012 0 180deg
    );
    pointer-events: none;
    z-index: 1;
  }
}

:deep(.pixeleditor) {
  width: fit-content;
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
}
</style>
