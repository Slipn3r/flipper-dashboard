<template>
  <q-item
    :disable="
      flipperStore.flags.disableButtonMultiflipper ||
      flipperStore.flags.disableNavigation
    "
    clickable
    @click="onSwitchFlipper"
  >
    <q-item-section avatar class="items-center">
      <q-avatar size="md" square>
        <q-icon name="flipper:switch" size="32px" />
        <q-badge
          v-if="countFlippers > 1"
          color="primary"
          floating
          style="top: 0px; right: -4px; font-size: 9px; padding: 1px 4.5px"
          :label="countFlippers"
        />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>My Flippers</q-item-label>
    </q-item-section>
  </q-item>

  <q-dialog v-model="flipperStore.dialogs.multiflipper">
    <q-card class="rounded-borders">
      <q-card-section class="row items-center" style="min-width: 350px">
        <q-list class="q-gutter-y-md full-width">
          <template
            v-for="flipper in flipperStore.availableFlippers"
            :key="flipper.info.hardware.name"
          >
            <q-item
              class="row rounded-borders"
              :style="`${
                flipperStore.flipperName === flipper.name
                  ? 'border: 2px solid ' + getCssVar('primary')
                  : ''
              }`"
              :active="flipperStore.flipperName === flipper.name"
              :clickable="flipperStore.flipperName !== flipper.name"
              @click="connectFlipper(flipper)"
              v-close-popup
            >
              <q-item-section class="col-5">
                <img
                  v-if="flipper.info?.hardware.color === '1'"
                  src="~assets/flipper_black.svg"
                  style="width: 100%"
                />
                <img
                  v-else-if="flipper.info?.hardware.color === '3'"
                  src="~assets/flipper_transparent.svg"
                  style="width: 100%"
                />
                <img
                  v-else
                  src="~assets/flipper_white.svg"
                  style="width: 100%"
                />
              </q-item-section>
              <q-item-section class="col-5 q-pl-md">
                <div>
                  <div class="text-h6">
                    {{ flipper.info?.hardware.name }}
                  </div>
                  <div class="text-caption">
                    Firmware
                    {{ firmwareVersion(flipper) }}
                  </div>
                </div>
              </q-item-section>
              <q-item-section class="col-2">
                <!-- v-if="
                    flipperStore.info?.hardware?.uid ===
                    flipper.info?.hardware.uid
                  " -->
                <q-icon
                  v-if="flipperStore.flipperName === flipper.name"
                  color="primary"
                  name="mdi-check-circle-outline"
                  size="md"
                />
              </q-item-section>
            </q-item>
          </template>

          <template
            v-for="flipper in flipperStore.availableDfuFlippers"
            :key="flipper.name"
          >
            <q-item class="row rounded-borders">
              <q-item-section class="col-5">
                <img
                  v-if="flipper.info?.color === 1"
                  src="~assets/flipper_black.svg"
                  style="width: 100%"
                />
                <img
                  v-else-if="flipper.info?.color === 3"
                  src="~assets/flipper_transparent.svg"
                  style="width: 100%"
                />
                <img
                  v-else
                  src="~assets/flipper_white.svg"
                  style="width: 100%"
                />
              </q-item-section>
              <q-item-section class="col-5 q-pl-md">
                <div>
                  <div class="text-h6">{{ flipper.name }}</div>
                  <div class="text-caption text-blue-14">Recovery mode</div>
                </div>
              </q-item-section>
              <q-item-section class="col-2">
                <q-btn
                  unelevated
                  dense
                  color="primary"
                  label="Repair"
                  @click="recovery(flipper.info)"
                />
              </q-item-section>
            </q-item>
          </template>

          <q-item
            v-if="
              !flipperStore.availableFlippers?.length &&
              !flipperStore.availableDfuFlippers?.length
            "
            class="row rounded-borders"
          >
            <q-item-section class="col-5">
              <img
                src="~assets/flipper_white.svg"
                style="width: 100%; filter: opacity(0.3)"
              />
            </q-item-section>
            <q-item-section class="col-7 q-pl-md">
              <div>
                <div class="text-h6">Waiting for connection...</div>
                <div class="text-caption">Your Flippers will appear here</div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- <div
          v-if="flipperStore.flags.loadingMultiflipper"
          class="row items-center full-width"
        >
          <Loading
            class="col"
            label="Reading Flippers..."
          />
        </div> -->
      </q-card-section>
      <!-- <q-card-section align="center">
        <q-btn unelevated color="primary" label="Repair" @click="recovery"/>
      </q-card-section> -->
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="dialogRecovery"
    :persistent="flipperStore.flags.recovering && !recoveryError"
    @hide="resetRecovery(true)"
  >
    <q-card
      class="dialog"
      style="width: 100%; max-width: min(calc(100vw - 16px), 1000px)"
    >
      <q-btn
        v-if="recoveryError"
        icon="close"
        flat
        round
        dense
        v-close-popup
        class="dialog-close-btn"
      />
      <q-card-section class="row items-center">
        <div class="text-h6">Repair</div>
      </q-card-section>
      <q-card-section class="row items-center">
        <template v-if="recoveryError">
          <p class="text-bold text-negative">{{ recoveryUpdateStage }}</p>
          <div class="full-width q-mb-md">
            <q-btn unelevated color="primary" label="Retry" @click="retry" />
          </div>
        </template>
        <template v-else>
          <p>{{ recoveryUpdateStage }}</p>
          <ProgressBar :progress="recoveryProgress" interpolated />
        </template>
        <q-expansion-item
          v-model="showRecoveryLog"
          class="full-width q-mt-md"
          icon="svguse:common-icons.svg#logs"
          label="View logs"
        >
          <div
            class="full-width bg-grey-12 q-px-sm q-py-xs rounded-borders"
            style="height: 300px"
          >
            <q-scroll-area ref="scrollAreaRef" class="fit text-left">
              <code v-for="line in recoveryLogs" :key="line">
                {{ line }}
                <br />
              </code>
            </q-scroll-area>
          </div>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCssVar, QScrollArea } from 'quasar'
import { emitter as bridgeEmitter } from 'shared/lib/flipperJs/bridgeController'
import { ProgressBar } from 'shared/components/ProgressBar'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { logger, type LogLevel } from 'shared/lib/utils/useLog'

import { FlipperModel, FlipperApi } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

const componentName = 'FlipperSwitch'

const onSwitchFlipper = async () => {
  flipperStore.dialogs.multiflipper = true
  // await mainStore.start()
}

const connectFlipper = (flipper: FlipperModel.DataFlipperElectron) => {
  // flipper.readingMode.type = route.name === 'Cli' ? 'cli' : 'rpc'
  /* else {
    flipper.mode = route.name === 'Cli' ? 'cli' : 'rpc'
  } */
  flipperStore.connectFlipper(flipper)
}

const countFlippers = computed(
  () =>
    flipperStore.availableFlippers.length +
    flipperStore.availableDfuFlippers.length
)

const firmwareVersion = (flipper: FlipperModel.DataFlipperElectron) => {
  console.log(flipper)
  if (flipper.info?.firmware.branch === 'dev') {
    return `Dev ${flipper.info?.firmware.commit}`
  }
  return flipper.info?.firmware.version
}

const dialogRecovery = ref(false)
const recoveryError = ref(false)
const recoveryUpdateStage = ref('')
const recoveryProgress = ref(0)
const showRecoveryLog = ref(false)
const scrollAreaRef = ref<QScrollArea>()
const recoveryLogs = ref<string[]>([])

const retry = () => {
  resetRecovery(true)
  dialogRecovery.value = false
  flipperStore.dialogs.multiflipper = true
}
const resetRecovery = (clearLogs = false) => {
  recoveryUpdateStage.value = ''
  recoveryProgress.value = 0
  if (clearLogs) {
    recoveryLogs.value = []
  }
}
const recovery = async (info: FlipperModel.DataDfuFlipperElectron['info']) => {
  if (!flipperStore.isElectron) {
    return
  }

  if (flipperStore.flipper) {
    flipperStore.flipper.disconnect()
    flipperStore.flipper = undefined
  }

  recoveryError.value = false
  flipperStore.dialogs.multiflipper = false
  dialogRecovery.value = true
  flipperStore.flags.recovering = true
  flipperStore.recoveringFlipperName = info.name
  flipperStore.flags.waitForReconnect = true
  // setAutoReconnectCondition.value(flags.value.autoReconnect)
  // flags.value.autoReconnect = false
  // autoReconnectFlipperName.value = info.name

  // console.log(info)
  recoveryUpdateStage.value = 'Loading firmware bundle...'
  const firmwareTar = await FlipperApi.fetchFirmwareTar(
    `https://update.flipperzero.one/firmware/release/f${info.target}/update_tgz`
  )

  const saved = await window.fs.saveToTemp({
    filename: 'update.tar',
    buffer: firmwareTar
  })

  if (saved.status !== 'ok') {
    return
  }

  let inactivityTimeout: NodeJS.Timeout
  const onTimeout = () => {
    const messageLong =
      'Error: Operation timed out. Please check USB connection and try again.'
    const messageShort = `Failed to repair ${info.name}: Repair timeout`
    showNotif({
      message: messageShort,
      color: 'negative'
    })
    logger.error({
      context: componentName,
      message: messageShort
    })
    unbindLogs()
    unbindStatus()
    recoveryUpdateStage.value = messageLong
    recoveryError.value = true
  }
  const updateInactivityTimeout = (stop = false) => {
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout)
    }

    if (stop) {
      return
    }

    inactivityTimeout = setTimeout(onTimeout, 60 * 1000)
  }

  window.bridge.send({
    type: 'repair',
    name: info.name,
    data: {
      file: saved.path
    }
  })

  updateInactivityTimeout()

  const unbindLogs = bridgeEmitter.on('log', (stderr) => {
    const logLines = stderr.data.split('\n')
    logLines.pop()
    logLines.forEach((line: string) => {
      recoveryLogs.value.push(line)
      if (scrollAreaRef.value) {
        scrollAreaRef.value.setScrollPercentage('vertical', 1)
      }
      let level: LogLevel = 'debug'
      if (line.includes('[E]')) {
        level = 'error'
      } else if (line.includes('[W]')) {
        level = 'warn'
      } else if (line.includes('[I]')) {
        level = 'info'
      }
      logger[level]({
        context: componentName,
        message: line
      })
    })
  })

  const unbindStatus = bridgeEmitter.on('status', async (status) => {
    if (status.error) {
      updateInactivityTimeout(true)
      let messageLong = `Failed to repair ${info.name}: ${status.error.message}`
      let messageShort = messageLong
      switch (status.error.message) {
        case 'UnknownError':
          messageLong =
            'Unknown error! Please try again. If the error persists, please contact support.'
          messageShort = `Failed to repair ${info.name}: Unknown error`
          break
        case 'InvalidDevice':
          messageLong = 'Error: Cannot determine device type. Please try again.'
          messageShort = `Failed to repair ${info.name}: Invalid device`
          break
        case 'DiskError':
          messageLong =
            'Error: Cannot read/write to disk. The app may be missing permissions.'
          messageShort = `Failed to repair ${info.name}: Disk error`
          break
        case 'DataError':
          messageLong =
            'Error: Necessary files are corrupted. Please try again.'
          messageShort = `Failed to repair ${info.name}: Data error`
          break
        case 'SerialAccessError':
          messageLong =
            'Error: Cannot access device in Serial mode. Please check USB connection and permissions and try again.'
          messageShort = `Failed to repair ${info.name}: Serial access error`
          break
        case 'RecoveryAccessError':
          messageLong =
            'Error: Cannot access device in Recovery mode. Please check USB connection and permissions and try again.'
          messageShort = `Failed to repair ${info.name}: Recovery access error`
          break
        case 'OperationError':
          messageLong =
            'Error: Current operation was interrupted. Please try again.'
          messageShort = `Failed to repair ${info.name}: Operation error`
          break
        case 'SerialError':
          messageLong =
            'Error: Serial port error. Please check USB connection and try again.'
          messageShort = `Failed to repair ${info.name}: Serial error`
          break
        case 'RecoveryError':
          messageLong =
            'Error: Recovery mode error. Please check USB connection and try again.'
          messageShort = `Failed to repair ${info.name}: Recovery error`
          break
        case 'ProtocolError':
          messageLong =
            'Error: Protocol error. Please try again. If the error persists, please contact support.'
          messageShort = `Failed to repair ${info.name}: Protocol error`
          break
        case 'TimeoutError':
          messageLong =
            'Error: Operation timed out. Please check USB connection and try again.'
          messageShort = `Failed to repair ${info.name}: Timeout error`
          break
      }
      showNotif({
        message: messageShort,
        color: 'negative'
      })
      unbindLogs()
      unbindStatus()
      recoveryUpdateStage.value = messageLong
      recoveryError.value = true
    }
    if (status.message) {
      updateInactivityTimeout()
      recoveryUpdateStage.value = status.message
    }
    if (status.progress) {
      updateInactivityTimeout()
      recoveryProgress.value = status.progress / 100
    }
    if (status.finished) {
      updateInactivityTimeout(true)
      unbindLogs()
      unbindStatus()

      flipperStore.dialogs.multiflipper = false
      // flags.value.autoReconnect = autoReconnectCondition.value
      // autoReconnectFlipperName.value = info.name
      // repairedFlipperName.value = info.name

      recoveryUpdateStage.value = 'Finished'
      // if (getList().includes((e) => e.name === info.name)) {
      //   await flipperStore.connectFlipper(info.name)
      // }
      dialogRecovery.value = false
    }
  })
}
</script>
