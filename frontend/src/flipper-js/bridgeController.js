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
  window.bridge.onRPCRead(payload => {
    // console.log('findFlipper', payload, findFlipper(payload.name))
    const flipper = findFlipper(payload.name)
    flipper.emitter.emit('RPCRead', payload.data)
  })

  window.bridge.onCLIRead(payload => {
    const flipper = findFlipper(payload.name)
    flipper.emitter.emit('CLIRead', payload.data)
  })

  window.bridge.onList(payload => {
    const finalList = []
    const oldList = bridgeController.list
    const newList = payload

    oldList.forEach(oldFlipper => {
      if (newList.find(newFlipper => newFlipper.name === oldFlipper.name)) {
        finalList.push(oldFlipper)
      } else {
        delete oldFlipper.emitter // here we "unbind" the emitter
      }
    })
    newList.forEach(newFlipper => {
      if (!oldList.find(oldFlipper => oldFlipper.name === newFlipper.name)) {
        newFlipper.emitter = createNanoEvents() // here we "create" a new emitter
        finalList.push(newFlipper)
      }
    })

    bridgeController.list = finalList

    emitter.emit('list', bridgeController.list)
  })

  window.bridge.onLog(e => {
    console.log('bridge log', e)
    emitter.emit('log')
  })

  window.bridge.onSpawn(() => {
    console.log('bridge spawn')
    emitter.emit('spawn')
  })
  window.bridge.onExit(e => {
    console.log('bridge exit', e)
    emitter.emit('exit', e)
  })

  window.bridge.spawn()

  return new Promise((resolve) => {
    const unbind = emitter.on('list', list => {
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

export { bridgeController, emitter, init, getList, getCurrentFlipper, setCurrentFlipper }
