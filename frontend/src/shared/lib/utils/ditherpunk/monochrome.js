import { createNanoEvents } from 'nanoevents'
import { message } from './worker-utils.js'

export const emitter = createNanoEvents()

let worker

function setup () {
  worker = new Worker(new URL('./monochrome-worker.js', import.meta.url), { type: 'module' })
  worker.addEventListener('message', async e => {
    const { id, type, title, imageData } = e.data
    if (type === 'started') {
      emitter.emit('dither/start', { id, title })
    } else {
      emitter.emit('dither/result', { id, imageData })
    }
  })
  worker.addEventListener('error', () =>
    console.error('Error in monochrome worker')
  )

  /* const bluenoiseWorker = new Worker(new URL('./bluenoise-worker.js', import.meta.url), {
    name: 'bluenoise',
    type: 'module'
  })
  bluenoiseWorker.addEventListener('error', () =>
    console.error('Error in bluenoise worker')
  )
  bluenoiseWorker.addEventListener(
    'message',
    ({ data }) => {
      worker.postMessage({ ...data, id: 'bluenoise' })
    },
    { once: true }
  ) */

  const numBayerLevels = 4
  const bayerWorker = new Worker(new URL('./bayer-worker.js', import.meta.url), {
    name: 'bayer',
    type: 'module'
  })
  bayerWorker.addEventListener('error', () =>
    console.error('Error in bayer worker')
  )
  const bayerLevels = Array.from({ length: numBayerLevels }, (_, id) => {
    bayerWorker.postMessage({
      level: id,
      id
    })
    return message(bayerWorker, id).then(m => m.result)
  })
  Promise.all(bayerLevels).then(bayerLevels =>
    worker.postMessage({ bayerLevels, id: 'bayerlevels' })
  )
}

export function dither (image) {
  if (!worker) {
    setup()
  }
  worker.postMessage({
    id: 'image',
    image
  })
}
