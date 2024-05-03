import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useMainStore } from 'stores/global/main'

export const useNfcWebStore = defineStore('NfcWeb', () => {
  const mainStore = useMainStore()
  const mainFlags = computed(() => mainStore.flags)

  const startRpc = mainStore.startRpc
  const start = async () => {
    if (!mainFlags.value.rpcActive) {
      await startRpc()
    }
  }

  return { start }
})
