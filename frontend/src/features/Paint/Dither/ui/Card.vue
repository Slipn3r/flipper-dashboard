<template>
  <q-card style="width: 616px; min-width: 300px">
    <q-card-section>
      <div class="text-h6">Uploaded image</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <canvas
        ref="sourceCanvasRef"
        width="128"
        height="64"
        class="q-ml-sm"
      ></canvas>
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="ditherProcesses.length">
      <div class="text-h6">Select dithering method:</div>
    </q-card-section>

    <q-card-section class="q-py-none row justify-start">
      <div
        v-for="p in ditherProcesses"
        :key="p.id"
        class="column flex-center q-ma-sm"
      >
        <div v-if="!p.imageData" class="canvas-placeholder flex flex-center">
          <q-spinner color="primary" size="3em" />
        </div>
        <canvas
          v-else
          :class="p.id"
          width="128"
          height="64"
          @click="select(p.imageData)"
        ></canvas>
        <q-tooltip :offset="[0, 3]" class="bg-primary">{{ p.title }}</q-tooltip>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancel" @click="cancel" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dither, emitter } from 'shared/lib/utils/ditherpunk/monochrome'

const props = defineProps({
  img: Object
})

const emit = defineEmits(['cancel', 'select'])

const sourceImageData = ref(null)
const ditherProcesses = ref([])
const sourceCanvasRef = ref(null)
const unbindDitherStart = ref(null)
const unbindDitherResult = ref(null)

const drawSourceImg = () => {
  const sourceCtx = sourceCanvasRef.value.getContext('2d')
  sourceCtx.fillStyle = 'white'
  sourceCtx.fillRect(0, 0, 128, 64)
  sourceCtx.drawImage(props.img, 0, 0, 128, 64)
  sourceImageData.value = sourceCtx.getImageData(0, 0, 128, 64)

  startDither()
}
const startDither = () => {
  unbindDitherStart.value = emitter.on('dither/start', onDitherStart)
  unbindDitherResult.value = emitter.on('dither/result', onDitherResult)
  dither(sourceImageData.value)
}
const onDitherStart = ({ id, title }) => {
  if (ditherProcesses.value.find((e) => e.id === id)) {
    return
  }
  ditherProcesses.value.push({ id, title })
}
const onDitherResult = ({ id, imageData }) => {
  const p = ditherProcesses.value.find((e) => e.id === id)
  if (!p) {
    return
  }
  p.imageData = imageData
  setTimeout(() => {
    const ditherCanvas = document.querySelector(`canvas.${p.id}`)
    if (ditherCanvas) {
      ditherCanvas.getContext('2d').putImageData(imageData, 0, 0)
    }
  }, 150)
}
const cancel = () => {
  ditherProcesses.value = []
  emit('cancel')
}
const select = (imageData) => {
  emit('select', imageData)
}

onMounted(() => {
  drawSourceImg()
})
</script>

<style lang="sass" scoped>
canvas
  border: 1px solid
  image-rendering: pixelated
  cursor: pointer
  &:hover
    box-shadow: 0 0 0 1px $primary
    border-color: $primary

.canvas-placeholder
  width: 128px
  height: 64px
  border: 1px solid
</style>
