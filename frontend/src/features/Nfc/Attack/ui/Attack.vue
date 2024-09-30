<template>
  <q-card flat bordered>
    <q-card-section>
      <h6 class="full-width text-center q-ma-none">Mfkey32v2 NFC attack</h6>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">Crack nonces on Flipper</div>
      <div class="q-mb-md">
        Captured nonces are stored in the log file
        (<code>/ext/nfc/.mfkey32.log</code>).<br />
        Once discovered, new keys will be added to the user dictionary file
        (<code>/ext/nfc/assets/mf_classic_dict_user.nfc</code>).
      </div>
      <div>
        Some cracks may take longer than expected. Timeout:
        <q-input
          v-model.number.trim="nfcStore.timeoutSeconds"
          @keypress="useNumbersOnly"
          dense
          style="width: 40px; display: inline-block"
          class="q-ml-sm"
        />
        seconds.
      </div>
    </q-card-section>
    <q-card-section
      v-if="flipperStore.flags.connected && flipperStore.rpcActive"
      class="column item-center"
    >
      <div class="row justify-center">
        <q-btn
          color="primary"
          label="Give me the keys"
          :loading="nfcStore.flags.mfkeyFlipperInProgress"
          :disable="
            nfcStore.flags.mfkeyManualInProgress ||
            !flipperStore.info?.storage.sdcard?.status.isInstalled ||
            nonces.length === 0
          "
          @click="mfkeyFlipperStart"
          unelevated
        />
      </div>
      <span
        v-if="
          flipperStore.info?.doneReading &&
          !flipperStore.info?.storage.sdcard?.status.isInstalled
        "
        class="q-pt-sm text-subtitle-1 text-negative"
      >
        MicroSD card not detected
      </span>
      <div v-if="mfkeyStatus" class="q-pt-sm text-subtitle-1 text-center">
        {{ mfkeyStatus }}
      </div>
      <div class="row justify-center">
        <q-btn
          v-if="
            (flipperStore.info?.doneReading &&
              !flipperStore.info?.storage.sdcard?.status.isInstalled) ||
            noncesNotFound
          "
          flat
          dense
          icon="mdi-reload"
          label="Refresh"
          @click="readNonces"
        />
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
              <template v-for="(args, index) in timeouts" :key="index">
                <tr v-if="args.length">
                  <td v-for="arg in args" :key="arg">{{ arg }}</td>
                </tr>
              </template>
            </tbody>
          </q-markup-table>
        </template>
      </div>
    </q-card-section>
    <q-card-section v-else class="row justify-center">
      <template v-if="flipperStore.isElectron">
        <p>Plug in your Flipper and and wait for initialization</p>
      </template>
      <template v-else>
        <FlipperConnectWebBtn />
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import { log } from 'shared/lib/utils/useLog'
import { rpcErrorHandler } from 'shared/lib/utils/useRpcUtils'

import { FlipperConnectWebBtn } from 'features/Flipper'

import { FlipperModel } from 'entities/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { NfcModel } from 'entities/Nfc'
const nfcStore = NfcModel.useNfcStore()
import { useNumbersOnly } from 'shared/lib/utils/useNumberOnly'
import { FlipperWeb } from 'shared/lib/flipperJs'

const componentName = 'NfcAttack'

const mfkeyStatus = ref('')

const nonces = ref<string[]>([])
const noncesNotFound = ref(false)
const readNonces = async () => {
  nfcStore.flags.mfkeyFlipperInProgress = true
  noncesNotFound.value = false
  mfkeyStatus.value = ''

  if (!flipperStore.info?.storage.sdcard?.status.isInstalled) {
    flipperStore.dialogs.microSDcardMissing = true
    return
  }

  const res = await flipperStore.flipper
    ?.RPC('storageRead', { path: '/ext/nfc/.mfkey32.log' })
    .then((value: Uint8Array) => {
      log({
        level: 'debug',
        message: `${componentName}: storageRead: /ext/nfc/.mfkey32.log`
      })

      return value
    })
    .catch((error: Error) => {
      if (error.toString() !== 'ERROR_STORAGE_NOT_EXIST') {
        rpcErrorHandler({
          componentName,
          error,
          command: 'storageRead: /ext/nfc/.mfkey32.log'
        })
      } else {
        log({
          level: 'warn',
          message: `${componentName}: storageRead: /ext/nfc/.mfkey32.log: ${error.toString()}`
        })
      }

      noncesNotFound.value = true
      mfkeyStatus.value = 'Mfkey log file not found'
      nfcStore.flags.mfkeyFlipperInProgress = false
    })

  if (!res) {
    return
  }

  nonces.value = new TextDecoder().decode(res).split('\n')
  if (nonces.value[nonces.value.length - 1].length === 0) {
    nonces.value.pop()
  }

  if (nonces.value.length === 0) {
    const res = await flipperStore.flipper
      ?.RPC('storageStat', { path: '/ext/nfc/.mfkey32.log' })
      .catch((error: object) => {
        console.error(error)
      })
    if (res && res.size) {
      mfkeyStatus.value = 'No nonces found in log file'
    } else {
      mfkeyStatus.value = 'Log file not found'
    }
    noncesNotFound.value = true
  }
}
onMounted(async () => {
  if (flipperStore.flipperReady) {
    if (!flipperStore.rpcActive) {
      if (!flipperStore.isElectron) {
        if (flipperStore.flipper instanceof FlipperWeb) {
          await flipperStore.flipper?.startRPCSession()
        }
      } else {
        flipperStore.flipper?.setReadingMode('rpc')
      }
    }

    if (flipperStore.rpcActive) {
      if (!flipperStore.info) {
        await flipperStore.flipper?.getInfo()
      }

      await readNonces()
    }
  }
})
watch(
  () => flipperStore.flipper?.flipperReady,
  async (newValue) => {
    if (newValue) {
      readNonces()
    }
  }
)

const timeouts = ref<string[][]>([])
const uniqueKeys = ref<string[]>([])
const mfkeyFlipperStart = async () => {
  timeouts.value = []
  nfcStore.flags.mfkeyFlipperInProgress = true
  mfkeyStatus.value = 'Loading log'

  const keys = new Set<string>()
  const errors = []
  for (let i = 0; i < nonces.value.length; i++) {
    const args = nonces.value[i]
      .slice(nonces.value[i].indexOf('cuid'))
      .split(' ')
      .filter((e, i) => i % 2 === 1)
    mfkeyStatus.value = `Cracking nonce ${i + 1} of ${nonces.value.length}`
    try {
      const key = await nfcStore.mfkey(args)
      if (key === 'timeout') {
        timeouts.value.push(args)
        continue
      }
      if (!key.startsWith('Error') && !key.includes(' ')) {
        keys.add(key)
        uniqueKeys.value = Array.from(keys)
      }
    } catch (error) {
      if (error instanceof ErrorEvent || error instanceof Error) {
        error = error.message
      } else {
        error = String(error)
      }
      errors.push(error)
      log({
        level: 'error',
        message: `${componentName}: error in mfkey32v2: ${error} (args: ${args})`
      })
    }
  }

  mfkeyStatus.value = 'Loading user dictionary'
  const res = await flipperStore.flipper
    ?.RPC('storageRead', { path: '/ext/nfc/assets/mf_classic_dict_user.nfc' })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageRead' })
    )
    .finally(() => {
      log({
        level: 'debug',
        message: `${componentName}: storageRead: /ext/nfc/assets/mf_classic_dict_user.nfc`
      })
    })

  let dictionary: string[] | Set<string> = []
  if (res) {
    mfkeyStatus.value = 'Processing user dictionary'
    dictionary = new TextDecoder().decode(res).split('\n')
    if (dictionary[dictionary.length - 1].length === 0) {
      dictionary.pop()
    }
  }

  dictionary = dictionary.filter(
    (e) => e !== 'Error: mfkey run killed on timeout'
  )
  dictionary = new Set(dictionary)
  const oldDictLength = Array.from(dictionary).length
  for (const key of keys) {
    dictionary.add(key)
  }

  mfkeyStatus.value = 'Uploading user dictionary'
  const file = new TextEncoder().encode(Array.from(dictionary).join('\n'))
  const path = '/ext/nfc/assets/mf_classic_dict_user.nfc'
  await flipperStore.flipper
    ?.RPC('storageWrite', { path, buffer: file.buffer })
    .catch((error: Error) =>
      rpcErrorHandler({ componentName, error, command: 'storageWrite' })
    )
    .finally(() => {
      log({
        level: 'debug',
        message: `${componentName}: storage.write: ${path}`
      })
    })

  mfkeyStatus.value = `Nonces: ${nonces.value.length} | Unique keys: ${
    uniqueKeys.value.length
  } | New keys: ${Array.from(dictionary).length - oldDictLength}`
  if (errors.length > 0) {
    mfkeyStatus.value += ` | Errors: ${errors.length} (check logs for details)`
  }
  if (timeouts.value.length > 0) {
    mfkeyStatus.value += ` | Timeouts: ${timeouts.value.length}`
  }

  nfcStore.flags.mfkeyFlipperInProgress = false
}
</script>
