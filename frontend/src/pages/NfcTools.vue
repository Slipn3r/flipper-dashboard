<template>
  <q-page class="column items-center q-pa-md full-width">
    <div class="text-h6 q-py-sm">Mfkey32v2 NFC attack</div>
      <div class="text-subtitle-1">Crack nonces you've gathered on your Flipper</div>

    <template v-if="mainFlags.connected && mainFlags.rpcActive">
      <q-btn
        color="primary"
        :loading="flags.mfkeyFlipperInProgress"
        :disable="flags.mfkeyManualInProgress"
        class="q-mt-lg q-py-sm q-px-lg"
        label="Give me the keys"
        @click="mfkeyFlipperStart"
        unelevated
      />
      <div class="q-pt-sm q-mb-xl text-subtitle-1">{{ mfkeyStatus }}</div>
    </template>
    <q-btn v-else outline label="Connect" class="q-mt-lg q-mb-xl" @click="mainStore.start(true)"/>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Manual attack</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="mfkeyManualStart">
          <div class="flex q-gutter-md">
            <q-input v-model="args.cuid" label="cuid" style="width: 70px" />
            <q-input v-model="args.nt0" label="nt0" style="width: 70px" />
            <q-input v-model="args.nr0" label="nr0" style="width: 70px" />
            <q-input v-model="args.ar0" label="ar0" style="width: 70px" />
            <q-input v-model="args.nt1" label="nt1" style="width: 70px" />
            <q-input v-model="args.nr1" label="nr1" style="width: 70px" />
            <q-input v-model="args.ar1" label="ar1" style="width: 70px" />
            <div class="q-mt-lg">
              <q-btn
                type="submit"
                color="primary"
                :loading="flags.mfkeyManualInProgress"
                :disable="flags.mfkeyFlipperInProgress"
                label="Run"
                unelevated
              />
            </div>
          </div>
        </q-form>
        <div v-if="result" class="q-pt-lg">
          <span v-if="!result.startsWith('Error')" class="text-subtitle1 q-mr-sm">Key:</span>
          <b>{{ result }}</b>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

const mainFlags = computed(() => mainStore.flags)

import { useNfcMainStore } from 'stores/pages/NFC'
const NfcMainStore = useNfcMainStore()

const flags = computed(() => NfcMainStore.flags)
const mfkeyStatus = computed(() => NfcMainStore.mfkeyStatus)
const args = computed(() => NfcMainStore.args)
const result = computed(() => NfcMainStore.result)

watch(() => mainFlags.value.connected, (newStatus) => {
  if (newStatus) {
    start()
  }
})

const mfkeyFlipperStart = NfcMainStore.mfkeyFlipperStart
const mfkeyManualStart = NfcMainStore.mfkeyManualStart

const start = NfcMainStore.start

onMounted(() => {
  if (mainFlags.value.connected) {
    start()
  }
})
</script>
