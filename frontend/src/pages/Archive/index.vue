<template>
  <q-page class="column items-center q-pa-md full-width" :class="$q.screen.width > 960 && $q.screen.height > 500 ? 'q-mt-xl' : 'q-mt-xs'">
    <div
      v-if="!mainFlags.connected || !mainFlags.rpcActive || mainFlags.rpcToggling"
      class="column flex-center q-my-xl"
    >
      <q-spinner
        color="primary"
        size="3em"
        class="q-mb-md"
      ></q-spinner>
      <p>Waiting for Flipper...</p>
    </div>
    <div v-if="mainFlags.connected && mainFlags.rpcActive" class="file-container">
      <div class="file-menu flex no-wrap q-pa-xs rounded-borders">
        <q-btn
          flat
          dense
          icon="arrow_back_ios_new"
          class="q-mr-xs"
          style="width: 24px;"
          :disabled="path === '/'"
          @click="itemClicked({ name: '..' })"
        ></q-btn>
        <code
          class="q-py-xs q-px-sm bg-grey-3 rounded-borders overflow-hidden-y"
        >{{ path }}</code>
        <q-space></q-space>
        <q-btn flat dense icon="mdi-plus" :disabled="path === '/'">
          <q-menu auto-close self="top middle">
            <q-list style="min-width: 100px">
              <q-item clickable @click="showUploadFilePopup">
                <q-item-section avatar>
                  <q-icon name="mdi-file-upload-outline"/>
                </q-item-section>
                <q-item-section>
                  Upload file
                </q-item-section>
              </q-item>
              <q-item clickable @click="showUploadFolderPopup">
                <q-item-section avatar>
                  <q-icon name="mdi-folder-upload-outline"/>
                </q-item-section>
                <q-item-section>
                  Upload folder
                </q-item-section>
              </q-item>
              <q-item clickable @click="showMkdirPopup">
                <q-item-section avatar>
                  <q-icon name="mdi-folder-plus-outline"/>
                </q-item-section>
                <q-item-section>
                  Create folder
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <q-list class="file-grid">
        <q-item
          v-for="item in dir"
          :key="item.name"
          class="rounded-borders"
          v-bind="item"
          dense
          clickable
        >
          <q-item-section avatar @click="itemClicked(item)">
            <q-icon :name="itemIconSwitcher(item)"/>
          </q-item-section>

          <q-item-section @click="itemClicked(item)">
            <q-item-label>
              {{ item.name }}
            </q-item-label>
            <span v-if="path === '/' && item.name === 'int'">Flipper internal storage</span>
            <span v-if="path === '/' && item.name === 'ext'">SD card</span>
            <span v-if="item.type !== 1 && item.size" class="text-weight-light">{{ item.size }} bytes</span>
          </q-item-section>

          <q-item-section avatar>
            <q-btn v-if="path !== '/'" flat dense round icon="more_vert">
              <q-menu auto-close self="top middle">
                <q-list style="min-width: 100px">
                  <q-item v-if="item.type === 0" clickable @click="itemClicked(item)">
                    <q-item-section avatar>
                      <q-icon name="mdi-download-outline"/>
                    </q-item-section>
                    <q-item-section>
                      Download
                    </q-item-section>
                  </q-item>
                  <q-item v-if="item.name.endsWith('.sub') || item.name.endsWith('.ir')" clickable @click="openFileIn(item, { name: 'PulsePlotter' })">
                    <q-item-section avatar>
                      <q-icon name="mdi-share-outline"/>
                    </q-item-section>
                    <q-item-section>
                      Open in Pulse plotter
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="renameItem(item)">
                    <q-item-section avatar>
                      <q-icon name="mdi-pencil-outline"/>
                    </q-item-section>
                    <q-item-section>
                      Rename
                    </q-item-section>
                  </q-item>
                  <q-item clickable class="text-negative" @click="deleteItem(item)">
                    <q-item-section avatar>
                      <q-icon name="mdi-delete-outline"/>
                    </q-item-section>
                    <q-item-section>
                      Delete
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="dir.length === 0 && path !== '/'" class="text-grey-7">
          <q-item-section avatar class="q-ml-xs">
            <q-icon name="mdi-folder-outline"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              Empty folder
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-dialog v-model="flags.uploadFolderPopup">
        <q-card>
          <q-card-section class="q-pt-none">
            <q-file
              outlined
              multiple
              webkitdirectory
              v-model="archiveMainStore.uploadedFiles"
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
            <q-btn
              flat
              label="Upload"
              v-close-popup
              @click="upload"
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
      <q-dialog v-model="flags.deletePopup">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Are you sure you want to delete <b>{{ itemToDelete.name }}</b>?</div>
            This action is permanent and can't be undone.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              v-close-popup
            ></q-btn>
            <q-btn
              flat
              label="Delete"
              color="negative"
              v-close-popup
              @click="remove(path + '/' + itemToDelete.name, !!itemToDelete.type)"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.uploadPopup">
        <q-card>
          <q-card-section class="q-pt-none">
            <q-file
              outlined
              multiple
              v-model="archiveMainStore.uploadedFiles"
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
            <q-btn
              flat
              label="Upload"
              v-close-popup
              @click="upload"
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
      <q-dialog v-model="flags.renamePopup">
        <q-card>
          <q-card-section>
            <q-input
              v-model="archiveMainStore.editorText"
              :label="'Rename ' + oldName"
              :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
            ></q-input>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Save"
              v-close-popup
              @click="rename(path, oldName, editorText)"
            ></q-btn>
            <q-btn
              flat
              label="Cancel"
              color="negative"
              v-close-popup
              @click="archiveMainStore.editorText = ''"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.mkdirPopup">
        <q-card>
          <q-card-section>
            <q-input
              v-model="archiveMainStore.editorText"
              label="Folder name"
              :style="$q.screen.width > 380 ? 'width: 300px;' : ''"
            ></q-input>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Create"
              v-close-popup
              @click="mkdir(path + '/' + editorText)"
            ></q-btn>
            <q-btn
              flat
              label="Cancel"
              color="negative"
              v-close-popup
              @click="archiveMainStore.editorText = ''"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="flags.blockingOperationPopup" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">File operation in progress</div>
          </q-card-section>
          <q-card-section v-if="file.name.length > 0">
            <ProgressBar
              :title="file.name"
              :progress="file.progress"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { watch, onMounted, computed } from 'vue'
import ProgressBar from 'components/ProgressBar.vue'
// import { exportFile } from 'quasar'
// import { log } from 'composables/useLog'
// import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)

import { useArchiveMainStore } from './stores'
const archiveMainStore = useArchiveMainStore()

const path = computed(() => archiveMainStore.path)
const dir = computed(() => archiveMainStore.dir)
const flags = computed(() => archiveMainStore.flags)
const editorText = computed(() => archiveMainStore.editorText)
const oldName = computed(() => archiveMainStore.oldName)
const file = computed(() => archiveMainStore.file)
const itemToDelete = computed(() => archiveMainStore.itemToDelete)

watch(() => mainFlags.value.connected, (newStatus) => {
  if (newStatus) {
    start()
  }
})

const remove = archiveMainStore.remove
const rename = archiveMainStore.rename
const mkdir = archiveMainStore.mkdir
const upload = archiveMainStore.upload

const itemClicked = archiveMainStore.itemClicked
const openFileIn = archiveMainStore.openFileIn
const itemIconSwitcher = archiveMainStore.itemIconSwitcher
const start = archiveMainStore.start

onMounted(() => {
  if (mainFlags.value.connected) {
    start()
  }
})

const showUploadFilePopup = () => {
  archiveMainStore.toggleFlag('uploadPopup', true)
  archiveMainStore.uploadedFiles = null
}

const showUploadFolderPopup = () => {
  archiveMainStore.toggleFlag('uploadFolderPopup', true)
  archiveMainStore.uploadedFiles = null
}

const showMkdirPopup = () => {
  archiveMainStore.toggleFlag('mkdirPopup', true)
  archiveMainStore.editorText = ''
}

const renameItem = (item) => {
  archiveMainStore.editorText = item.name
  archiveMainStore.oldName = item.name
  archiveMainStore.toggleFlag('renamePopup', true)
}

const deleteItem = (item) => {
  archiveMainStore.toggleFlag('deletePopup', true)
  archiveMainStore.itemToDelete = item
}
</script>
