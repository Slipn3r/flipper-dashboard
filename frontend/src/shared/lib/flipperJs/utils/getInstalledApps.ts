import Flipper from '../flipper'
import { FlipperModel } from 'entities/Flipper'

let installedApps: FlipperModel.App[] = []

const onClearInstalledAppsList = () => {
  installedApps = []
}

async function getInstalledApps(this: Flipper) {
  if (this.flipperReady) {
    const manifestsList = await this.RPC('storageList', {
      path: '/ext/apps_manifests'
    })
    // .catch(error => rpcErrorHandler(componentName, error, 'storageList'))
    const decoder = new TextDecoder()
    for await (const file of manifestsList) {
      const manifestFile = await this.RPC('storageRead', {
        path: `/ext/apps_manifests/${file.name}`
      })
      // .catch(error => rpcErrorHandler(componentName, error, 'storageRead'))
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
