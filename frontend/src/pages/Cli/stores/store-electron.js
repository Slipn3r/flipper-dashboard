import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useCliMainStore } from './index'

export const useCliElectronStore = defineStore('CliElectron', () => {
  const CliMainStore = useCliMainStore()

  const lineSeparator = ref('\x01')

  const start = async () => {
    CliMainStore.init()
  }

  return { lineSeparator, start }
})
