<template>
  <div class="full-width">
    <q-btn
      class="full-width text-bold text-body1"
      @click="showFullInfo"
      flat
      padding="xs 0 xs xs"
      label="Device Info"
      icon-right="mdi-chevron-right"
      align="between"
      no-caps
    />

    <q-dialog v-model="fullInfoDialog">
      <q-card style="max-width: 375px">
        <q-card-section class="q-pb-none">
          <p class="q-mb-none text-h6 text-bold">Device Info</p>
        </q-card-section>
        <q-card-section class="column q-gutter-y-md full-width">
          <template v-for="infoBlock in fullInfo" :key="infoBlock.title">
            <div class="full-width">
              <p class="q-mb-none text-body1 text-bold">
                {{ infoBlock.title }}
              </p>
              <div class="column">
                <template
                  v-for="(value, index) in infoBlock.values"
                  :key="value?.label"
                >
                  <template v-if="value">
                    <p class="q-my-xs row no-wrap justify-between items-center">
                      <span class="text-weight-medium text-no-wrap q-mr-xl"
                        >{{ value?.label }}:</span
                      >
                      <span class="text-right text-mono">{{
                        value?.value.replace(/\//g, '/&#8203;')
                      }}</span>
                    </p>
                    <div
                      v-show="index !== infoBlock.values.length - 1"
                      class="full-width bg-grey-3"
                      style="height: 1px"
                    />
                  </template>
                </template>
              </div>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getRadioStackType } from 'entity/Flipper/lib/RadioStackType'

import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

const info = computed(() => flipperStore.info)
const hardware = computed(() => info.value?.hardware)
const firmware = computed(() => info.value?.firmware)

interface ResultItem {
  label: string
  value: string
}

const createValue = (title: string, value?: string): ResultItem | undefined => {
  if (value) {
    return {
      label: title,
      value
    }
  }

  return undefined
}

const radioStackFormatted = computed(() => {
  const major = info.value?.radio.stack.major
  const minor = info.value?.radio.stack.minor
  const sub = info.value?.radio.stack.sub
  const type = getRadioStackType(info.value?.radio.stack.type)

  return `${major}.${minor}.${sub} (${type ?? 'Unknown'})`
})

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function shouldIgnore(currentPath: string, ignoreKeys: string[]): boolean {
  const normalizedPath = currentPath.toLowerCase().trim()
  const pathParts = normalizedPath.split(' ')
  const lastPart = pathParts[pathParts.length - 1]

  return ignoreKeys.some((ignoreItem) => {
    const normalizedIgnore = ignoreItem.toLowerCase().trim()
    if (normalizedIgnore.includes(' ')) {
      return normalizedIgnore === normalizedPath
    } else {
      return normalizedIgnore === lastPart
    }
  })
}

function traverseObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  ignoreKeys: string[] = [],
  parentKeys: string[] = []
): ResultItem[] {
  let result: ResultItem[] = []

  Object.keys(obj).forEach((key: string) => {
    const currentKeys = [...parentKeys, capitalize(key)]
    const currentPath = currentKeys.join(' ')

    if (shouldIgnore(currentPath, ignoreKeys)) {
      return
    }

    const value = obj[key]

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result = result.concat(traverseObject(value, ignoreKeys, currentKeys))
    } else if (typeof value === 'string' || Number.isInteger(value)) {
      result.push({
        label: currentKeys.join(' '),
        value: String(value)
      })
    }
  })

  return result
}

const isDetailRegion = (
  region?: FlipperModel.DeviceInfo['hardware']['region']
): region is FlipperModel.DetailRegion => {
  return region !== '0'
}

const fullInfo = computed(() => {
  return [
    {
      title: 'Flipper Device',
      values: [
        createValue('Device Name', hardware.value?.name),
        createValue('Hardware Model', hardware.value?.model),
        createValue(
          'Hardware Region',
          hardware.value && isDetailRegion(hardware.value.region)
            ? hardware.value.region.builtin
            : undefined
        ),
        createValue(
          'Hardware Region Provisioned',
          hardware.value && isDetailRegion(hardware.value.region)
            ? hardware.value.region.provisioned
            : undefined
        ),
        createValue('Hardware Version', hardware.value?.ver),
        createValue('Hardware OTP Version', hardware.value?.otp.ver),
        createValue('Serial Number', hardware.value?.uid)
      ]
    },
    {
      title: 'Firmware',
      values: [
        createValue(
          'Software Revision',
          `${firmware.value?.branch.name} ${firmware.value?.commit.hash}`
        ),
        createValue('Build Date', firmware.value?.build.date),
        createValue('Target', firmware.value?.target),
        createValue(
          'Protobuf Version',
          `${info.value?.protobuf.version.major}.${info.value?.protobuf.version.minor}`
        )
      ]
    },
    {
      title: 'Radio Stack',
      values: [createValue('Software Revision', radioStackFormatted.value)]
    },
    {
      title: 'Other',
      values: traverseObject(info.value!, [
        'Hardware Name',
        'Hardware Model',
        'Hardware Region',
        'Hardware Ver',
        'Hardware Otp Ver',
        'Hardware Uid',
        'Firmware Commit',
        'Firmware Build Date',
        'Firmware Target',
        'Info Protobuf Version',
        'Info Radio Stack Major',
        'Info Radio Stack Minor',
        'Info Radio Stack Sub',
        'Info Radio Stack Type'
      ]).sort((a, b) => a.label.localeCompare(b.label))
    }
  ]
})

const fullInfoDialog = ref(false)
const showFullInfo = () => {
  fullInfoDialog.value = true

  flipperStore.flipper?.getInfo({ ignoreLoading: true })
}
</script>
