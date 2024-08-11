import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import PixelEditor from 'shared/lib/utils/pixeleditor/pixeleditor'

export const usePaintStore = defineStore('paint', () => {
  const flags = reactive({
    checkerboard: false,
    imageFileLoading: false,
    ditherDialog: false
  })

  const pe = ref<PixelEditor>()

  const createEditor = () => {
    pe.value = new PixelEditor({
      width: 128,
      height: 64,
      container: document.querySelector('.pe-container'),
      onUpdate: updateMirror
    })
  }

  const mirror = ref<HTMLCanvasElement>()
  const setMirror = (element: HTMLCanvasElement) => {
    mirror.value = element
  }
  const updateMirror = () => {
    const mirror = document.querySelector('.mirror') as HTMLCanvasElement
    const imageData = pe.value?.toImageData()
    if (imageData) {
      mirror.getContext('2d')?.putImageData(imageData, 0, 0)
    }
  }

  const zoomLevel = ref(4)
  const uploadedImage = ref<HTMLImageElement>()

  return {
    flags,
    pe,
    createEditor,

    mirror,
    setMirror,

    zoomLevel,
    uploadedImage
  }
})
