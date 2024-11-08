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
      />
    </q-toolbar>
    <q-list class="list">
      <template v-for="item in filteredDirs" :key="item.name">
        <q-item
          class="rounded-borders full-width"
          v-bind="item"
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
                  v-if="item.type === 0"
                  clickable
                  @click="itemClicked(item)"
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
    <q-dialog v-model="renameDialog">
      <q-card>
        <q-card-section>
          <q-input
            v-model="editableItem.newName"
            :label="'Rename ' + editableItem.oldName"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
          ></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Save"
            v-close-popup
            @click="
              rename({
                path: fullPath,
                oldName: editableItem.oldName,
                newName: editableItem.newName
              })
            "
          ></q-btn>
          <q-btn
            flat
            label="Cancel"
            color="negative"
            v-close-popup
            @click="editableItem.newName = ''"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mkdirDialog">
      <q-card>
        <q-card-section>
          <q-input
            v-model="createdDirName"
            label="Folder name"
            :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
          ></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Create"
            v-close-popup
            @click="
              mkdir({
                path: `${fullPath}/${createdDirName}`
              })
            "
          ></q-btn>
          <q-btn
            flat
            label="Cancel"
            color="negative"
            v-close-popup
            @click="createdDirName = ''"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="blockingOperationDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">File operation in progress</div>
        </q-card-section>
        <q-card-section v-if="file.name.length > 0">
          <ProgressBar :title="file.name" :progress="file.progress" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, onMounted, watch, computed } from 'vue'
import { exportFile } from 'quasar'
import { type RouteLocationRaw } from 'vue-router'

import { log } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { ProgressBar } from 'shared/components/ProgressBar'

import { FlipperModel } from 'entities/Flipper'
import { FlipperWeb } from 'src/shared/lib/flipperJs'
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
      file.value.name = localFile.name
    }
    let dir = fullPath.value

    if (localFile.webkitRelativePath?.length > 0) {
      const path = localFile.webkitRelativePath.split('/')
      path.pop()
      while (path.length > 0) {
        dir += '/' + path.shift()
        const stat = await flipperStore.flipper?.RPC('storageStat', {
          path: dir
        })
        if (!stat) {
          await flipperStore.flipper?.RPC('storageMkdir', { path: dir })
        }
      }
    }

    const unbind = flipperStore.flipper?.emitter.on(
      'storageWriteRequest/progress',
      (e: { progress: number; total: number }) => {
        file.value.progress = e.progress / e.total
      }
    )

    await flipperStore.flipper
      ?.RPC('storageWrite', {
        path: dir + '/' + localFile.name,
        buffer: await localFile.arrayBuffer()
      })
      .then(() => {
        log({
          level: 'debug',
          message: `${componentName}: storageWrite: ${dir}/${localFile.name}`
        })
      })
      .catch((error: Error) =>
        rpcErrorHandler({ componentName, error, command: 'storageWrite' })
      )
    if (unbind) {
      unbind()
    }
  }
  file.value.name = ''
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
const mkdir = async ({ path }: { path: string }) => {
  await flipperStore.flipper
    ?.RPC('storageMkdir', { path })
    .then(() => {
      log({
        level: 'debug',
        message: `${componentName}: storageMkdir: ${path}`
      })
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageMkdir' })
    )
  list({
    path: fullPath.value
  })
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      if (!flipperStore.isElectron) {
        if (flipperStore.flipper instanceof FlipperWeb) {
          await flipperStore.flipper?.startRPCSession()
        }
      } else {
        flipperStore.flipper?.setReadingMode('rpc')
      }
    }

    if (flipperStore.flipper?.readingMode.type === 'rpc') {
      if (!flipperStore.info) {
        await flipperStore.flipper?.getInfo()
      }

      list({
        path: fullPath.value
      })
    }
  }
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
      log({
        level: 'debug',
        message: `${componentName}: storageList: ${path}`
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
      filePath: fullPath.value + '/' + item.name
    })
  }
}

const file = ref({
  name: '',
  progress: 0
})
const read = async ({
  filePath,
  preventDownload
}: {
  filePath: string
  preventDownload?: boolean
}) => {
  blockingOperationDialog.value = true
  file.value.name = fullPath.value.slice(fullPath.value.lastIndexOf('/') + 1)
  const localFile = dirs.value.find(
    (e) => e.name === file.value.name && !e.type
  )

  let unbind
  if (localFile) {
    const total = localFile.size

    if (total) {
      unbind = flipperStore.flipper?.emitter.on(
        'storageReadRequest/progress',
        (chunks: number) => {
          file.value.progress = Math.min(chunks * 512, total) / total
        }
      )
    }
  }

  const res: Uint8Array = await flipperStore.flipper
    ?.RPC('storageRead', { path: filePath })
    .then((data: Uint8Array) => {
      log({
        level: 'debug',
        message: `${componentName}: storageRead: ${filePath}`
      })
      return data
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageRead' })
    )

  const s = filePath.split('/')
  if (!preventDownload) {
    exportFile(s[s.length - 1], res)
  }
  if (unbind) {
    unbind()
  }
  blockingOperationDialog.value = false

  if (preventDownload) {
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
    filePath: fullPath.value + '/' + item.name,
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
      log({
        level: 'debug',
        message: `${componentName}: storageRename: ${path}, old name: ${oldName}, new name: ${newName}`
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
      log({
        level: 'debug',
        message: `${componentName}: storageRemove: ${path}, recursive: ${isRecursive}`
      })
    })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageRemove' })
    )
  list({
    path: fullPath.value
  })
}
</script>

<style lang="scss" scoped>
@import 'styles';
</style>
