<template>
  <div>
    <q-dialog v-model="model" @show="showDialog" @hide="hideDialog" persistent>
      <q-layout
        :style="$q.screen.lt.md ? '' : 'width: 1220px; max-width: 80vw'"
        style="height: 100%"
        view="hHh LpR fFf"
        container
      >
        <q-page-container style="height: 100%">
          <q-page class="flex">
            <div ref="editorContainer" class="code-editor"></div>
          </q-page>
        </q-page-container>
        <q-footer class="footer row justify-end q-gutter-sm q-pa-sm">
          <q-btn flat label="Close" @click="close" />
          <q-btn flat label="Save" @click="save" />
        </q-footer>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="closeWarning" persistent>
      <q-card class="dialog" style="width: 400px">
        <q-card-section class="q-pa-none q-ma-md" align="center">
          <!-- <q-icon name="mdi-alert-circle" color="warning" size="64px" /> -->
          <q-img src="~assets/flipper_alert.svg" width="70px" no-spinner />
          <div class="text-h6 q-my-sm">Save changes?</div>
          <p>File «{{ file.name }}» has been modified, save changes?</p>
        </q-card-section>

        <q-card-section class="row justify-between">
          <q-btn
            class="col-auto"
            outline
            color="grey-7"
            label="Don't Save"
            v-close-popup
            @click="confirmClose"
          />
          <div class="col-auto">
            <q-btn
              class="q-mr-sm"
              flat
              color="primary"
              label="Cancel"
              v-close-popup
            />
            <q-btn
              unelevated
              color="primary"
              label="Save"
              v-close-popup
              @click="save"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue'
import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import {
  FileEditorModel,
  FileEditorThemes,
  FileEditorSyntax
} from 'entities/FileEditor'
import { FlipperModel } from 'entities/Flipper'

const changeLanguage = (language: FileEditorModel.languageTypes) => {
  switch (language) {
    case 'ir':
      return FileEditorSyntax.FlipperIR()

    case 'sub':
      return FileEditorSyntax.FlipperSubGhz()

    case 'rfid':
      return FileEditorSyntax.FlipperRFID()

    case 'ibutton':
      return FileEditorSyntax.FlipperIButton()

    case 'nfc':
      return FileEditorSyntax.FlipperNFC()
  }
}

interface Props {
  file: FlipperModel.File
  type: FileEditorModel.languageTypes
  doc: string
}
const props = defineProps<Props>()

const model = defineModel<boolean>({ default: false })
const emit = defineEmits<{
  (e: 'save', doc: string): void
}>()

const editorContainer = ref<HTMLDivElement>()
let editorView = ref<EditorView>()

const showDialog = () => {
  if (editorContainer.value) {
    editorView.value = new EditorView({
      state: EditorState.create({
        doc: unref(props.doc),
        extensions: [
          basicSetup,
          changeLanguage(props.type),
          FileEditorThemes.OneDarkTheme.oneDark,
          EditorView.lineWrapping
        ]
      }),
      parent: editorContainer.value
    })
  }
}

const close = () => {
  if (editorView.value?.state.doc.toString() !== props.doc) {
    closeWarning.value = true
  } else {
    model.value = false
  }
}

const closeWarning = ref(false)
const confirmClose = () => {
  model.value = false
}

const save = () => {
  if (editorView.value) {
    emit('save', editorView.value.state.doc.toString())
  }
}

const hideDialog = () => {
  if (editorView.value) {
    editorView.value.destroy()
  }
}
</script>

<style scoped lang="scss">
.code-editor {
  width: 100%;
  max-width: 100%;
  overflow: auto;
  background-color: #282c34;
  border-radius: 4px;
}

.footer {
  background-color: #282c34;
}
</style>
