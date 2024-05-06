import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Platform, dom } from 'quasar'

import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { FitAddon } from 'xterm-addon-fit'
import { SerializeAddon } from 'xterm-addon-serialize'
import { io } from 'socket.io-client'
import { log } from 'composables/useLog'
import showNotif from 'composables/useShowNotif'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

import { useCliWebStore } from './store-web'
import { useCliElectronStore } from './store-electron'

export const useCliMainStore = defineStore('CliMain', () => {
  const platformStore = Platform.is.electron ? useCliElectronStore() : useCliWebStore()
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
  const roomName = ref('')
  const socket = ref(null)
  const clientsPollingInterval = ref(null)
  const fontSize = ref(14)
  const dump = ref('')
  const serializeAddon = ref(null)
  const fitAddon = ref(null)
  const clientsCount = ref(0)
  const unbind = ref(undefined)

  const init = () => {
    terminal.value = new Terminal({
      scrollback: 10_000,
      fontSize: fontSize.value,
      allowProposedApi: true
    })
    fitAddon.value = new FitAddon()
    terminal.value.loadAddon(fitAddon.value)
    serializeAddon.value = new SerializeAddon()
    terminal.value.loadAddon(serializeAddon.value)
    if (dump.value) {
      flags.value.foundDumpOnStartup = true
    }
    terminal.value.open(document.getElementById('terminal-container'))
    document.querySelector('.xterm').setAttribute('style', 'height:' + getComputedStyle(document.querySelector('.xterm')).height)
    terminal.value.focus()
    fitAddon.value.fit()

    write(platformStore.lineSeparator)

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

    window.onresize = () => {
      fitAddon.value.fit()
    }
  }

  const write = (data) => {
    flipper.value.write(data)
  }

  const downloadDump = () => {
    const text = serializeAddon.value.serialize()
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

  const start = () => {
    if (window.innerWidth < 381) {
      fontSize.value = 9
    } else if (window.innerWidth < 463) {
      fontSize.value = 11
    }

    platformStore.start()

    unbind.value = flipper.value.emitter.on('cli/output', data => {
      terminal.value.write(data)
    })
  }

  const terminalWrapper = ref(null)
  const myTweak = (offset) => {
    const height = offset ? `calc(100vh - ${offset}px)` : '100vh'
    if (terminalWrapper.value) {
      dom.css(terminalWrapper.value, {
        minHeight: height
      })
    }
    return { minHeight: height }
  }

  return { flipper, flags, componentName, terminal, roomName, clientsCount, fontSize, dump, fitAddon, serializeAddon, unbind, start, startServer, stopServer, myTweak, clearDump, downloadDump, init }
})
