import { defineStore } from 'pinia'

export const useArchiveElectronStore = (ArchiveMainStore) => {
  return defineStore('ArchiveElectron', () => {
    const start = async () => {
      await ArchiveMainStore.list()
    }

    return { start }
  })()
}
