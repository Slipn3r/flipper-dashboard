import { PB } from './protobufCompiled'

import type { Emitter, DefaultEvents } from 'nanoevents'

import { logger } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'
import {
  addToQueue,
  getProcess,
  clearQueue,
  type QueueItem
} from 'shared/lib/utils/usePromiseQueue'

import { FlipperModel } from 'entity/Flipper'
import { CategoryModel } from 'entity/Category'
import type { ActionAppOptions, InstallAppOptions } from './types'

import readInfo from './utils/readInfo'
import {
  getInstalledApps,
  onClearInstalledAppsList
} from './utils/getInstalledApps'
import { installApp, deleteApp } from './utils/appActions'

import * as storage from './commands/storage'
import * as system from './commands/system'
import * as application from './commands/application'
import * as gui from './commands/gui'
import * as gpio from './commands/gpio'
import * as property from './commands/property'

type RPCSubSystemsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: { [command: string]: (args: any) => any }
}
const RPCSubSystems: RPCSubSystemsType = {
  storage,
  system,
  application,
  gui,
  gpio,
  property
}

RPCSubSystems['storage']!['info']

const componentName = 'FlipperJS'
export default class Flipper {
  filters: {
    usbVendorId: number
    usbProductId: number
  }[]
  config: {
    appDir: string
    manifestDir: string
    tempDir: string
  }
  info?: FlipperModel.FlipperInfo
  flipperReady: boolean
  commandQueue: {
    commandId: number
    requestType: string
    commandStatus?: {
      value: number
    }
    chunks?: Args[]
    args?: Args | Args[]
    error?: Error
  }[]
  loadingInfo: boolean
  name: string
  connected: boolean
  updating: boolean
  rpcActive: boolean
  installedApps: FlipperModel.App[]
  emitter: Emitter<DefaultEvents>

  constructor(emitter: Emitter<DefaultEvents>) {
    this.filters = [{ usbVendorId: 0x0483, usbProductId: 0x5740 }]
    this.config = {
      appDir: '/ext/apps',
      manifestDir: '/ext/apps_manifests',
      tempDir: '/ext/.tmp'
    }

    this.commandQueue = [
      {
        commandId: 0,
        requestType: 'unsolicited',
        chunks: [],
        error: undefined
      }
    ]

    this.flipperReady = false

    this.info = undefined
    this.loadingInfo = false

    this.name = ''
    this.connected = false
    this.updating = false
    this.rpcActive = false

    this.installedApps = []

    this.emitter = emitter
  }

  async getInfo({ ignoreLoading = false } = {}) {
    if (!ignoreLoading) {
      this.loadingInfo = true
    }
    await readInfo
      .bind(this)()
      .then((data: Partial<FlipperModel.FlipperInfo>) => {
        this.info = data as FlipperModel.FlipperInfo
        this.flipperReady = true
      })
      .catch((/* error: Error */) => {
        this.flipperReady = false
      })
    this.loadingInfo = false
  }
  async getInstalledApps() {
    onClearInstalledAppsList()
    await getInstalledApps
      .bind(this)()
      .then((apps) => {
        this.installedApps = apps
      })
      .catch((error: Error) => {
        this.installedApps = []
        throw error
      })
  }

  encodeRPCRequest(
    requestType: string,
    args: Args,
    hasNext?: boolean,
    commandId?: number
  ) {
    let command
    const options: {
      hasNext?: boolean
      [key: string]: Args | object | boolean | number | undefined
      commandId?: number
    } = { hasNext }
    options[requestType] = args || {}
    if (commandId) {
      options.commandId = commandId
      command = this.commandQueue.find((c) => c.commandId === options.commandId)
    } else {
      options.commandId = this.commandQueue.length
    }

    if (!command) {
      const i = this.commandQueue.push({
        commandId: options.commandId,
        requestType: requestType,
        args: hasNext ? [args] : args
      })
      command = this.commandQueue[i - 1]
    }

    const message = PB.Main.create(options)
    const data = new Uint8Array(PB.Main.encodeDelimited(message).finish())
    return [data, command]
  }

  RPC(requestType: string, args?: Args) {
    try {
      const [subSystem, command] = splitRequestType(requestType) ?? []
      return RPCSubSystems[subSystem]![command]!.bind(this)(args)
    } catch (e) {
      console.error(e)
    }
  }

  async ensureCommonPaths() {
    if (this.flipperReady && this.info?.storage.sdcard?.status.isInstalled) {
      let dir = await this.RPC('storageStat', {
        path: this.config.manifestDir
      }).catch((error: Error) => {
        if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
          rpcErrorHandler({
            componentName,
            error,
            command: `storageStat ${this.config.manifestDir}`
          })
        } else {
          logger.debug({
            context: componentName,
            message: `Storage ${this.config.manifestDir} not exist`
          })
        }
      })
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: this.config.manifestDir
        })
          .then(() =>
            logger.debug({
              context: componentName,
              message: `storageMkdir: ${this.config.manifestDir}`
            })
          )
          .catch((error: Error) =>
            rpcErrorHandler({
              componentName,
              error,
              command: `storageMkdir ${this.config.manifestDir}`
            })
          )
      }

      dir = await this.RPC('storageStat', {
        path: this.config.tempDir
      }).catch((error: Error) => {
        if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
          rpcErrorHandler({
            componentName,
            error,
            command: `storageStat ${this.config.tempDir}`
          })
        } else {
          logger.debug({
            context: componentName,
            message: `Storage ${this.config.tempDir} not exist`
          })
        }
      })
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: this.config.tempDir
        })
          .then(() =>
            logger.debug({
              context: componentName,
              message: `storageMkdir: ${this.config.tempDir}`
            })
          )
          .catch((error: Error) =>
            rpcErrorHandler({
              componentName,
              error,
              command: `storageMkdir ${this.config.tempDir}`
            })
          )
      }

      dir = await this.RPC('storageStat', {
        path: `${this.config.tempDir}/lab`
      }).catch((error: Error) => {
        if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
          return rpcErrorHandler({
            componentName,
            error,
            command: `storageStat ${this.config.tempDir}/lab`
          })
        } else {
          return logger.debug({
            context: componentName,
            message: `Storage ${this.config.tempDir}/lab not exist`
          })
        }
      })
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: `${this.config.tempDir}/lab`
        })
          .then(() =>
            logger.debug({
              context: componentName,
              message: `storageMkdir: ${this.config.tempDir}/lab`
            })
          )
          .catch((error: Error) =>
            rpcErrorHandler({
              componentName,
              error,
              command: `storageMkdir ${this.config.tempDir}/lab`
            })
          )
      }
    }
  }

  async ensureCategoryPaths(categories: CategoryModel.CategoryData[]) {
    for (const category of categories) {
      const dir = await this.RPC('storageStat', {
        path: `/ext/apps/${category.name}`
      }).catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageStat' })
      )
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: `/ext/apps/${category.name}`
        }).catch((error: Error) =>
          rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
        )
      }
    }
  }

  async installApp({
    callback,
    categoryName,
    app,
    catalogChannelProduction = true
  }: InstallAppOptions) {
    return installApp.bind(this)({
      callback,
      categoryName,
      app,
      catalogChannelProduction
    })
  }
  async deleteApp({ callback, categoryName, app }: ActionAppOptions) {
    return deleteApp.bind(this)({ callback, categoryName, app })
  }

  async addToQueue({ fn, params }: QueueItem) {
    return await addToQueue({ fn, params })
  }

  getProcess() {
    return getProcess()
  }

  clearQueue() {
    return clearQueue()
  }
}

type Args = {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

function splitRequestType(requestType: string): [string, string] {
  const index = requestType.search(/[A-Z]/g)
  const command = requestType.slice(index)
  return [
    requestType.slice(0, index),
    command[0]!.toLowerCase() + command.slice(1)
  ]
}
