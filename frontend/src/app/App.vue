<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useQuasar, Platform } from 'quasar'

defineOptions({
  name: 'App'
})

type Icons = {
  [k: string]: string
}

const getPathToIcon = (path: string) => {
  return `svguse:${Platform.is.electron ? '' : '/'}${
    isType(path) ? 'file-types' : 'common-icons'
  }.svg#${path}`
}

const isType = (path: string) => {
  switch (path) {
    case 'badusb':
      return true
    case 'ibutton':
      return true
    case 'infrared':
      return true
    case 'nfc':
      return true
    case 'rfid':
      return true
    case 'subghz':
      return true
    case 'u2f':
      return true

    default:
      return false
  }
}

const myIcons: Icons = {
  'flipper:apps': getPathToIcon('apps'),
  'flipper:device': getPathToIcon('device'),
  'flipper:files': getPathToIcon('files'),
  'flipper:cli': getPathToIcon('cli'),
  'flipper:nfctools': getPathToIcon('nfctools'),
  'flipper:paint': getPathToIcon('paint'),
  'flipper:subtools': getPathToIcon('subtools'),
  'flipper:installed': getPathToIcon('installed'),
  'flipper:delete': getPathToIcon('delete'),
  'flipper:settings': getPathToIcon('settings'),
  'flipper:switch': getPathToIcon('switch'),
  'flipper:connect': getPathToIcon('connect'),
  'flipper:connected': getPathToIcon('connected'),
  'flipper:logs': getPathToIcon('logs'),
  'flipper:fw-conflict-icon': getPathToIcon('fw-conflict-icon'),
  'flipper:internal-memory': getPathToIcon('internal-memory'),
  'flipper:sdcard-memory': getPathToIcon('sdcard-memory'),
  'flipper:badusb': getPathToIcon('badusb'),
  'flipper:ibutton': getPathToIcon('ibutton'),
  'flipper:infrared': getPathToIcon('infrared'),
  'flipper:nfc': getPathToIcon('nfc'),
  'flipper:rfid': getPathToIcon('rfid'),
  'flipper:subghz': getPathToIcon('subghz'),
  'flipper:u2f': getPathToIcon('u2f')
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
