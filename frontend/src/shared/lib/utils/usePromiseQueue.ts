import { App, InstalledApp, ActionType } from 'entity/Apps/model'
import { beforeunloadActive, beforeunloadDeactivate } from './useBeforeunload'

export type QueueItem = {
  fn: (app: App | InstalledApp, actionType: ActionType) => Promise<void>
  params: [App | InstalledApp, ActionType]
}

let queue: QueueItem[] = []
let process = false

const addToQueue = async ({ fn, params }: QueueItem) => {
  queue.push({
    fn,
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
        const queueShift = queue.shift()
        if (queueShift) {
          const { fn, params } = queueShift

          fn(...params)
            .then(() => next())
            .catch((error) => {
              process = false
              beforeunloadDeactivate()
              reject(error)
            })
        }
      } else {
        process = false
        beforeunloadDeactivate()
        resolve('The queue has been completed')
      }
    }

    next()
  })
}

const getProcess = () => process

export { addToQueue, clearQueue, getProcess }
