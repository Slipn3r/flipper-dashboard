import { createRPCPromise } from '../util'

const inputKeys = {
  UP: 0,
  DOWN: 1,
  RIGHT: 2,
  LEFT: 3,
  OK: 4,
  BACK: 5
}

const inputTypes = {
  PRESS: 0, // < Press event, emitted after debounce
  RELEASE: 1, // < Release event, emitted after debounce
  SHORT: 2, // < Short event, emitted after InputTypeRelease done withing INPUT_LONG_PRESS interval
  LONG: 3, // < Long event, emmited after INPUT_LONG_PRESS interval, asynchronouse to InputTypeRelease
  REPEAT: 4 // < Repeat event, emmited with INPUT_REPEATE_PRESS period after InputTypeLong event
}

const screenOrientations = {
  HORIZONTAL: 0, // < Horizontal
  HORIZONTAL_FLIP: 1, // < Horizontal flipped (180)
  VERTICAL: 2, // < Vertical (90)
  VERTICAL_FLIP: 3 // < Vertical flipped
}

function screenFrame ({ data, orientation = 'HORIZONTAL' }) {
  const [requestData] = this.encodeRPCRequest('guiScreenFrame', { data, orientation: screenOrientations[orientation] })
  this.writeRaw(requestData)
}

function startScreenStream () {
  return createRPCPromise.bind(this)('guiStartScreenStreamRequest')
}

function stopScreenStream () {
  return createRPCPromise.bind(this)('guiStopScreenStreamRequest')
}

function sendInputEvent ({ key, type }) {
  return createRPCPromise.bind(this)('guiSendInputEventRequest', { key: inputKeys[key], type: inputTypes[type] })
}

function startVirtualDisplay (firstFrame) {
  const args = {}
  if (firstFrame) {
    const [data] = this.encodeRPCRequest(
      'guiScreenFrame',
      { data: firstFrame.data, orientation: screenOrientations[firstFrame.orientation] },
      false,
      0
    )
    args[firstFrame] = data
  }
  return createRPCPromise.bind(this)('guiStartVirtualDisplayRequest', args)
}

function stopVirtualDisplay () {
  // this.emitter.emit('screenStream/stop')
  return createRPCPromise.bind(this)('guiStopVirtualDisplayRequest')
}

export {
  screenFrame,
  startScreenStream,
  stopScreenStream,
  sendInputEvent,
  startVirtualDisplay,
  stopVirtualDisplay
}
