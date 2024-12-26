import { createNanoEvents } from 'nanoevents'

const bridgeController = {
  list: [],
  currentFlipper: null
}

const emitter = createNanoEvents()
const findFlipper = (name) => {
  return bridgeController.list.find((flipper) => flipper.name === name)
}

const init = async () => {
  console.log('bridge init')
  window.bridge.onRPCRead((payload) => {
    const flipper = findFlipper(payload.name)
    flipper.emitter.emit('RPCRead', payload.data.buffer)
  })

  window.bridge.onCLIRead((payload) => {
    const flipper = findFlipper(payload.name)
    flipper.emitter.emit('CLIRead', payload.data.buffer)
  })

  window.bridge.onList((payload) => {
    const finalList = []
    const oldList = bridgeController.list
    const newList = payload

    const interchangeableModes = ['cli', 'rpc']
    oldList.forEach((oldFlipper) => {
      if (
        newList.find(
          (newFlipper) =>
            newFlipper.name === oldFlipper.name &&
            interchangeableModes.includes(newFlipper.mode) &&
            interchangeableModes.includes(oldFlipper.mode)
        )
      ) {
        finalList.push(oldFlipper)
      } else {
        oldFlipper.emitter.events = {}
        delete oldFlipper.emitter
      }
    })
    newList.forEach((newFlipper) => {
      if (
        !oldList.find(
          (oldFlipper) =>
            oldFlipper.name === newFlipper.name &&
            interchangeableModes.includes(newFlipper.mode) &&
            interchangeableModes.includes(oldFlipper.mode)
        )
      ) {
        newFlipper.emitter = createNanoEvents()
        finalList.push(newFlipper)
      }
    })

    bridgeController.list = finalList.filter(
      (flipper) => flipper.mode !== 'offline'
    )

    emitter.emit('list', bridgeController.list)
  })

  window.bridge.onLog((e) => {
    console.log('bridge log', e)
    emitter.emit('log', e)
  })

  window.bridge.onStatus((e) => {
    console.log('bridge status', e)
    emitter.emit('status', e)
  })

  window.bridge.onSpawn(() => {
    console.log('bridge spawn')
    emitter.emit('spawn')
  })

  window.bridge.onExit((e) => {
    console.log('bridge exit', e)
    emitter.emit('exit', e)
  })

  window.bridge.onError((e) => {
    console.warn('bridge error', e)
    emitter.emit('error', e)
  })

  window.bridge.spawn()

  return new Promise((resolve) => {
    const unbind = emitter.on('list', (list) => {
      if (list.length) {
        unbind()
        resolve()
      }
    })
  })
}

const getList = () => {
  return bridgeController.list
}

const getCurrentFlipper = () => {
  return bridgeController.currentFlipper
}

const setCurrentFlipper = (name) => {
  bridgeController.currentFlipper = findFlipper(name)
}

export {
  bridgeController,
  emitter,
  init,
  getList,
  getCurrentFlipper,
  setCurrentFlipper
}
