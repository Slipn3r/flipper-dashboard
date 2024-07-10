<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'App'
})

type Icons = {
  [k: string]: string
}

const myIcons: Icons = {
  'flipper:apps': 'svguse:/common-icons.svg#apps',
  'flipper:device': 'svguse:/common-icons.svg#device',
  'flipper:files': 'svguse:/common-icons.svg#files',
  'flipper:cli': 'svguse:/common-icons.svg#cli',
  'flipper:nfctools': 'svguse:/common-icons.svg#nfctools',
  'flipper:paint': 'svguse:/common-icons.svg#paint',
  'flipper:subtools': 'svguse:/common-icons.svg#subtools',
  'flipper:installed': 'svguse:/common-icons.svg#installed',
  'flipper:delete': 'svguse:/common-icons.svg#delete',
  'flipper:settings': 'svguse:/common-icons.svg#settings',
  'flipper:switch': 'svguse:/common-icons.svg#switch',
  'flipper:connect': 'svguse:/common-icons.svg#connect',
  'flipper:connected': 'svguse:/common-icons.svg#connected',
  'flipper:logs': 'svguse:/common-icons.svg#logs',
  'flipper:fw-conflict-icon': 'svguse:/common-icons.svg#fw-conflict-icon',
  'flipper:internal-memory': 'svguse:/common-icons.svg#internal-memory',
  'flipper:sdcard-memory': 'svguse:/common-icons.svg#sdcard-memory',
  'flipper:badusb': 'svguse:/file-types.svg#badusb',
  'flipper:ibutton': 'svguse:/file-types.svg#ibutton',
  'flipper:infrared': 'svguse:/file-types.svg#infrared',
  'flipper:nfc': 'svguse:/file-types.svg#nfc',
  'flipper:rfid': 'svguse:/file-types.svg#rfid',
  'flipper:subghz': 'svguse:/file-types.svg#subghz',
  'flipper:u2f': 'svguse:/file-types.svg#u2f'
}

onBeforeMount(() => {
  const $q = useQuasar()

  $q.iconMapFn = (iconName) => {
    const icon = myIcons[iconName]
    if (icon !== undefined) {
      return { icon }
    }
  }
})
</script>
