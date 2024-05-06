import { defineStore } from 'pinia'

export const usePaintElectronStore = defineStore('PaintElectron', () => {
  const start = async () => {
    return true
  }

  return { start }
})
