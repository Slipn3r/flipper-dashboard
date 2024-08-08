<template>
  <template v-if="!flipperStore.loadingInfo">
    <template v-if="flipperStore.info">
      <div class="column items-center">
        <div class="flex items-start q-gutter-x-xl q-mb-md">
          <FlipperInfo class="q-mt-sm" v-bind="info" />
          <FlipperBody
            v-bind="flipperBody"
            :showScreenUpdating="flipperStore.flags.updateInProgress"
          />
        </div>

        <FlipperUpdate />
      </div>
    </template>
  </template>
  <template v-else>
    <div class="row justify-center q-my-md">
      <Loading
        label="Loading info..."
      />
    </div>
  </template>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Loading } from 'shared/components/Loading'
import { FlipperUpdate } from 'features/Flipper'
import { FlipperBody, FlipperInfo, FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { bytesToSize } from 'shared/lib/utils/bytesToSize'

const sdCardUsage = computed(() => {
  return `${bytesToSize(flipperStore.info?.storage.sdcard.totalSpace - flipperStore.info?.storage.sdcard.freeSpace)} / ${bytesToSize(flipperStore.info?.storage.sdcard.totalSpace)}`
})

const hardwareVersion = computed(() => {
  return flipperStore.info?.hardware.ver + '.F' + flipperStore.info?.hardware.target + 'B' + flipperStore.info?.hardware.body + 'C' + flipperStore.info?.hardware.connect
})

const radioVersion = computed(() => {
  return flipperStore.info?.radio.alive !== false ? flipperStore.info?.radio.stack.major + '.' + flipperStore.info?.radio.stack.minor + '.' + flipperStore.info?.radio.stack.sub : 'corrupt'
})

const info = ref({
  firmwareVersion: computed(() => flipperStore.info?.firmware.version),
  buildDate: computed(() => flipperStore.info?.firmware.build.date),
  sdCardUsage: computed(() => sdCardUsage.value),
  databaseStatus: computed(() => flipperStore.info?.storage.databases.status),
  hardwareVersion: computed(() => hardwareVersion.value),
  radioVersion: computed(() => radioVersion.value),
  radioStackType: computed(() => flipperStore.info?.radio.stack.type)
})

const flipperBody = ref({
  flipperName: computed(() => flipperStore.info?.hardware.name),
  flipperColor: computed(() => flipperStore.info?.hardware.color)
})

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      await flipperStore.flipper.startRPCSession()
    }

    if (!flipperStore.info) {
      await flipperStore.flipper.getInfo()
    }
  }
})
</script>
