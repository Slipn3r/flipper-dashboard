import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'
import { useDeviceMainStore } from './index'

export const useDeviceElectronStore = defineStore('DeviceElectron', () => {
  const DeviceMainStore = useDeviceMainStore()
  const flags = computed(() => DeviceMainStore.flags)

  const mainStore = useMainStore()
  const mainFlags = computed(() => mainStore.flags)

  const start = async () => {
    flags.value.rpcActive = mainFlags.value.rpcActive
    await DeviceMainStore.startScreenStream()
  }

  return { start }
})
