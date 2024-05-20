import { beforeunloadActive, beforeunloadDeactivate } from 'composables/useBeforeunload'

export default function promiseQueue () {
  const queue = []
  let process = false

  const addToQueue = (fn, params) => {
    queue.push({
      fn,
      params
    })

    if (!process) {
      executeQueue()
    }
  }

  const executeQueue = () => {
    process = true
    beforeunloadActive()

    return new Promise((resolve, reject) => {
      const next = () => {
        if (queue.length) {
          const { fn, params } = queue.shift()

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
    executeQueue
  }
}
