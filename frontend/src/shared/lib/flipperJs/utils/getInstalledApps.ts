import Flipper from '../flipper'
import { FlipperModel } from 'entities/Flipper'

import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

const componentName = 'FlipperJS Util getInstalled'

let installedApps: FlipperModel.App[] = []

const onClearInstalledAppsList = () => {
  installedApps = []
}

async function getInstalledApps(this: Flipper) {
  if (this.flipperReady) {
    const manifestsList = await this.RPC('storageList', {
      path: '/ext/apps_manifests'
    }).catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageList' })
    )
    const decoder = new TextDecoder()
    for await (const file of manifestsList) {
      const manifestFile = await this.RPC('storageRead', {
        path: `/ext/apps_manifests/${file.name}`
      }).catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageRead' })
      )
      const manifest = decoder.decode(manifestFile)
      const app: FlipperModel.App = {
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
      installedApps.push(app)
    }

    return installedApps
  }

  return []
}

export { onClearInstalledAppsList, getInstalledApps }
