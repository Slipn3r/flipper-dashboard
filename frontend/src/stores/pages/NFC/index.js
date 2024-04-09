import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

  const mfkeyFlipperStart = async () => {
    if (!info.value?.storage.sdcard.status.isInstalled) {
      mainStore.toggleFlag('microSDcardMissingDialog', true)
      return
    }
    flags.value.mfkeyFlipperInProgress = true
    mfkeyStatus.value = 'Loading log'

    let res = await flipper.value.RPC('storageRead', { path: '/ext/nfc/.mfkey32.log' })
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

    mfkeyStatus.value = 'Processing log'
    const nonces = new TextDecoder().decode(res).split('\n')
    if (nonces[nonces.length - 1].length === 0) {
      nonces.pop()
    }

    const keys = new Set()
    const errors = []
    for (let i = 0; i < nonces.length; i++) {
      const args = nonces[i].slice(nonces[i].indexOf('cuid')).split(' ').filter((e, i) => i % 2 === 1)
      mfkeyStatus.value = `Attacking nonce ${i + 1} of ${nonces.length}`
      try {
        const key = await mfkey(args)
        if (!key.startsWith('Error')) {
          keys.add(key)
        }
        log({
          level: 'debug',
          message: `${componentName}: cracked nonce: ${args}, key: ${key}`
        })
      } catch (error) {
        errors.push(error.toString())
        log({
          level: 'error',
          message: `${componentName}: error in mfkey32v2: ${error}`
        })
      }
    }

    mfkeyStatus.value = 'Loading user dictionary'
    res = await flipper.value.RPC('storageRead', { path: '/ext/nfc/assets/mf_classic_dict_user.nfc' })
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
    const dictLength = Array.from(dictionary).length
    for (const key of keys) {
      dictionary.add(key)
    }

    mfkeyStatus.value = 'Uploading user dictionary'
    const file = new TextEncoder().encode(Array.from(keys).join('\n'))
    const path = '/ext/nfc/assets/mf_classic_dict_user.nfc'
    await flipper.value.RPC('storageWrite', { path, buffer: file.buffer })
      .catch(error => rpcErrorHandler(componentName, error, 'storageWrite'))
      .finally(() => {
        log({
          level: 'debug',
          message: `${componentName}: storage.write: ${path}`
        })
      })

    mfkeyStatus.value = `Nonces: ${nonces.length} | Unique keys: ${Array.from(keys).length} | New keys: ${Array.from(dictionary).length - dictLength} | Errors: ${errors.length}`

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
      localResult = await startMfkey(localArgs)
      log({
        level: 'debug',
        message: `${componentName}: cracked nonce: ${localArgs}, key: ${localResult}`
      })
    } catch (error) {
      log({
        level: 'error',
        message: `${componentName}: error in mfkey32v2: ${error}`
      })
      localResult = `Error: ${error}`
    }
    if (flags.value.mfkeyManualInProgress) {
      result.value = localResult
    }
    flags.value.mfkeyManualInProgress = false
    return result.value
  }

  const start = platformStore.start

  return { flags, mfkeyStatus, args, result, mfkeyFlipperStart, mfkeyManualStart, start }
})
