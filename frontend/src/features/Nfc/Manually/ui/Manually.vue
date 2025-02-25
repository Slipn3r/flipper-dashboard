<template>
  <q-card flat>
    <q-card-section class="q-px-none">
      <h6 class="full-width text-left q-ma-none">Enter the nonce manually</h6>
    </q-card-section>
    <q-card-section class="q-px-none">
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
        <div class="row justify-start q-mt-lg">
          <q-btn
            type="submit"
            color="primary"
            :loading="nfcStore.flags.mfkeyManualInProgress"
            :disable="nfcStore.flags.mfkeyFlipperInProgress"
            label="Run mfkey32"
            unelevated
          />
        </div>
      </q-form>
      <div v-if="result" class="q-pt-lg">
        <span v-if="!result.startsWith('Error')" class="text-subtitle1 q-mr-sm"
          >Key:</span
        >
        <b>{{ result }}</b>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { NfcModel } from 'entity/Nfc'
const nfcStore = NfcModel.useNfcStore()

const args = ref({
  cuid: '2a234f80',
  nt0: '55721809',
  nr0: 'ce9985f6',
  ar0: '772f55be',
  nt1: 'a27173f2',
  nr1: 'e386b505',
  ar1: '5fa65203'
})

const result = ref<string>()
const mfkeyManualStart = async (e: Event | SubmitEvent) => {
  e.preventDefault()
  nfcStore.flags.mfkeyManualInProgress = true
  result.value = await nfcStore.mfkey(args.value)
}
</script>

<style lang="sass" scoped>
.args-inputs-container .q-field
  min-width: 70px
  max-width: 115px
</style>
