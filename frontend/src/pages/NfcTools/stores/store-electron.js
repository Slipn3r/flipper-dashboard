import { defineStore } from 'pinia'

export const useNfcElectronStore = defineStore('NfcElectron', () => {
  const start = async () => {
    return true
  }

  return { start }
})
