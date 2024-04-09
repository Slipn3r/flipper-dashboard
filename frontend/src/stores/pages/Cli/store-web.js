import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { log } from 'composables/useLog'
import asyncSleep from 'simple-async-sleep'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

export const useCliWebStore = (CliMainStore) => {
  return defineStore('CliWeb', () => {
    const flags = computed(() => CliMainStore.flags)
    const mainFlags = computed(() => mainStore.flags)

    const lineSeparator = ref('\r\n\x01\r\n')

    const stopRpc = async () => {
      flags.value.rpcToggling = true
      await CliMainStore.flipper.setReadingMode('text', 'promptBreak')
      flags.value.rpcActive = false
      mainStore.setRpcStatus(false)
      flags.value.rpcToggling = false
      log({
        level: 'info',
        message: `${CliMainStore.componentName}: RPC stopped`
      })
    }

    const start = async () => {
      flags.value.rpcActive = mainFlags.value.rpcActive
      if (mainFlags.value.rpcActive) {
        await stopRpc()
      }

      setTimeout(CliMainStore.init, 500)
      await asyncSleep(1000)
      await CliMainStore.flipper.setReadingMode('text')
    }

    return { lineSeparator, start }
  })()
}
