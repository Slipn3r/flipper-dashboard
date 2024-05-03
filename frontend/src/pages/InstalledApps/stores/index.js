import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { Platform } from 'quasar'

// import { useInstalledAppsWebStore } from './store-web'
// import { useInstalledAppsElectronStore } from './store-electron'

export const useInstalledAppsMainStore = defineStore('InstalledAppsMain', () => {
  // const platformStore = Platform.is.electron ? useInstalledAppsElectronStore(useInstalledAppsMainStore()) : useInstalledAppsWebStore(useInstalledAppsMainStore())

  const flags = ref({
    deleteConfirmationDialog: false
  })
  const appToDelete = ref(null)

  return { flags, appToDelete }
})
