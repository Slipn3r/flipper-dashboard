import { defineStore } from 'pinia'

import { useArchiveMainStore } from './index'

export const useArchiveElectronStore = defineStore('ArchiveElectron', () => {
  const ArchiveMainStore = useArchiveMainStore()

  const start = async () => {
    await ArchiveMainStore.list()
  }

  return { start }
})
