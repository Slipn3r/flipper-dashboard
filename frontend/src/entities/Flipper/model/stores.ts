import { ref, unref, computed, reactive } from 'vue'
import { Platform } from 'quasar'
import { defineStore } from 'pinia'
import { FlipperWeb, FlipperElectron } from 'shared/lib/flipperJs'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { logger } from 'shared/lib/utils/useLog'

import { AppsModel } from 'entity/Apps'
import {
  FlipperInfo,
  PulseFile,
  DataFlipperElectron,
  DataDfuFlipperElectron
} from './types'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'

// import type { Emitter, DefaultEvents } from 'nanoevents'
// import { createNanoEvents } from 'nanoevents'

import asyncSleep from 'simple-async-sleep'

import {
  init as bridgeControllerInit,
  emitter as bridgeEmitter /* , getCurrentFlipper, getList, setCurrentFlipper */
} from 'shared/lib/flipperJs/bridgeController'

const componentName = 'FlipperStore'

export const useFlipperStore = defineStore('flipper', () => {
  const isElectron = Platform.is.electron

  const route = useRoute()
  const router = useRouter()

  const appsStore = AppsModel.useAppsStore()

  const flags = reactive({
    connected: computed(() => flipper.value?.connected),
    updateInProgress: ref(false),
    waitForReconnect: ref(false),
    recovering: ref(false),
    autoReconnect: ref(false),
    isBridgeReady: ref(false),
    switchFlipper: ref(false),
    flipperIsInitialized: ref(false),
    disableNavigation: ref(false),
    disableButtonMultiflipper: ref(false)
  })

  const dialogs = reactive({
    microSDcardMissing: false,
    multiflipper: false,
    connectFlipper: false,
    mobileDetected: false,
    serialUnsupported: false,
    logs: false
  })

  const recoveringFlipperName = ref('')
  const oldFlipper = ref<FlipperElectron | FlipperWeb>()
  const flipper = ref<FlipperElectron | FlipperWeb>()

  if (!Platform.is.electron) {
    flipper.value = new FlipperWeb()
  }
  // Platform.is.electron
  //   ? new FlipperElectron(/* '', createNanoEvents() */)
  //   : new FlipperWeb()

  // const flipper = ref<FlipperElectron | FlipperWeb>(new FlipperWeb())
  const flipperName = computed(() => flipper.value?.name)
  const flipperReady = computed(() => flipper.value?.flipperReady || false)
  const rpcActive = computed(() => flipper.value?.rpcActive || false)
  // const flippers: Ref<FlipperWeb[]> = ref([])
  const info = computed(() => flipper.value?.info as FlipperInfo | undefined)
  const loadingInfo = computed(() => flipper.value?.loadingInfo)

  const api = computed(() => {
    const firmware = info?.value?.firmware
    return firmware?.api
      ? `${firmware.api.major}.${firmware.api.minor}`
      : undefined
  })
  const target = computed(() => {
    const firmware = info?.value?.firmware
    return firmware?.target ? `f${firmware.target}` : undefined
  })

  const connect = async ({
    mode,
    autoReconnect
  }: {
    mode?: string
    autoReconnect?: boolean
  } = {}) => {
    if (flipper.value instanceof FlipperWeb) {
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
      await flipper.value
        .connect({
          type: mode || route.name === 'Cli' ? 'CLI' : 'RPC',
          autoReconnect
        })
        .then(async () => {
          // flags.connected = true
          const unbind = flipper.value?.emitter.on(
            'disconnect',
            (e: { isUserAction: boolean }) => {
              appsStore.onClearInstalledAppsList()

              if (flags.autoReconnect && !e.isUserAction) {
                onAutoReconnect()

                flags.autoReconnect = currentAutoReconnectFlag
              }

              if (unbind) {
                unbind()
              }
            }
          )

          if (reconnectInterval.value) {
            clearInterval(reconnectInterval.value)
          }

          if (flags.updateInProgress) {
            onUpdateStage('end')
          }
        })
        .catch(() => {
          // flags.connected = false
        })
    }
  }

  const disconnect = async ({
    isUserAction = false
  }: {
    isUserAction?: boolean
  } = {}) => {
    if (flipper.value instanceof FlipperWeb) {
      await flipper.value?.disconnect({
        isUserAction
      })
      // flags.connected = false
      appsStore.onClearInstalledAppsList()
    }
  }

  const onUpdateStage = (stage: string) => {
    if (flipper.value) {
      if (stage === 'start') {
        flags.disableButtonMultiflipper = true
        flags.disableNavigation = true
        flags.updateInProgress = true
        flipper.value.updating = true

        // stopScreenStream()
      } else if (stage === 'end') {
        flags.disableButtonMultiflipper = false
        flags.disableNavigation = false
        flags.updateInProgress = false
        flipper.value.updating = false
        flags.recovering = false
      }
    }
  }

  const reconnectInterval = ref<NodeJS.Timeout>()
  const onAutoReconnect = () => {
    reconnectInterval.value = setInterval(() => {
      connect({
        autoReconnect: true
      })
    }, 1000)
  }

  const fileToPass = ref<PulseFile>()
  const openFileIn = ({
    path,
    file
  }: {
    path: RouteLocationRaw
    file: PulseFile
  }) => {
    logger.info({
      context: componentName,
      message: `Passing file ${file.name} to ${path}`
    })
    fileToPass.value = file
    router.push(path)
  }

  const availableFlippers = ref<DataFlipperElectron[]>([])
  const availableDfuFlippers = ref<DataDfuFlipperElectron[]>([])

  const connectFlipper = async (
    _flipper: DataFlipperElectron
    // {
    //   name,
    //   emitter,
    //   mode
    // }: {
    //   name: string
    //   emitter: Emitter<DefaultEvents>
    //   mode: string
    // }
  ) => {
    console.log('connectFlipper', _flipper)
    if (!_flipper) {
      return
    }
    _flipper.mode = route.name === 'Cli' ? 'cli' : 'rpc'

    if (flipperReady.value && flipperName.value !== _flipper.name) {
      // _flipper.flipperReady = false
      flags.switchFlipper = true
    }
    flags.flipperIsInitialized = true
    if (flipper.value) {
      // flipper.value.flipperReady = false
      await flipper.value.disconnect()
      appsStore.onClearInstalledAppsList()
      oldFlipper.value = unref(flipper.value)
    }

    await asyncSleep(500)

    const localFlipper = new FlipperElectron(
      _flipper.name,
      _flipper.emitter
      /* flipper.info */
    )

    localFlipper.setReadingMode(_flipper.mode)
    localFlipper.setName(_flipper.name)
    // localFlipper.setEmitter(_flipper.emitter)

    await localFlipper.connect(/* name, emitter */).catch(() => {
      showNotif({
        message: `Failed to connect to Flipper ${_flipper.name}. Replug the device and try again.`,
        color: 'negative'
      })
    })

    flipper.value = localFlipper

    flags.switchFlipper = false
    flags.waitForReconnect = false

    if (flipper.value.readingMode.type === 'rpc') {
      await flipper.value.getInfo()
      await flipper.value.ensureCommonPaths()
    } /* else {
      flipper.value.info = _flipper.info
    } */

    if (flags.updateInProgress || flags.recovering) {
      onUpdateStage('end')
    }

    flags.flipperIsInitialized = false

    // const _flipper = new FlipperElectron(name, emitter)
    // flipper.value.setReadingMode('rpc')
    // await _flipper.getInfo()

    // await asyncSleep(1)
    // await _flipper.init()

    // flipper.value = localFlipper

    // await flipper.value?.RPC('systemPing', { timeout: 2000 })
    // await asyncSleep(1000)

    // flipper.value = _flipper
  }

  const isDataFlipperElectron = (
    flipper: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): flipper is DataFlipperElectron => {
    return flipper.mode !== 'dfu'
  }
  const isDataDfuFlipperElectron = (
    flipper: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): flipper is DataDfuFlipperElectron => {
    return flipper.mode === 'dfu'
  }

  const availableBridgeFlippers = ref<
    Array<DataFlipperElectron | DataDfuFlipperElectron>
  >([])
  const listInit = () => {
    bridgeEmitter.on(
      'list',
      async (data: DataFlipperElectron[] | DataDfuFlipperElectron[]) => {
        // availableFlippers.value = []
        // availableDfuFlippers.value = []

        // const _availableFlippers = []
        // const _availableDfuFlippers = []

        // new FlipperElectron(data.name, data.emitter)
        if (availableBridgeFlippers.value.length > data.length) {
          for (
            let index = 0;
            index < availableBridgeFlippers.value.length;
            index++
          ) {
            const bridgeFlipper = availableBridgeFlippers.value[index]!

            if (
              data.findIndex((flipper) => {
                return flipper.name === bridgeFlipper.name
              }) === -1
            ) {
              availableBridgeFlippers.value.splice(index, 1)

              if (flipper.value?.name === bridgeFlipper.name) {
                flipper.value.disconnect()
                appsStore.onClearInstalledAppsList()

                if (!flags.updateInProgress) {
                  flipper.value = undefined
                }
              }

              if (isDataFlipperElectron(bridgeFlipper)) {
                const index = availableFlippers.value.findIndex((flipper) => {
                  return flipper.name === bridgeFlipper.name
                })

                if (index !== -1) {
                  availableFlippers.value.splice(index, 1)
                }
              }

              if (isDataDfuFlipperElectron(bridgeFlipper)) {
                const index = availableDfuFlippers.value.findIndex(
                  (flipper) => {
                    return flipper.name === bridgeFlipper.name
                  }
                )

                if (index !== -1) {
                  availableDfuFlippers.value.splice(index, 1)
                }
              }
            }
          }
        }

        for (let index = 0; index < data.length; index++) {
          const flipper = data[index]!

          if (
            availableBridgeFlippers.value.findIndex((availableFlipper) => {
              return availableFlipper.name === flipper.name
            }) === -1
          ) {
            availableBridgeFlippers.value.push(flipper)

            if (isDataFlipperElectron(flipper)) {
              availableFlippers.value.push(flipper)
            }

            if (isDataDfuFlipperElectron(flipper)) {
              availableDfuFlippers.value.push(flipper)
              // useFlipperStore().availableDfuFlippers.push(
              //   new FlipperElectron(flipper.name, flipper.emitter, flipper.info)
              // )
            }
          }
        }

        // HACK: Necessary delay to eliminate flippers that lock up after a reboot
        await asyncSleep(1000)

        if (flags.updateInProgress) {
          if (flags.waitForReconnect) {
            const findFlipper = availableFlippers.value.find(
              (availableFlipper) => {
                return availableFlipper.name === flipper.value?.name
              }
            )

            if (findFlipper) {
              // await asyncSleep(1000)

              if (isDataFlipperElectron(findFlipper)) {
                connectFlipper(findFlipper)
              }
            }
          }
        } else if (flags.recovering) {
          if (flags.waitForReconnect) {
            const findFlipper = availableFlippers.value.find(
              (availableFlipper) => {
                return availableFlipper.name === recoveringFlipperName.value
              }
            )

            if (findFlipper) {
              // await asyncSleep(1000)

              if (isDataFlipperElectron(findFlipper)) {
                connectFlipper(findFlipper)
              }
            }
          }
        } else {
          if (availableFlippers.value.length) {
            // await asyncSleep(1000)

            if (!flipper.value) {
              if (!flags.flipperIsInitialized) {
                connectFlipper(availableFlippers.value[0]!)
              }
              // console.log('flipper.value', flipper.value.name)
              // if (flipper.value.name !== availableFlippers.value[0].name) {
              //   console.log(
              //     'availableFlippers.value[0].name',
              //     availableFlippers.value[0].name
              //   )
              //   connectFlipper(availableFlippers.value[0])
              // }
            }
          }
        }

        // availableFlippers.value = _availableFlippers
        // availableDfuFlippers.value = _availableDfuFlippers
        // data.forEach((flipper) => {
        //   if (isDataFlipperElectron(flipper)) {
        //     const _flipper = new FlipperElectron /*
        //       flipper.name,
        //       flipper.emitter,
        //       flipper.info */()

        //     _flipper.setName(flipper.name)
        //     _flipper.setEmitter(flipper.emitter)
        //     _flipper.getInfo()

        //     // await asyncSleep(10000)
        //     // await _flipper.getInfo()

        //     useFlipperStore().availableFlippers.push(_flipper)
        //   }

        //   if (isDataDfuFlipperElectron(flipper)) {
        //     useFlipperStore().availableDfuFlippers.push(flipper)
        //     // useFlipperStore().availableDfuFlippers.push(
        //     //   new FlipperElectron(flipper.name, flipper.emitter, flipper.info)
        //     // )
        //   }
        // })

        // useFlipperStore().availableFlippers[0].getInfo()
      }
    )
  }

  const init = async () => {
    // toggleAutoReconnectCondition.value()

    bridgeEmitter.on('spawn', () => {
      flags.isBridgeReady = true
      // setTimeout(() => {
      // }, 1000)
    })
    bridgeEmitter.on('exit', () => {
      flags.isBridgeReady = false
    })
    listInit()
    await bridgeControllerInit()

    // if (flags.value.autoReconnect && flipper.value?.name) {
    //   autoReconnectFlipperName.value = flipper.value?.name
    // } else {
    //   autoReconnectFlipperName.value = null
    // }
  }

  if (Platform.is.electron) {
    init()
  }

  const findMicroSd = async () => {
    await flipper.value?.getInfo()

    if (info.value?.storage.sdcard?.status.isInstalled) {
      dialogs.microSDcardMissing = false
    } else {
      showNotif({
        message: 'MicroSD not found',
        color: 'warning',
        textColor: 'black',
        timeout: 1000
      })
    }
  }

  return {
    isElectron,

    flags,
    dialogs,
    connect,
    disconnect,
    recoveringFlipperName,
    oldFlipper,
    flipper,
    flipperReady,
    flipperName,
    rpcActive,
    info,
    loadingInfo,
    api,
    target,
    onUpdateStage,
    onAutoReconnect,

    fileToPass,
    openFileIn,

    availableFlippers,
    availableDfuFlippers,
    availableBridgeFlippers,
    connectFlipper,
    findMicroSd
  }
})
