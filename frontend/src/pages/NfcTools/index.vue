<template>
  <q-page class="column q-pa-md q-gutter-y-lg full-width" style="max-width: min(1000px, 100vw);">
    <div class="full-width text-h6 text-center">Mfkey32v2 NFC attack</div>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Crack nonces on Flipper</div>
        <div class="q-mb-md">
          Captured nonces are stored in the log file (<code>/ext/nfc/.mfkey32.log</code>).<br/>
          Once discovered, new keys will be added to the user dictionary file (<code>/ext/nfc/assets/mf_classic_dict_user.nfc</code>).
        </div>
        <div>
          Some cracks may take longer than expected.
          Timeout:
          <q-input
            v-model.number="NfcMainStore.timeoutSeconds"
            type="number"
            dense
            style="width: 40px; display: inline-block;"
            class="q-ml-sm"
          />
          seconds.
        </div>
      </q-card-section>
      <q-card-section class="column items-center">
        <template v-if="mainFlags.connected && mainFlags.rpcActive">
          <q-btn
            color="primary"
            :loading="flags.mfkeyFlipperInProgress"
            :disable="flags.mfkeyManualInProgress || !mainStore.info?.storage.sdcard.status.isInstalled || nonces.length === 0"
            class="q-py-sm q-px-lg"
            label="Give me the keys"
            @click="mfkeyFlipperStart"
            unelevated
          />
          <span v-if="mainStore.info?.doneReading && !mainStore.info.storage.sdcard.status.isInstalled" class="text-negative">MicroSD card not detected</span>
          <div v-if="mfkeyStatus" class="q-pt-sm text-subtitle-1">
            {{ mfkeyStatus }}
          </div>
          <div v-if="uniqueKeys.length || timeouts.length" class="q-mt-sm">
            <template v-if="uniqueKeys.length">
              <div class="text-bold q-mt-md">Unique keys:</div>
              <div>{{ uniqueKeys.join(', ') }}</div>
            </template>
            <template v-if="timeouts.length">
              <div class="text-bold q-mt-md">Timeouts:</div>
              <q-markup-table flat dense>
                <thead>
                  <tr>
                    <th>cuid</th>
                    <th>nt0</th>
                    <th>nr0</th>
                    <th>ar0</th>
                    <th>nt1</th>
                    <th>nr1</th>
                    <th>ar1</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="args in timeouts" :key="args">
                    <td v-for="arg in args" :key="arg">{{ arg }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </template>
          </div>
        </template>
        <template v-else-if="mainFlags.isElectron">
          <q-card v-if="!mainFlags.connected" flat>
            <q-card-section class="q-pa-none q-ma-md" align="center">
              <template v-if="mainFlags.isBridgeReady">
                <q-img
                  src="~assets/flipper_alert.svg"
                  width="70px"
                />
                <div class="text-h6 q-my-sm">Flipper not connected</div>
              </template>
              <template v-else>
                <q-spinner
                  color="primary"
                  size="3em"
                  class="q-mb-md"
                ></q-spinner>
              </template>
            </q-card-section>
          </q-card>
        </template>
        <q-btn v-else outline label="Connect" class="q-mt-lg q-mb-xl" @click="mainStore.start(true)"/>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Run mfkey32v2 manually</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="mfkeyManualStart">
          <div class="flex q-gutter-md args-inputs-container">
            <q-input v-model="args.cuid" label="cuid" />
            <q-input v-model="args.nt0" label="nt0" />
            <q-input v-model="args.nr0" label="nr0" />
            <q-input v-model="args.ar0" label="ar0" />
            <q-input v-model="args.nt1" label="nt1" />
            <q-input v-model="args.nr1" label="nr1" />
            <q-input v-model="args.ar1" label="ar1" />
          </div>
          <div class="row justify-center q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              :loading="flags.mfkeyManualInProgress"
              :disable="flags.mfkeyFlipperInProgress"
              label="Run"
              unelevated
            />
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

import { useNfcMainStore } from './stores'
const NfcMainStore = useNfcMainStore()

const flags = computed(() => NfcMainStore.flags)
const mfkeyStatus = computed(() => NfcMainStore.mfkeyStatus)
const args = computed(() => NfcMainStore.args)
const result = computed(() => NfcMainStore.result)
const timeouts = computed(() => NfcMainStore.timeouts)
const uniqueKeys = computed(() => NfcMainStore.uniqueKeys)
const nonces = computed(() => NfcMainStore.nonces)

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

<style lang="sass" scoped>
  .args-inputs-container .q-field
    min-width: 70px
    max-width: 115px
</style>
