<template>
  <q-page class="column items-center bg-black q-pa-sm" :style-fn="myTweak">
    <div ref="terminalWrapper" class="fit">
      <div ref="terminalContainer" class="fit" />

      <q-btn
        color="black"
        icon="tune"
        class="absolute-top-right q-ma-sm z-top shadow-2"
      >
        <q-menu dark :offset="[0, 10]">
          <q-list
            dark
            bordered
            separator
            style="min-width: 100px; border-width: 2px"
          >
            <q-item
              v-if="foundDumpOnStartup && dump && term"
              clickable
              v-close-popup
              @click="term.write(dump)"
            >
              <q-item-section avatar
                ><q-icon name="mdi-history"
              /></q-item-section>
              <q-item-section>Restore history</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="downloadDump">
              <q-item-section avatar
                ><q-icon name="mdi-download"
              /></q-item-section>
              <q-item-section>Download history</q-item-section>
            </q-item>
            <q-item
              class="text-negative"
              clickable
              v-close-popup
              @click="clearDump"
            >
              <q-item-section avatar
                ><q-icon name="mdi-delete"
              /></q-item-section>
              <q-item-section>Clear history</q-item-section>
            </q-item>
            <q-item class="text-center">
              <q-item-section class="col-grow">Font size</q-item-section>
              <q-item-section>
                <q-btn
                  dense
                  color="black"
                  icon="mdi-minus"
                  @click="fontSize--"
                />
              </q-item-section>
              <q-item-section>{{ fontSize }}</q-item-section>
              <q-item-section>
                <q-btn
                  dense
                  color="black"
                  icon="mdi-plus"
                  @click="fontSize++"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SerializeAddon } from 'xterm-addon-serialize'
import asyncSleep from 'simple-async-sleep'

import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { FlipperWeb } from 'src/shared/lib/flipperJs'

const terminalWrapper = ref(null)
const myTweak = (offset: number) => {
  const height = offset ? `calc(100vh - ${offset}px)` : '100vh'
  return { height: height }
}

const fontSize = ref(14)
watch(fontSize, (newSize) => {
  if (term.value && fitAddon.value) {
    term.value.options.fontSize = Number(newSize)
    localStorage.setItem('cli-fontSize', String(newSize))

    fitAddon.value.fit()
  }
})

const dump = ref(localStorage.getItem('cli-dump'))
const foundDumpOnStartup = ref(false)
if (dump.value) {
  foundDumpOnStartup.value = true
}
const downloadDump = () => {
  if (serializeAddon.value) {
    const text = serializeAddon.value.serialize()
    const dl = document.createElement('a')
    dl.setAttribute('download', 'cli-dump.txt')
    dl.setAttribute('href', 'data:text/plain,' + text)
    dl.style.visibility = 'hidden'
    document.body.append(dl)
    dl.click()
    dl.remove()
  }
}
const clearDump = () => {
  dump.value = ''
  localStorage.setItem('cli-dump', '')
}

const terminalContainer = ref(null)
const term = ref<Terminal>()
const fitAddon = ref<FitAddon>()
const serializeAddon = ref<SerializeAddon>()

// const term = new Terminal({
//     scrollback: 10_000,
//     fontSize: fontSize.value,
//     allowProposedApi: true
//   })
// const fitAddon = new FitAddon()
// term.loadAddon(fitAddon)
// const  serializeAddon = new SerializeAddon()
// term.loadAddon(serializeAddon)

const write = async (data: string) => {
  await flipperStore.flipper?.write(data)
}

const unbind = ref()
const init = async () => {
  if (unbind.value) {
    unbind.value()
  }

  if (terminalContainer.value) {
    term.value = new Terminal({
      scrollback: 10_000,
      fontSize: fontSize.value,
      allowProposedApi: true
    })
    fitAddon.value = new FitAddon()
    // term.value.loadAddon(fitAddon.value)
    fitAddon.value.activate(term.value)

    serializeAddon.value = new SerializeAddon()
    // term.value.loadAddon(serializeAddon.value)
    serializeAddon.value.activate(term.value)

    term.value.open(terminalContainer.value)

    if (fitAddon.value) {
      fitAddon.value.fit()
    }
    window.onresize = () => {
      if (fitAddon.value) {
        fitAddon.value.fit()
      }
    }

    document.querySelector('.xterm')?.setAttribute('style', 'height: 100%')

    await asyncSleep(500)
    if (flipperStore.isElectron) {
      await write('\x01')
    } else {
      await write('\r\n\x01\r\n')
    }

    term.value.onData(async (data) => {
      await write(data)
    })

    term.value.focus()
  }

  if (flipperStore.flipper instanceof FlipperWeb) {
    await asyncSleep(500)
    await flipperStore.flipper?.setReadingMode('text')
  }

  unbind.value = flipperStore.flipper?.emitter?.on(
    'cli/output',
    (data: string | Uint8Array) => {
      if (term.value) {
        term.value.write(data)
      }
    }
  )
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (flipperStore.rpcActive) {
      await asyncSleep(500)
      if (flipperStore.flipper instanceof FlipperWeb) {
        await flipperStore.flipper?.setReadingMode('text', 'promptBreak')
      }
    }

    init()
  }

  const savedFontSize = localStorage.getItem('cli-fontSize')
  if (savedFontSize) {
    fontSize.value = Number(savedFontSize)
  }
})

watch(
  () => flipperStore.flipperReady,
  async (newValue) => {
    if (newValue) {
      if (term.value) {
        term.value.dispose()
      }

      init()
    }
  }
)

// watch(
//   () => flipperStore.flipperName,
//   async (newValue, oldValue) => {
//     if (newValue !== oldValue && oldValue.trim() !== '') {
//       init()
//     }
//   }
// )

onBeforeUnmount(() => {
  if (serializeAddon.value) {
    localStorage.setItem('cli-dump', serializeAddon.value.serialize())
  }
  if (unbind.value) {
    unbind.value()
  }
})
</script>

<style>
@import '@xterm/xterm/css/xterm.css';
</style>
