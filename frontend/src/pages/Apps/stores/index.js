import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { Platform } from 'quasar'

import { useRouter } from 'vue-router'

import { useAppsStore } from 'stores/global/apps'
const appsStore = useAppsStore()

// import { useAppsWebStore } from './store-web'
// import { useAppsElectronStore } from './store-electron'

export const useAppsMainStore = defineStore('AppsMain', () => {
  // const platformStore = Platform.is.electron ? useAppsElectronStore(useAppsMainStore()) : useAppsWebStore(useAppsMainStore())

  const router = useRouter()

  const flags = computed(() => appsStore.flags)
  const apps = computed(() => appsStore.apps)

  const infinityScrollRef = ref(null)

  const categories = computed(() => appsStore.categories)
  const initialCategory = computed(() => appsStore.initialCategory)
  const catalogCategories = computed(() => {
    return [{
      // id:"64971d0f6617ba37a4bc79b3"
      // priority:0
      name: 'All apps',
      color: 'EBEBEB'
    }, ...categories.value]
  })

  const currentCategory = ref(null)
  const setCurrentCategory = (category) => {
    currentCategory.value = category
  }

  const options = {
    limit: appsStore.defaultParamsAppsShort.limit,
    offset: 0
  }

  const reLoad = async ({
    infinityScrollRef
  }) => {
    options.offset = 0

    await infinityScrollRef.value.stop()
    await infinityScrollRef.value.reset()
    await infinityScrollRef.value.resume()
  }
  const onLoad = async (index, done) => {
    if (index > 1) {
      options.offset += options.limit
    }

    await getAppsShort(options)
    done(flags.value.fetchEnd)
  }

  const getAppsShort = async (options = {}) => {
    switch (sortModel.value) {
      case 'New Updates':
        options.sort_by = 'updated_at'
        options.sort_order = -1
        break
      case 'Old Updates':
        options.sort_by = 'updated_at'
        options.sort_order = 1
        break
      case 'New Releases':
        options.sort_by = 'created_at'
        options.sort_order = -1
        break
      case 'Old Releases':
        options.sort_by = 'created_at'
        options.sort_order = 1
        break
    }

    await appsStore.getAppsShort(options)
  }

  const sortOptions = ref([
    'New Updates',
    'New Releases',
    'Old Updates',
    'Old Releases'
  ])
  const sortModel = ref('New Updates')
  const onSortApps = ({
    infinityScrollRef
  }) => {
    appsStore.onClearAppsList()
    appsStore.toggleFlag('fetchEnd', false)
    reLoad({
      infinityScrollRef
    })
  }

  const appClicked = (app) => {
    if (app.action.type) {
      return
    }
    appsStore.openApp(app)
  }

  const onSelectCategory = ({
    category,
    infinityScrollRef
  }) => {
    appsStore.onClearAppsList()
    appsStore.toggleFlag('fetchEnd', false)

    if (category.name === 'All apps') {
      currentCategory.value = null
      appsStore.setInitalCategory(null)
      router.push({ name: 'Apps' })

      reLoad({
        infinityScrollRef
      })

      return
    }

    router.push({ name: 'AppsCategory', params: { path: category.name.toLowerCase() } })
    appsStore.setInitalCategory(category)
    currentCategory.value = category

    reLoad({
      infinityScrollRef
    })
  }

  return { flags, apps, infinityScrollRef, categories, initialCategory, catalogCategories, currentCategory, setCurrentCategory, sortOptions, sortModel, onSortApps, appClicked, onSelectCategory, onLoad }
})
