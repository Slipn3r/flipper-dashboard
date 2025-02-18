<template>
  <div>
    <q-toolbar class="toolbar row justify-between q-mb-md">
      <q-btn
        class="col-auto"
        color="primary"
        icon="chevron_left"
        outline
        padding="sm"
        size="sm"
        :disabled="fullPath === '/'"
        @click="itemClicked({ name: '..' })"
      />
      <q-breadcrumbs class="col q-mx-md" active-color="black" gutter="xs">
        <template v-slot:separator>
          <q-icon size="1.4em" name="chevron_right" />
        </template>
        <template v-for="(item, index) in pathList" :key="index">
          <q-breadcrumbs-el
            class="toolbar__breadcrumb justify-center"
            :class="{ 'cursor-pointer': item.path !== fullPath }"
            :label="item.name"
            :icon="item.icon"
            @click="
              movePath({
                item
              })
            "
          />
        </template>
      </q-breadcrumbs>
      <q-btn-dropdown
        class="col-auto q-mr-sm"
        color="primary"
        dropdown-icon="add"
        no-icon-animation
        outline
        padding="sm"
        size="sm"
        :disabled="fullPath === '/'"
        auto-close
      >
        <q-list style="min-width: 100px">
          <q-item clickable @click="showUploadFileDialog">
            <q-item-section avatar>
              <q-icon name="mdi-file-upload-outline" />
            </q-item-section>
            <q-item-section> Upload file </q-item-section>
          </q-item>
          <q-item clickable @click="showUploadFolderDialog">
            <q-item-section avatar>
              <q-icon name="mdi-folder-upload-outline" />
            </q-item-section>
            <q-item-section> Upload folder </q-item-section>
          </q-item>
          <q-item clickable @click="showMkdirDialog">
            <q-item-section avatar>
              <q-icon name="mdi-folder-plus-outline" />
            </q-item-section>
            <q-item-section> Create folder </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn
        class="col-auto q-mr-sm"
        color="primary"
        icon="mdi-refresh"
        outline
        padding="sm"
        size="sm"
        @click="refreshList"
      />
      <q-toggle
        class="col-auto"
        v-model="isHiddenFiles"
        color="primary"
        label="Hidden files"
        @update:model-value="() => navigator?.setItems(filteredDirs)"
      />
    </q-toolbar>
    <q-list
      class="list no-outline"
      tabindex="0"
      ref="container"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <template v-for="(item, index) in filteredDirs" :key="Symbol(item.name)">
        <q-item
          ref="containerItem"
          class="rounded-borders full-width"
          v-bind="item"
          manual-focus
          :focused="focusedIndex === index"
          clickable
          v-ripple
          @click="itemClicked(item)"
        >
          <q-item-section avatar>
            <q-icon :name="itemIconSwitcher(item)" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis">{{ item.name }}</q-item-label>
            <q-item-label class="ellipsis" caption>
              <span v-if="fullPath === '/' && item.name === 'int'"
                >Flipper internal storage</span
              >
              <span v-if="fullPath === '/' && item.name === 'ext'"
                >SD card</span
              >
              <span
                v-if="item.type !== 1 && item.size"
                class="text-weight-light"
                >{{ item.size }} bytes</span
              >
            </q-item-label>
          </q-item-section>
          <q-item-section v-if="fullPath !== '/'" avatar>
            <q-btn-dropdown
              flat
              dense
              round
              dropdown-icon="more_vert"
              no-icon-animation
              @click.stop
              auto-close
            >
              <q-list style="min-width: 100px">
                <q-item
                  v-if="
                    item.name.endsWith('.sub') ||
                    item.name.endsWith('.ir') ||
                    item.name.endsWith('.nfc') ||
                    item.name.endsWith('.rfid') ||
                    item.name.endsWith('.ibtn')
                  "
                  clickable
                  @click="editFile(item)"
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-file-edit-outline" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Edit</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  v-if="item.type === 0 || flipperStore.isElectron"
                  clickable
                  @click="
                    download({
                      file: item
                    })
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-download-outline" />
                  </q-item-section>
                  <q-item-section> Download </q-item-section>
                </q-item>
                <q-item
                  v-if="item.name.endsWith('.sub') || item.name.endsWith('.ir')"
                  clickable
                  @click="
                    openFileIn({
                      item,
                      destination: { name: 'PulsePlotter' }
                    })
                  "
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-share-outline" />
                  </q-item-section>
                  <q-item-section> Open in Pulse plotter </q-item-section>
                </q-item>
                <q-item clickable @click="renameItem(item)">
                  <q-item-section avatar>
                    <q-icon name="mdi-pencil-outline" />
                  </q-item-section>
                  <q-item-section> Rename </q-item-section>
                </q-item>
                <q-item
                  class="text-negative"
                  clickable
                  @click="deleteItem(item)"
                >
                  <q-item-section avatar>
                    <q-icon name="mdi-delete-outline" />
                  </q-item-section>
                  <q-item-section> Delete </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </template>
      <q-item
        v-if="filteredDirs.length === 0 && fullPath !== '/'"
        class="text-grey-7 full-width"
      >
        <q-item-section avatar class="q-ml-xs">
          <q-icon name="mdi-folder-outline" />
        </q-item-section>

        <q-item-section>
          <q-item-label> Empty folder </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="uploadFolderDialog">
      <q-card>
        <q-card-section class="q-pt-none">
          <q-file
            outlined
            multiple
            webkitdirectory
            v-model="uploadedFiles"
            label="Drop or select folder"
            class="q-pt-md folder-upload"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-folder-upload-outline"></q-icon>
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Upload" v-close-popup @click="upload"></q-btn>
          <q-btn flat label="Cancel" color="negative" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteDialog">
      <template v-if="itemToDelete">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">
              Are you sure you want to delete <b>{{ itemToDelete.name }}</b
              >?
            </div>
            This action is permanent and can't be undone.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup></q-btn>
            <q-btn
              flat
              label="Delete"
              color="negative"
              v-close-popup
              @click="
                remove({
                  path: `${fullPath}/${itemToDelete?.name}`,
                  isRecursive: !!itemToDelete?.type
                })
              "
            ></q-btn>
          </q-card-actions>
        </q-card>
      </template>
    </q-dialog>
    <q-dialog v-model="uploadDialog">
      <q-card>
        <q-card-section class="q-pt-none">
          <q-file
            outlined
            multiple
            v-model="uploadedFiles"
            label="Drop or select files"
            class="q-pt-md"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="mdi-file-upload-outline"></q-icon>
            </template>
          </q-file>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Upload" v-close-popup @click="upload"></q-btn>
          <q-btn flat label="Cancel" color="negative" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="renameDialog" @hide="hideRenameDialog">
      <q-card>
        <q-card-section>
          <q-input
            v-model.trim="editableItem.newName"
            :label="'Rename ' + editableItem.oldName"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
            @update:model-value="
              (value: string | number | null) =>
                debouncedValidateName(value as string, 'inputRename')
            "
            :error-message="validationMessage"
            :error="!validationStatus['inputRename']"
            bottom-slots
          ></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Save"
            v-close-popup
            :disable="!validationStatus['inputRename']"
            @click="
              rename({
                path: fullPath,
                oldName: editableItem.oldName,
                newName: editableItem.newName
              })
            "
          ></q-btn>
          <q-btn flat label="Cancel" color="negative" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mkdirDialog" @hide="hideMkdirDialog">
      <q-card>
        <q-card-section>
          <q-input
            v-model.trim="createdDirName"
            label="Folder name"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
            @update:model-value="
              (value: string | number | null) =>
                debouncedValidateName(value as string, 'inputDirName')
            "
            :error-message="validationMessage"
            :error="!validationStatus['inputDirName']"
            bottom-slots
          ></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Create"
            v-close-popup
            :disable="!validationStatus['inputDirName']"
            @click="
              mkdir({
                path: `${fullPath}/${createdDirName}`
              })
            "
          ></q-btn>
          <q-btn flat label="Cancel" color="negative" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="blockingOperationDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">File operation in progress</div>
        </q-card-section>
        <q-card-section v-if="selectedFile.name.length > 0">
          <ProgressBar
            :title="selectedFile.name"
            :progress="selectedFile.progress"
          />
        </q-card-section>
        <q-card-section v-else>
          <ProgressBar indeterminate />
        </q-card-section>
      </q-card>
    </q-dialog>
    <FileEditor
      v-model="showEditor"
      :file="currentEditFile!"
      :doc="editFileDoc"
      :type="editFileType"
      @save="saveFile"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  unref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  reactive,
  useTemplateRef
} from 'vue'
import { exportFile, debounce, type QList, type QItem } from 'quasar'
import { type RouteLocationRaw } from 'vue-router'

import { FileEditor } from 'features/FileEditor'
import { FileEditorModel } from 'entity/FileEditor'

import { showNotif } from 'shared/lib/utils/useShowNotif'
import { logger } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'
import {
  downloadFile,
  downloadFolder
} from 'shared/lib/utils/useFileDownloader'

import { ProgressBar } from 'shared/components/ProgressBar'

import { FlipperModel, FlipperLib } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

const componentName = 'FlipperFileExplorer'

type PathItem = FlipperModel.File & {
  path: string
  icon?: string
}

const fullPath = ref('/')
const pathList = ref<PathItem[]>([
  {
    name: '/',
    path: '/'
  }
])

const isHiddenFiles = ref(false)

const dirs = ref<FlipperModel.File[]>([])
const filteredDirs = computed(() => {
  if (!isHiddenFiles.value) {
    return dirs.value.filter((e: FlipperModel.File) => !e.name.startsWith('.'))
  }

  return dirs.value
})

const itemIconSwitcher = (item: FlipperModel.File) => {
  if (fullPath.value === '/' && item.name === 'int') {
    return 'flipper:internal-memory'
  } else if (fullPath.value === '/' && item.name === 'ext') {
    return 'flipper:sdcard-memory'
  } else if (item.type === 1) {
    return 'mdi-folder-outline'
  } else if (item.name.endsWith('.badusb')) {
    return 'flipper:badusb'
  } else if (item.name.endsWith('.ibtn')) {
    return 'flipper:ibutton'
  } else if (item.name.endsWith('.ir')) {
    return 'flipper:infrared'
  } else if (item.name.endsWith('.nfc')) {
    return 'flipper:nfc'
  } else if (item.name.endsWith('.rfid')) {
    return 'flipper:rfid'
  } else if (item.name.endsWith('.sub')) {
    return 'flipper:subghz'
  } else if (item.name.endsWith('.u2f')) {
    return 'flipper:u2f'
  } else {
    return 'mdi-file-outline'
  }
}

const validationMessage =
  "Invalid characters! Allowed: 0-9, A-Z, a-z, !#\\$%&'()-@^_`{}~., and spaces."
const validationStatus = reactive({
  inputRename: true,
  inputDirName: true
})

type validateName = (
  value: string,
  refName: keyof typeof validationStatus
) => boolean

const validateName: validateName = (value, refName) => {
  const pattern = /^[0-9A-Za-z!#\\\$%&'()\-\@^_`\{\}~\. ]*$/
  const isValid = pattern.test(value)

  validationStatus[refName] = isValid && value !== ''

  return isValid
}
const debouncedValidateName = debounce<validateName>(validateName, 300)

const uploadDialog = ref(false)
const showUploadFileDialog = () => {
  uploadDialog.value = true
  uploadedFiles.value = undefined
}

const uploadFolderDialog = ref(false)
const showUploadFolderDialog = () => {
  uploadFolderDialog.value = true
  uploadedFiles.value = undefined
}

const blockingOperationDialog = ref(false)
const uploadedFiles = ref<File[]>()
const upload = async () => {
  if (!uploadedFiles.value || uploadedFiles.value.length === 0) {
    return
  }
  blockingOperationDialog.value = true
  for (const localFile of uploadedFiles.value) {
    if (localFile) {
      selectedFile.value.name = localFile.name
    }
    let dir = fullPath.value

    if (localFile.webkitRelativePath?.length > 0) {
      const path = localFile.webkitRelativePath.split('/')
      path.pop()
      while (path.length > 0) {
        dir += '/' + path.shift()
        await flipperStore.flipper
          ?.RPC('storageStat', {
            path: dir
          })
          .catch(async (error: Error) => {
            if (error.toString() === 'ERROR_STORAGE_NOT_EXIST') {
              await flipperStore.flipper?.RPC('storageMkdir', { path: dir })
            }
          })
      }
    }

    const unbind = flipperStore.flipper?.emitter.on(
      'storageWriteRequest/progress',
      (e: { progress: number; total: number }) => {
        selectedFile.value.progress = e.progress / e.total
      }
    )

    await flipperStore.flipper
      ?.RPC('storageWrite', {
        path: dir + '/' + localFile.name,
        buffer: await localFile.arrayBuffer()
      })
      .then(() => {
        logger.debug({
          context: componentName,
          message: `storageWrite: ${dir}/${localFile.name}`
        })
      })
      .catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageWrite' })
      )
    if (unbind) {
      unbind()
    }
  }
  selectedFile.value.name = ''
  list({
    path: fullPath.value
  })
  blockingOperationDialog.value = false
}

const mkdirDialog = ref(false)
const createdDirName = ref('')
const showMkdirDialog = () => {
  mkdirDialog.value = true
  createdDirName.value = ''
}
const hideMkdirDialog = () => {
  createdDirName.value = ''
  validationStatus.inputDirName = true
}
const mkdir = async ({ path }: { path: string }) => {
  await flipperStore.flipper
    ?.RPC('storageMkdir', { path })
    .then(() => {
      logger.debug({
        context: componentName,
        message: `storageMkdir: ${path}`
      })
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
    )
  list({
    path: fullPath.value
  })
}

const { FileNavigator } = FlipperLib
const navigator = ref<InstanceType<typeof FileNavigator>>()

const container = useTemplateRef<QList>('container')
const containerItem = useTemplateRef<QItem[]>('containerItem')

const focusedIndex = ref<number | null>(null)
const onKeydown = async (e: KeyboardEvent) => {
  if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
    focusedIndex.value = navigator.value!.navigate(
      e.key as 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'
    )
  }

  if (e.key === 'Enter') {
    if (containerItem.value?.length && focusedIndex.value !== null) {
      // HACK For some reason the containerItem is reversed
      const list = [...containerItem.value].reverse()
      const item = list[focusedIndex.value]

      if (item?.focused) {
        item.$el.click()

        focusedIndex.value = 0
        navigator.value?.setCurrentIndex(focusedIndex.value)
      }
    }
  }

  if (e.key === 'Backspace') {
    if (fullPath.value !== '/') {
      itemClicked({ name: '..' })
    }
  }
}

const handleGlobalKeydown = (e: KeyboardEvent) => {
  if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
    if (container.value && document.activeElement !== container.value.$el) {
      container.value.$el.focus()
      focusedIndex.value = navigator.value!.navigate(
        e.key as 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'
      )

      e.preventDefault()
    }
  }
}

const onBlur = () => {
  focusedIndex.value = null
  navigator.value?.setCurrentIndex(focusedIndex.value)
}

onMounted(async () => {
  try {
    if (flipperStore.flipperReady) {
      if (!flipperStore.rpcActive) {
        await flipperStore.flipper?.startRPCSession()
      }

      if (flipperStore.flipper?.readingMode.type === 'rpc') {
        if (!flipperStore.info) {
          await flipperStore.flipper?.getInfo()
        }

        await list({
          path: fullPath.value
        })

        window.addEventListener('keydown', handleGlobalKeydown)
        if (container.value) {
          container.value.$el.focus()

          navigator.value = new FileNavigator(
            filteredDirs.value,
            container.value.$el
          )
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

watch(
  () => flipperStore.flipperReady,
  (newValue) => {
    if (newValue) {
      list({
        path: fullPath.value
      })
    }
  }
)

const list = async ({ path }: { path: string }) => {
  const list = await flipperStore.flipper
    ?.RPC('storageList', { path })
    .then((list: FlipperModel.File[]) => {
      logger.debug({
        context: componentName,
        message: `storageList: ${path}`
      })
      return list
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageList' })
    )

  if (list.length === 0) {
    dirs.value = []
    return
  }

  if (path === '/') {
    dirs.value = list.filter((e: FlipperModel.File) => e.name !== 'any')
  } else {
    dirs.value = list
  }

  navigator.value?.setItems(filteredDirs.value)
}
const refreshList = () => {
  list({
    path: fullPath.value
  })
}

const movePath = async ({ item }: { item: PathItem }) => {
  if (item.path !== fullPath.value) {
    await list({
      path: item.path
    })

    fullPath.value = item.path

    const removeIndex = pathList.value.findIndex(
      (dir) => dir.name === item.name
    )
    pathList.value.splice(removeIndex + 1)
  }
}

const itemClicked = async (item: FlipperModel.File) => {
  if (item.type === 1) {
    let path = unref(fullPath.value)
    if (!fullPath.value.endsWith('/')) {
      path += '/'
    }
    path += item.name

    await list({
      path
    })

    pathList.value.push({
      ...item,
      path: unref(path),
      icon: itemIconSwitcher(item)
    })
    fullPath.value = path
  } else if (item.name === '..') {
    let path = unref(fullPath.value.slice(0, fullPath.value.lastIndexOf('/')))
    if (path.length === 0) {
      path = '/'
    }

    await list({
      path
    })

    fullPath.value = path
    pathList.value.pop()
  } else {
    read({
      file: item
    })
  }
}

const selectedFile = ref({
  name: '',
  progress: 0
})
const read = async ({
  file,
  preventDownload
}: {
  file: FlipperModel.File
  preventDownload?: boolean
}) => {
  blockingOperationDialog.value = true
  selectedFile.value.name = fullPath.value.slice(
    fullPath.value.lastIndexOf('/') + 1
  )
  const localFile = dirs.value.find(
    (e) => e.name === selectedFile.value.name && !e.type
  )

  let unbind
  if (localFile) {
    const total = localFile.size

    if (total) {
      unbind = flipperStore.flipper?.emitter.on(
        'storageReadRequest/progress',
        (chunks: number) => {
          selectedFile.value.progress = Math.min(chunks * 512, total) / total
        }
      )
    }
  }

  if (!preventDownload) {
    download({ file })
  }

  if (unbind) {
    unbind()
  }
  blockingOperationDialog.value = false

  selectedFile.value = {
    name: '',
    progress: 0
  }

  if (preventDownload) {
    const filePath = `${unref(fullPath.value)}/${file.name}`

    const res: Uint8Array = await flipperStore.flipper
      ?.RPC('storageRead', { path: filePath })
      .then((data: Uint8Array) => {
        logger.debug({
          context: componentName,
          message: `storageRead: ${filePath}`
        })
        return data
      })
      .catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageRead' })
      )

    return res
  }
}
const openFileIn = async ({
  item,
  destination
}: {
  item: FlipperModel.File
  destination: RouteLocationRaw
}) => {
  const res = await read({
    file: item,
    preventDownload: true
  })

  if (res) {
    flipperStore.openFileIn({
      path: destination,
      file: {
        name: item.name,
        data: res
      }
    })
  }
}

interface FlipperFile extends FlipperModel.File {
  type: number
  path: string
}

const createStructure = async ({
  file
}: {
  file: FlipperFile
}): Promise<FolderStructure | FileStructure> => {
  if (file.type === 0) {
    const res: Uint8Array = await flipperStore.flipper
      ?.RPC('storageRead', { path: file.path })
      .then((data: Uint8Array) => {
        return data
      })
      .catch((error: Error) =>
        rpcErrorHandler({
          componentName: `${componentName} function createStructure`,
          error,
          command: 'storageRead'
        })
      )

    return {
      name: file.name,
      type: file.type,
      rawData: res
    }
  }

  const folderStructure: FolderStructure = {
    name: file.name,
    type: file.type,
    data: []
  }

  const folderContents = await flipperStore.flipper
    ?.RPC('storageList', { path: file.path })
    .then((list: FlipperModel.File[]) => {
      if (!isHiddenFiles.value) {
        return list.filter((e: FlipperModel.File) => !e.name.startsWith('.'))
      }

      return list
    })
    .catch((error: Error) =>
      rpcErrorHandler({
        componentName: `${componentName} function createStructure`,
        error,
        command: 'storageList'
      })
    )

  for (const item of folderContents) {
    const structure = await createStructure({
      file: {
        name: item.name,
        type: item.type,
        path: file.path + '/' + item.name
      }
    })
    folderStructure.data.push(structure)
  }

  return folderStructure
}

const download = async ({ file }: { file: FlipperModel.File }) => {
  const filePath = `${unref(fullPath.value)}/${file.name}`

  if (file.type === 1) {
    blockingOperationDialog.value = true

    const folderStructure = await createStructure({
      file: {
        name: file.name,
        type: file.type,
        path: filePath
      }
    })

    await downloadFolder({ structure: folderStructure }).then((res) => {
      if (res.status === 'error') {
        showNotif({
          message: res.message,
          color: 'negative'
        })
      }

      if (res?.status === 'ok') {
        showNotif({
          message: `Folder «${file.name}» save in «${res.path}»`,
          color: 'positive',
          timeout: 5000
        })
      }
    })

    blockingOperationDialog.value = false
    return
  }

  if (file.type === 0) {
    const res: Uint8Array = await flipperStore.flipper
      ?.RPC('storageRead', { path: filePath })
      .then((data: Uint8Array) => {
        logger.debug({
          context: componentName,
          message: `storageRead: ${filePath}`
        })
        return data
      })
      .catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageRead' })
      )

    if (flipperStore.isElectron) {
      downloadFile({
        file: file,
        rawData: res
      }).then((res) => {
        if (res?.status === 'error') {
          showNotif({
            message: res.message,
            color: 'negative'
          })
        }

        if (res?.status === 'ok') {
          showNotif({
            message: `File «${file.name}» save in «${res.path}»`,
            color: 'positive',
            timeout: 5000
          })
        }
      })
    } else {
      const s = filePath.split('/')
      exportFile(s[s.length - 1]!, res)
    }
  }
}

const renameDialog = ref(false)
const editableItem = ref<{
  oldName: string
  newName: string
}>({
  oldName: '',
  newName: ''
})
const renameItem = (item: FlipperModel.File) => {
  editableItem.value.oldName = item.name
  editableItem.value.newName = unref(item.name)
  renameDialog.value = true

  if (editableItem.value.newName) {
    validateName(editableItem.value.newName, 'inputRename')
  }
}
const hideRenameDialog = () => {
  editableItem.value.oldName = ''
  editableItem.value.newName = ''
  validationStatus.inputRename = true
}
const rename = async ({
  path,
  oldName,
  newName
}: {
  path: string
  oldName: string
  newName: string
}) => {
  await flipperStore.flipper
    ?.RPC('storageRename', {
      oldPath: path + '/' + oldName,
      newPath: path + '/' + newName
    })
    .then(() => {
      logger.debug({
        context: componentName,
        message: `storageRename: ${path}, old name: ${oldName}, new name: ${newName}`
      })
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageRename' })
    )
  list({
    path: fullPath.value
  })
}

const deleteDialog = ref(false)
const itemToDelete = ref<FlipperModel.File>()
const deleteItem = (item: FlipperModel.File) => {
  deleteDialog.value = true
  itemToDelete.value = item
}
const remove = async ({
  path,
  isRecursive
}: {
  path: string
  isRecursive: boolean
}) => {
  await flipperStore.flipper
    ?.RPC('storageRemove', { path, recursive: isRecursive })
    .then(() => {
      logger.debug({
        context: componentName,
        message: `storageRemove: ${path}, recursive: ${isRecursive}`
      })
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageRemove' })
    )
  list({
    path: fullPath.value
  })
}

const showEditor = ref(false)
const currentEditFile = ref<FlipperModel.File>()
const editFileType = ref<FileEditorModel.languageTypes>('sub')
const editFileDoc = ref('')
const editFile = async (item: FlipperModel.File) => {
  try {
    const res = await read({
      file: item,
      preventDownload: true
    })

    currentEditFile.value = item
    editFileDoc.value = new TextDecoder().decode(res)
    editFileType.value = item.name
      .split('.')
      .pop() as FileEditorModel.languageTypes

    showEditor.value = true
  } catch (err) {
    console.error(err)
  }
}
const saveFile = (doc: string) => {
  if (currentEditFile.value) {
    const path = `${fullPath.value}/${currentEditFile.value.name}`

    flipperStore.flipper
      ?.RPC('storageWrite', {
        path,
        buffer: new TextEncoder().encode(doc)
      })
      .then(() => {
        logger.debug({
          context: componentName,
          message: `${componentName}: storageWrite: ${path}`
        })

        showEditor.value = false
      })
      .catch((error: Error) => {
        rpcErrorHandler({ componentName, error, command: 'storageWrite' })
      })
      .finally(() => {
        currentEditFile.value = undefined
        editFileDoc.value = ''
        editFileType.value = 'sub'

        refreshList()
      })
  }
}
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
