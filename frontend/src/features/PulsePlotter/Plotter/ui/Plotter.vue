<template>
  <div id="flipperPlotter" class="full-width q-mb-md" />
  <div class="full-width">
    <div class="row q-col-gutter-md q-mb-md">
      <q-select
        class="col-1"
        v-model="currentSlicer.modulation"
        :options="slicerOptions"
        option-value="value"
        option-label="text"
        emit-value
        label="Slicer"
      />
      <q-input
        class="col-1"
        v-model.number.trim="currentSlicer.short"
        @keypress="useNumbersOnly"
        type="text"
        label="Short"
      />
      <q-input
        class="col-1"
        v-model.number.trim="currentSlicer.long"
        @keypress="useNumbersOnly"
        type="text"
        label="Long"
      />
      <q-input
        class="col-1"
        v-model.number.trim="currentSlicer.sync"
        @keypress="useNumbersOnly"
        type="text"
        label="Sync"
      />
      <q-input
        class="col-1"
        v-model.number.trim="currentSlicer.gap"
        @keypress="useNumbersOnly"
        type="text"
        label="Gap"
      />
      <div class="col-2 flex">
        <q-btn
          color="primary"
          icon="content_cut"
          label="Slice"
          size="md"
          unelevated
          @click="onSlice"
        />
      </div>
    </div>
    <div class="column">
      <div ref="timings" class="q-mb-md" />
      <div ref="bits" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { PulsePlotterLib } from 'entities/PulsePlotter'
const { FlipperPlotter, FlipperPlotterOffscreen } = PulsePlotterLib
import { useNumbersOnly } from 'shared/lib/utils/useNumberOnly'

const props = defineProps(['data', 'offscreen'])
const timings = ref(null)
const bits = ref(null)

const plot = ref<PulsePlotterLib.FlipperPlotter | PulsePlotterLib.FlipperPlotterOffscreen>()
const slicerOptions = ref<typeof PulsePlotterLib.Constants.slicerOptions>()
const currentSlicer = ref({
  modulation: '',
  short: 0,
  long: 0,
  sync: 0,
  gap: 0
})

const onSlice = () => {
  plot.value?.setSlicer(currentSlicer.value)
}

const draw = () => {
  const config = {
    data: props.data,
    timings: timings.value,
    messages: bits.value
  }

  if (props.offscreen) {
    plot.value = new FlipperPlotterOffscreen(config)
  } else {
    plot.value = new FlipperPlotter(config)
  }

  slicerOptions.value = plot.value.slicerOptions
  currentSlicer.value = plot.value.slicer
}

onMounted(() => {
  draw()
})

watch(
  () => props.data,
  () => {
    plot.value?.destroy()
    draw()
  }
)

onBeforeUnmount(() => {
  plot.value?.destroy()
})
</script>
