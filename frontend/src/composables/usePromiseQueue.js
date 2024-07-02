import { beforeunloadActive, beforeunloadDeactivate } from 'composables/useBeforeunload'

export default function promiseQueue () {
  let queue = []
  let process = false
  let flipperCurrentlyParticipating = ''

  const addToQueue = async ({
    fn,
    flipperName,
    params
  }) => {
    queue.push({
      fn,
      flipperName,
      params
    })

    if (!process) {
      await executeQueue()
    }
  }

  const clearQueue = () => {
    queue = []
  }

  const executeQueue = () => {
    process = true
    beforeunloadActive()

    return new Promise((resolve, reject) => {
      const next = () => {
        if (queue.length) {
          const { fn, flipperName, params } = queue.shift()

          flipperCurrentlyParticipating = flipperName
          fn(...params)
            .then(() => next())
            .catch((error) => {
              process = false
              beforeunloadDeactivate()
              reject(error)
            })
        } else {
          process = false
          beforeunloadDeactivate()
          resolve()
        }
      }

      next()
    })
  }

  return {
    addToQueue,
    clearQueue,
    getProcess: () => process,
    getFlipperCurrentlyParticipating: () => flipperCurrentlyParticipating
  }
}
