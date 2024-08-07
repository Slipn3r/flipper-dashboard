<template>
  <div class="column flex-center text-center full-width">
    <template v-if="!flipperStore.flags.updateInProgress">
      <template v-if="ableToUpdate && flipperStore.info.storage.sdcard?.status">
        <template v-if="outdated !== undefined">
          <p class="q-mb-sm" v-if="outdated">Your firmware is out of date, newest release is {{ getChannel('release')?.versions[0].version }}.</p>
          <p class="q-mb-sm" v-else-if="aheadOfRelease">Your firmware is ahead of current release.</p>
          <p class="q-mb-sm" v-else-if="flipperStore.info.firmware.version !== 'unknown'">Your firmware is up to date.</p>
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
            :suffix="fwOptions.find(({label}) => label === fwModel.label) ? fwOptions.find(({label}) => label === fwModel.label)?.version : ''"
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
          >{{ getTextButton }}</q-btn>
        </div>
        <q-btn
          v-if="installFromFile"
          @click="uploadPopup = true; uploadedFile = undefined"
          class="q-mt-lg"
          outline
          color="grey-8"
        >
          Install from file
        </q-btn>
      </template>
      <template v-else>
        <span v-if="flipperStore.info.storage.sdcard?.status">Your firmware doesn't support self-update. Install latest release using <b>repair mode</b>.</span>
        <span v-else>Self-update is impossible without an SD card.</span>
      </template>
    </template>

    <template v-else>
      <p>{{ updateStage }}</p>
      <q-btn
        v-if="updateError"
        outline
        class="q-mt-md"
        @click="cancelUpdate()"
      >Cancel</q-btn>
      <ProgressBar
        v-else-if="write.filename.length > 0"
        class="full-width"
        :title="write.filename"
        :progress="write.progress"
        size="56px"
      />
    </template>

    <q-dialog v-model="uploadPopup">
      <q-card>
        <q-card-section class="q-pt-none">
          <q-file
            outlined
            v-model="uploadedFile"
            label="Drop or select files"
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
            @click="update()"
          ></q-btn>
          <q-btn
            flat
            label="Cancel"
            color="negative"
            v-close-popup
          ></q-btn>
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
import { unpack } from 'shared/lib/utils/unpack'

import { ProgressBar } from 'shared/components/ProgressBar'
import { FlipperModel, FlipperApi } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()
const { fetchChannels, fetchRegions, fetchFirmware } = FlipperApi

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
    label: 'Release', value: 'release', version: '', color: 'positive'
  },
  {
    label: 'Release-candidate', value: 'rc', version: '', color: 'accent'
  },
  {
    label: 'Dev (unstable)', value: 'dev', version: '', color: 'negative'
  },
  // {
  //   label: 'Custom', value: 'custom', version: '', color: 'dark'
  // }
])
const fwModel = ref(fwOptions.value[0])

onMounted(async () => {
  channels.value = await fetchChannels()

  if (channels.value.length) {
    fwOptions.value[0].version = getChannel('release')?.versions[0].version || ''
    fwOptions.value[1].version = getChannel('release-candidate')?.versions[0].version || ''
    fwOptions.value[2].version = getChannel('development')?.versions[0].version || ''
  }

  compareVersions()

  if (new URLSearchParams(location.search).get('overrideDevRegion') === 'true') {
    overrideDevRegion.value = true
  }
})

const compareVersions = () => {
  if (semver.lt((flipperStore.info.protobuf.version.major + '.' + flipperStore.info.protobuf.version.minor) + '.0', '0.6.0')) {
    ableToUpdate.value = false
  }
  if (flipperStore.info.firmware.version) {
    if (flipperStore.info.firmware.version !== 'unknown' && semver.valid(flipperStore.info.firmware.version)) {
      const releaseVersion = getChannel('release')?.versions[0].version

      if (releaseVersion) {
        if (semver.eq(flipperStore.info.firmware.version, releaseVersion)) {
          outdated.value = false
        } else if (semver.gt(flipperStore.info.firmware.version, releaseVersion)) {
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
  if (fwModel.value.version === flipperStore.info.firmware.version) {
    return 'Reinstall'
  }
  return 'Install'
})

const update = async () => {
  if (!flipperStore.info.storage.sdcard?.status.isInstalled) {
    flipperStore.flags.microSDcardMissingDialog = true
    return
  }

  flipperStore.onUpdateStage('start')
  await loadFirmware()
}

const updateStage = ref('')
const write = ref({
  filename: '',
  progress: 0
})
const loadFirmware = async () => {
  updateStage.value = 'Loading firmware bundle...'

  if (flipperStore.info.hardware.region !== '0' || overrideDevRegion.value) {
    const regions: FlipperModel.Regions = await fetchRegions()
      .catch(error => {
        // showNotif({
        //   message: 'Failed to fetch regional update information',
        //   color: 'negative',
        //   actions: [{ label: 'Reload', color: 'white', handler: () => { location.reload() } }]
        // })
        // log({
        //   level: 'error',
        //   message: `${componentName}: Failed to fetch regional update information: ${error.toString()}`
        // })
        throw error
      })

    let bands
    if (regions.countries[regions.country]) {
      bands = regions.countries[regions.country].map(e => regions.bands[e])
    } else {
      bands = regions.default.map(e => regions.bands[e])
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
    const encoded = new Uint8Array(PB.Region.encodeDelimited(message).finish()).slice(1)

    await flipperStore.flipper.RPC('storageWrite', { path: '/int/.region_data', buffer: encoded })
      // .catch(error => rpcErrorHandler(error, 'storageWrite'))
  }

  if (updateError.value) {
    return
  }

  const channel = getChannel(fwModel.value.value)

  if (uploadedFile.value || channel) {
    let files
    if (uploadedFile.value) {
      const buffer = await uploadedFile.value.arrayBuffer()
      files = await unpack(buffer)
        .then((value: object) => {
          // log({
          //   level: 'debug',
          //   message: `${componentName}: Unpacked firmware`
          // })
          return value
        })
    } else {
      const file = channel?.versions[0].files.find((_file) => _file.target === flipperStore.target && _file.type === 'update_tgz')

      if (file) {
        files = await fetchFirmware(file.url)
          .catch(error => {
            updateError.value = true
            updateStage.value = error
            // showNotif({
            //   message: 'Failed to fetch firmware: ' + error.toString(),
            //   color: 'negative',
            //   actions: [{ label: 'Reload', color: 'white', handler: () => { location.reload() } }]
            // })
            // log({
            //   level: 'error',
            //   message: `${componentName}: Failed to fetch firmware: ${error.toString()}`
            // })
            throw error
          })
          .then(value => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: Downloaded firmware from ${channels.value[fwModel.value.value].url}`
            // })
            return value
          })
      }
    }

    updateStage.value = 'Loading firmware files'

    if (updateError.value) {
      return
    }

    let path = '/ext/update/'
    await flipperStore.flipper.RPC('storageStat', { path: '/ext/update' })
      .catch(async (error: string) => {
        if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
          // rpcErrorHandler(componentName, error, 'storageStat')
        } else {
          await flipperStore.flipper.RPC('storageMkdir', { path: '/ext/update' })
            // .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
            .then(() => {
              // log({
              //   level: 'debug',
              //   message: `${componentName}: storageMkdir: /ext/update`
              // })
            })
        }
      })

    for (const file of files) {
      if (updateError.value) {
        return
      }
      if (file.size === 0) {
        path = '/ext/update/' + file.name
        if (file.name.endsWith('/')) {
          path = path.slice(0, -1)
        }
        await flipperStore.flipper.RPC('storageMkdir', { path })
          // .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: storageMkdir: ${path}`
            // })
          })
      } else {
        write.value.filename = file.name.slice(file.name.lastIndexOf('/') + 1)
        const unbind = flipperStore.flipper.emitter.on('storageWriteRequest/progress', e => {
          write.value.progress = e.progress / e.total
        })
        await flipperStore.flipper.RPC('storageWrite', { path: '/ext/update/' + file.name, buffer: file.buffer })
          // .catch(error => rpcErrorHandler(componentName, error, 'storageWrite'))
          .then(() => {
            // log({
            //   level: 'debug',
            //   message: `${componentName}: storageWrite: /ext/update/${file.name}`
            // })
          })
        unbind()
      }
      await asyncSleep(300)
    }

    write.value.filename = ''
    write.value.progress = 0

    updateStage.value = 'Loading manifest...'

    if (updateError.value) {
      return
    }

    await flipperStore.flipper.RPC('systemUpdate', { path: path + '/update.fuf' })
      // .catch(error => rpcErrorHandler(componentName, error, 'systemUpdate'))
      .then(() => {
        // log({
        //   level: 'debug',
        //   message: `${componentName}: systemUpdate: OK`
        // })
      })

    updateStage.value = 'Update in progress, pay attention to your Flipper'

    await flipperStore.flipper.RPC('systemReboot', { mode: 'UPDATE' })
      // .catch(error => rpcErrorHandler(componentName, error, 'systemReboot'))

    flipperStore.flags.autoReconnect = true
  } else {
    updateError.value = true

    updateStage.value = 'Failed to fetch channel'
    throw updateStage.value
  }
}

const cancelUpdate = () => {
  // mainFlags.updateInProgress = false
  updateError.value = false
  // reload()
}
</script>
