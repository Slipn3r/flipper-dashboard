<template>
  <canvas ref="mirror" class="mirror" width="128" height="64"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PaintModel } from 'entities/Paint'
const paintStore = PaintModel.usePaintStore()

const mirror = ref()
onMounted(() => {
  paintStore.setMirror(mirror.value)
})
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
