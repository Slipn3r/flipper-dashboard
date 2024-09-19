import Flipper from '../flipper'
import { FlipperModel } from 'entities/Flipper'
import { AppsModel, AppsApi } from 'entities/Apps'

import { instance } from 'boot/axios'

import type { ActionAppOptions, InstallAppOptions } from '../types'

import { log } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

const componentName = 'FlipperJS Utils AppActions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isInstalledApp = (obj: any): obj is AppsModel.InstalledApp => {
  return 'installedVersion' in obj
}

async function installApp(
  this: Flipper,
  {
    callback,
    app,
    categoryName,
    catalogChannelProduction = true
  }: InstallAppOptions
): Promise<void> {
  const paths = {
    appDir: `${this.config.appDir}/${categoryName}`,
    manifestDir: this.config.manifestDir,
    tempDir: `${this.config.tempDir}/lab`
  }

  return new Promise(async (resolve, reject) => {
    // fetch fap
    const fap = await AppsApi.fetchAppFap({
      versionId: app.currentVersion.id,
      target: `f${this.info?.firmware.target}`,
      api: `${this.info?.firmware.api.major}.${this.info?.firmware.api.minor}`
    }).catch((error: Error) => {
      log({
        level: 'error',
        message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): ${error}`
      })

      reject(error)
      throw error
    })
    if (!fap) {
      app.action.type = ''
      app.action.progress = 0
      return
    }

    app.action.progress = 0.33
    callback(0.33)
    log({
      level: 'debug',
      message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): fetched .fap`
    })

    // generate manifest
    let manifestFile = null
    async function urlContentToDataUri(url: string) {
      return await instance
        .get(url, { responseType: 'blob' })
        .then(
          ({ data }: { data: Blob }) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = function () {
                resolve(this.result as string)
              }
              reader.readAsDataURL(data)
            })
        )
        .catch((error) => {
          throw error
        })
    }

    try {
      const dataUri = await urlContentToDataUri(app.currentVersion.iconUri)

      const base64Icon = dataUri.split(',')[1]

      let manifestText = `Filetype: Flipper Application Installation Manifest\nVersion: 1\nFull Name: ${app.currentVersion.name}\nIcon: ${base64Icon}\nVersion Build API: ${this.info?.firmware.api.major}.${this.info?.firmware.api.minor}\nUID: ${app.id}\nVersion UID: ${app.currentVersion.id}\nPath: ${paths.appDir}/${app.alias}.fap`
      if (!catalogChannelProduction) {
        manifestText = manifestText + '\nDevCatalog: true'
      }
      manifestFile = new TextEncoder().encode(manifestText)
      app.action.progress = 0.45
      callback(0.45)
    } catch (error) {
      reject(error)
      throw error
    }

    // upload manifest to temp
    await this?.RPC('storageWrite', {
      path: `${paths.tempDir}/${app.id}.fim`,
      buffer: manifestFile
    })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): uploaded manifest (temp)`
        })
      })
      .catch((error: Error) => {
        rpcErrorHandler({ componentName, error, command: 'storageWrite' })

        reject(error)
        throw error
      })
    app.action.progress = 0.5

    // upload fap to temp
    await this?.RPC('storageWrite', {
      path: `${paths.tempDir}/${app.id}.fap`,
      buffer: fap
    })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): uploaded .fap (temp)`
        })
      })
      .catch((error: Error) => {
        rpcErrorHandler({ componentName, error, command: 'storageWrite' })

        reject(error)
        throw error
      })
    app.action.progress = 0.75
    callback(0.75)

    // move manifest and fap
    let dirList = null
    dirList = await this.RPC('storageList', {
      path: paths.manifestDir
    }).catch((error: Error) => {
      rpcErrorHandler({
        componentName,
        error,
        command: `storageList ${paths.manifestDir}`
      })

      reject(error)
      throw error
    })
    const oldManifest = dirList?.find(
      (e: FlipperModel.File) => e.name === `${app.alias}.fim`
    )
    if (oldManifest) {
      const pathOfFim = `${paths.manifestDir}/${app.alias}.fim`
      await this.RPC('storageRemove', {
        path: pathOfFim
      })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): removed old manifest`
          })
        })
        .catch((error: Error) => {
          rpcErrorHandler({
            componentName,
            error,
            command: `storageRemove ${pathOfFim}`
          })

          reject(error)
          throw error
        })
    }

    const pathOfOldFim = `${paths.tempDir}/${app.id}.fim`
    const pathOfNewFim = `${paths.manifestDir}/${app.alias}.fim`
    await this.RPC('storageRename', {
      oldPath: pathOfOldFim,
      newPath: pathOfNewFim
    })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): moved new manifest`
        })
      })
      .catch((error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: `storageRename ${pathOfOldFim} to ${pathOfNewFim}`
        })

        reject(error)
        throw error
      })
    app.action.progress = 0.8
    callback(0.8)

    dirList = await this.RPC('storageList', { path: paths.appDir }).catch(
      (error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: `storageList ${paths.appDir}`
        })

        reject(error)
        throw error
      }
    )
    const oldFap = dirList.find(
      (e: FlipperModel.File) => e.name === `${app.alias}.fap`
    )
    if (oldFap) {
      const pathOfOldFap = `${paths.appDir}/${app.alias}.fap`
      await this.RPC('storageRemove', {
        path: pathOfOldFap
      })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): removed old .fap`
          })
        })
        .catch((error: Error) => {
          rpcErrorHandler({
            componentName,
            error,
            command: `storageRemove ${pathOfOldFap}`
          })

          reject(error)
          throw error
        })
    }

    const pathOfOldFap = `${paths.tempDir}/${app.id}.fap`
    const pathOfNewFap = `${paths.appDir}/${app.alias}.fap`
    await this.RPC('storageRename', {
      oldPath: pathOfOldFap,
      newPath: pathOfNewFap
    })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: Installing app '${app.currentVersion.name}' (${app.alias}): moved new .fap`
        })
      })
      .catch((error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: `storageRename ${pathOfOldFap} to ${pathOfNewFap}`
        })

        reject(error)
        throw error
      })
    app.action.progress = 1
    callback(1)

    await this.RPC('systemPing', { timeout: 1000 }).catch((error: Error) => {
      reject(error)
      throw error
    })

    resolve()
  })
}

async function deleteApp(
  this: Flipper,
  { callback, categoryName, app }: ActionAppOptions
): Promise<void> {
  let appName: string
  if (isInstalledApp(app)) {
    appName = app.name
  } else {
    appName = app.currentVersion.name
  }

  const paths = {
    appDir: `${this.config.appDir}/${categoryName}`,
    manifestDir: this.config.manifestDir
  }

  // remove .fap
  return new Promise(async (resolve, reject) => {
    let dirList = null
    dirList = await this.RPC('storageList', { path: paths.appDir }).catch(
      (error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: `storageList ${paths.appDir}`
        })

        reject(error)
        throw error
      }
    )
    const fap = dirList.find(
      (e: FlipperModel.File) => e.name === `${app.alias}.fap`
    )
    if (fap) {
      const pathOfFap = `${paths.appDir}/${app.alias}.fap`
      await this.RPC('storageRemove', {
        path: pathOfFap
      })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Deleting app '${appName}' (${app.alias}): removed .fap`
          })
        })
        .catch((error: Error) => {
          rpcErrorHandler({
            componentName,
            error,
            command: `storageRemove ${pathOfFap}`
          })

          reject(error)
          throw error
        })
    }
    app.action.progress = 0.5
    callback(0.5)

    // remove manifest
    dirList = await this.RPC('storageList', {
      path: paths.manifestDir
    }).catch((error: Error) => {
      rpcErrorHandler({ componentName, error, command: 'storageList' })

      reject(error)
      throw error
    })
    const manifest = dirList.find(
      (e: FlipperModel.File) => e.name === `${app.alias}.fim`
    )
    if (manifest) {
      await this.RPC('storageRemove', {
        path: `${paths.manifestDir}/${app.alias}.fim`
      })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName}: Deleting app '${appName}' (${app.alias}): removed manifest`
          })
        })
        .catch((error: Error) => {
          rpcErrorHandler({ componentName, error, command: 'storageRemove' })

          reject(error)
          throw error
        })
    }
    app.action.progress = 1
    callback(1)

    await this.RPC('systemPing', { timeout: 1000 }).catch((error: Error) => {
      reject(error)
      throw error
    })

    resolve()
  })
}

export { installApp, deleteApp }
