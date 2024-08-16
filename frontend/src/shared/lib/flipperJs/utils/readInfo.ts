import Flipper from '../flipper'
import { FlipperModel } from 'entities/Flipper'
import useSetProperty from 'shared/lib/utils/useSetProperty'

import asyncSleep from 'simple-async-sleep'

import { log } from 'shared/lib/utils/useLog'

const componentName = 'FlipperJS Utils ReadInfo'

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
    protobufVersion = await this.RPC('systemProtobufVersion')
  }
  // const protobufVersion = await this.RPC('systemProtobufVersion')
  // .catch(error => {
  //   rpcErrorHandler(componentName, error, 'systemProtobufVersion')
  //   throw error
  // })
  return protobufVersion.major === 0 && protobufVersion.minor < 14
}

type Primitive = string | number | boolean
export interface InfoObject {
  [key: string]: FlipperModel.FlipperInfo | Primitive | InfoObject
}

let info: InfoObject = {}
const setInfo = (options: InfoObject) => {
  info = { ...info, ...options }
}

const setPropertyInfo = (options: InfoObject) => {
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
  // if (!flags.value.connected) {
  //   return
  // }

  /* await flipper.value?.RPC('systemPing', { timeout: 2000 })
    .catch(error => {
      rpcErrorHandler(componentName, error, 'systemPing')
      throw error
    }) */

  if (await isOldProtobuf.bind(this)()) {
    await this.RPC('systemDeviceInfo').then(
      (devInfo: FlipperModel.DeviceInfo) => {
        log({
          level: 'debug',
          message: `${componentName}: deviceInfo: OK`
        })
        setInfo({ ...info, ...devInfo })
      }
    )
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'systemDeviceInfo')
    //   throw error
    // })
  } else {
    await asyncSleep(1000)
    await this.RPC('propertyGet', { key: 'devinfo' }).then(
      (devInfo: FlipperModel.DeviceInfo) => {
        log({
          level: 'debug',
          message: `${componentName}: propertyGet: OK`
        })
        setInfo({ ...info, ...devInfo })
      }
    )
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'propertyGet')
    //   throw error
    // })

    await this.RPC('propertyGet', { key: 'pwrinfo' }).then(
      (powerInfo: FlipperModel.PowerInfo) => {
        log({
          level: 'debug',
          message: `${componentName}: propertyGet: OK`
        })
        setPropertyInfo({ power: powerInfo })
      }
    )
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'propertyGet')
    //   throw error
    // })
  }

  const ext = await this.RPC('storageList', { path: '/ext' }).then(
    (list: FlipperModel.File[]) => {
      log({
        level: 'debug',
        message: `${componentName}: storageList: /ext`
      })
      return list
    }
  )
  // .catch(error => {
  //   rpcErrorHandler(componentName, error, 'storageList')
  //   throw error
  // })

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

    await this.RPC('storageInfo', { path: '/ext' }).then(
      (extInfo: FlipperModel.SpaceInfo) => {
        log({
          level: 'debug',
          message: `${componentName}: storageInfo: /ext`
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
      }
    )
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'storageInfo')
    //   console.error(error)
    //   throw error
    // })
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
      log({
        level: 'debug',
        message: `${componentName}: storageInfo: /int`
      })
      setPropertyInfo({
        storage: {
          internal: {
            totalSpace: intInfo.totalSpace,
            freeSpace: intInfo.freeSpace
          }
        }
      })
      log({
        level: 'info',
        message: `${componentName}: Fetched device info`
      })
    })
    .catch((error: object) => {
      // rpcErrorHandler(componentName, error, 'storageInfo')
      // throw error
      console.log(error)
    })
  setPropertyInfo({ doneReading: true })

  return info
}
