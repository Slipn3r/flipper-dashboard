<template>
  <q-page class="column items-center bg-black q-pl-sm full-width" :style-fn="myTweak">
    <div
      v-if="!mainFlags.connected"
      class="column flex-center q-my-xl"
    >
      <q-spinner
        color="primary"
        size="3em"
        class="q-mb-md"
      ></q-spinner>
      <p class="text-white">Waiting for Flipper...</p>
    </div>
    <div
      ref="terminalWrapper"
      v-if="mainFlags.connected && !flags.rpcActive"
      class="full-width full-height q-pb-md"
    >
      <div id="terminal-container" class="fit bg-black"></div>

      <q-btn
        color="black"
        icon="tune"
        class="absolute-top-right q-ma-sm z-top shadow-2"
      >
        <q-menu dark :offset="[0, 10]">
          <q-list dark bordered separator style="min-width: 100px; border-width: 2px;">
            <q-item v-if="flags.foundDumpOnStartup" clickable v-close-popup @click="terminal.write(dump)">
              <q-item-section avatar><q-icon name="mdi-history" /></q-item-section>
              <q-item-section>Restore history</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="downloadDump">
              <q-item-section avatar><q-icon name="mdi-download" /></q-item-section>
              <q-item-section>Download history</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="clearDump" class="text-negative">
              <q-item-section avatar><q-icon name="mdi-delete" /></q-item-section>
              <q-item-section>Clear history</q-item-section>
            </q-item>
            <q-item class="text-center">
              <q-item-section class="col-grow">Font size</q-item-section>
              <q-item-section>
                <q-btn dense color="black" icon="mdi-minus" @click="CliMainStore.fontSize--"/>
              </q-item-section>
              <q-item-section>{{ fontSize }}</q-item-section>
              <q-item-section>
                <q-btn dense color="black" icon="mdi-plus" @click="CliMainStore.fontSize++"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <q-dialog v-model="flags.sharePopup">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-mr-xl">CLI session sharing</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <template v-if="flags.serverActive">
            <p>
              Room name: <code class="bg-grey-4 q-pa-xs rounded-borders">{{ roomName }}</code><br />
              <a :href="'/remote-cli#' + roomName" target="_blank">Sharelink</a>
            </p>

            <p>
              Clients connected: {{ clientsCount }}
            </p>

            <q-toggle v-model="flags.allowPeerInput" label="Allow peer input" />
          </template>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :loading="flags.serverToggling"
            :color="flags.serverActive ? 'negative' : 'black'"
            @click="flags.serverActive ? stopServer() : startServer()"
          >
            {{ flags.serverActive ? 'Stop server' : 'Start server' }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)

import { useCliMainStore } from './stores'
const CliMainStore = useCliMainStore()

const flags = computed(() => CliMainStore.flags)

const terminal = computed(() => CliMainStore.terminal)

const roomName = computed(() => CliMainStore.roomName)
const clientsCount = computed(() => CliMainStore.clientsCount)

const serializeAddon = computed(() => CliMainStore.serializeAddon)
const fitAddon = computed(() => CliMainStore.fitAddon)
const fontSize = computed(() => CliMainStore.fontSize)
const dump = computed(() => CliMainStore.dump)

const myTweak = computed(() => CliMainStore.myTweak)
const stopServer = computed(() => CliMainStore.stopServer)
const startServer = computed(() => CliMainStore.startServer)
const downloadDump = computed(() => CliMainStore.downloadDump)
const clearDump = computed(() => CliMainStore.clearDump)
const unbind = computed(() => CliMainStore.unbind)

watch(fontSize, (newSize) => {
  if (terminal.value) {
    terminal.value.options.fontSize = Number(newSize)
    localStorage.setItem('cli-fontSize', newSize)

    fitAddon.value.fit()
  }
})

onMounted(() => {
  CliMainStore.dump = localStorage.getItem('cli-dump')
  if (mainFlags.value.connected) {
    setTimeout(CliMainStore.start, 500)
  }

  const savedFontSize = localStorage.getItem('cli-fontSize')
  if (savedFontSize) {
    CliMainStore.fontSize = Number(savedFontSize)
  }

  if (new URLSearchParams(location.search).get('sharing') === 'true') {
    CliMainStore.toggleFlag('sharingEnabled', true)
  }
})

onBeforeUnmount(() => {
  localStorage.setItem('cli-dump', serializeAddon.value.serialize())
  unbind.value()
  if (flags.value.serverActive) {
    stopServer()
  }
})
</script>
src/pages/Cli/Cli
