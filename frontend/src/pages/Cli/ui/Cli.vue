<template>
  <q-page
    class="column items-center bg-black q-pa-sm"
    :style-fn="myTweak"
  >
    <div
      ref="terminalWrapper"
      class="fit"
    >
      <div
        ref="terminalContainer"
        class="fit"
      />

      <q-btn
        color="black"
        icon="tune"
        class="absolute-top-right q-ma-sm z-top shadow-2"
      >
        <q-menu dark :offset="[0, 10]">
          <q-list dark bordered separator style="min-width: 100px; border-width: 2px;">
            <q-item
              v-if="foundDumpOnStartup && dump"
              clickable
              v-close-popup
              @click="term.write(dump)"
            >
              <q-item-section avatar><q-icon name="mdi-history" /></q-item-section>
              <q-item-section>Restore history</q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="downloadDump"
            >
              <q-item-section avatar><q-icon name="mdi-download" /></q-item-section>
              <q-item-section>Download history</q-item-section>
            </q-item>
            <q-item
              class="text-negative"
              clickable
              v-close-popup
              @click="clearDump"
            >
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

const terminalWrapper = ref(null)
const myTweak = (offset: number) => {
  const height = offset ? `calc(100vh - ${offset}px)` : '100vh'
  return { height: height }
}

const fontSize = ref(14)
watch(fontSize, (newSize) => {
  if (term) {
    term.options.fontSize = Number(newSize)
    localStorage.setItem('cli-fontSize', String(newSize))

    fitAddon.fit()
  }
})

const dump = ref(localStorage.getItem('cli-dump'))
const foundDumpOnStartup = ref(false)
if (dump.value) {
  foundDumpOnStartup.value = true
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

const terminalContainer = ref(null)
const term = new Terminal({
  scrollback: 10_000,
  fontSize: fontSize.value,
  allowProposedApi: true
})
const fitAddon = new FitAddon()
term.loadAddon(fitAddon)
const serializeAddon = new SerializeAddon()
term.loadAddon(serializeAddon)

const write = async (data: string) => {
  await flipperStore.flipper.write(data)
}

const unbind = ref()
const init = async () => {
  if (terminalContainer.value) {
    term.open(terminalContainer.value)

    fitAddon.fit()
    window.onresize = () => {
      fitAddon.fit()
    }

    document.querySelector('.xterm')?.setAttribute('style', 'height: 100%')

    await write('\r\n\x01\r\n')

    term.onData(async data => {
      await write(data)
    })

    term.focus()
  }

  await asyncSleep(1000)
  await flipperStore.flipper.setReadingMode('text')

  unbind.value = flipperStore.flipper.emitter.on('cli/output', data => {
    term.write(data)
  })
}

onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (flipperStore.rpcActive) {
      await flipperStore.flipper.setReadingMode('text', 'promptBreak')
    }

    init()
  }

  const savedFontSize = localStorage.getItem('cli-fontSize')
  if (savedFontSize) {
    fontSize.value = Number(savedFontSize)
  }
})

watch(() => flipperStore.flipper.flipperReady, async (newValue) => {
  if (newValue) {
    init()
  }
})

onBeforeUnmount(() => {
  localStorage.setItem('cli-dump', serializeAddon.serialize())
  if (unbind.value) {
    unbind.value()
  }
})
</script>

<style>
@import '@xterm/xterm/css/xterm.css';
</style>
