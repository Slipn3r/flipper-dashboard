import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Platform, exportFile } from 'quasar'

import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'

import { useArchiveWebStore } from './store-web'
import { useArchiveElectronStore } from './store-electron'

export const useArchiveMainStore = defineStore('ArchiveMain', () => {
  const platformStore = Platform.is.electron ? useArchiveElectronStore(useArchiveMainStore()) : useArchiveWebStore(useArchiveMainStore())

  const mainStore = useMainStore()
  const flipper = computed(() => mainStore.flipper)

  const componentName = ref('Archive')
  const path = ref('/')
  const dir = ref([])
  const flags = ref({
    uploadPopup: false,
    uploadFolderPopup: false,
    renamePopup: false,
    mkdirPopup: false,
    blockingOperationPopup: false,
    deletePopup: false
  })
  const uploadedFiles = ref(null)
  const editorText = ref('')
  const oldName = ref('')
  const file = ref({
    name: '',
    progress: 0
  })
  const itemToDelete = ref(null)

  const list = async () => {
    const list = await flipper.value.RPC('storageList', { path: path.value })
      .then(list => {
        log({
          level: 'debug',
          message: `${componentName.value}: storageList: ${path.value}`
        })
        return list
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageList'))

    if (list.length === 0) {
      dir.value = []
      return
    }

    if (path.value === '/') {
      dir.value = list.filter(e => e.name !== 'any')
    } else {
      dir.value = list
    }
  }
  const read = async (path, preventDownload) => {
    flags.value.blockingOperationPopup = true
    file.value.name = path.slice(path.lastIndexOf('/') + 1)
    const localFile = dir.value.find(e => e.name === file.value.name && !e.type)
    const total = localFile.size
    const unbind = flipper.value.emitter.on('storageReadRequest/progress', chunks => {
      file.value.progress = Math.min(chunks * 512, total) / total
    })

    const res = await flipper.value.RPC('storageRead', { path })
      .then(data => {
        log({
          level: 'debug',
          message: `${componentName.value}: storageRead: ${path}`
        })
        return data
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageRead'))
    const s = path.split('/')
    if (!preventDownload) {
      exportFile(s[s.length - 1], res)
    }
    unbind()
    flags.value.blockingOperationPopup = false
    if (preventDownload) {
      return res
    }
  }
  const remove = async (path, isRecursive) => {
    await flipper.value.RPC('storageRemove', { path, recursive: isRecursive })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName.value}: storageRemove: ${path}, recursive: ${isRecursive}`
        })
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageRemove'))
    list()
  }
  const rename = async (path, oldName, newName) => {
    await flipper.value.RPC('storageRename', { oldPath: path + '/' + oldName, newPath: path + '/' + newName })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName.value}: storageRename: ${path}, old name: ${oldName}, new name: ${newName}`
        })
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageRename'))
    list()
  }
  const mkdir = async (path) => {
    await flipper.value.RPC('storageMkdir', { path })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName.value}: storageMkdir: ${path}`
        })
      })
      .catch(error => rpcErrorHandler(componentName, error, 'storageMkdir'))
    list()
  }
  const upload = async () => {
    if (!uploadedFiles.value || uploadedFiles.value.length === 0) {
      return
    }
    flags.value.blockingOperationPopup = true
    for (const localFile of uploadedFiles.value) {
      file.value.name = localFile.name
      let dir = path.value

      if (localFile.webkitRelativePath?.length > 0) {
        const path = localFile.webkitRelativePath.split('/')
        path.pop()
        while (path.length > 0) {
          dir += '/' + path.shift()
          const stat = await flipper.value.RPC('storageStat', { path: dir })
          if (!stat) {
            await flipper.value.RPC('storageMkdir', { path: dir })
          }
        }
      }

      const unbind = flipper.value.emitter.on('storageWriteRequest/progress', e => {
        file.value.progress = e.progress / e.total
      })

      await flipper.value.RPC('storageWrite', { path: dir + '/' + localFile.name, buffer: await localFile.arrayBuffer() })
        .then(() => {
          log({
            level: 'debug',
            message: `${componentName.value}: storageWrite: ${path.value}/${localFile.name}`
          })
        })
        .catch(error => rpcErrorHandler(componentName, error, 'storageWrite'))
      unbind()
    }
    file.value.name = ''
    list()
    flags.value.blockingOperationPopup = false
  }

  const itemClicked = (item) => {
    if (item.type === 1) {
      if (!path.value.endsWith('/')) {
        path.value += '/'
      }
      path.value += item.name
      list()
    } else if (item.name === '..') {
      path.value = path.value.slice(0, path.value.lastIndexOf('/'))
      if (path.value.length === 0) {
        path.value = '/'
      }
      list()
    } else {
      read(path.value + '/' + item.name)
    }
  }
  const openFileIn = async (item, destination) => {
    const res = await read(path.value + '/' + item.name, true)
    mainStore.openFileIn({
      path: destination,
      file: {
        name: item.name,
        data: res
      }
    })
  }
  const itemIconSwitcher = (item) => {
    if (path.value === '/' && item.name === 'int') {
      return 'svguse:common-icons.svg#internal-memory'
    } else if (path.value === '/' && item.name === 'ext') {
      return 'svguse:common-icons.svg#sdcard-memory'
    } else if (item.type === 1) {
      return 'mdi-folder-outline'
    } else if (item.name.endsWith('.badusb')) {
      return 'svguse:file-types.svg#badusb'
    } else if (item.name.endsWith('.ibtn')) {
      return 'svguse:file-types.svg#ibutton'
    } else if (item.name.endsWith('.ir')) {
      return 'svguse:file-types.svg#infrared'
    } else if (item.name.endsWith('.nfc')) {
      return 'svguse:file-types.svg#nfc'
    } else if (item.name.endsWith('.rfid')) {
      return 'svguse:file-types.svg#rfid'
    } else if (item.name.endsWith('.sub')) {
      return 'svguse:file-types.svg#subghz'
    } else if (item.name.endsWith('.u2f')) {
      return 'svguse:file-types.svg#u2f'
    } else {
      return 'mdi-file-outline'
    }
  }

  const start = platformStore.start

  return { flags, path, dir, uploadedFiles, editorText, oldName, file, itemToDelete, remove, rename, mkdir, upload, itemClicked, openFileIn, itemIconSwitcher, list, start }
})
