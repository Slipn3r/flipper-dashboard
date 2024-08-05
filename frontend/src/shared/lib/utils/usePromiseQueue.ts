import { App, InstalledApp, ActionType } from 'entities/Apps/model'
import { beforeunloadActive, beforeunloadDeactivate } from './useBeforeunload'

type QueueItem = {
  fn: (app: App | InstalledApp, actionType: ActionType) => Promise<void>
  flipperName?: string
  params: [App | InstalledApp, ActionType]
}

let queue: QueueItem[] = []
let process = false
let flipperCurrentlyParticipating = ''

const addToQueue = async ({
  fn,
  flipperName,
  params
}: QueueItem) => {
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
        const queueShift = queue.shift()
        if (queueShift) {
          const { fn, flipperName, params } = queueShift

          if (flipperName) {
            flipperCurrentlyParticipating = flipperName
          }
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
const getFlipperCurrentlyParticipating = () => flipperCurrentlyParticipating

export {
  addToQueue,
  clearQueue,
  getProcess,
  getFlipperCurrentlyParticipating
}
