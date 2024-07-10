<template>
  <q-drawer class="bg-grey-2" show-if-above :width="175" :breakpoint="900">
    <q-list>
      <RouterLink v-for="link in linksList" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { RouterLink } from 'shared/components/RouterLink'

const linksList = [
  {
    title: 'My Flipper',
    icon: 'flipper:device',
    name: 'Device'
    // titleOverride: currentFlipperName
  },
  {
    title: 'Apps',
    icon: 'flipper:apps',
    name: 'Apps'
  },
  {
    title: 'Files',
    icon: 'flipper:files',
    name: 'Archive'
  },
  {
    title: 'CLI',
    icon: 'flipper:cli',
    name: 'Cli'
  },
  {
    title: 'NFC tools',
    icon: 'flipper:nfctools',
    name: 'NfcTools'
  },
  {
    title: 'Paint',
    icon: 'flipper:paint',
    name: 'Paint'
  },
  {
    title: 'Pulse Plotter',
    icon: 'flipper:subtools',
    name: 'Pulseplot'
  }
]
</script>
