import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import asyncSleep from 'simple-async-sleep'
import { FlipperModel } from 'entities/Flipper'
import { CategoryModel } from 'entities/Category'
import { addToQueue, getFlipperCurrentlyParticipating } from 'shared/lib/utils/usePromiseQueue'
import { instance } from 'boot/axios'
import { App, InstalledApp, AppsPostShortParams, ActionType } from './types'
import { api } from '../api'
const { fetchAppsVersions, fetchPostAppsShort, fetchAppFap } = api

export const useAppStore = defineStore('apps', () => {
  const flipperStore = FlipperModel.useFlipperStore()
  // const { flipper, info, flipperReady } = flipperStore
  const flipper = computed(() => flipperStore.flipper)
  const info = computed(() => flipperStore.info)
  const api = computed(() => flipperStore.api)
  const target = computed(() => flipperStore.target)
  const flipperReady = computed(() => flipperStore.flipperReady)

  const categoryStore = CategoryModel.useCategoriesStore()
  // const { categories } = categoryStore
  const categories = computed(() => categoryStore.categories)

  const flipperInstalledApps = computed(() => flipper.value.installedApps)
  const installedApps = ref<InstalledApp[]>([])
  const updatableApps = ref<InstalledApp[]>([])
  const upToDateApps = ref<InstalledApp[]>([])
  const unsupportedApps = ref<InstalledApp[]>([])
  const appsUpdateCount = ref(0)
  const loadingInstalledApps = ref(false)

  const onClearInstalledAppsList = () => {
    installedApps.value = []
    updatableApps.value = []
    upToDateApps.value = []
    unsupportedApps.value = []
    appsUpdateCount.value = 0
  }
  const getInstalledApps = async ({
    refreshInstalledApps = false
  } = {}) => {
    if (!installedApps.value.length) {
      loadingInstalledApps.value = true
    }

    if (refreshInstalledApps) {
      // onClearInstalledAppsList()
      await flipper.value.getInstalledApps()
    }

    try {
      let installed: InstalledApp[] = installedApps.value = flipperStore.flipper.installedApps

      // if (!installed.length) {
      //   flags.value.noApplicationsInstalled = true
      //   flags.value.loadingInstalledApps = false
      //   return
      // }

      const versions = await fetchAppsVersions(flipperInstalledApps.value.map(app => app.installedVersion.id))
      for (const version of versions) {
        const app = flipperInstalledApps.value.find(app => app.id === version.applicationId)
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
          applications: installed.map(app => app.id)
        })
      } while (actualApps.length === params.limit)

      installed = installed.filter(installedApp => {
        // if (installedApp.devCatalog && mainFlags.value.catalogChannelProduction) {
        if (installedApp.devCatalog) {
          return false
        }

        return true
      })

      // HACK: Bind the past action state to the new list
      if (actionAppList.value.length) {
        installed = installed.map(installedApp => {
          const lastInstalledApp = actionAppList.value.find(actualApp => actualApp.id === installedApp.id)

          if (lastInstalledApp) {
            installedApp.action = lastInstalledApp.action
          }

          return installedApp
        })
      }

      updatableApps.value = installed.filter(installedApp => {
        const app = actualApps.find(actualApp => actualApp.id === installedApp.id)

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

      upToDateApps.value = installed.filter(installedApp => {
        const app = actualApps.find(actualApp => actualApp.id === installedApp.id)

        if (app) {
          if (api.value && installedApp.installedVersion.api !== api.value) {
            // installedApp.isInstalled = false
            return false
          }

          if (app.currentVersion.id === installedApp.installedVersion.id && app.currentVersion.status === 'READY') {
            // installedApp.isInstalled = true
            return true
          }
        }
        // installedApp.isInstalled = false
        return false
      })

      unsupportedApps.value = installed.filter(installedApp => {
        // if (!installedApp.action) {
        //   installedApp.action = {
        //     type: '',
        //     progress: 0,
        //     id: installedApp.id
        //   }
        // }
        if (!actualApps.find(app => app.id === installedApp.id)) {
          // installedApp.unsupported = true
          return true
        }
        // installedApp.unsupported = false
        return false
      })

      if (batch.value.inProcess) {
        batch.value.doneCount++

        if (batch.value.totalCount === batch.value.doneCount) {
          batch.value.totalCount = 0
          batch.value.doneCount = 0
          batch.value.inProcess = false
        }
      }

      loadingInstalledApps.value = false
    } catch {
      loadingInstalledApps.value = false
    }
  }

  const getButtonState = (app: App) => {
    if (updatableApps.value.find(updatableApp => updatableApp.id === app.id)) {
      return 'update'
    }

    if (upToDateApps.value.find(upToDateApp => upToDateApp.id === app.id)) {
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
  const actionAppList = ref<Array<App | InstalledApp>>([])
  const onAction = async (app: App | InstalledApp, actionType: ActionType) => {
    // TODO: validation check //

    app.action = {
      progress: 0,
      type: actionType
    }

    actionAppList.value.push(app)

    const action = async (app: App | InstalledApp, actionType: ActionType) => {
      await handleAction(app, actionType)
        // .catch(error => {
        //   log({
        //     level: 'error',
        //     message: `${componentName}: ${error.message}`
        //   })
        // })
        if (actionAppList.value.length) {
          let appIndex: number | null = null
          const lastInstalledApp = actionAppList.value.find((actualApp, index) => {
            appIndex = index
            return actualApp.id === app.id
          })

          if (lastInstalledApp) {
            if (appIndex !== null) {
              actionAppList.value.splice(appIndex, 1)

              appIndex = null
            }
          }
        }
      return Promise.resolve()
    }

    await addToQueue({
      fn: action,
      flipperName: flipper.value.name,
      params: [app, actionType]
    })
  }

  const handleAction = async (app: App | InstalledApp, actionType: ActionType) => {
    // if (info?.value.storage.sdcard) {
    //   app.action.type = actionType
    //   mainStore.toggleFlag('microSDcardMissingDialog', true)
    //   setTimeout(() => {
    //     app.action.type = ''
    //   }, 300)
    //   return
    // }
    if (!actionType) {
      return
    }

    // appNotif.value = showNotif({
    //   isStayOpen: true,
    //   group: false, // required to be updatable
    //   timeout: 0, // we want to be in control when it gets dismissed
    //   spinner: true,
    //   message: 'Processing...',
    //   caption: '0%'
    // })

    switch (actionType) {
      case 'install':
        // appNotif.value({
        //   message: `Installing ${app?.currentVersion?.name || 'app'}...`
        // })
        return installApp(app)
          .catch((/* error */) => {
            // const message = `${app.currentVersion?.name || 'App'} didn't install${flipper.value.name !== getFlipperCurrentlyParticipating() ? ' because ' + error.message : ''}!`

            // appNotif.value({
            //   icon: 'error_outline',
            //   color: 'negative',
            //   spinner: false, // we reset the spinner setting so the icon can be displayed
            //   actions: [
            //     { icon: 'close', color: 'white', class: 'q-px-sm' }
            //   ],
            //   message,
            //   caption: ''
            // })

            // const index = installableApps.value.findIndex((e) => e.id === app.id)
            // if (index !== -1) {
            //   installableApps.value.splice(index, 1)
            // }

            // updateInstalledApps([app])

            // throw new Error(message)
          })
      case 'update':
        // appNotif.value({
        //   message: `Uploading ${app?.currentVersion?.name || 'app'}...`
        // })
        return updateApp(app)
          .catch((/* error */) => {
            // const message = `${app.currentVersion?.name || 'App'} didn't update${flipper.value.name !== getFlipperCurrentlyParticipating() ? ' because ' + error.message : ''}!`

            // appNotif.value({
            //   icon: 'error_outline',
            //   color: 'negative',
            //   spinner: false, // we reset the spinner setting so the icon can be displayed
            //   actions: [
            //     { icon: 'close', color: 'white', class: 'q-px-sm' }
            //   ],
            //   message,
            //   caption: ''
            // })

            // updateInstalledApps([app])

            // throw new Error(message)
          })
      case 'delete':
        // appNotif.value({
        //   message: `Deleting ${app?.currentVersion?.name || 'app'}...`
        // })
        return deleteApp(app as InstalledApp)
          .catch((/* error */) => {
            // const message = `${app.currentVersion?.name || 'App'} wasn't deleted${flipper.value.name !== getFlipperCurrentlyParticipating() ? ' because ' + error.message : ''}!`

            // appNotif.value({
            //   icon: 'error_outline',
            //   color: 'negative',
            //   spinner: false, // we reset the spinner setting so the icon can be displayed
            //   actions: [
            //     { icon: 'close', color: 'white', class: 'q-px-sm' }
            //   ],
            //   message,
            //   caption: ''
            // })

            // updateInstalledApps([app])

            // throw new Error(message)
          })
    }
  }

  const ensureCategoryPaths = async () => {
    for (const category of categories.value) {
      const dir = await flipper.value.RPC('storageStat', { path: `/ext/apps/${category.name}` })
        .catch(/* error => rpcErrorHandler(componentName, error, 'storageStat') */)
      if (!dir) {
        await flipper.value.RPC('storageMkdir', { path: `/ext/apps/${category.name}` })
          .catch(/* error => rpcErrorHandler(componentName, error, 'storageMkdir') */)
      }
    }
  }

  const updateApp = async (app: App | InstalledApp) => {
    return installApp(app)
  }

  const installApp = async (app: App | InstalledApp) => {
    const paths = {
      appDir: `/ext/apps/${categories.value.find(e => e.id === app.categoryId)?.name}`,
      manifestDir: '/ext/apps_manifests',
      tempDir: '/ext/.tmp/lab'
    }
    await ensureCategoryPaths()

    // fetch fap
    const fap = await fetchAppFap({
      versionId: app.currentVersion.id,
      target: `f${info.value.firmware.target}`,
      api: `${info.value.firmware.api.major}.${info.value.firmware.api.minor}`
    }).catch(error => {
      // showNotif({
      //   message: error.toString(),
      //   color: 'negative'
      // })
      // log({
      //   level: 'error',
      //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): ${error}`
      // })

      app.action.type = ''
      // batch.value.progress = 0
      app.action.progress = 0

      throw error
    })
    if (!fap) {
      app.action.type = ''
      // batch.value.progress = 0
      app.action.progress = 0
      return
    }

    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      app.action.progress = 0.33
      // if (app.action.type === 'update') {
      //   batch.value.progress = 0.33
      // }
      // appNotif.value({
      //   caption: '33%'
      // })
      await asyncSleep(300)
      // log({
      //   level: 'debug',
      //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): fetched .fap`
      // })
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // generate manifest
    let manifestFile = null
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      async function urlContentToDataUri (url: string) {
        return await instance.get(url, { responseType: 'blob' })
          .then(({ data }: { data: Blob }) => new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = function () { resolve(this.result as string) }
            reader.readAsDataURL(data)
          }))
          .catch((error) => {
            throw error
          })
      }
      const dataUri = await urlContentToDataUri(app.currentVersion.iconUri)
      const base64Icon = dataUri.split(',')[1]
      const manifestText = `Filetype: Flipper Application Installation Manifest\nVersion: 1\nFull Name: ${app.currentVersion.name}\nIcon: ${base64Icon}\nVersion Build API: ${info.value.firmware.api.major}.${info.value.firmware.api.minor}\nUID: ${app.id}\nVersion UID: ${app.currentVersion.id}\nPath: ${paths.appDir}/${app.alias}.fap`
      // if (!mainFlags.value.catalogChannelProduction) {
      //   manifestText = manifestText + '\nDevCatalog: true'
      // }
      manifestFile = new TextEncoder().encode(manifestText)
      app.action.progress = 0.45
      // if (app.action.type === 'update') {
      //   batch.value.progress = 0.45
      // }
      // appNotif.value({
      //   caption: '45%'
      // })
      // await asyncSleep(300)
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // upload manifest to temp
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      await flipper.value.RPC('storageWrite', { path: `${paths.tempDir}/${app.id}.fim`, buffer: manifestFile })
        .then(() => {
          // log({
          //   level: 'debug',
          //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): uploaded manifest (temp)`
          // })
        })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageWrite')

          throw error
        })
      app.action.progress = 0.5
      // if (app.action.type === 'update') {
      //   batch.value.progress = 0.5
      // }
      // await asyncSleep(300)
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // upload fap to temp
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      await flipper.value.RPC('storageWrite', { path: `${paths.tempDir}/${app.id}.fap`, buffer: fap })
        .then(() => {
          // log({
          //   level: 'debug',
          //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): uploaded .fap (temp)`
          // })
        })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageWrite')

          throw error
        })
      app.action.progress = 0.75
      // if (app.action.type === 'update') {
      //   batch.value.progress = 0.75
      // }
      // appNotif.value({
      //   caption: '75%'
      // })
      // await asyncSleep(300)
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // move manifest and fap
    let dirList = null
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      dirList = await flipper.value.RPC('storageList', { path: paths.manifestDir })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageList')

          throw error
        })
      const oldManifest = dirList.find((e: FlipperModel.File) => e.name === `${app.alias}.fim`)
      if (oldManifest) {
        await flipper.value.RPC('storageRemove', { path: `${paths.manifestDir}/${app.alias}.fim` })
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): removed old manifest`
            // })
          })
          .catch((error: ErrorEvent) => {
            // rpcErrorHandler(componentName, error, 'storageRemove')

            throw error
          })
      }

      await flipper.value.RPC('storageRename', { oldPath: `${paths.tempDir}/${app.id}.fim`, newPath: `${paths.manifestDir}/${app.alias}.fim` })
        .then(() => {
          // log({
          //   level: 'debug',
          //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): moved new manifest`
          // })
        })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageRename')

          throw error
        })
      app.action.progress = 0.8
      // if (app.action.type === 'update') {
      //   batch.value.progress = 0.8
      // }
      // appNotif.value({
      //   caption: '80%'
      // })
      // await asyncSleep(300)
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      dirList = await flipper.value.RPC('storageList', { path: paths.appDir })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageList')

          throw error
        })
      const oldFap = dirList.find((e: FlipperModel.File) => e.name === `${app.alias}.fap`)
      if (oldFap) {
        await flipper.value.RPC('storageRemove', { path: `${paths.appDir}/${app.alias}.fap` })
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): removed old .fap`
            // })
          })
          .catch((error: ErrorEvent) => {
            // rpcErrorHandler(componentName, error, 'storageRemove')

            throw error
          })
      }

      await flipper.value.RPC('storageRename', { oldPath: `${paths.tempDir}/${app.id}.fap`, newPath: `${paths.appDir}/${app.alias}.fap` })
        .then(() => {
          // log({
          //   level: 'debug',
          //   message: `${componentName}: Installing app '${app.name}' (${app.alias}): moved new .fap`
          // })
        })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageRename')

          throw error
        })
      app.action.progress = 1
      // if (app.action.type === 'update') {
      //   batch.value.progress = 1
      // }
      // appNotif.value({
      //   caption: '100%'
      // })
      // await asyncSleep(300)
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // post-install
    await getInstalledApps({
      refreshInstalledApps: true
    })

    app.action.type = ''
    app.action.progress = 0
    // if (app.action.type === 'update') {
    //   batch.value.progress = 0
    // }
    // const index = installableApps.value.findIndex((e) => e.id === app.id)
    // if (index !== -1) {
    //   installableApps.value.splice(index, 1)
    // }
    // appNotif.value({
    //   icon: 'done',
    //   color: 'positive',
    //   spinner: false, // we reset the spinner setting so the icon can be displayed
    //   message: `${app.currentVersion?.name || 'App'} ${app.action.type === 'update' ? 'updated' : 'installed'}!`,
    //   timeout: 500 // we will timeout it in 0.5s
    // })
  }

  const deleteApp = async (app: InstalledApp) => {
    const paths = {
      appDir: '',
      manifestDir: '/ext/apps_manifests'
    }
    if (app.categoryId) {
      paths.appDir = `/ext/apps/${categories.value.find(e => e.id === app.categoryId)?.name}`
    } else {
      paths.appDir = app.path.slice(0, app.path.lastIndexOf('/'))
      app.alias = app.path.slice(app.path.lastIndexOf('/') + 1, -4)
    }

    await ensureCategoryPaths()

    // remove .fap
    let dirList = null
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      dirList = await flipper.value.RPC('storageList', { path: paths.appDir })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageList')

          throw error
        })
      const fap = dirList.find((e: FlipperModel.File) => e.name === `${app.alias}.fap`)
      if (fap) {
        await flipper.value.RPC('storageRemove', { path: `${paths.appDir}/${app.alias}.fap` })
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: Deleting app '${app.name}' (${app.alias}): removed .fap`
            // })
          })
          .catch((error: ErrorEvent) => {
            // rpcErrorHandler(componentName, error, 'storageRemove')

            throw error
          })
      }
      app.action.progress = 0.5
      // appNotif.value({
      //   caption: '50%'
      // })
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // remove manifest
    if (flipper.value.name === getFlipperCurrentlyParticipating()) {
      dirList = await flipper.value.RPC('storageList', { path: paths.manifestDir })
        .catch((error: ErrorEvent) => {
          // rpcErrorHandler(componentName, error, 'storageList')

          throw error
        })
      const manifest = dirList.find((e: FlipperModel.File) => e.name === `${app.alias}.fim`)
      if (manifest) {
        await flipper.value.RPC('storageRemove', { path: `${paths.manifestDir}/${app.alias}.fim` })
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: Deleting app '${app.name}' (${app.alias}): removed manifest`
            // })
          })
          .catch((error: ErrorEvent) => {
            // rpcErrorHandler(componentName, error, 'storageRemove')

            throw error
          })
      }
      app.action.progress = 1
      // appNotif.value({
      //   caption: '100%'
      // })
    } else {
      throw new Error(`Flipper ${getFlipperCurrentlyParticipating()} was not found`)
    }

    // post-delete
    await getInstalledApps({
      refreshInstalledApps: true
    })

    app.action.type = ''
    app.action.progress = 0
    // appNotif.value({
    //   icon: 'done',
    //   color: 'positive',
    //   spinner: false, // we reset the spinner setting so the icon can be displayed
    //   message: `${app.currentVersion?.name || 'App'} deleted!`,
    //   timeout: 500 // we will timeout it in 0.5s
    // })
  }

  return {
    onClearInstalledAppsList,
    getInstalledApps,
    getButtonState,
    progressColors,
    updatableApps,
    upToDateApps,
    unsupportedApps,
    appsUpdateCount,
    loadingInstalledApps,
    onAction,
    actionAppList,
    batch,
    batchUpdate
  }
})
