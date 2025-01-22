<template>
  <div v-if="pe" class="controls q-pa-xs rounded-borders bg-grey-2">
    <q-btn-toggle
      v-model="modeModel"
      flat
      dense
      :options="[
        {
          value: 'pencil',
          slot: 'pencil',
          attrs: {
            'aria-mode': 'draw'
          }
        },
        {
          value: 'eraser',
          slot: 'eraser',
          attrs: {
            'aria-mode': 'erase'
          }
        },
        {
          value: 'line',
          slot: 'line',
          attrs: {
            'aria-mode': 'line'
          }
        },
        {
          value: 'rectangle',
          slot: 'rectangle',
          attrs: {
            'aria-mode': 'rect'
          }
        },
        {
          value: 'fill',
          slot: 'fill',
          attrs: {
            'aria-mode': 'fill'
          }
        }
      ]"
      @update:model-value="changeMode"
    >
      <template v-slot:pencil
        ><q-icon name="mdi-pencil" class="q-px-sm"
      /></template>
      <template v-slot:eraser
        ><q-icon name="mdi-eraser" class="q-px-sm"
      /></template>
      <template v-slot:line
        ><q-icon name="mdi-vector-line" class="q-px-sm"
      /></template>
      <template v-slot:rectangle
        ><q-icon name="mdi-vector-rectangle" class="q-px-sm"
      /></template>
      <template v-slot:fill
        ><q-icon name="mdi-format-color-fill" class="q-px-sm q-pt-xs"
      /></template>
    </q-btn-toggle>

    <input type="file" class="file-upload hidden" @change="upload" />
    <q-btn
      flat
      dense
      @click="triggerUpload"
      :loading="paintStore.flags.imageFileLoading"
      class="q-px-sm"
      icon="mdi-file-image-outline"
    ></q-btn>

    <q-btn
      flat
      dense
      :color="paintStore.flags.checkerboard ? 'primary' : 'black'"
      icon="mdi-checkerboard"
      class="q-px-sm"
      @click="paintStore.flags.checkerboard = !paintStore.flags.checkerboard"
    ></q-btn>

    <q-separator vertical class="q-mx-xs"></q-separator>

    <q-btn-group flat>
      <q-btn dense icon="mdi-undo" class="q-px-sm" @click="undo"></q-btn>
      <q-btn dense icon="mdi-redo" class="q-px-sm" @click="redo"></q-btn>
    </q-btn-group>

    <q-separator vertical class="q-mx-xs"></q-separator>

    <q-btn-group flat>
      <q-btn
        icon="mdi-magnify-minus-outline"
        class="q-px-sm"
        @click="zoom({ offset: -1 })"
      ></q-btn>
      <!-- <q-input
        dense
        outlined
        :model-value="zoomLevel"
        @change="val => { zoomLevel = /^[0-9]*$/.test(val) ? Number(val) : zoomLevel }"
        @update:modelValue="val => { zoomLevel = Number(val) zoom({ val }) }"
        :rules="[val => /^[0-9]*$/.test(val)]"
        hide-bottom-space
        style="width: 52px"
        label="Zoom"
        class="q-mx-xs"
      /> -->
      <q-btn
        icon="mdi-magnify-plus-outline"
        class="q-px-sm"
        @click="zoom({ offset: 1 })"
      ></q-btn>
    </q-btn-group>

    <q-separator vertical class="q-mx-xs"></q-separator>

    <q-btn
      flat
      icon="mdi-file-download-outline"
      class="q-px-sm"
      @click="download"
    ></q-btn>

    <q-btn
      flat
      icon="mdi-delete-outline"
      class="q-px-sm"
      color="negative"
      @click="clear"
    ></q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { exportFile } from 'quasar'

import { showNotif } from 'shared/lib/utils/useShowNotif'

import { PaintModel } from 'entity/Paint'
const paintStore = PaintModel.usePaintStore()
const pe = computed(() => paintStore.pe)

const modeModel = ref('pencil')
const changeMode = (value: string) => {
  if (pe.value) {
    switch (value) {
      case 'pencil':
        pe.value.currentColor = 1
        pe.value.mode = 'draw'
        break
      case 'eraser':
        pe.value.currentColor = 0
        pe.value.mode = 'draw'
        break
      case 'line':
        pe.value.currentColor = 1
        pe.value.mode = 'line'
        break
      case 'rectangle':
        pe.value.currentColor = 1
        pe.value.mode = 'rect'
        break
      case 'fill':
        pe.value.currentColor = 1
        pe.value.mode = 'fill'
        break
    }
  }
}

const zoomLimit = computed(() => {
  /* const containerWidth = document.querySelector('.paint').clientWidth
      const containerHeight = document.querySelector('.paint').clientHeight
      let max = 10
      if (containerWidth) {
        max = Math.round(Math.min(containerWidth / 128, containerHeight / 64))
      } */
  return {
    min: 1,
    max: 8
  }
})

watch(
  () => paintStore.zoomLevel,
  (newValue: number) => {
    if (!/^[0-9]*$/.test(String(newValue))) {
      return
    }
    if (pe.value) {
      pe.value.resize({ zoom: newValue })
    }
  }
)

const zoom = ({
  mul,
  val,
  offset
}: {
  mul?: number
  val?: number
  offset: number
}) => {
  let result
  if (mul) {
    result = paintStore.zoomLevel * mul
  } else if (val) {
    result = val
  } else if (offset) {
    result = paintStore.zoomLevel + offset
  }
  if (result) {
    if (result < zoomLimit.value.min) {
      paintStore.zoomLevel = zoomLimit.value.min
    } else if (result > zoomLimit.value.max) {
      paintStore.zoomLevel = zoomLimit.value.max
    } else {
      paintStore.zoomLevel = result
    }
  }
}
const undo = () => {
  pe.value?.undo()
}
const redo = () => {
  pe.value?.redo()
}
const clear = () => {
  pe.value?.clear()
}

const triggerUpload = () => {
  const el: HTMLInputElement | null = document.querySelector('.file-upload')
  if (el) {
    el.click()
  }
}
const upload = (event: Event): void => {
  paintStore.flags.imageFileLoading = true

  try {
    const input = event.target as HTMLInputElement
    if (input) {
      const files = input.files
      if (files?.length) {
        const file = files[0]
        if (file) {
          const reader = new FileReader()

          reader.onload = () => {
            if (reader.readyState !== FileReader.DONE) {
              return
            }
            const img = new Image()
            img.onload = () => {
              ;(
                document.querySelector('.file-upload') as HTMLInputElement
              ).value = ''
              paintStore.flags.imageFileLoading = false
              paintStore.uploadedImage = img
              paintStore.flags.ditherDialog = true
            }
            img.src = reader.result as string
          }

          reader.readAsDataURL(file)
        }
      }
    }
  } catch (error) {
    paintStore.flags.imageFileLoading = false
    console.error(error)
  }
}

const download = async () => {
  const blob = (await pe.value?.toBlob()) as Blob
  const status = exportFile(`Paint_${new Date().toISOString()}.png`, blob)
  if (!status) {
    showNotif({
      message: 'Failed to download image: permission denied',
      color: 'negative'
    })
  }
}
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  z-index: 1;
}
</style>
