<template>
  <div class="column flex-center text-center full-width">
    <template v-if="!flipperStore.flags.updateInProgress">
      <template
        v-if="ableToUpdate && flipperStore.info?.storage.sdcard?.status"
      >
        <template v-if="outdated !== undefined">
          <p class="q-mb-sm" v-if="outdated">
            Your firmware is out of date, newest release is
            {{ getChannel('release')?.versions[0].version }}.
          </p>
          <p class="q-mb-sm" v-else-if="aheadOfRelease">
            Your firmware is ahead of current release.
          </p>
          <p
            class="q-mb-sm"
            v-else-if="flipperStore.info.firmware.version !== 'unknown'"
          >
            Your firmware is up to date.
          </p>
        </template>
        <!-- <p v-if="channels.custom">
          Detected custom firmware <b>"{{ channels.custom.channel }}"</b>
          <span v-if="!channels.custom.url.endsWith('tgz')"> with <b>unsupported</b> filetype</span>
        </p> -->
        <div class="flex q-mt-sm">
          <q-select
            v-model="fwModel"
            :options="fwOptions"
            label="Choose firmware"
            :suffix="
              fwOptions.find(({ label }) => label === fwModel.label)
                ? fwOptions.find(({ label }) => label === fwModel.label)
                    ?.version
                : ''
            "
            :style="!$q.screen.xs ? 'width: 320px;' : 'width: 290px;'"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section class="items-start">
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
                <q-item-section class="items-end">
                  <q-chip
                    :color="scope.opt.color"
                    text-color="white"
                    :label="scope.opt.version"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-btn
            v-if="fwModel"
            @click="update()"
            unelevated
            color="positive"
            padding="12px 30px"
            :class="!$q.screen.xs ? 'q-ml-lg' : 'q-mt-sm'"
            >{{ getTextButton }}</q-btn
          >
        </div>
        <q-btn
          v-if="installFromFile"
          @click="
            () => {
              uploadPopup = true
              uploadedFile = undefined
            }
          "
          class="q-mt-lg"
          outline
          color="grey-8"
        >
          Install from file
        </q-btn>
      </template>
      <template v-else>
        <span v-if="flipperStore.info?.storage.sdcard?.status"
          >Your firmware doesn't support self-update. Install latest release
          using <b>repair mode</b>.</span
        >
        <span v-else>Self-update is impossible without an SD card.</span>
      </template>
    </template>

    <template v-else>
      <p>{{ updateStage }}</p>
      <q-btn v-if="updateError" outline class="q-mt-md" @click="cancelUpdate()"
        >Cancel</q-btn
      >
      <ProgressBar
        v-else-if="write.filename.length > 0"
        class="full-width"
        :title="write.filename"
        :progress="write.progress"
        color="positive"
        trackColor="green-4"
        size="56px"
        interpolated
      />
    </template>

    <q-dialog v-model="uploadPopup">
      <q-card>
        <q-card-section class="q-pt-none">
          <q-file
            outlined
            v-model="uploadedFile"
            label="Drop or select files"
            accept=".tgz"
            class="q-pt-md"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="file_upload"></q-icon>
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Upload"
            v-close-popup
            @click="update(true)"
          ></q-btn>
          <q-btn flat label="Cancel" color="negative" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import semver from 'semver'
import asyncSleep from 'simple-async-sleep'

import { PB } from 'shared/lib/flipperJs/protobufCompiled'
import { unpack } from 'shared/lib/utils/operation'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { logger } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { ProgressBar } from 'shared/components/ProgressBar'
import { FlipperModel, FlipperApi } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()
const { fetchChannels, fetchRegions, fetchFirmware } = FlipperApi

const componentName = 'FlipperUpdate'

const outdated = ref<boolean | undefined>(false)
const ableToUpdate = ref(true)
const aheadOfRelease = ref(false)

const installFromFile = ref(true)
const uploadedFile = ref<File>()
const uploadPopup = ref(false)

const overrideDevRegion = ref(false)
const updateError = ref(false)

const channels = ref<FlipperModel.Channel[]>([])
const getChannel = (channelId: string) => {
  if (channels.value.length) {
    return channels.value.find((channel) => channel.id === channelId)
  }

  return undefined
}

const fwOptions = ref([
  {
    label: 'Release',
    value: 'release',
    version: '',
    color: 'positive'
  },
  {
    label: 'Release-candidate',
    value: 'release-candidate',
    version: '',
    color: 'accent'
  },
  {
    label: 'Dev (unstable)',
    value: 'development',
    version: '',
    color: 'negative'
  }
  // {
  //   label: 'Custom', value: 'custom', version: '', color: 'dark'
  // }
])
const fwModel = ref(fwOptions.value[0])

const emit = defineEmits<{ (event: 'updateInProgress'): Promise<void> }>()

onMounted(async () => {
  channels.value = await fetchChannels().catch((error) => {
    showNotif({
      message: 'Unable to load firmware channels from the build server.',
      color: 'negative',
      actions: [
        {
          label: 'Reload',
          color: 'white',
          handler: () => {
            location.reload()
          }
        }
      ]
    })
    logger.error({
      context: componentName,
      message: 'failed to fetch update channels'
    })
    throw error
  })

  if (channels.value.length) {
    fwOptions.value[0].version =
      getChannel('release')?.versions[0].version || ''
    fwOptions.value[1].version =
      getChannel('release-candidate')?.versions[0].version || ''
    fwOptions.value[2].version =
      getChannel('development')?.versions[0].version || ''
  }

  compareVersions()

  if (
    new URLSearchParams(location.search).get('overrideDevRegion') === 'true'
  ) {
    overrideDevRegion.value = true
  }
})

const compareVersions = () => {
  if (
    semver.lt(
      flipperStore.info?.protobuf.version.major +
        '.' +
        flipperStore.info?.protobuf.version.minor +
        '.0',
      '0.6.0'
    )
  ) {
    ableToUpdate.value = false
  }
  if (flipperStore.info?.firmware.version) {
    if (
      flipperStore.info.firmware.version !== 'unknown' &&
      semver.valid(flipperStore.info.firmware.version)
    ) {
      const releaseVersion = getChannel('release')?.versions[0].version

      if (releaseVersion) {
        if (semver.eq(flipperStore.info.firmware.version, releaseVersion)) {
          outdated.value = false
        } else if (
          semver.gt(flipperStore.info.firmware.version, releaseVersion)
        ) {
          outdated.value = false
          aheadOfRelease.value = true
        } else {
          outdated.value = true
        }
      } else {
        outdated.value = true
      }
    } else {
      outdated.value = undefined
    }
  }
}

const getTextButton = computed(() => {
  if (fwModel.value.version === flipperStore.info?.firmware.version) {
    return 'Reinstall'
  }
  return 'Install'
})

const update = async (fromFile = false) => {
  updateStage.value = ''

  if (!flipperStore.info?.storage.sdcard?.status.isInstalled) {
    flipperStore.dialogs.microSDcardMissing = true
    return
  }

  flipperStore.onUpdateStage('start')

  if (fromFile) {
    if (!uploadedFile.value) {
      updateError.value = true
      flipperStore.onUpdateStage('end')
      updateStage.value = 'No file selected'
      throw new Error(updateStage.value)
    } else if (!uploadedFile.value.name.endsWith('.tgz')) {
      updateError.value = true
      flipperStore.onUpdateStage('end')
      updateStage.value = 'Wrong file format'
      throw new Error(updateStage.value)
    }
    logger.info({
      context: componentName,
      message: 'Uploading firmware from file'
    })
  }

  await emit('updateInProgress')
  await loadFirmware().catch((error: Error) => {
    updateError.value = true
    updateStage.value = error.message || error.toString()

    flipperStore.onUpdateStage('end')

    throw error
  })
}

const updateStage = ref('')
const write = ref({
  filename: '',
  progress: 0
})
const loadFirmware = async () => {
  updateStage.value = 'Loading firmware bundle...'

  if (flipperStore.info?.hardware.region !== '0' || overrideDevRegion.value) {
    const regions: FlipperModel.Regions = await fetchRegions().catch(
      (error) => {
        showNotif({
          message: 'Failed to fetch regional update information',
          color: 'negative',
          actions: [
            {
              label: 'Reload',
              color: 'white',
              handler: () => {
                location.reload()
              }
            }
          ]
        })
        logger.error({
          context: componentName,
          message: `Failed to fetch regional update information: ${error.toString()}`
        })
        throw error
      }
    )

    let bands
    if (regions.countries[regions.country]) {
      bands = regions.countries[regions.country].map((e) => regions.bands[e])
    } else {
      bands = regions.default.map((e) => regions.bands[e])
      regions.country = 'JP'
    }
    const options: {
      countryCode: string | Uint8Array
      bands: InstanceType<typeof PB.Region.Band>[]
    } = {
      countryCode: regions.country,
      bands: []
    }

    for (const band of bands) {
      const bandOptions = {
        start: band.start,
        end: band.end,
        powerLimit: band.max_power,
        dutyCycle: band.duty_cycle
      }
      const message = PB.Region.Band.create(bandOptions)
      options.bands.push(message)
    }

    if (updateError.value) {
      return
    }

    options.countryCode = new TextEncoder().encode(regions.country)
    const message = PB.Region.create(options)
    const encoded = new Uint8Array(
      PB.Region.encodeDelimited(message).finish()
    ).slice(1)

    await flipperStore.flipper
      ?.RPC('storageWrite', {
        path: '/int/.region_data',
        buffer: encoded
      })
      .catch((error: Error) => {
        const command = 'storageWrite'
        rpcErrorHandler({ componentName, error, command })

        throw new Error(
          `${componentName}: RPC error in command '${command}': ${error.toString()}`
        )
      })
  }

  if (updateError.value) {
    return
  }

  const channel = getChannel(fwModel.value.value)

  if (uploadedFile.value || channel) {
    let files
    if (uploadedFile.value) {
      const buffer = await uploadedFile.value.arrayBuffer()
      files = await unpack(buffer).then((value: object) => {
        logger.debug({
          context: componentName,
          message: 'Unpacked firmware'
        })
        return value
      })
    } else {
      const file = channel?.versions[0].files.find(
        (_file) =>
          _file.target === flipperStore.target && _file.type === 'update_tgz'
      )

      if (file) {
        files = await fetchFirmware(file.url)
          .then((value) => {
            logger.debug({
              context: componentName,
              message: `Downloaded firmware from ${file.url}`
            })
            return value
          })
          .catch((error: Error) => {
            updateError.value = true
            updateStage.value = error.toString()
            showNotif({
              message: 'Failed to fetch firmware: ' + error.toString(),
              color: 'negative',
              actions: [
                {
                  label: 'Reload',
                  color: 'white',
                  handler: () => {
                    location.reload()
                  }
                }
              ]
            })

            const message = `${componentName}: Failed to fetch firmware: ${error.toString()}`
            logger.error({
              context: componentName,
              message
            })
            throw new Error(message)
          })
      }
    }

    updateStage.value = 'Loading firmware files'

    if (updateError.value) {
      return
    }

    let path = '/ext/update/'
    const updateDir = await flipperStore.flipper
      ?.RPC('storageStat', { path: '/ext/update' })
      .catch(async (error: Error) => {
        if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
          const command = 'storageStat'
          rpcErrorHandler({
            componentName,
            error,
            command
          })

          throw new Error(
            `${componentName}: RPC error in command '${command}': ${error.toString()}`
          )
        } else {
          logger.debug({
            context: componentName,
            message: 'Storage /ext/update not exist'
          })
        }
      })

    if (!updateDir) {
      await flipperStore.flipper
        ?.RPC('storageMkdir', { path: '/ext/update' })
        .then(() =>
          logger.debug({
            context: componentName,
            message: 'storageMkdir: /ext/update'
          })
        )
        .catch((error: Error) => {
          const command = 'storageMkdir'
          rpcErrorHandler({ componentName, error, command })

          throw new Error(
            `${componentName}: RPC error in command '${command}': ${error.toString()}`
          )
        })
    }

    for (const file of files) {
      if (updateError.value) {
        return
      }
      if (file.size === 0) {
        path = '/ext/update/' + file.name
        if (file.name.endsWith('/')) {
          path = path.slice(0, -1)
        }

        const updateVersionDir = await flipperStore.flipper
          ?.RPC('storageStat', { path })
          .catch(async (error: Error) => {
            if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
              const command = 'storageStat'
              rpcErrorHandler({
                componentName,
                error,
                command
              })

              throw new Error(
                `${componentName}: RPC error in command '${command}': ${error.toString()}`
              )
            } else {
              logger.debug({
                context: componentName,
                message: 'Storage /ext/update not exist'
              })
            }
          })

        if (!updateVersionDir) {
          await flipperStore.flipper
            ?.RPC('storageMkdir', { path })
            .then(() =>
              logger.debug({
                context: componentName,
                message: `storageMkdir: ${path}`
              })
            )
            .catch((error: Error) => {
              const command = 'storageMkdir'
              rpcErrorHandler({ componentName, error, command })

              throw new Error(
                `${componentName}: RPC error in command '${command}': ${error.toString()}`
              )
            })
        }
      } else {
        write.value.filename = file.name.slice(file.name.lastIndexOf('/') + 1)
        const unbind = flipperStore.flipper?.emitter.on(
          'storageWriteRequest/progress',
          (e: { progress: number; total: number }) => {
            if (!flipperStore.flipper?.connected) {
              throw new Error(
                `Flipper ${flipperStore.flipper?.name} not connected`
              )
            }

            write.value.progress = e.progress / e.total
          }
        )
        await flipperStore.flipper
          ?.RPC('storageWrite', {
            path: '/ext/update/' + file.name,
            buffer: file.buffer
          })
          .then(() =>
            logger.debug({
              context: componentName,
              message: `storageWrite: /ext/update/${file.name}`
            })
          )
          .catch((error: Error) => {
            const command = 'storageWrite'
            rpcErrorHandler({ componentName, error, command })

            throw new Error(
              `${componentName}: RPC error in command '${command}': ${error.toString()}`
            )
          })

        if (unbind) {
          unbind()
        }
      }
      await asyncSleep(300)
    }

    write.value.filename = ''
    write.value.progress = 0

    updateStage.value = 'Loading manifest...'

    if (updateError.value) {
      return
    }

    await flipperStore.flipper
      ?.RPC('systemUpdate', { path: path + '/update.fuf' })
      .then(() =>
        logger.debug({
          context: componentName,
          message: 'systemUpdate: OK'
        })
      )
      .catch((error: Error) => {
        const command = 'systemUpdate'
        rpcErrorHandler({ componentName, error, command })

        throw new Error(
          `${componentName}: RPC error in command '${command}': ${error.toString()}`
        )
      })

    updateStage.value = 'Update in progress, pay attention to your Flipper'

    await flipperStore.flipper
      ?.RPC('systemReboot', { mode: 'UPDATE' })
      .catch((error: Error) => {
        const command = 'systemReboot'
        rpcErrorHandler({ componentName, error, command })

        throw new Error(
          `${componentName}: RPC error in command '${command}': ${error.toString()}`
        )
      })

    flipperStore.flags.waitForReconnect = true
    flipperStore.flags.autoReconnect = true
  } else {
    updateError.value = true

    updateStage.value = 'Failed to fetch channel'

    showNotif({
      message: 'Unable to load firmware channel from the build server.',
      color: 'negative',
      actions: [
        {
          label: 'Reload',
          color: 'white',
          handler: () => {
            location.reload()
          }
        }
      ]
    })
    throw new Error(updateStage.value)
  }
}

const cancelUpdate = () => {
  flipperStore.flags.waitForReconnect = false
  flipperStore.flags.updateInProgress = false
  updateError.value = false
  updateStage.value = ''
  // reload()
}
</script>
