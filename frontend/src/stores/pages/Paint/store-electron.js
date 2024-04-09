import { defineStore } from 'pinia'

export const usePaintElectronStore = (PaintMainStore) => {
  return defineStore('PaintElectron', () => {
    const start = async () => {
      return true
    }

    return { start }
  })()
}
