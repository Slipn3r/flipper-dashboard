import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { startMfkey } from '../lib/mfkey'

import { logger } from 'shared/lib/utils/useLog'

const componentName = 'NfcStore'

export const useNfcStore = defineStore('nfc', () => {
  const flags = reactive({
    mfkeyFlipperInProgress: false,
    mfkeyManualInProgress: false
  })

  const timeoutSeconds = ref(15)

  const mfkey = async (args: object) => {
    let result = ''
    if (args instanceof Object) {
      args = Object.values(args)
    }

    try {
      result = await startMfkey(args, timeoutSeconds.value)
      if (result) {
        logger.debug({
          context: componentName,
          message: `cracked nonce: ${args}, key: ${result}`
        })
      }
    } catch (error) {
      if (error instanceof ErrorEvent || error instanceof Error) {
        result = error.message
      } else {
        result = String(error)
      }
    }
    flags.mfkeyManualInProgress = false
    if (result.includes('timeout')) {
      return 'timeout'
    }
    if (result.startsWith('Error')) {
      throw new Error(result)
    }
    return result
  }

  return {
    flags,
    timeoutSeconds,
    mfkey
  }
})
