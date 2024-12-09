import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Platform } from 'quasar'
import { isProd, isDebug } from 'shared/config'
// import asyncSleep from 'simple-async-sleep'
import { FlipperModel } from 'entities/Flipper'
import { CategoryModel } from 'entities/Category'

import { FlipperJsUtils } from 'shared/lib/flipperJs'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { logger } from 'shared/lib/utils/useLog'

// import { instance } from 'boot/axios'
import { App, InstalledApp, AppsPostShortParams, ActionType } from './types'
import { api } from '../api'
const { fetchAppsVersions, fetchPostAppsShort /* , fetchAppFap */ } = api

const componentName = 'AppsStore'

export const useAppsStore = defineStore('apps', () => {
  const flipperStore = FlipperModel.useFlipperStore()
  // const { flipper, info, flipperReady } = flipperStore
  const flipper = computed(() => flipperStore.flipper)
  // const info = computed(() => flipperStore.info)
  const api = computed(() => flipperStore.api)
  const target = computed(() => flipperStore.target)
  const flipperReady = computed(() => flipperStore.flipperReady)

  const flags = reactive({
    catalogChannelProduction: ref(true),
    catalogCanSwitchChannel: ref(isProd && !isDebug ? false : true),
    catalogInstallAllApps: ref(false),
    catalogCanInstallAllApps: ref(isProd && !isDebug ? false : true),
    catalogIsUnknownSDK: false
  })

  const dialogs = reactive<{
    [key: string]: boolean
  }>({
    outdatedFirmwareDialogPersistent: false,
    outdatedFirmwareDialog: false,
    outdatedAppDialog: false,
    noFreeSpace: false
  })

  const categoryStore = CategoryModel.useCategoriesStore()
  // const { categories } = categoryStore
  const categories = computed(() => categoryStore.categories)

  const flipperInstalledApps = computed(() => flipper.value?.installedApps)
  const installedApps = ref<InstalledApp[]>([])
  const updatableApps = ref<InstalledApp[]>([])
  const upToDateApps = ref<InstalledApp[]>([])
  const unsupportedApps = ref<InstalledApp[]>([])
  const appsUpdateCount = ref(0)
  const loadingInstalledApps = ref(false)
  const noApplicationsInstalled = ref(false)

  const onClearInstalledAppsList = () => {
    installedApps.value = []
    updatableApps.value = []
    upToDateApps.value = []
    unsupportedApps.value = []
    appsUpdateCount.value = 0
    actionAppList.value = []
    batch.value = {
      inProcess: false,
      totalCount: 0,
      doneCount: 0,
      failed: [],
      progress: 0
    }
  }
  const getInstalledApps = async ({ refreshInstalledApps = false } = {}) => {
    if (!installedApps.value.length) {
      loadingInstalledApps.value = true
    }

    if (refreshInstalledApps) {
      // onClearInstalledAppsList()
      await flipper.value?.getInstalledApps().catch((/* error: Error */) => {
        loadingInstalledApps.value = false
        // throw error
        return
      })
    }

    try {
      let installed: InstalledApp[] = (installedApps.value = flipperStore
        .flipper?.installedApps as InstalledApp[])

      if (!installed.length) {
        noApplicationsInstalled.value = true
        throw 'No installed apps'
      } else {
        noApplicationsInstalled.value = false
      }

      installed = installed.filter((installedApp) => {
        if (installedApp.devCatalog && flags.catalogChannelProduction) {
          return false
        }

        return true
      })

      const versions = await fetchAppsVersions(
        (flipperInstalledApps.value as InstalledApp[]).map(
          (app) => app.installedVersion.id
        )
      )
      for (const version of versions) {
        const app = (flipperInstalledApps.value as InstalledApp[]).find(
          (app) => app.id === version.applicationId
        )
        if (app) {
          app.installedVersion = { ...app.installedVersion, ...version }
        }
      }

      const params: AppsPostShortParams = {
        limit: 500,
        is_latest_release_version: true
      }

      if (flipperReady.value) {
        params.api = api.value
        params.target = target.value
        delete params.is_latest_release_version
      }

      // NOTE: Actual — latest compatible
      let actualApps: App[] = []
      do {
        actualApps = await fetchPostAppsShort({
          ...params,
          applications: installed.map((app) => app.id)
        })
      } while (actualApps.length === params.limit)

      // HACK: Bind the past action state to the new list
      if (actionAppList.value.length) {
        installed = installed.map((installedApp) => {
          const lastInstalledApp = actionAppList.value.find(
            (actualApp) => actualApp.id === installedApp.id
          )

          if (lastInstalledApp) {
            installedApp.action = lastInstalledApp.action
          }

          return installedApp
        })
      }

      updatableApps.value = installed.filter((installedApp) => {
        const app = actualApps.find(
          (actualApp) => actualApp.id === installedApp.id
        )

        if (app) {
          const currentApp = installedApp as InstalledApp
          // const currentApp = { ...app, ...installedApp }
          // if (!installedApp.action) {
          //   installedApp.action = app.action
          // }
          currentApp.categoryId = app.categoryId
          currentApp.currentVersion = app.currentVersion
          currentApp.alias = app.alias

          if (api.value && installedApp.installedVersion.api !== api.value) {
            return true
          }
          if (app.currentVersion.id !== installedApp.installedVersion.id) {
            return true
          }
        }
        return false
      })

      appsUpdateCount.value = updatableApps.value.length

      upToDateApps.value = installed.filter((installedApp) => {
        const app = actualApps.find(
          (actualApp) => actualApp.id === installedApp.id
        )

        if (app) {
          if (api.value && installedApp.installedVersion.api !== api.value) {
            // installedApp.isInstalled = false
            return false
          }

          if (
            app.currentVersion.id === installedApp.installedVersion.id &&
            app.currentVersion.status === 'READY'
          ) {
            // installedApp.isInstalled = true
            return true
          }
        }
        // installedApp.isInstalled = false
        return false
      })

      unsupportedApps.value = installed.filter((installedApp) => {
        // if (!installedApp.action) {
        //   installedApp.action = {
        //     type: '',
        //     progress: 0,
        //     id: installedApp.id
        //   }
        // }
        if (!actualApps.find((app) => app.id === installedApp.id)) {
          // installedApp.unsupported = true
          return true
        }
        // installedApp.unsupported = false
        return false
      })

      // if (batch.value.inProcess) {
      //   batch.value.doneCount++

      //   if (batch.value.totalCount === batch.value.doneCount) {
      //     batch.value.totalCount = 0
      //     batch.value.doneCount = 0
      //     batch.value.inProcess = false
      //   }
      // }

      loadingInstalledApps.value = false
    } catch {
      loadingInstalledApps.value = false
    }
  }

  const getButtonState = (app: App) => {
    if (
      updatableApps.value.find((updatableApp) => updatableApp.id === app.id)
    ) {
      return 'update'
    }

    if (upToDateApps.value.find((upToDateApp) => upToDateApp.id === app.id)) {
      return 'installed'
    }

    return 'install'
  }

  const progressColors = (type: App['action']['type']) => {
    switch (type) {
      case 'delete':
        return {
          bar: 'negative',
          track: 'deep-orange-4'
        }
      case 'install':
        return {
          bar: 'primary',
          track: 'orange-4'
        }
      default:
        return {
          bar: 'positive',
          track: 'green-4'
        }
    }
  }

  const batch = ref<{
    inProcess: boolean
    totalCount: number
    doneCount: number
    failed: {
      id: string
      name: string
    }[]
    progress: number
  }>({
    inProcess: false,
    totalCount: 0,
    doneCount: 0,
    failed: [],
    progress: 0
  })
  const batchUpdate = async (apps: InstalledApp[]) => {
    batch.value.inProcess = true
    batch.value.totalCount = apps.length
    batch.value.doneCount = 0

    for (const app of apps) {
      try {
        onAction(app, 'update')
      } catch (error) {
        console.error(error)
        batch.value.failed.push({
          id: app.id,
          name: app.installedVersion.name
        })
      }
    }
  }
  const installationBatch = ref<{
    inProcess: boolean
    totalCount: number
    doneCount: number
    failed: {
      id: string
      name: string
    }[]
    progress: number
  }>({
    inProcess: false,
    totalCount: 0,
    doneCount: 0,
    failed: [],
    progress: 0
  })
  const actionAppList = ref<Array<App | InstalledApp>>([])
  const onAction = async (app: App | InstalledApp, actionType: ActionType) => {
    if (Platform.is.mobile) {
      dialogs.mobileAppDialog = true
      return
    }
    if (!('serial' in navigator)) {
      flipperStore.dialogs.serialUnsupported = true
      return
    }

    if (!flipper.value) {
      flipperStore.dialogs.connectFlipper = true
      return
    }

    if (!flipper.value.connected) {
      flipperStore.dialogs.connectFlipper = true
      return
    }

    await flipper.value.ensureCategoryPaths(categories.value)

    flipperStore.flags.disableButtonMultiflipper = true

    app.action = {
      progress: 0,
      type: actionType
    }

    actionAppList.value.push(app)

    const action = async (app: App | InstalledApp, actionType: ActionType) => {
      await handleAction(app, actionType).catch((error) => {
        logger.error({
          context: componentName,
          message: error.message
        })
      })
      if (actionAppList.value.length) {
        let appIndex: number | null = actionAppList.value.findIndex(
          (actualApp) => actualApp.id === app.id
        )

        if (appIndex !== null) {
          actionAppList.value.splice(appIndex, 1)

          appIndex = null
        }
      }
      return Promise.resolve()
    }

    await flipper.value.addToQueue({
      fn: action,
      params: [app, actionType]
    })

    if (!flipper.value || flipper.value.getProcess() === false) {
      flipperStore.flags.disableButtonMultiflipper = false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInstalledApp = (obj: any): obj is InstalledApp => {
    return 'installedVersion' in obj
  }

  const findAndRemoveApp = (
    arrays: (App | InstalledApp)[][],
    target: App | InstalledApp
  ) => {
    for (const array of arrays) {
      const index = array.findIndex((item) => item.id === target.id)
      if (index !== -1) {
        const [item] = array.splice(index, 1)
        return item
      }
    }
    return null
  }

  const addAndSortArray = (
    array: (App | InstalledApp)[],
    app: App | InstalledApp
  ) => {
    array.push(app)

    array.sort((a, b) => {
      let aName: string
      let bName: string

      if (isInstalledApp(a)) {
        aName = a.name
      } else {
        aName = a.currentVersion.name
      }

      if (isInstalledApp(b)) {
        bName = b.name
      } else {
        bName = b.currentVersion.name
      }

      return aName.localeCompare(bName)
    })
  }

  const getCurrentApp = async (app: App) => {
    const version = await fetchAppsVersions([app.currentVersion.id])

    const manifest = (await FlipperJsUtils.readManifest.bind(flipper.value!)({
      name: `${app.alias}.fim`
    })) as InstalledApp

    const _app: InstalledApp = { ...manifest! }
    _app.installedVersion = { ..._app.installedVersion, ...version[0] }

    _app.currentVersion = app.currentVersion
    _app.alias = app.alias
    _app.categoryId = app.categoryId

    return _app as InstalledApp
  }

  const appNotif = ref()
  const handleAction = async (
    app: App | InstalledApp,
    actionType: ActionType
  ) => {
    if (!flipper.value) {
      return
    }

    const flipperCurrentlyParticipating = flipper.value.name

    if (!flipperStore.info?.storage.sdcard) {
      app.action.type = actionType
      flipperStore.dialogs.microSDcardMissing = true
      setTimeout(() => {
        app.action.type = ''
      }, 300)
      return
    }
    if (!actionType) {
      return
    }

    appNotif.value = showNotif({
      isStayOpen: true,
      group: false, // required to be updatable
      timeout: 0, // we want to be in control when it gets dismissed
      spinner: true,
      message: 'Processing...',
      caption: '0%'
    })

    switch (actionType) {
      case 'install':
        appNotif.value({
          message: `Installing ${app?.currentVersion?.name || 'app'}...`
        })

        const installCategoryName = categories.value.find(
          (e) => e.id === app.categoryId
        )!.name
        return await flipper.value
          .installApp({
            callback: (progress) => {
              appNotif.value({
                caption: `${progress * 100}%`
              })
            },
            categoryName: installCategoryName,
            app,
            catalogChannelProduction: flags.catalogChannelProduction
          })
          .then(async () => {
            const _app = await getCurrentApp(app as App)

            addAndSortArray(upToDateApps.value, _app)

            appNotif.value({
              icon: 'done',
              color: 'positive',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              message: `${app.currentVersion.name || 'App'} installed!`,
              caption: '',
              timeout: 500 // we will timeout it in 0.5s
            })
          })
          .catch((error: Error) => {
            const message = `${
              app.currentVersion.name || 'App'
            } didn't install${
              !flipper.value ||
              flipper.value.name !== flipperCurrentlyParticipating
                ? ` because ${flipperCurrentlyParticipating} was not found`
                : error.message
                ? ' because ' + error.message
                : ''
            }!`
            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [{ icon: 'close', color: 'white', class: 'q-px-sm' }],
              message,
              caption: ''
            })
            const index = installedApps.value.findIndex((e) => e.id === app.id)
            if (index !== -1) {
              installedApps.value.splice(index, 1)
            }
            app.action.type = ''
            throw new Error(message)
          })
          .finally(() => {
            if (installationBatch.value.inProcess) {
              installationBatch.value.doneCount++

              if (
                installationBatch.value.totalCount ===
                installationBatch.value.doneCount
              ) {
                installationBatch.value.totalCount = 0
                installationBatch.value.doneCount = 0
                installationBatch.value.inProcess = false
              }
            }

            app.action.type = ''
            app.action.progress = 0
          })
      case 'update':
        appNotif.value({
          message: `Uploading ${app?.currentVersion?.name || 'app'}...`
        })
        return await flipper.value
          .installApp({
            callback: (progress) => {
              appNotif.value({
                caption: `${progress * 100}%`
              })
            },
            categoryName: categories.value.find((e) => e.id === app.categoryId)!
              .name,
            app,
            catalogChannelProduction: flags.catalogChannelProduction
          })
          .then(async () => {
            const _app = await getCurrentApp(app as App)

            findAndRemoveApp([updatableApps.value, unsupportedApps.value], _app)

            addAndSortArray(upToDateApps.value, _app)

            if (batch.value.inProcess) {
              batch.value.doneCount++

              if (batch.value.totalCount === batch.value.doneCount) {
                batch.value.totalCount = 0
                batch.value.doneCount = 0
                batch.value.inProcess = false
              }
            }

            appsUpdateCount.value = updatableApps.value.length

            appNotif.value({
              icon: 'done',
              color: 'positive',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              message: `${app.currentVersion?.name || 'App'} updated!`,
              caption: '',
              timeout: 500 // we will timeout it in 0.5s
            })
          })
          .catch((error: Error) => {
            const message = `${
              app.currentVersion?.name || 'App'
            } didn't update${
              !flipper.value ||
              flipper.value.name !== flipperCurrentlyParticipating
                ? ` because ${flipperCurrentlyParticipating} was not found`
                : error.message
                ? ' because ' + error.message
                : ''
            }!`
            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [{ icon: 'close', color: 'white', class: 'q-px-sm' }],
              message,
              caption: ''
            })
            const index = installedApps.value.findIndex((e) => e.id === app.id)
            if (index !== -1) {
              installedApps.value.splice(index, 1)
            }
            app.action.type = ''
            throw new Error(message)
          })
          .finally(() => {
            if (installationBatch.value.inProcess) {
              installationBatch.value.doneCount++

              if (
                installationBatch.value.totalCount ===
                installationBatch.value.doneCount
              ) {
                installationBatch.value.totalCount = 0
                installationBatch.value.doneCount = 0
                installationBatch.value.inProcess = false
              }
            }

            app.action.type = ''
            app.action.progress = 0
          })
      case 'delete':
        appNotif.value({
          message: `Deleting ${app?.currentVersion?.name || 'app'}...`
        })

        let deleteCategoryName
        if (isInstalledApp(app)) {
          const parts = app.path.split('/').filter(Boolean)
          deleteCategoryName = parts[parts.length - 2]
          app.alias = parts[parts.length - 1].split('.')[0]
        } else {
          deleteCategoryName = categories.value.find(
            (e) => e.id === app.categoryId
          )!.name
        }

        return await flipper.value
          .deleteApp({
            callback: (progress) => {
              appNotif.value({
                caption: `${progress * 100}%`
              })
            },
            categoryName: deleteCategoryName,
            app
          })
          .then(() => {
            findAndRemoveApp(
              [updatableApps.value, upToDateApps.value, unsupportedApps.value],
              app
            )

            appNotif.value({
              icon: 'done',
              color: 'positive',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              message: `${app.currentVersion?.name || 'App'} deleted!`,
              timeout: 500 // we will timeout it in 0.5s
            })
          })
          .catch((error: Error) => {
            const message = `${
              app.currentVersion?.name || 'App'
            } wasn't deleted${
              !flipper.value ||
              flipper.value.name !== flipperCurrentlyParticipating
                ? ` because ${flipperCurrentlyParticipating} was not found`
                : error.message
                ? ' because ' + error.message
                : ''
            }!`

            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [{ icon: 'close', color: 'white', class: 'q-px-sm' }],
              message,
              caption: ''
            })

            throw new Error(message)
          })
          .finally(() => {
            app.action.type = ''
            app.action.progress = 0
          })
    }
  }

  return {
    flags,
    dialogs,
    onClearInstalledAppsList,
    getInstalledApps,
    getButtonState,
    progressColors,
    flipperInstalledApps,
    updatableApps,
    upToDateApps,
    unsupportedApps,
    appsUpdateCount,
    loadingInstalledApps,
    noApplicationsInstalled,
    onAction,
    actionAppList,
    installationBatch,
    batch,
    batchUpdate
  }
})
