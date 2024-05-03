import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

export const useNfcWebStore = (NfcMainStore) => {
  return defineStore('NfcWeb', () => {
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
