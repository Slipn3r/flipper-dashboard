import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCliElectronStore = (CliMainStore) => {
  return defineStore('CliElectron', () => {
    const lineSeparator = ref('\x01')

    const start = async () => {
      CliMainStore.init()
    }

    return { lineSeparator, start }
  })()
}
