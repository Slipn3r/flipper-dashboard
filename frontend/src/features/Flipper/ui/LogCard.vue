<template>
  <q-card class="card" :flat="flat" :class="{ dialog: isDialog }">
    <q-card-section class="row items-center q-pb-none">
      <h6 class="q-ma-none">Logs</h6>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <p>
        You can report bugs
        <a href="https://forum.flipperzero.one/c/web-app/22" target="blank_"
          >here</a
        >. Attached logs may be helpful.
      </p>
      <div
        style="height: 300px; min-width: 280px; width: 100%"
        class="bg-grey-12 q-pa-xs rounded-borders"
      >
        <q-scroll-area ref="scrollArea" class="fit">
          <code v-if="!history.length">Logs will appear here...</code>
          <code v-for="line in history" :key="line.timestamp">
            {{
              `${line.time.padEnd(8)} [${line.level.toUpperCase()}] [${
                line.context
              }] ${line.message}`
            }}
            <br />
          </code>
        </q-scroll-area>
      </div>
    </q-card-section>

    <q-card-section align="right" class="q-pt-none">
      <q-btn flat label="Download" @click="downloadLogs"></q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { logger, history } from 'shared/lib/utils/useLog'
import { QScrollArea } from 'quasar'

type Props = {
  flat?: boolean
  isDialog?: boolean
}

withDefaults(defineProps<Props>(), {
  flat: false,
  isDialog: false
})

const scrollArea = ref<QScrollArea>()

onMounted(() => {
  if (scrollArea.value) {
    scrollArea.value.setScrollPercentage('vertical', 1)
  }
})

watch(history.value, () => {
  if (scrollArea.value) {
    scrollArea.value.setScrollPercentage('vertical', 1)
  }
})

logger.setLevel('info', true)
const originalFactory = logger.methodFactory
logger.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName)

  return function (message) {
    if (methodName !== 'debug') {
      rawMethod(message)
    }
  }
}
logger.setLevel(logger.getLevel())

const downloadLogs = () => {
  let text = ''
  for (const line of history.value) {
    text += `${line.time} [${line.level}] ${line.message}\n`
  }
  const dl = document.createElement('a')
  dl.setAttribute('download', 'logs.txt')
  dl.setAttribute('href', 'data:text/plain,' + text)
  dl.style.visibility = 'hidden'
  document.body.append(dl)
  dl.click()
  dl.remove()
}
</script>

<style lang="scss" scoped>
.card {
  &.dialog {
    width: 100%;
    max-width: min(calc(100vw - 16px), 1000px);
  }
}
</style>
