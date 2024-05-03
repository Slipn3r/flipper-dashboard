import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

export const usePaintWebStore = (PaintMainStore) => {
  return defineStore('PaintWeb', () => {
    const mainFlags = computed(() => mainStore.flags)

    const startRpc = mainStore.startRpc
    const start = async () => {
      if (!mainFlags.value.rpcActive) {
        await startRpc()
      }
    }

    return { start }
  })()
}
