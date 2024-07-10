<template>
  <q-page class="flex-center column" padding>
    <div class="flex items-start q-gutter-x-xl">
      <Info class="q-mt-sm" v-bind="info" />
      <FlipperInfo v-bind="flipperInfo" />
    </div>

    <Updater />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Info, FlipperInfo, Updater } from './components'

const info = ref({
  firmwareVersion: '0.101.2',
  buildDate: '30-04-2024',
  sdCardUsage: '70.9MiB / 29.1GiB',
  databaseStatus: 'installed',
  hardwareVersion: '12.F7B9C6',
  radioVersion: '1.19.0',
  radioStackType: '3'
})

const flipperInfo = ref({
  flipperName: 'Test',
  flipperColor: '2'
})
</script>
