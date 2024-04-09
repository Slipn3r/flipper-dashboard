<template>
  <q-page class="flex-center column full-width">
    <div class="flex-center column">
      <div v-show="mainFlags.updateInProgress || (mainFlags.connected && info !== null && info.doneReading && flags.rpcActive)" class="device-screen column">
        <template v-if="info">
          <div class="flex">
            <div class="info">
              <p>
                <span>Firmware:</span>
                <span>{{ info.firmware.version !== 'unknown' ? info.firmware.version : info.firmware.commit }}</span>
              </p>
              <p>
                <span>Build date:</span>
                <span>{{ info.firmware.build.date }}</span>
              </p>
              <p>
                <span>SD card:</span>
                <span>{{ sdCardUsage }}</span>
              </p>
              <p>
                <span>Databases:</span>
                <span>{{ info.storage.databases.status }}</span>
              </p>
              <p>
                <span>Hardware:</span>
                <span>{{ info.hardware.ver + '.F' + info.hardware.target + 'B' + info.hardware.body + 'C' + info.hardware.connect }}</span>
              </p>
              <p>
                <span>Radio FW:</span>
                <span>{{ info.radio.alive !== false ? info.radio.stack.major + '.' + info.radio.stack.minor + '.' + info.radio.stack.sub : 'corrupt' }}</span>
              </p>
              <p>
                <span>Radio stack:</span>
                <span>{{ radioStackType }}</span>
              </p>
            </div>
            <div class="column items-center">
              <h5>{{ info.hardware.name }}</h5>
              <div
                class="flipper relative-position"
                :class="flipperBodyClass"
              >
                <canvas
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
                />
              </div>
            </div>
          </div>
          <Updater/>
        </template>
      </div>
      <div
        v-if="!mainFlags.updateInProgress && (!mainFlags.connected || info == null || !flags.rpcActive || flags.rpcToggling)"
        class="flex-center column q-my-xl"
      >
        <q-spinner
          color="primary"
          size="3em"
          class="q-mb-md"
        ></q-spinner>
        <p>Waiting for Flipper...</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Updater from 'components/Updater.vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()
const mainFlags = computed(() => mainStore.flags)

import { useDeviceMainStore } from 'stores/pages/Device'
const deviceMainStore = useDeviceMainStore()
const flags = computed(() => deviceMainStore.flags)
const radioStackType = computed(() => deviceMainStore.radioStackType)
const sdCardUsage = computed(() => deviceMainStore.sdCardUsage)
const flipperBodyClass = computed(() => deviceMainStore.flipperBodyClass)
const screenScale = computed(() => deviceMainStore.screenScale)

const screenStreamCanvas = ref(null)

const flipper = computed(() => mainStore.flipper)
const info = computed(() => mainStore.info)

watch(info, (newInfo) => {
  if (newInfo !== null && info.value.doneReading && mainFlags.value.connected) {
    deviceMainStore.start()
  }
})

onMounted(() => {
  deviceMainStore.setScreenStreamCanvas(screenStreamCanvas.value)

  if (info.value !== null && info.value.doneReading && mainFlags.value.connected) {
    deviceMainStore.start()
  }

  function onDisconnect (unbind) {
    flags.value.rpcActive = false
    flags.value.rpcToggling = false
    mainStore.setRpcStatus(false)
    flags.value.screenStream = false
    if (unbind) {
      unbind()
    }
  }
  if (window.serial) {
    const unbind = flipper.value.emitter.on('disconnect', () => onDisconnect(unbind))
  } else {
    navigator.serial.addEventListener('disconnect', () => onDisconnect())
  }
})
</script>
