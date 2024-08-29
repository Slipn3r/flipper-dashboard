import { PB } from './protobufCompiled'

import type { Emitter, DefaultEvents } from 'nanoevents'

import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { FlipperModel } from 'entities/Flipper'

import readInfo from './utils/readInfo'
import {
  getInstalledApps,
  onClearInstalledAppsList
} from './utils/getInstalledApps'

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

RPCSubSystems['storage']['info']

const componentName = 'FlipperJS'
export default class Flipper {
  filters: {
    usbVendorId: number
    usbProductId: number
  }[]
  info?: FlipperModel.FlipperInfo
  flipperReady: boolean
  commandQueue: {
    commandId: number
    requestType: string
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

  async getInfo() {
    this.loadingInfo = true
    this.info = (await readInfo.bind(this)()) as FlipperModel.FlipperInfo
    this.loadingInfo = false
    this.flipperReady = true
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
      const [subSystem, command] = splitRequestType(requestType)
      return RPCSubSystems[subSystem][command].bind(this)(args)
    } catch (e) {
      console.error('test', e)
    }
  }

  async ensureCommonPaths() {
    if (this.flipperReady && this.info?.storage.sdcard?.status.isInstalled) {
      let dir = await this.RPC('storageStat', {
        path: '/ext/apps_manifests'
      }).catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageStat' })
      )
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: '/ext/apps_manifests'
        }).catch((error: Error) =>
          rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
        )
      }

      dir = await this.RPC('storageStat', {
        path: '/ext/.tmp'
      }).catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageStat' })
      )
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: '/ext/.tmp'
        }).catch((error: Error) =>
          rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
        )
      }

      dir = await this.RPC('storageStat', {
        path: '/ext/.tmp/lab'
      }).catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageStat' })
      )
      if (!dir) {
        await this.RPC('storageMkdir', {
          path: '/ext/.tmp/lab'
        }).catch((error: Error) =>
          rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
        )
      }
    }
  }
}

type Args = {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

function splitRequestType(requestType: string) {
  const index = requestType.search(/[A-Z]/g)
  const command = requestType.slice(index)
  return [
    requestType.slice(0, index),
    command[0].toLowerCase() + command.slice(1)
  ]
}
