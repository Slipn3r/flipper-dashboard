<template>
  <q-page class="column no-wrap items-center full-width" padding>
    <div class="text-h6">Raw Sub-GHz/Infrared/RFID pulse plotter</div>
    <q-file
      outlined
      v-model="uploadedFile"
      label="Drop or select file"
      class="q-py-md"
      style="min-width: 200px"
    >
      <template v-slot:prepend>
        <q-icon name="file_upload"></q-icon>
      </template>
    </q-file>

    <q-select
      v-if="currentSignal"
      class="q-mb-md"
      v-model="currentSignal"
      :options="signalOptions"
      option-label="name"
      label="Select signal"
      style="min-width: 200px"
    />

    <PulsePlotter
      v-if="showPlotter"
      :data="data"
      :offscreen="flags.offscreenCanvasSupported"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { PulsePlotter } from 'features/PulsePlotter/Plotter'
import { Notify } from 'quasar'

import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

const fileToPass = computed(() => flipperStore.fileToPass)

const flags = ref({
  offscreenCanvasSupported: true,
  dragging: false
})

const filetype = ref<string>()
const showPlotter = ref(false)

type Data = {
  centerfreq_Hz: number
  pulses: number[]
}
const data = ref<Data>()

const notifyForWrongFile = () => {
  Notify.create({
    type: 'negative',
    message:
      'Wrong file type. Only <b>SubGhz RAW</b>, <b>Infrared RAW</b> and <b>RFID RAW</b> files are accepted.',
    html: true
  })
}

const switchFiletype = async ({
  file,
  isBuffer
}: {
  file?: File | Uint8Array
  isBuffer?: boolean
} = {
  isBuffer: false
}) => {
  if (!file) {
    return
  }

  let buffer: ArrayBuffer
  if (isBuffer) {
    buffer = file as Uint8Array
  } else if (file instanceof File) {
    buffer = await file.arrayBuffer()
  } else {
    throw new Error('Unsupported file type')
  }
  const text = new TextDecoder().decode(buffer).split(/\r?\n/)

  if (text[0].startsWith('RIFL')) {
    return processRfid(new Uint8Array(buffer))
  }

  switch (text[0]) {
    case 'Filetype: Flipper SubGhz RAW File':
      return processSubGhz(text)
    case 'Filetype: IR signals file':
      return processIr(text)
    default:
      notifyForWrongFile()
      break
  }
}

const processSubGhz = (text: string[]) => {
  filetype.value = 'subghz'
  let frequency,
    rawData: string | string[] | number[] = ''
  for (const line of text) {
    if (line.startsWith('Frequency')) {
      frequency = Number(line.split(' ')[1])
    } else if (line.startsWith('RAW_Data')) {
      let raw = line.replaceAll('RAW_Data: ', ' ')
      const deviations = raw.match(/(\s\d+\s\d+)|(\s-\d+\s-\d+)/g)
      if (deviations) {
        for (const match of deviations) {
          const s = match.trim().split(' ')
          if (s[1].startsWith('-')) {
            s.splice(1, 0, '1')
          } else {
            s.splice(1, 0, '-1')
          }
          raw = raw.replace(match, ' ' + s.join(' '))
          console.log(`Fixed deviation:${match} ->${' ' + s.join(' ')}`)
        }
      }
      rawData += raw
    }
  }

  rawData = rawData.trim()

  if (rawData.startsWith('-')) {
    rawData = '0 ' + rawData
  }
  rawData = rawData.replaceAll('-', '').split(' ')
  rawData = rawData.map((e) => Number(e))

  if (frequency) {
    data.value = {
      centerfreq_Hz: frequency,
      pulses: rawData
    }
  }
  onShowPlotter()
}

const uploadedFile = ref<File>()
watch(
  () => uploadedFile.value,
  (newFile) => {
    signalOptions.value = []
    currentSignal.value = undefined
    switchFiletype({
      file: newFile
    })
  }
)

type Signal = {
  name?: string
  type?: string
  frequency?: number
  data?: string | string[] | number[]
}
const signalOptions = ref<Signal[]>([])
const currentSignal = ref<Signal>()
watch(
  () => currentSignal.value,
  (newSignal) => {
    if (newSignal) {
      if (newSignal.frequency && newSignal.data?.length) {
        data.value = {
          centerfreq_Hz: newSignal.frequency,
          pulses: newSignal.data as number[]
        }
      }
    }
  }
)

const processIr = (text: string[]) => {
  filetype.value = 'ir'
  let signals: Signal[] = [],
    i = -1
  for (const line of text) {
    if (line.startsWith('#')) {
      i++
      signals[i] = {}
    } else if (line.startsWith('name')) {
      signals[i].name = line.split(' ')[1]
    } else if (line.startsWith('type')) {
      signals[i].type = line.split(' ')[1]
    } else if (line.startsWith('frequency')) {
      signals[i].frequency = Number(line.split(' ')[1])
    } else if (line.startsWith('data')) {
      signals[i].data = line.split(': ')[1]
    }
  }

  signals = signals.filter((e) => e.type === 'raw')
  if (signals.length === 0) {
    notifyForWrongFile()
    return
  }

  for (const signal of signals) {
    signal.data = (signal.data as string).split(' ')
    signal.data = signal.data.map((e) => Number(e))
  }

  signalOptions.value = signals
  currentSignal.value = signals[0]

  onShowPlotter()
}

type Header = {
  magic: number
  version: number
  frequency: number
  dutyCycle: number
  maxBufferSize: number
}
const processRfid = (rawData: Uint8Array) => {
  filetype.value = 'rfid'

  const sliceView = (from: number, to: number) => {
    const view = new DataView(new ArrayBuffer(to - from))
    rawData
      .slice(from, to)
      .reverse()
      .forEach((b, i) => {
        view.setUint8(i, b)
      })
    return view
  }

  const header: Header = {
    magic: sliceView(0, 4).getUint32(0),
    version: sliceView(4, 8).getUint32(0),
    frequency: sliceView(8, 12).getFloat32(0),
    dutyCycle: sliceView(12, 16).getFloat32(0),
    maxBufferSize: sliceView(16, 20).getUint32(0)
  }

  const readVarInt = (buffer: Uint8Array) => {
    let value = 0
    let length = 0
    let currentByte

    while (true) {
      currentByte = buffer[length]
      value |= (currentByte & 0x7f) << (length * 7)
      length += 1
      if (length > 5) {
        throw new Error('VarInt exceeds allowed bounds.')
      }
      if ((currentByte & 0x80) !== 0x80) break
    }
    return { value, length }
  }

  let dataOffset = 20,
    bufferSize = sliceView(dataOffset, dataOffset + 4).getUint32(0)
  const varints = []
  if (bufferSize > header.maxBufferSize) {
    throw new Error(
      `Buffer size (${bufferSize}) exceeds max_buffer_size (${header.maxBufferSize})`
    )
  }
  while (rawData.length > dataOffset) {
    const buffer = rawData.slice(dataOffset, dataOffset + bufferSize)
    let bufferOffset = 4
    while (bufferOffset < buffer.length) {
      const varint = readVarInt(buffer.slice(bufferOffset))
      bufferOffset += varint.length
      varints.push(varint.value)
    }
    dataOffset += bufferSize + 4
    bufferSize = sliceView(dataOffset, dataOffset + 4).getUint32(0)
  }

  data.value = {
    centerfreq_Hz: header.frequency,
    pulses: varints
  }
  onShowPlotter()
}

const onShowPlotter = () => {
  showPlotter.value = true
}

onMounted(() => {
  if (fileToPass.value) {
    switchFiletype({
      file: fileToPass.value.data as File | Uint8Array,
      isBuffer: true
    })
  }
  if (typeof OffscreenCanvas !== 'undefined') {
    flags.value.offscreenCanvasSupported = true
  } else {
    flags.value.offscreenCanvasSupported = false
  }
})
</script>
