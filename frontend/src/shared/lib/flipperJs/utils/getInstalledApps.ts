import Flipper from '../flipper'
import { FlipperModel } from 'entities/Flipper'

import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'
import { readManifest } from './readManifest'

const componentName = 'FlipperJS Util GetInstalled'

let installedApps: FlipperModel.App[] = []

const onClearInstalledAppsList = () => {
  installedApps = []
}

async function getInstalledApps(this: Flipper) {
  if (this.flipperReady) {
    await this.RPC('systemPing', { timeout: 1000 }).catch((error: Error) => {
      throw error
    })

    const manifestsList = await this.RPC('storageList', {
      path: '/ext/apps_manifests'
    }).catch((error: Error) => {
      rpcErrorHandler({
        componentName,
        error,
        command: 'storageList /ext/apps_manifests'
      })

      throw error
    })

    if (manifestsList?.length) {
      try {
        for await (const file of manifestsList) {
          await this.RPC('systemPing', { timeout: 1000 }).catch(
            (error: Error) => {
              throw error
            }
          )

          const app: FlipperModel.App | undefined = await readManifest.bind(
            this
          )(file)

          if (app) {
            installedApps.push(app)
          }
        }

        return installedApps
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('The manifests list is empty')
    }
  }

  return []
}

export { onClearInstalledAppsList, getInstalledApps }
