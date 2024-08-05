import { FlipperModel } from 'entities/Flipper'

export type AppsShortParams = {
  limit: number
  offset: number
  sort_by: string
  sort_order: string | number
  is_latest_release_version?: boolean
  applications?: string[]
  category_id?: string
  has_version?: boolean
  query?: string
  api?: string
  target?: string
}

export type AppsPostShortParams = {
  limit: number
  is_latest_release_version?: boolean
  applications?: string[]
  api?: string
  target?: string
}

export type GetAppParams = {
  id: string
  is_latest_release_version?: boolean
  api?: string
  target?: string
}

export type AppFapParams = {
  versionId: string,
  api: string
  target: string
}

export type App = {
  id: string
  createdAt: number
  updatedAt: number
  categoryId: string
  alias: string
  author: string
  downloads: number
  currentVersion: {
    id: string
    status: string
    name: string
    version: string
    shortDescription: string
    currentBuild: {
      id: string
      sdk: {
        id: string
        name: string
        target: string
        api: string
        isLatestRelease: boolean
        releasedAt: number
      }
      fapHash: string
    }
    icon: string
    iconUri: string
    screenshots: string[]
  }
  action: {
    progress: number
    type: ActionType | ''
  }
}

export type AppVersion = {
  applicationId: string
  bundleId: string
  currentBuildId: string
  iconUri: string
  name: string
  screenshots: string[] | null[]
  shortDescription: string
  version: string
  _id: string
}

export type InstalledApp = FlipperModel.App & Pick<App, 'alias' | 'currentVersion' | 'categoryId' | 'action'> & {
  installedVersion: AppVersion
  path: string
}

export type AppDetail = App & {
  currentVersion: {
    description: string
    changelog: string
    currentBuild: {
      metadata: {
        id: string
        filename: string
        length: number
      }
    }
    links: {
      bundleUri: string
      manifestUri: string
      sourceCode: {
        type: string
        uri: string
      }
    }
  }
}

export type ActionType = 'install' | 'update' | 'delete'
