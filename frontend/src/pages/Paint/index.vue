<template>
  <q-page class="column items-center full-width">
    <div
      v-if="!mainFlags.connected || !mainFlags.rpcActive || mainFlags.rpcToggling"
      class="column flex-center q-my-xl"
    >
      <q-spinner
        color="primary"
        size="3em"
        class="q-mb-md"
      ></q-spinner>
      <p>Waiting for Flipper...</p>
    </div>
    <PixelEditor v-else ref="editor"/>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PixelEditor from 'src/components/PixelEditor.vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)
const flipper = computed(() => mainStore.flipper)
const info = computed(() => mainStore.info)

import { usePaintMainStore } from './stores'
const PaintMainStore = usePaintMainStore()

const autoStreaming = computed(() => PaintMainStore.autoStreaming)
// const backlightInterval = computed(() => PaintMainStore.backlightInterval)
const editor = ref(null)

const startVirtualDisplay = PaintMainStore.startVirtualDisplay
const stopVirtualDisplay = PaintMainStore.stopVirtualDisplay

const start = PaintMainStore.start

onMounted(async () => {
  PaintMainStore.setEditorRef(editor.value)

  if (mainFlags.value.connected && info.value !== null && info.value.doneReading) {
    await start()
  }

  startVirtualDisplay()
})

const onDisconnect = (unbind) => {
  if (autoStreaming.value.interval) {
    clearInterval(autoStreaming.value.interval)
  }
  // clearInterval(backlightInterval)
  if (unbind) {
    unbind()
  }
}
if (window.serial) {
  const unbind = flipper.value.emitter.on('disconnect', () => onDisconnect(unbind))
} else {
  navigator.serial.addEventListener('disconnect', () => onDisconnect())
}

onBeforeUnmount(() => {
  if (autoStreaming.value.interval) {
    clearInterval(autoStreaming.value.interval)
  }
  // clearInterval(backlightInterval)
  stopVirtualDisplay()
})
</script>
