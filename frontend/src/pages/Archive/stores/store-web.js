import { defineStore } from 'pinia'
import { computed } from 'vue'

import { log } from 'composables/useLog'

import { useMainStore } from 'stores/global/main'
import { useArchiveMainStore } from './index'

export const useArchiveWebStore = defineStore('ArchiveWeb', () => {
  const ArchiveMainStore = useArchiveMainStore()

  const mainStore = useMainStore()
  const mainFlags = computed(() => mainStore.flags)

  const startRpc = async () => {
    mainFlags.value.rpcToggling = true
    await ArchiveMainStore.flipper.value.startRPCSession()
      .then(() => {
        mainFlags.value.rpcActive = true
        mainStore.setRpcStatus(true)
        mainFlags.value.rpcToggling = false
        log({
          level: 'info',
          message: `${ArchiveMainStore.componentName}: RPC started`
        })
      })
      .catch(error => {
        console.error(error)
        log({
          level: 'error',
          message: `${ArchiveMainStore.componentName}: Error while starting RPC: ${error.toString()}`
        })
      })
  }

  const start = async () => {
    if (!mainFlags.value.rpcActive) {
      await startRpc()
    }
    await ArchiveMainStore.list()
  }

  return { start }
})
