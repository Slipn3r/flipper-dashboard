import Flipper from '../flipperWeb'
import { FlipperModel } from 'entities/Flipper'
import useSetProperty from 'shared/lib/utils/useSetProperty'

const isOldProtobuf = async (instance: Flipper) => {
  const protobufVersion = await instance.RPC('systemProtobufVersion')
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'systemProtobufVersion')
    //   throw error
    // })
  return protobufVersion.major === 0 && protobufVersion.minor < 14
}

type Primitive = string | number | boolean;
type AnyObject = { [key: string]: AnyObject | Primitive };

let info: AnyObject = {}
const setInfo = (options: AnyObject) => {
  info = options
}

const setPropertyInfo = (options: AnyObject) => {
  info = useSetProperty(info, options)
}

export default async function readInfo (instance: Flipper) {
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

  /* await flipper.value.RPC('systemPing', { timeout: 2000 })
    .catch(error => {
      rpcErrorHandler(componentName, error, 'systemPing')
      throw error
    }) */

  if (await isOldProtobuf(instance)) {
    await instance.RPC('systemDeviceInfo')
      .then((devInfo: FlipperModel.DeviceInfo) => {
        // console.log('isOldProtobuf', devInfo)
        // log({
        //   level: 'debug',
        //   message: `${componentName}: deviceInfo: OK`
        // })
        setInfo({ ...info, ...devInfo })
      })
      // .catch(error => {
      //   rpcErrorHandler(componentName, error, 'systemDeviceInfo')
      //   throw error
      // })
  } else {
    await instance.RPC('propertyGet', { key: 'devinfo' })
      .then((devInfo: FlipperModel.DeviceInfo) => {
        // console.log('devInfo', devInfo)
        // log({
        //   level: 'debug',
        //   message: `${componentName}: propertyGet: OK`
        // })
        setInfo({ ...info, ...devInfo })
      })
      // .catch(error => {
      //   rpcErrorHandler(componentName, error, 'propertyGet')
      //   throw error
      // })

    await instance.RPC('propertyGet', { key: 'pwrinfo' })
      .then((powerInfo: FlipperModel.PowerInfo) => {
        // console.log('powerInfo', powerInfo)
        // log({
        //   level: 'debug',
        //   message: `${componentName}: propertyGet: OK`
        // })
        setPropertyInfo({ power: powerInfo })
      })
      // .catch(error => {
      //   rpcErrorHandler(componentName, error, 'propertyGet')
      //   throw error
      // })
  }

  const ext = await instance.RPC('storageList', { path: '/ext' })
    .then((list: FlipperModel.File[]) => {
      // console.log('list', list)
      // log({
      //   level: 'debug',
      //   message: `${componentName}: storageList: /ext`
      // })
      return list
    })
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'storageList')
    //   throw error
    // })

  if (ext && ext.length) {
    const manifest = ext.find((e: FlipperModel.File) => {
      // console.log('e', e)
      return e.name === 'Manifest'
    })
    // console.log('manifest', manifest)
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

    await instance.RPC('storageInfo', { path: '/ext' })
      .then((extInfo: FlipperModel.SpaceInfo) => {
        // console.log('extInfo', extInfo)
        // log({
        //   level: 'debug',
        //   message: `${componentName}: storageInfo: /ext`
        // })
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

  await instance.RPC('storageInfo', { path: '/int' })
    .then((intInfo: FlipperModel.SpaceInfo) => {
      // log({
      //   level: 'debug',
      //   message: `${componentName}: storageInfo: /int`
      // })
      setPropertyInfo({
        storage: {
          internal: {
            totalSpace: intInfo.totalSpace,
            freeSpace: intInfo.freeSpace
          }
        }
      })
      // log({
      //   level: 'info',
      //   message: `${componentName}: Fetched device info`
      // })
    })
    // .catch(error => {
    //   rpcErrorHandler(componentName, error, 'storageInfo')
    //   throw error
    // })
  setPropertyInfo({ doneReading: true })

  return info
}
