import { ref, unref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { FlipperWeb } from 'shared/lib/flipperJs'
import { AppsModel } from 'entities/Apps'
import { FlipperInfo } from './types'

export const useFlipperStore = defineStore('flipper', () => {
  const appsStore = AppsModel.useAppStore()
  const { getInstalledApps, onClearInstalledAppsList } = appsStore

  const flags = reactive({
    connected: computed(() => flipper.value.connected),
    updateInProgress: ref(false),
    microSDcardMissingDialog: ref(false),
    autoReconnect: ref(false)
  })

  const flipper = ref(new FlipperWeb())
  const flipperReady = computed(() => flipper.value.flipperReady)
  // const flippers: Ref<FlipperWeb[]> = ref([])
  const info = computed(() => (flipper.value.info as FlipperInfo))
  const api = computed(() => {
    const firmware = info?.value?.firmware
    return firmware ? `${firmware.api.major}.${firmware.api.minor}` : ''
  })
  const target = computed(() => {
    const firmware = info?.value?.firmware
    return firmware ? `f${firmware.target}` : ''
  })

  const connect = async () => {
    // const ports = await navigator.serial.getPorts()

    // console.log(ports)
    // ports.forEach(async (port) => {
    //   console.log(port)
    //   await new Promise((resolve) => {
    //     setTimeout(() => resolve(true), 2000)
    //   })
    //   const _flipper = new FlipperWeb()
    //   await _flipper.connect({
    //     type: 'RPC'
    //   })
    //   flippers.value.push(_flipper)
    //   console.log(flippers.value)
    // })

    const currentAutoReconnectFlag = unref(flags.autoReconnect)
    await flipper.value.connect({
      type: 'RPC'
    })
      .then(async () => {
        // flags.connected = true
        const unbind = flipper.value.emitter.on('disconnect', (e) => {
          onClearInstalledAppsList()

          if (flags.autoReconnect && !e.isUserAction) {
            onAutoReconnect()

            flags.autoReconnect = currentAutoReconnectFlag
          }

          unbind()
        })

        if (reconnectInterval.value) {
          clearInterval(reconnectInterval.value)
        }

        if (flags.updateInProgress) {
          onUpdateStage('end')
        }

        await getInstalledApps({
          refreshInstalledApps: true
        })
      })
      .catch(() => {
        // flags.connected = false
      })
  }

  const disconnect = async ({
    isUserAction = false
  }: {
    isUserAction?: boolean
  } = {}) => {
    await flipper.value.disconnect({
      isUserAction
    })
    // flags.connected = false
    onClearInstalledAppsList()
  }

  const onUpdateStage = (stage: string) => {
    if (stage === 'start') {
      // flags.disableNavigation = true
      flags.updateInProgress = true
      flipper.value.updating = true

      // stopScreenStream()
    } else if (stage === 'end') {
      // flags.disableNavigation = false
      flags.updateInProgress = false
      flipper.value.updating = false
    }
  }

  const reconnectInterval = ref<NodeJS.Timeout>()
  const onAutoReconnect = () => {
    reconnectInterval.value = setInterval(() => {
      connect()
    }, 1000)
  }

  return {
    flags,
    connect,
    disconnect,
    flipper,
    flipperReady,
    info,
    api,
    target,
    onUpdateStage,
    onAutoReconnect
  }
})

// const write = async () => {
//   // flipper.write('info device\r')
//   console.log(flipper.RPC('systemDeviceInfo'))
// }

// const filters = [
//   { usbVendorId: 0x0483, usbProductId: 0x5740 }
// ]

// const findKnownDevices = async () => {
//   console.log('findKnownDevices')
//   return navigator.serial.getPorts()
//     .then((ports) => {
//       const filteredPorts = ports.filter(port => {
//         const info = port.getInfo()
//         console.log('info', info)

//         return info.usbVendorId === filters[0].usbVendorId &&
//           info.usbProductId === filters[0].usbProductId;
//       })

//       console.log(filteredPorts)
//       return filteredPorts
//     })
//     .catch((e) => {
//       console.error(e)

//       throw e
//     })
// }

// const selectPort = async () => {
//   return await navigator.serial.requestPort({ filters })
// }
// const flipper = ref(new FlipperWeb())

// const startRpc = async () => {
//   if (!flags.value.connected) {
//     return
//   }
//   // flags.value.rpcToggling = true

//   await flipper.value.startRPCSession()
//     .catch(error => {
//       console.error(error)
//     })
//   // flags.value.rpcActive = true
//   // flags.value.rpcToggling = false

//   // log({
//   //   level: 'info',
//   //   message: `${componentName}: RPC started`
//   // })
// }

// const isOldProtobuf = async () => {
//     const protobufVersion = await flipper.value.RPC('systemProtobufVersion')
//       // .catch(error => {
//       //   rpcErrorHandler(componentName, error, 'systemProtobufVersion')
//       //   throw error
//       // })
//     return protobufVersion.major === 0 && protobufVersion.minor < 14
//   }
// const readInfo = async () => {
//   if (!flags.value.connected) {
//     return
//   }
//   // const defaultInfo = {
//   //   doneReading: false,
//   //   storage: {
//   //     sdcard: {
//   //       status: {}
//   //     },
//   //     databases: {},
//   //     internal: {}
//   //   }
//   // }
//   // setInfo(defaultInfo)

//   /* await flipper.value.RPC('systemPing', { timeout: 2000 })
//     .catch(error => {
//       rpcErrorHandler(componentName, error, 'systemPing')
//       throw error
//     }) */

//   if (await isOldProtobuf()) {
//     await flipper.value.RPC('systemDeviceInfo')
//       .then((devInfo: FlipperModel.DeviceInfo) => {
//         console.log('isOldProtobuf', devInfo)
//         // log({
//         //   level: 'debug',
//         //   message: `${componentName}: deviceInfo: OK`
//         // })
//         // setInfo({ ...info.value, ...devInfo })
//       })
//       // .catch(error => {
//       //   rpcErrorHandler(componentName, error, 'systemDeviceInfo')
//       //   throw error
//       // })
//   } else {
//     await flipper.value.RPC('propertyGet', { key: 'devinfo' })
//       .then((devInfo: FlipperModel.DeviceInfo) => {
//         console.log('devInfo', devInfo)
//         // log({
//         //   level: 'debug',
//         //   message: `${componentName}: propertyGet: OK`
//         // })
//         // setInfo({ ...info.value, ...devInfo })
//       })
//       // .catch(error => {
//       //   rpcErrorHandler(componentName, error, 'propertyGet')
//       //   throw error
//       // })

//     await flipper.value.RPC('propertyGet', { key: 'pwrinfo' })
//       .then((powerInfo: FlipperModel.PowerInfo) => {
//         console.log('powerInfo', powerInfo)
//         // log({
//         //   level: 'debug',
//         //   message: `${componentName}: propertyGet: OK`
//         // })
//         // setPropertyInfo({ power: powerInfo })
//       })
//       // .catch(error => {
//       //   rpcErrorHandler(componentName, error, 'propertyGet')
//       //   throw error
//       // })
//   }

//   const ext = await flipper.value.RPC('storageList', { path: '/ext' })
//     .then((list: FlipperModel.File[]) => {
//       console.log('list', list)
//       // log({
//       //   level: 'debug',
//       //   message: `${componentName}: storageList: /ext`
//       // })
//       return list
//     })
//     // .catch(error => {
//     //   rpcErrorHandler(componentName, error, 'storageList')
//     //   throw error
//     // })

//   if (ext && ext.length) {
//     const manifest: FlipperModel.File = ext.find((e: FlipperModel.File) => {
//       console.log('e', e)
//       return e.name === 'Manifest'
//     })
//     console.log('manifest', manifest)
//     // let status
//     // if (manifest) {
//     //   status = 'installed'
//     // } else {
//     //   status = 'missing'
//     // }
//     // setPropertyInfo({
//     //   storage: {
//     //     databases: {
//     //       status
//     //     }
//     //   }
//     // })

//     await flipper.value.RPC('storageInfo', { path: '/ext' })
//       .then((extInfo: FlipperModel.ExtInfo) => {
//         console.log('extInfo', extInfo)
//         // log({
//         //   level: 'debug',
//         //   message: `${componentName}: storageInfo: /ext`
//         // })
//         // setPropertyInfo({
//         //   storage: {
//         //     sdcard: {
//         //       status: {
//         //         label: 'installed',
//         //         isInstalled: true
//         //       },
//         //       totalSpace: extInfo.totalSpace,
//         //       freeSpace: extInfo.freeSpace
//         //     }
//         //   }
//         // })
//       })
//       // .catch(error => {
//       //   rpcErrorHandler(componentName, error, 'storageInfo')
//       //   console.error(error)
//       //   throw error
//       // })
//   } /* else {
//     setPropertyInfo({
//       storage: {
//         sdcard: {
//           status: {
//             label: 'missing',
//             isInstalled: false
//           }
//         },
//         databases: {
//           status: 'missing'
//         }
//       }
//     })
//   } */
// }

// const start = async ({
//   manual = false
// }: {
//   manual?: boolean
// } = {}) => {
//   const ports = await findKnownDevices()

//   if (ports && ports.length > 1) {
//     if (manual) {
//       console.log('manual')
//       await selectPort()
//     }
//   }

//   await connect()
//   await startRpc()
//   await readInfo()
// }

// const connect = async () => {
//   console.log('connect')
//   return new Promise((resolve, reject) => {
//     (async () => {
//       await flipper.value.connect()
//         .then(() => {
//           flags.value.connected = true
//           resolve('Connected')
//         })
//         .catch((e) => {
//           flags.value.connected = false
//           reject(e)
//         })
//     })()
//   })
// }

// const disconnect = () => {
//   flipper.value.disconnect()
//     .then(() => {
//       flags.value.connected = false
//     })
//     .catch((e) => {
//       console.error(e)
//     })
// }
