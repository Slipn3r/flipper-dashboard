import { defineStore } from 'pinia'

export const useNfcElectronStore = (NfcMainStore) => {
  return defineStore('NfcElectron', () => {
    const start = async () => {
      return true
    }

    return { start }
  })()
}
