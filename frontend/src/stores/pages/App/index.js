import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { Platform } from 'quasar'

import { submitAppReport, fetchAppById } from 'util/fetch'

import { useRouter } from 'vue-router'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

// import { useAppWebStore } from './store-web'
// import { useAppElectronStore } from './store-electron'

export const useAppMainStore = defineStore('AppMain', () => {
  // const platformStore = Platform.is.electron ? useAppElectronStore(useAppMainStore()) : useAppWebStore(useAppMainStore())
  const router = useRouter()

  const mainFlags = computed(() => mainStore.flags)

  const sdk = computed(() => appsStore.sdk)
  const app = computed(() => appsStore.currentApp)
  const categories = computed(() => appsStore.categories)

  const loading = ref(true)
  const flags = ref({
    noFreeSpaceDialog: false,
    deleteConfirmationDialog: false,
    reportDialog: false,
    reportSubmitted: false
  })
  const category = ref({})
  const screenshotWidth = 256 + 4 + 8 + 8
  const position = ref(0)
  const currentStatusHint = ref(null)
  const statusHints = ref({
    READY: {
      text: 'Runs on latest firmware release',
      icon: 'mdi-check-circle-outline',
      color: 'light-green-2'
    },
    BUILD_RUNNING: {
      text: 'App is rebuilding',
      icon: 'mdi-alert-circle-outline',
      color: 'yellow-2',
      tooltip: 'This may take some time, come back later'
    },
    FLIPPER_OUTDATED: {
      text: 'Flipper firmware is outdated',
      icon: 'mdi-alert-circle-outline',
      color: 'deep-orange-2',
      dialog: 'outdatedFirmwareDialog'
    },
    UNSUPPORTED_APPLICATION: {
      text: 'Outdated app',
      icon: 'mdi-alert-circle-outline',
      color: 'deep-orange-2',
      dialog: 'outdatedAppDialog'
    },
    UNSUPPORTED_SDK: {
      text: 'Unsupported SDK',
      icon: 'mdi-alert-circle-outline',
      color: 'deep-orange-2',
      dialog: 'outdatedFirmwareDialog'
    }
  })
  const report = ref({
    type: '',
    description: ''
  })

  const setCategory = () => {
    category.value = categories.value.find(category => category.id === app.value.categoryId)
  }

  const animateScroll = ({ direction, scrollAreaRef }) => {
    const width = scrollAreaRef.value.$el.offsetWidth
    const numberOfScreenshots = Object.keys(app.value.currentVersion.screenshots).length
    const screenshotsOnScreen = Math.floor(width / screenshotWidth) || 1

    if (direction === 'forward') {
      if ((position.value + (screenshotWidth * screenshotsOnScreen)) < screenshotWidth * numberOfScreenshots) {
        position.value = position.value + screenshotWidth
      }
    }

    if (direction === 'backward') {
      if (position.value < 0) {
        position.value = 0
      } else {
        position.value = position.value - screenshotWidth
      }
    }

    scrollAreaRef.value.setScrollPosition('horizontal', position.value, 300)
  }

  const sendReport = async () => {
    await submitAppReport(app.value.id, { description: report.value.description, description_type: report.value.type })
    flags.value.reportSubmitted = true
  }

  const start = async ({ route }) => {
    loading.value = true
    const path = route.params.path
    if (!path) {
      return
    }

    const appFull = await fetchAppById(path, sdk.value)
    if (appFull.detail && appFull.detail.status === 'error') {
      router.push({ name: 'Apps' })
      return
    }
    appsStore.setCurrentApp(appFull)
    const status = app.value.currentVersion.status
    if (mainFlags.value.connected && status === 'READY') {
      currentStatusHint.value = null
    } else {
      currentStatusHint.value = status
    }
    if (!categories.value.length) {
      await appsStore.getCategories()
    }
    setCategory()

    appsStore.updateInstalledApps([app.value])

    loading.value = false
  }

  return { app, loading, flags, category, currentStatusHint, statusHints, report, animateScroll, sendReport, start }
})
