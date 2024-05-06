import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'
import { useDeviceMainStore } from './index'

export const useDeviceWebStore = defineStore('DeviceWeb', () => {
  const DeviceMainStore = useDeviceMainStore()
  const flags = computed(() => DeviceMainStore.flags)

  const mainStore = useMainStore()
  const mainFlags = computed(() => mainStore.flags)

  const start = async () => {
    flags.value.rpcActive = mainFlags.value.rpcActive
    if (!mainFlags.value.rpcActive) {
      await mainStore.startRpc()
    }
    if (!flags.value.screenStream) {
      await DeviceMainStore.startScreenStream()
    }
  }

  return { start }
})
