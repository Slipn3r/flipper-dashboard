import Flipper from '../flipper'
import { FlipperModel } from 'entity/Flipper'
import useSetProperty from 'shared/lib/utils/useSetProperty'

// import asyncSleep from 'simple-async-sleep'

import { logger } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

const componentName = 'FlipperJS Util ReadInfo'

async function isOldProtobuf(this: Flipper) {
  let protobufVersion
  if (
    (this.info as unknown as FlipperModel.DataFlipperElectron['info'])?.protobuf
      .version
  ) {
    protobufVersion = (
      this.info as unknown as FlipperModel.DataFlipperElectron['info']
    )?.protobuf.version
  } else {
    protobufVersion = await this.RPC('systemProtobufVersion').catch(
      (error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: 'systemProtobufVersion'
        })
        throw error
      }
    )
  }

  return protobufVersion.major === 0 && protobufVersion.minor < 14
}

type Primitive = string | number | boolean
export interface InfoObject {
  [key: string]: FlipperModel.FlipperInfo | Primitive | InfoObject
}

let info: Partial<FlipperModel.FlipperInfo> = {}
// const setInfo = (options: InfoObject) => {
//   info = { ...info, ...options }
// }

const setPropertyInfo = (options: Partial<FlipperModel.FlipperInfo>) => {
  info = useSetProperty(info, options)
}

export default async function readInfo(this: Flipper) {
  info = {
    doneReading: false,
    storage: {
      sdcard: {
        status: {}
      },
      databases: {},
      internal: {}
    }
  }
  // info = {
  //   doneReading: false,
  //   storage: {
  //     sdcard: {
  //       status: {}
  //     },
  //     databases: {},
  //     internal: {}
  //   }
  // }
  // if (!flags.value.connected) {
  //   return
  // }

  if (await isOldProtobuf.bind(this)()) {
    await this.RPC('systemDeviceInfo')
      .then((devInfo: FlipperModel.DeviceInfo) => {
        logger.debug({
          context: componentName,
          message: 'deviceInfo: OK'
        })
        setPropertyInfo(devInfo)
      })
      .catch((error: Error) => {
        rpcErrorHandler({ componentName, error, command: 'systemDeviceInfo' })
        throw error
      })
  } else {
    // await asyncSleep(1000)
    await this.RPC('propertyGet', { key: 'devinfo' })
      .then((devInfo: FlipperModel.DeviceInfo) => {
        logger.debug({
          context: componentName,
          message: 'propertyGet devinfo: OK'
        })
        setPropertyInfo(devInfo)
      })
      .catch((error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: 'propertyGet devinfo'
        })
        throw error
      })

    await this.RPC('propertyGet', { key: 'pwrinfo' })
      .then((powerInfo: FlipperModel.PowerInfo) => {
        logger.debug({
          context: componentName,
          message: 'propertyGet pwrinfo: OK'
        })
        setPropertyInfo(powerInfo)
      })
      .catch((error: Error) => {
        rpcErrorHandler({
          componentName,
          error,
          command: 'propertyGet pwrinfo'
        })
        throw error
      })
  }

  const ext = await this.RPC('storageList', { path: '/ext' })
    .then((list: FlipperModel.File[]) => {
      logger.debug({
        context: componentName,
        message: 'storageList: /ext'
      })
      return list
    })
    .catch((error: Error) => {
      rpcErrorHandler({ componentName, error, command: 'storageList /ext' })
      // throw error
    })

  if (ext && ext.length) {
    const manifest = ext.find((e: FlipperModel.File) => {
      return e.name === 'Manifest'
    })
    let status
    if (manifest) {
      status = 'installed'
    } else {
      status = 'missing'
    }
    setPropertyInfo({
      storage: {
        databases: {
          status
        }
      }
    })

    await this.RPC('storageInfo', { path: '/ext' })
      .then((extInfo: FlipperModel.SpaceInfo) => {
        logger.debug({
          context: componentName,
          message: 'storageInfo: /ext'
        })
        setPropertyInfo({
          storage: {
            sdcard: {
              status: {
                label: 'installed',
                isInstalled: true
              },
              totalSpace: extInfo.totalSpace,
              freeSpace: extInfo.freeSpace
            }
          }
        })
      })
      .catch((error: Error) => {
        rpcErrorHandler({ componentName, error, command: 'storageInfo /ext' })
        // throw error
      })
  } else {
    setPropertyInfo({
      storage: {
        sdcard: {
          status: {
            label: 'missing',
            isInstalled: false
          }
        },
        databases: {
          status: 'missing'
        }
      }
    })
  }

  await this.RPC('storageInfo', { path: '/int' })
    .then((intInfo: FlipperModel.SpaceInfo) => {
      logger.debug({
        context: componentName,
        message: 'storageInfo: /int'
      })
      setPropertyInfo({
        storage: {
          internal: {
            totalSpace: intInfo.totalSpace,
            freeSpace: intInfo.freeSpace
          }
        }
      })
      logger.info({
        context: componentName,
        message: 'Fetched device info'
      })
    })
    .catch((error: Error) => {
      rpcErrorHandler({ componentName, error, command: 'storageInfo /int' })
      // throw error
    })
  setPropertyInfo({ doneReading: true })

  return info
}
