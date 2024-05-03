import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

export const useDeviceWebStore = (DeviceMainStore) => {
  return defineStore('DeviceWeb', () => {
    const flags = computed(() => DeviceMainStore.flags)
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
  })()
}
