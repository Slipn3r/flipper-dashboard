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

const getPathToIcon = (file: string, path: string, viewBox?: string) => {
  return `svguse:${Platform.is.electron ? '' : '/'}${file}.svg#${path}${
    viewBox ? '|' + viewBox : ''
  }`
}

const myIcons: Icons = {
  'flipper:apps': getPathToIcon('common-icons', 'apps'),
  'flipper:device': getPathToIcon('common-icons', 'device'),
  'flipper:files': getPathToIcon('common-icons', 'files'),
  'flipper:cli': getPathToIcon('common-icons', 'cli'),
  'flipper:nfctools': getPathToIcon('common-icons', 'nfctools'),
  'flipper:paint': getPathToIcon('common-icons', 'paint'),
  'flipper:subtools': getPathToIcon('common-icons', 'subtools'),
  'flipper:installed': getPathToIcon('common-icons', 'installed'),
  'flipper:delete': getPathToIcon('common-icons', 'delete'),
  'flipper:settings': getPathToIcon('common-icons', 'settings'),
  'flipper:switch': getPathToIcon('common-icons', 'switch'),
  'flipper:connect': getPathToIcon('common-icons', 'connect'),
  'flipper:connected': getPathToIcon('common-icons', 'connected'),
  'flipper:logs': getPathToIcon('common-icons', 'logs'),
  'flipper:fw-conflict-icon': getPathToIcon('common-icons', 'fw-conflict-icon'),
  'flipper:internal-memory': getPathToIcon('common-icons', 'internal-memory'),
  'flipper:sdcard-memory': getPathToIcon('common-icons', 'sdcard-memory'),
  'flipper:info': getPathToIcon('common-icons', 'info'),
  'flipper:info-small': getPathToIcon('common-icons', 'info-small'),
  'flipper:info-big': getPathToIcon('common-icons', 'info-big'),
  'flipper:save-symbolic': getPathToIcon('common-icons', 'save-symbolic'),
  'flipper:chevron-left': getPathToIcon('common-icons', 'chevron-left'),
  'flipper:chevron-left-small': getPathToIcon(
    'common-icons',
    'chevron-left-small'
  ),

  'flipper:badusb': getPathToIcon('file-types', 'badusb'),
  'flipper:ibutton': getPathToIcon('file-types', 'ibutton'),
  'flipper:infrared': getPathToIcon('file-types', 'infrared'),
  'flipper:nfc': getPathToIcon('file-types', 'nfc'),
  'flipper:rfid': getPathToIcon('file-types', 'rfid'),
  'flipper:subghz': getPathToIcon('file-types', 'subghz'),
  'flipper:u2f': getPathToIcon('file-types', 'u2f'),

  'flipper:control-back': getPathToIcon('controls', 'back'),
  'flipper:control-back-down': getPathToIcon('controls', 'back-down'),
  'flipper:control-back-hover': getPathToIcon('controls', 'back-hover'),
  'flipper:control-circle': getPathToIcon('controls', 'circle'),
  'flipper:control-circle-down': getPathToIcon('controls', 'circle-down'),
  'flipper:control-circle-hover': getPathToIcon('controls', 'circle-hover'),
  'flipper:control-triangle': getPathToIcon('controls', 'triangle'),
  'flipper:control-triangle-down': getPathToIcon('controls', 'triangle-down'),
  'flipper:control-triangle-hover': getPathToIcon('controls', 'triangle-hover'),

  'flipper:steaming-help': getPathToIcon(
    'streaming-help',
    'default',
    '0 0 207 102'
  ),
  'flipper:steaming-help-mac': getPathToIcon(
    'streaming-help',
    'mac',
    '0 0 207 102'
  )
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
