<template>
  <q-page class="column items-center bg-black q-pl-sm full-width">
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
    <div v-if="mainFlags.connected && !flags.rpcActive" class="full-width" style="height: calc(100vh - 50px)">
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
                <q-btn dense color="black" icon="mdi-minus" @click="fontSize--"/>
              </q-item-section>
              <q-item-section>{{ fontSize }}</q-item-section>
              <q-item-section>
                <q-btn dense color="black" icon="mdi-plus" @click="fontSize++"/>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { SerializeAddon } from 'xterm-addon-serialize'
import { io } from 'socket.io-client'
// import asyncSleep from 'simple-async-sleep'
import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'

import { useMainStore } from 'src/stores/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)
const flipper = computed(() => mainStore.flipper)
const info = computed(() => mainStore.info)

const componentName = 'CLI'
const flags = ref({
  rpcActive: false,
  rpcToggling: false,
  serverActive: false,
  serverToggling: false,
  sharePopup: false,
  allowPeerInput: false,
  sharingEnabled: false,
  foundDumpOnStartup: false
})
const terminal = ref(undefined)
const unbind = ref(undefined)
const socket = ref(null)
const roomName = ref('')
const clientsCount = ref(0)
const clientsPollingInterval = ref(null)
const fontSize = ref(14)
let serializeAddon = null
const dump = ref('')

const init = () => {
  terminal.value = new Terminal({
    scrollback: 10_000,
    fontSize: fontSize.value,
    allowProposedApi: true
  })
  const fitAddon = new FitAddon()
  terminal.value.loadAddon(fitAddon)
  serializeAddon = new SerializeAddon()
  terminal.value.loadAddon(serializeAddon)
  if (dump.value) {
    flags.value.foundDumpOnStartup = true
  }
  terminal.value.open(document.getElementById('terminal-container'))
  document.querySelector('.xterm').setAttribute('style', 'height:' + getComputedStyle(document.querySelector('.xterm')).height)
  terminal.value.focus()
  fitAddon.fit()

  write('\x01')

  let dumpTimeout
  terminal.value.onData(async data => {
    if (!dumpTimeout) {
      clearTimeout(dumpTimeout)
    }
    dumpTimeout = setTimeout(() => {
      dump.value = localStorage.getItem('cli-dump')
    }, 500)
    write(data)
  })
}
const write = (data) => {
  flipper.value.write(data)
}

const downloadDump = () => {
  const text = serializeAddon.serialize()
  const dl = document.createElement('a')
  dl.setAttribute('download', 'cli-dump.txt')
  dl.setAttribute('href', 'data:text/plain,' + text)
  dl.style.visibility = 'hidden'
  document.body.append(dl)
  dl.click()
  dl.remove()
}
const clearDump = () => {
  dump.value = ''
  localStorage.setItem('cli-dump', '')
}

// TODO
const startServer = () => {
  flags.value.serverToggling = true
  roomName.value = info.value.hardware.name
  if (!socket.value) {
    socket.value = io('ws://lab.flipper.net:3000')
  }

  socket.value.on('connect', () => {
    log({
      level: 'info',
      message: `${componentName}: Connected to cli server. My id: ${socket.value.id}, room name: ${roomName.value}`
    })

    socket.value.emit('claimRoomName', roomName.value, (res) => {
      if (res.error) {
        showNotif({
          message: `Failed to claim room ${roomName.value}`,
          color: 'negative'
        })
        log({
          level: 'error',
          message: `${componentName}: Failed to claim room ${roomName.value}: ${res.error.toString()}`
        })
      }
    })

    socket.value.emit('joinRoom', roomName.value, (res) => {
      if (res.error) {
        showNotif({
          message: `Failed to join room ${roomName.value}`,
          color: 'negative'
        })
        log({
          level: 'error',
          message: `${componentName}: Failed to join room ${roomName.value}: ${res.error.toString()}`
        })
      } else {
        log({
          level: 'info',
          message: `${componentName}: Hosting room ${roomName.value}`
        })

        clientsPollingInterval.value = setInterval(() => {
          socket.value.emit('pollClients', roomName.value, (res) => {
            if (res.clientsCount) {
              clientsCount.value = res.clientsCount - 1
            }
          })
        }, 3000)
      }
    })
  })

  socket.value.on('dm', (id, text) => {
    if (typeof (text) === 'string' && flags.value.allowPeerInput) {
      write(text)
    }
  })

  socket.value.on('disconnect', () => {
    showNotif({
      message: 'Disconnected from cli server'
    })
    log({
      level: 'warn',
      message: `${componentName}: Disconnected from CLI server`
    })
    if (flags.value.serverActive !== false) {
      stopServer()
    }
  })

  flags.value.serverToggling = false
  flags.value.serverActive = true
}
const stopServer = () => {
  flags.value.serverToggling = true
  socket.value.disconnect()
  clearInterval(clientsPollingInterval.value)
  clientsCount.value = 0
  roomName.value = ''
  flags.value.serverToggling = false
  flags.value.serverActive = false
  flags.value.sharePopup = false
}
// eslint-disable-next-line no-unused-vars
const broadcast = (msg) => {
  socket.value.emit('broadcast', roomName, msg, (res) => {
    if (res.error) {
      log({
        level: 'error',
        message: `${componentName}: Failed to broadcast: ${res.error.toString()}`
      })
      console.error(res.message)
    }
  })
}

const start = async () => {
  /* flags.value.rpcActive = mainFlags.value.rpcActive
  if (mainFlags.value.rpcActive) {
    await stopRpc()
  } */
  if (window.innerWidth < 381) {
    fontSize.value = 9
  } else if (window.innerWidth < 463) {
    fontSize.value = 11
  }

  // setTimeout(init, 500)
  init()
  // await asyncSleep(1000)
  // await flipper.value.setReadingMode('text')

  unbind.value = flipper.value.emitter.on('cli/output', data => {
    terminal.value.write(data)
  })
}

watch(fontSize, (newSize) => {
  if (terminal.value) {
    terminal.value.options.fontSize = Number(newSize)
    localStorage.setItem('cli-fontSize', newSize)
  }
})

onMounted(() => {
  dump.value = localStorage.getItem('cli-dump')
  if (mainFlags.value.connected) {
    setTimeout(start, 500)
  }

  const savedFontSize = localStorage.getItem('cli-fontSize')
  if (savedFontSize) {
    fontSize.value = Number(savedFontSize)
  }

  if (new URLSearchParams(location.search).get('sharing') === 'true') {
    flags.value.sharingEnabled = true
  }
})

onBeforeUnmount(() => {
  localStorage.setItem('cli-dump', serializeAddon.serialize())
  unbind.value()
  if (flags.value.serverActive) {
    stopServer()
  }
})
</script>
