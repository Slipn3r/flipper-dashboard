import { AppsModel } from 'entity/Apps'

export type ActionAppOptions = {
  callback: (progress: number) => void
  categoryName: string
  app: AppsModel.InstalledApp | AppsModel.App
}

export type InstallAppOptions = ActionAppOptions & {
  catalogChannelProduction: boolean
}
