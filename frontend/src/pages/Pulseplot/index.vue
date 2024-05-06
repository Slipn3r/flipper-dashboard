<template>
  <q-page class="column no-wrap items-center q-pa-md full-width">
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
      v-model="currentSignal"
      :options="signalOptions"
      option-label="name"
      label="Select signal"
      style="min-width: 200px"
    />

    <FlipperPlotter
      v-if="showPlotter"
      :data="data"
      :offscreen="flags.offscreenCanvasSupported"
    />
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import FlipperPlotter from 'src/components/FlipperPlotter.vue'
import { Notify } from 'quasar'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const fileToPass = computed(() => mainStore.fileToPass)

const flags = ref({
  offscreenCanvasSupported: true,
  dragging: false
})
const uploadedFile = ref(null)
const filetype = ref(null)
const showPlotter = ref(false)
const data = ref(null)
const signalOptions = ref(null)
const currentSignal = ref(null)

watch(
  () => uploadedFile.value,
  (newFile) => {
    signalOptions.value = null
    currentSignal.value = null
    switchFiletype(newFile)
  }
)

watch(
  () => currentSignal.value,
  (newSignal) => {
    if (newSignal) {
      data.value = {
        centerfreq_Hz: newSignal.frequency,
        pulses: newSignal.data
      }
    }
  }
)

const notifyForWrongFile = () => {
  Notify.create({
    type: 'negative',
    message:
      'Wrong file type. Only <b>SubGhz RAW</b>, <b>Infrared RAW</b> and <b>RFID RAW</b> files are accepted.',
    html: true
  })
}

const switchFiletype = async (file, isBuffer) => {
  let buffer
  if (isBuffer) {
    buffer = file
  } else {
    buffer = await file.arrayBuffer()
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

const processSubGhz = (text) => {
  filetype.value = 'subghz'
  let frequency,
    rawData = ''
  for (const line of text) {
    if (line.startsWith('Frequency')) {
      frequency = line.split(' ')[1]
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

  data.value = {
    centerfreq_Hz: frequency,
    pulses: rawData
  }
  onShowPlotter()
}

const processIr = (text) => {
  filetype.value = 'ir'
  let signals = [],
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
      signals[i].frequency = line.split(' ')[1]
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
    signal.data = signal.data.split(' ')
    signal.data = signal.data.map((e) => Number(e))
  }

  signalOptions.value = signals
  currentSignal.value = signals[0]

  onShowPlotter()
}

const processRfid = (rawData) => {
  filetype.value = 'rfid'

  const sliceView = (from, to) => {
    const view = new DataView(new ArrayBuffer(to - from))
    rawData
      .slice(from, to)
      .reverse()
      .forEach((b, i) => {
        view.setUint8(i, b)
      })
    return view
  }

  const header = {
    magic: sliceView(0, 4).getUint32(),
    version: sliceView(4, 8).getUint32(),
    frequency: sliceView(8, 12).getFloat32(0),
    dutyCycle: sliceView(12, 16).getFloat32(0),
    maxBufferSize: sliceView(16, 20).getUint32()
  }

  const readVarInt = (buffer) => {
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
    bufferSize = sliceView(dataOffset, dataOffset + 4).getUint32()
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
    bufferSize = sliceView(dataOffset, dataOffset + 4).getUint32()
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
    switchFiletype(fileToPass.value.data, true)
  }
  if (typeof OffscreenCanvas !== 'undefined') {
    flags.value.offscreenCanvasSupported = true
  } else {
    flags.value.offscreenCanvasSupported = false
  }
})
</script>
