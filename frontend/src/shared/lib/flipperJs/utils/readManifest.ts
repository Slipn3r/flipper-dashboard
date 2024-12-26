import Flipper from '../flipper'
import FlipperWeb from '../flipperWeb'
import FlipperElectron from '../flipperElectron'
import { FlipperModel } from 'entities/Flipper'

import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

const componentName = 'FlipperJS Utils ReadManifest'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFilled = (obj: Record<string, any>): boolean => {
  return Object.values(obj).every((value) => {
    if (typeof value === 'object' && value !== null) {
      return isFilled(value)
    }
    return value !== ''
  })
}

async function readManifest(
  this: Flipper | FlipperWeb | FlipperElectron,
  file: FlipperModel.File
) {
  const manifestFile = await this.RPC('storageRead', {
    path: `/ext/apps_manifests/${file.name}`
  }).catch((error: Error) => {
    rpcErrorHandler({ componentName, error, command: 'storageRead' })

    throw error
  })

  const decoder = new TextDecoder()
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

  if (isFilled(app)) {
    return app
  }
}

export { readManifest }
