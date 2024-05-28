import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Platform } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { fetchAppsVersions, fetchAppFap, fetchPostAppsShort, fetchAppsShort, fetchCategories } from 'util/fetch'
import asyncSleep from 'simple-async-sleep'
import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'
import useSetProperty from 'composables/useSetProperty'
import { rpcErrorHandler } from 'composables/useRpcUtils'
import promiseQueue from 'composables/usePromiseQueue'
const { getProcess, addToQueue } = promiseQueue()
import { axios } from 'boot/axios'

import { useMainStore } from 'stores/global/main'

const componentName = 'Apps'

export const useAppsStore = defineStore('apps', () => {
  const mainStore = useMainStore()
  const mainFlags = computed(() => mainStore.flags)
  const flipper = computed(() => mainStore.flipper)
  const info = computed(() => mainStore.info)

  const router = useRouter()
  const route = useRoute()

  const flags = ref({
    restarting: false,
    rpcActive: false,
    rpcToggling: false,
    installedPage: false,
    outdatedFirmwareDialogPersistent: false,
    outdatedFirmwareDialog: false,
    outdatedAppDialog: false,
    connectFlipperDialog: false,
    updatableAppsCount: 0,
    batchUpdate: false,
    mobileAppDialog: false,
    fetchEnd: false,
    loadingCategories: true,
    loadingInitial: true,
    loadingInstalledApps: true,
    noApplicationsInstalled: false
  })

  const flipperReady = computed(() => mainFlags.value.rpcActive && info.value !== null && info.value.doneReading)

  const api = computed(() => `${info.value.firmware.api.major}.${info.value.firmware.api.minor}`)
  const target = computed(() => `f${info.value.firmware.target}`)

  const actionColors = (app) => {
    switch (app.action.type) {
      case 'delete':
        return {
          bar: 'negative',
          track: 'deep-orange-5'
        }
      case 'install':
        return {
          bar: 'primary',
          track: 'orange-6'
        }
      default:
        return {
          bar: 'positive',
          track: 'green-6'
        }
    }
  }
  const onAction = async (app, value) => {
    mainFlags.value.disableButtonMultiflipper = true
    const actionType = value === 'Installed' ? '' : value.toLowerCase()
    if (Platform.is.mobile) {
      flags.value.mobileAppDialog = true
      return
    }
    if (!('serial' in navigator)) {
      mainStore.toggleFlag('serialUnsupportedDialog', true)
      return
    }
    if (!mainFlags.value.connected) {
      flags.value.connectFlipperDialog = true
      return
    }

    app.action.type = actionType
    app.action.progress = 0
    app.action.id = app.id

    const action = async (app, actionType) => {
      await handleAction(app, actionType)

      return Promise.resolve()
    }

    await addToQueue(action, [app, actionType])
    if (getProcess() === false) {
      mainFlags.value.disableButtonMultiflipper = false
    }
  }
  const appNotif = ref(null)
  const handleAction = async (app, actionType) => {
    if (!info.value.storage.sdcard.status.isInstalled) {
      app.action.type = actionType
      mainStore.toggleFlag('microSDcardMissingDialog', true)
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

    switch (app.action.type) {
      case 'install':
        appNotif.value({
          message: `Installing ${app?.currentVersion?.name || 'app'}...`
        })
        return installApp(app)
          .catch(error => {
            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [
                { icon: 'close', color: 'white', class: 'q-px-sm' }
              ],
              message: `${app.currentVersion?.name || 'App'} didn't install!`,
              caption: ''
            })

            updateInstalledApps([app])

            throw error
          })
      case 'update':
        appNotif.value({
          message: `Uploading ${app?.currentVersion?.name || 'app'}...`
        })
        return updateApp(app)
          .catch(error => {
            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [
                { icon: 'close', color: 'white', class: 'q-px-sm' }
              ],
              message: `${app.currentVersion?.name || 'App'} didn't update!`,
              caption: ''
            })

            updateInstalledApps([app])

            throw error
          })
      case 'delete':
        appNotif.value({
          message: `Deleting ${app?.currentVersion?.name || 'app'}...`
        })
        return deleteApp(app)
          .catch(error => {
            appNotif.value({
              icon: 'error_outline',
              color: 'negative',
              spinner: false, // we reset the spinner setting so the icon can be displayed
              actions: [
                { icon: 'close', color: 'white', class: 'q-px-sm' }
              ],
              message: `${app.currentVersion?.name || 'App'} wasn't deleted!`,
              caption: ''
            })

            updateInstalledApps([app])

            throw error
          })
    }
  }
  const actionButton = (app) => {
    if (!sdk.value.api) {
      return { text: 'Install', class: 'bg-primary' }
    }
    if (app.isInstalled && app.installedVersion) {
      if (app.installedVersion.api !== sdk.value.api) {
        if (app.currentVersion.status === 'READY') {
          return { text: 'Update', class: 'bg-positive' }
        }
        return { text: 'Installed', class: 'bg-grey-6', disabled: true }
      } else {
        if (app.installedVersion.isOutdated) {
          return { text: 'Update', class: 'bg-positive' }
        } else {
          return { text: 'Installed', class: 'bg-grey-6', disabled: true }
        }
      }
    }
    return {
      text: 'Install',
      class: 'bg-primary'
    }
  }

  const batch = ref({
    totalCount: 0,
    doneCount: 0,
    failed: [],
    action: {
      type: '',
      progress: 0
    }
  })
  const batchUpdate = async (apps) => {
    flags.value.batchUpdate = true
    batch.value.totalCount = apps.length
    batch.value.doneCount = 0

    batch.value.action.type = 'update'

    for (const app of apps) {
      try {
        app.action.type = 'update'
        onAction(app, 'update')
      } catch (error) {
        console.error(error)
        batch.value.failed.push(app)
      }
    }
  }

  const sdk = ref({
    target: null,
    api: null
  })
  const setPropertySdk = (options) => {
    sdk.value = useSetProperty(sdk.value, options)
  }

  const installedApps = ref([])
  const setInstalledApps = (newInstalledApps) => {
    installedApps.value = newInstalledApps
  }
  const onClearInstalledAppsList = () => {
    installedApps.value = []
    flags.value.updatableAppsCount = 0
  }
  const getInstalledApps = async () => {
    if (!installedApps.value.length) {
      flags.value.loadingInstalledApps = true
    }
    try {
      let installed = []
      if (flipperReady.value) {
        const manifestsList = await flipper.value.RPC('storageList', { path: '/ext/apps_manifests' })
          .catch(error => rpcErrorHandler(componentName, error, 'storageList'))
        const decoder = new TextDecoder()
        for await (const file of manifestsList) {
          const manifestFile = await flipper.value.RPC('storageRead', { path: `/ext/apps_manifests/${file.name}` })
            .catch(error => rpcErrorHandler(componentName, error, 'storageRead'))
          const manifest = decoder.decode(manifestFile)
          const app = {
            id: '',
            name: '',
            icon: '',
            installedVersion: {
              id: '',
              api: ''
            },
            path: ''
          }
          for await (const line of manifest.replaceAll('\r', '').split('\n')) {
            const key = line.slice(0, line.indexOf(': '))
            const value = line.slice(line.indexOf(': ') + 2)
            switch (key) {
              case 'UID':
                app.id = value
                break
              case 'Full Name':
                app.name = value
                break
              case 'Icon':
                app.icon = value
                break
              case 'Version UID':
                app.installedVersion.id = value
                break
              case 'Version Build API':
                app.installedVersion.api = value
                break
              case 'Path':
                app.path = value
                break
              case 'DevCatalog':
                app.devCatalog = value
            }
          }
          installed.push(app)
        }
      }

      const versions = await fetchAppsVersions(installed.map(app => app.installedVersion.id))
      for (const version of versions) {
        const app = installed.find(app => app.id === version.applicationId)
        if (app) {
          app.installedVersion = { ...app.installedVersion, ...version }
        }
      }

      const params = {
        limit: 500,
        is_latest_release_version: true
      }

      if (flipperReady.value) {
        params.api = api.value
        params.target = target.value
        delete params.is_latest_release_version
      }

      // NOTE: Actual — latest compatible
      let actualApps = []
      do {
        actualApps = await fetchPostAppsShort({
          ...params,
          applications: installed.map(app => app.id)
        })
      } while (actualApps.length === params.limit)

      if (!installed.length) {
        flags.value.noApplicationsInstalled = true
        flags.value.loadingInstalledApps = false
        return
      } else {
        flags.value.noApplicationsInstalled = false
      }

      installed = installed.filter(installedApp => {
        if (installedApp.devCatalog && mainFlags.value.catalogChannelProduction) {
          return false
        }

        return true
      })

      // HACK: Bind the past action state to the new list
      installed = installed.map(installedApp => {
        const lastInstalledApp = installedApps.value.find(actualApp => actualApp.id === installedApp.id)

        installedApp.isInstalled = true

        if (lastInstalledApp) {
          installedApp.action = lastInstalledApp.action
        }

        return installedApp
      })

      const updatableApps = installed.filter(installedApp => {
        const app = actualApps.find(actualApp => actualApp.id === installedApp.id)

        if (app) {
          if (!installedApp.action) {
            installedApp.action = app.action
          }
          installedApp.categoryId = app.categoryId
          installedApp.currentVersion = app.currentVersion
          installedApp.alias = app.alias

          if (sdk.value.api && installedApp.installedVersion.api !== sdk.value.api) {
            installedApp.updatable = true
            return true
          }
          if (app.currentVersion.id !== installedApp.installedVersion.id) {
            installedApp.updatable = true
            return true
          }
        }
        installedApp.updatable = false
        return false
      })

      flags.value.updatableAppsCount = updatableApps.length

      const upToDateApps = installed.filter(installedApp => {
        const app = actualApps.find(actualApp => actualApp.id === installedApp.id)

        if (app) {
          if (sdk.value.api && installedApp.installedVersion.api !== sdk.value.api) {
            installedApp.isActualized = false
            return false
          }

          if (app.currentVersion.id === installedApp.installedVersion.id && app.currentVersion.status === 'READY') {
            installedApp.isActualized = true
            return true
          }
        }
        installedApp.isActualized = false
        return false
      })

      const unsupportedApps = installed.filter(installedApp => {
        if (!installedApp.action) {
          installedApp.action = {
            type: '',
            progress: 0,
            id: installedApp.id
          }
        }
        if (!actualApps.find(app => app.id === installedApp.id)) {
          installedApp.unsupported = true
          return true
        }
        installedApp.unsupported = false
        return false
      })

      setInstalledApps([...updatableApps, ...upToDateApps, ...unsupportedApps])

      updateInstalledApps()
      if (flags.value.batchUpdate) {
        batch.value.doneCount++

        if (batch.value.totalCount === batch.value.doneCount) {
          console.log('flags.value.batchUpdate 1', flags.value.batchUpdate)
          batch.value.totalCount = 0
          batch.value.doneCount = 0
          flags.value.batchUpdate = false
          console.log('flags.value.batchUpdate 2', flags.value.batchUpdate)
        }
      }
      flags.value.loadingInstalledApps = false
    } catch {
      flags.value.loadingInstalledApps = false
    }
  }
  const updateInstalledApps = (newApps) => {
    if (!newApps) {
      if (!apps.value.length) {
        newApps = [currentApp.value]
      } else {
        newApps = apps.value
      }
    }
    for (const app of newApps) {
      // console.log(installedApps.value.find(e => e.id === app.id))
      const installed = installedApps.value.find(e => e.id === app.id)
      if (installed) {
        app.isInstalled = true
        app.installedVersion = installed.installedVersion
        app.action = installed.action
        app.actionButton = actionButton(installed)

        app.installedVersion.isOutdated = app.currentVersion.id !== app.installedVersion.id
      } else {
        app.isInstalled = false
        app.installedVersion = null

        app.action = {
          id: app.id,
          progress: 0,
          type: ''
        }
        app.actionButton = actionButton(app)
      }

      if (currentApp.value && app.id === currentApp.value.id) {
        const newCurrentApp = currentApp.value
        newCurrentApp.isInstalled = app.isInstalled
        newCurrentApp.installedVersion = app.installedVersion
        newCurrentApp.action = app.action
        newCurrentApp.actionButton = app.actionButton

        setCurrentApp(newCurrentApp)
      }
    }
  }

  const openApp = async (app) => {
    router.push({ name: 'AppsPath', params: { path: app.alias } })
  }
  const updateApp = async (app) => {
    return installApp(app)
      .catch(error => error)
  }

  const installApp = async (app) => {
    const paths = {
      appDir: `/ext/apps/${categories.value.find(e => e.id === app.categoryId).name}`,
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
      showNotif({
        message: error.toString(),
        color: 'negative'
      })
      log({
        level: 'error',
        message: `${componentName}: Installing app '${app.name}' (${app.alias}): ${error}`
      })

      throw error
    })
    if (!fap) {
      app.action.type = ''
      batch.value.progress = 0
      app.action.progress = 0
      return
    }
    app.action.progress = 0.33
    if (app.action.type === 'update') {
      batch.value.progress = 0.33
    }
    appNotif.value({
      caption: '33%'
    })
    await asyncSleep(300)
    log({
      level: 'debug',
      message: `${componentName}: Installing app '${app.name}' (${app.alias}): fetched .fap`
    })

    // generate manifest
    async function urlContentToDataUri (url) {
      return await axios.get(url, { responseType: 'blob' })
        .then(({ data }) => new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = function () { resolve(this.result) }
          reader.readAsDataURL(data)
        }))
        .catch((error) => {
          throw error
        })
    }
    const dataUri = await urlContentToDataUri(app.currentVersion.iconUri)
    const base64Icon = dataUri.split(',')[1]
    let manifestText = `Filetype: Flipper Application Installation Manifest\nVersion: 1\nFull Name: ${app.currentVersion.name}\nIcon: ${base64Icon}\nVersion Build API: ${info.value.firmware.api.major}.${info.value.firmware.api.minor}\nUID: ${app.id}\nVersion UID: ${app.currentVersion.id}\nPath: ${paths.appDir}/${app.alias}.fap`
    if (!mainFlags.value.catalogChannelProduction) {
      manifestText = manifestText + '\nDevCatalog: true'
    }
    const manifestFile = new TextEncoder().encode(manifestText)
    app.action.progress = 0.45
    if (app.action.type === 'update') {
      batch.value.progress = 0.45
    }
    appNotif.value({
      caption: '45%'
    })
    await asyncSleep(300)

    // upload manifest to temp
    await flipper.value.RPC('storageWrite', { path: `${paths.tempDir}/${app.id}.fim`, buffer: manifestFile })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.name}' (${app.alias}): uploaded manifest (temp)`
        })
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageWrite')

        throw error
      })
    app.action.progress = 0.5
    if (app.action.type === 'update') {
      batch.value.progress = 0.5
    }
    await asyncSleep(300)

    // upload fap to temp
    await flipper.value.RPC('storageWrite', { path: `${paths.tempDir}/${app.id}.fap`, buffer: fap })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.name}' (${app.alias}): uploaded .fap (temp)`
        })
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageWrite')

        throw error
      })
    app.action.progress = 0.75
    if (app.action.type === 'update') {
      batch.value.progress = 0.75
    }
    appNotif.value({
      caption: '75%'
    })
    await asyncSleep(300)

    // move manifest and fap
    let dirList = await flipper.value.RPC('storageList', { path: paths.manifestDir })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageList')

        throw error
      })
    const oldManifest = dirList.find(e => e.name === `${app.alias}.fim`)
    if (oldManifest) {
      await flipper.value.RPC('storageRemove', { path: `${paths.manifestDir}/${app.alias}.fim` })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Installing app '${app.name}' (${app.alias}): removed old manifest`
          })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'storageRemove')

          throw error
        })
    }

    await flipper.value.RPC('storageRename', { oldPath: `${paths.tempDir}/${app.id}.fim`, newPath: `${paths.manifestDir}/${app.alias}.fim` })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.name}' (${app.alias}): moved new manifest`
        })
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageRename')

        throw error
      })
    app.action.progress = 0.8
    if (app.action.type === 'update') {
      batch.value.progress = 0.8
    }
    appNotif.value({
      caption: '80%'
    })
    await asyncSleep(300)

    dirList = await flipper.value.RPC('storageList', { path: paths.appDir })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageList')

        throw error
      })
    const oldFap = dirList.find(e => e.name === `${app.alias}.fap`)
    if (oldFap) {
      await flipper.value.RPC('storageRemove', { path: `${paths.appDir}/${app.alias}.fap` })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Installing app '${app.name}' (${app.alias}): removed old .fap`
          })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'storageRemove')

          throw error
        })
    }

    await flipper.value.RPC('storageRename', { oldPath: `${paths.tempDir}/${app.id}.fap`, newPath: `${paths.appDir}/${app.alias}.fap` })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.name}' (${app.alias}): moved new .fap`
        })
      })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageRename')

        throw error
      })
    app.action.progress = 1
    if (app.action.type === 'update') {
      batch.value.progress = 1
    }
    appNotif.value({
      caption: '100%'
    })
    await asyncSleep(300)

    // post-install
    await getInstalledApps()

    app.action.type = ''
    app.action.progress = 0
    if (app.action.type === 'update') {
      batch.value.progress = 0
    }
    appNotif.value({
      icon: 'done',
      color: 'positive',
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: `${app.currentVersion?.name || 'App'} ${app.action.type === 'update' ? 'updated' : 'installed'}!`,
      timeout: 500 // we will timeout it in 0.5s
    })
  }

  const deleteApp = async (app) => {
    const paths = {
      appDir: '',
      manifestDir: '/ext/apps_manifests'
    }
    if (app.categoryId) {
      paths.appDir = `/ext/apps/${categories.value.find(e => e.id === app.categoryId).name}`
    } else {
      paths.appDir = app.path.slice(0, app.path.lastIndexOf('/'))
      app.alias = app.path.slice(app.path.lastIndexOf('/') + 1, -4)
    }

    await ensureCategoryPaths()

    // remove .fap
    let dirList = await flipper.value.RPC('storageList', { path: paths.appDir })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageList')

        throw error
      })
    const fap = dirList.find(e => e.name === `${app.alias}.fap`)
    if (fap) {
      await flipper.value.RPC('storageRemove', { path: `${paths.appDir}/${app.alias}.fap` })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Deleting app '${app.name}' (${app.alias}): removed .fap`
          })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'storageRemove')

          throw error
        })
    }
    app.action.progress = 0.5
    appNotif.value({
      caption: '50%'
    })

    // remove manifest
    dirList = await flipper.value.RPC('storageList', { path: paths.manifestDir })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageList')

        throw error
      })
    const manifest = dirList.find(e => e.name === `${app.alias}.fim`)
    if (manifest) {
      await flipper.value.RPC('storageRemove', { path: `${paths.manifestDir}/${app.alias}.fim` })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Deleting app '${app.name}' (${app.alias}): removed manifest`
          })
        })
        .catch(error => {
          rpcErrorHandler(componentName, error, 'storageRemove')

          throw error
        })
    }
    app.action.progress = 1
    appNotif.value({
      caption: '100%'
    })

    // post-delete
    await getInstalledApps()

    app.action.type = ''
    app.action.progress = 0
    appNotif.value({
      icon: 'done',
      color: 'positive',
      spinner: false, // we reset the spinner setting so the icon can be displayed
      message: `${app.currentVersion?.name || 'App'} deleted!`,
      timeout: 500 // we will timeout it in 0.5s
    })
  }

  const currentApp = ref(null)
  const setCurrentApp = (app) => {
    currentApp.value = app
  }

  const apps = ref([])
  const setApps = (newApps) => {
    apps.value = newApps
  }
  const onClearAppsList = () => {
    apps.value = []
  }
  const defaultParamsAppsShort = {
    limit: 48,
    is_latest_release_version: true
  }
  const getAppsShort = async (options = {}) => {
    flags.value.loadingInitial = true

    const params = {
      ...defaultParamsAppsShort,
      ...options
    }

    if (initialCategory.value) {
      params.category_id = initialCategory.value.id
    }

    if (flipperReady.value) {
      params.api = api.value
      params.target = target.value
      delete params.is_latest_release_version
    }

    let newApps = []
    if (!flags.value.fetchEnd) {
      await fetchAppsShort(params).then((res) => {
        if (!res) {
          flags.value.fetchEnd = true
          return
        }
        newApps = res

        if (!newApps.length) {
          flags.value.fetchEnd = true
        } else {
          if (params.offset === 0) {
            setApps(newApps)
          } else {
            setApps(apps.value.concat(newApps))
          }
        }

        if (apps.value.length && !flipperReady.value) {
          apps.value = apps.value.map(app => {
            app.actionButton = actionButton(app)
            return app
          })
        }

        if (flipperReady.value && installedApps.value.length) {
          updateInstalledApps(newApps)
        }

        if (newApps.length < params.limit) {
          flags.value.fetchEnd = true
        }

        flags.value.loadingInitial = false
      }).catch(() => {
        flags.value.loadingInitial = false
        flags.value.fetchEnd = true
        showNotif({
          message: 'Unable to load applications.',
          color: 'negative',
          actions: [{ label: 'Reload', color: 'white', handler: () => { location.reload() } }]
        })
      })
    } else {
      flags.value.loadingInitial = false
    }
  }

  const initialCategory = ref(null)
  const setInitialCategory = (category) => {
    initialCategory.value = category
  }
  const getCategories = async () => {
    flags.value.loadingCategories = true

    const categoryParams = {
      limit: 500
    }

    if (flipperReady.value) {
      categoryParams.api = api.value
      categoryParams.target = target.value
    }

    await fetchCategories(categoryParams)
      .then((data) => {
        setCategories(data)
      })
      .catch((error) => {
        showNotif({
          message: 'Unable to load categories.',
          color: 'negative',
          actions: [{ label: 'Reload', color: 'white', handler: () => { location.reload() } }]
        })

        throw error
      })

    const path = route.params.path
    if (path) {
      const normalize = (string) => string.toLowerCase().replaceAll(' ', '-')

      const category = categories.value.find(e => normalize(e.name) === normalize(path))
      if (category) {
        setInitialCategory(category)
      }
    }

    flags.value.loadingCategories = false
  }

  const categories = ref([])
  const setCategories = (newCategories) => {
    categories.value = newCategories
  }
  const setCategory = (name) => {
    const category = categories.value.find(e => e.name === name)
    let prefix = ''
    if (!location.pathname.startsWith('/apps/')) {
      prefix = 'apps/'
    }
    router.push(prefix + encodeURIComponent(category.name.toLowerCase().replaceAll(' ', '-')))
  }
  const ensureCategoryPaths = async () => {
    for (const category of categories.value) {
      const dir = await flipper.value.RPC('storageStat', { path: `/ext/apps/${category.name}` })
        .catch(error => rpcErrorHandler(componentName, error, 'storageStat'))
      if (!dir) {
        await flipper.value.RPC('storageMkdir', { path: `/ext/apps/${category.name}` })
          .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
      }
    }
  }

  return {
    flags,
    flipperReady,

    actionColors,
    handleAction,
    onAction,
    actionButton,

    batch,
    batchUpdate,

    sdk,
    setPropertySdk,

    installedApps,
    setInstalledApps,
    onClearInstalledAppsList,
    getInstalledApps,
    updateInstalledApps,

    openApp,

    currentApp,
    setCurrentApp,

    apps,
    setApps,
    onClearAppsList,
    defaultParamsAppsShort,
    getAppsShort,

    initialCategory,
    setInitialCategory,

    categories,
    setCategory,
    setCategories,
    getCategories
  }
})
