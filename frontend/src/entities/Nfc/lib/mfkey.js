import { Operation } from 'shared/lib/utils/operation'
const operation = new Operation()
let mfkey

async function startMfkey(args, timeoutSeconds = 15) {
  mfkey = new Worker(new URL('./mfkey-worker.js', import.meta.url))
  const start = operation.create(
    mfkey,
    'start',
    JSON.parse(JSON.stringify(args))
  )
  const timeout = setTimeout(() => {
    operation.terminate({ status: 0, error: 'killed on timeout' })
    mfkey.terminate()
  }, timeoutSeconds * 1000)
  mfkey.onmessage = (e) => {
    if (e.data.operation === 'output') {
      clearTimeout(timeout)
      operation.terminate({ status: 1, data: e.data.data })
      mfkey.terminate()
    } else if (e.data.operation === 'error') {
      operation.terminate({ status: 0, error: e.data.data })
      mfkey.terminate()
    }
  }
  return start
}

function forceStopMfkey() {
  mfkey.terminate()
  mfkey = null
}

export { startMfkey, forceStopMfkey }
