import { defineStore } from 'pinia'
import { ref, computed, watch, onMounted } from 'vue'
import { Platform } from 'quasar'

import { startMfkey } from 'util/mfkey32v2/mfkey'
import { log } from 'composables/useLog'
import { rpcErrorHandler } from 'composables/useRpcUtils'

import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()

import { useNfcWebStore } from './store-web'
import { useNfcElectronStore } from './store-electron'

export const useNfcMainStore = defineStore('NfcMain', () => {
  const platformStore = Platform.is.electron ? useNfcElectronStore(useNfcMainStore()) : useNfcWebStore(useNfcMainStore())

  const flipper = computed(() => mainStore.flipper)
  const info = computed(() => mainStore.info)

  const componentName = 'NfcTools'
  const flags = ref({
    mfkeyFlipperInProgress: false,
    mfkeyManualInProgress: false
  })
  const timeoutSeconds = ref(15)
  const mfkeyStatus = ref('')
  const args = ref({
    cuid: '2a234f80',
    nt0: '55721809',
    nr0: 'ce9985f6',
    ar0: '772f55be',
    nt1: 'a27173f2',
    nr1: 'e386b505',
    ar1: '5fa65203'
  })
  const result = ref('')
  const timeouts = ref([])
  const uniqueKeys = ref([])

  const nonces = ref([])
  const readNonces = async () => {
    const res = await flipper.value.RPC('storageRead', { path: '/ext/nfc/.mfkey32.log' })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageRead')
        mfkeyStatus.value = 'Mfkey log file not found'
        flags.value.mfkeyFlipperInProgress = false
      })
      .finally(() => {
        log({
          level: 'debug',
          message: `${componentName}: storageRead: /ext/nfc/.mfkey32.log`
        })
      })

    if (!res) {
      return
    }

    nonces.value = new TextDecoder().decode(res).split('\n')
    if (nonces.value[nonces.value.length - 1].length === 0) {
      nonces.value.pop()
    }
  }

  const mfkeyFlipperStart = async () => {
    timeouts.value = []
    flags.value.mfkeyFlipperInProgress = true
    mfkeyStatus.value = 'Loading log'

    const keys = new Set()
    const errors = []
    for (let i = 0; i < nonces.value.length; i++) {
      const args = nonces.value[i].slice(nonces.value[i].indexOf('cuid')).split(' ').filter((e, i) => i % 2 === 1)
      mfkeyStatus.value = `Cracking nonce ${i + 1} of ${nonces.value.length}`
      try {
        const key = await mfkey(args)
        if (key === 'timeout') {
          timeouts.value.push(args)
          continue
        }
        if (!key.startsWith('Error') && !key.includes(' ')) {
          keys.add(key)
          uniqueKeys.value = Array.from(keys)
        }
      } catch (error) {
        errors.push(error.toString())
        log({
          level: 'error',
          message: `${componentName}: error in mfkey32v2: ${error} (args: ${args})`
        })
      }
    }

    mfkeyStatus.value = 'Loading user dictionary'
    const res = await flipper.value.RPC('storageRead', { path: '/ext/nfc/assets/mf_classic_dict_user.nfc' })
      .catch(error => {
        rpcErrorHandler(componentName, error, 'storageRead')
      })
      .finally(() => {
        log({
          level: 'debug',
          message: `${componentName}: storageRead: /ext/nfc/assets/mf_classic_dict_user.nfc`
        })
      })

    let dictionary = []
    if (res) {
      mfkeyStatus.value = 'Processing user dictionary'
      dictionary = new TextDecoder().decode(res).split('\n')
      if (dictionary[dictionary.length - 1].length === 0) {
        dictionary.pop()
      }
    }

    dictionary = dictionary.filter(e => e !== 'Error: mfkey run killed on timeout')
    dictionary = new Set(dictionary)
    const oldDictLength = Array.from(dictionary).length
    for (const key of keys) {
      dictionary.add(key)
    }

    mfkeyStatus.value = 'Uploading user dictionary'
    const file = new TextEncoder().encode(Array.from(dictionary).join('\n'))
    const path = '/ext/nfc/assets/mf_classic_dict_user.nfc'
    await flipper.value.RPC('storageWrite', { path, buffer: file.buffer })
      .catch(error => rpcErrorHandler(componentName, error, 'storageWrite'))
      .finally(() => {
        log({
          level: 'debug',
          message: `${componentName}: storage.write: ${path}`
        })
      })

    mfkeyStatus.value = `Nonces: ${nonces.value.length} | Unique keys: ${uniqueKeys.value.length} | New keys: ${Array.from(dictionary).length - oldDictLength}`
    if (errors.length > 0) {
      mfkeyStatus.value += ` | Errors: ${errors.length} (check logs for details)`
    }
    if (timeouts.value.length > 0) {
      mfkeyStatus.value += ` | Timeouts: ${timeouts.value.length}`
    }

    flags.value.mfkeyFlipperInProgress = false
  }
  const mfkeyManualStart = async (e) => {
    e.preventDefault()
    flags.value.mfkeyManualInProgress = true
    return mfkey()
  }
  const mfkey = async (localArgs) => {
    result.value = ''
    if (!localArgs) {
      localArgs = Object.values(args.value)
    }
    let localResult
    try {
      localResult = await startMfkey(localArgs, timeoutSeconds.value)
      if (localResult) {
        log({
          level: 'debug',
          message: `${componentName}: cracked nonce: ${localArgs}, key: ${localResult}`
        })
      }
    } catch (error) {
      localResult = error.message || error
    }
    if (localResult.includes('timeout')) {
      return 'timeout'
    }
    if (localResult.startsWith('Error')) {
      throw new Error(localResult)
    }
    result.value = localResult
    flags.value.mfkeyManualInProgress = false
    return result.value
  }

  const start = platformStore.start

  const onFlipperReady = async (isConnected) => {
    nonces.value = []
    mfkeyStatus.value = ''
    timeouts.value = []
    uniqueKeys.value = []
    if (!isConnected) {
      return
    }

    // check for SD card
    if (!info.value?.storage.sdcard.status.isInstalled) {
      mainStore.toggleFlag('microSDcardMissingDialog', true)
      return
    }

    await readNonces()
    if (nonces.value.length === 0) {
      const res = await flipper.value.RPC('storageStat', { path: '/ext/nfc/.mfkey32.log' })
        .catch(error => {
          console.error(error)
        })
      if (res && res.size) {
        mfkeyStatus.value = 'No nonces found in log file'
      } else {
        mfkeyStatus.value = 'Log file not found'
      }
      flags.value.noncesNotFound = true
    }
  }

  watch(() => mainStore.flags.connected && mainStore.info?.doneReading, onFlipperReady)

  onMounted(() => onFlipperReady(mainStore.flags.connected && mainStore.info?.doneReading))

  return { flags, timeoutSeconds, mfkeyStatus, args, result, timeouts, uniqueKeys, nonces, mfkeyFlipperStart, mfkeyManualStart, start }
})
