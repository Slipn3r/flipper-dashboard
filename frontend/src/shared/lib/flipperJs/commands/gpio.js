import { createRPCPromise } from '../util'

const gpioPins = {
  PC0: 0,
  PC1: 1,
  PC3: 2,
  PB2: 3,
  PB3: 4,
  PA4: 5,
  PA6: 6,
  PA7: 7
}

const gpioPinModes = {
  OUTPUT: 0,
  INPUT: 1
}

const gpioInputPulls = {
  NO: 0,
  UP: 1,
  DOWN: 2
}

function setPin ({ pin, mode }) {
  return createRPCPromise.bind(this)('gpioUpdateRequest', { pin: gpioPins[pin], mode: gpioPinModes[mode] })
}

function setInputPull ({ pin, pullMode }) {
  return createRPCPromise.bind(this)('gpioSetInputPullRequest', { pin: gpioPins[pin], pullMode: gpioInputPulls[pullMode] })
}

function getPinMode ({ pin }) {
  return createRPCPromise.bind(this)('gpioGetPinModeRequest', { pin: gpioPins[pin] })
}

function readPin ({ pin }) {
  return createRPCPromise.bind(this)('gpioReadPinRequest', { pin: gpioPins[pin] })
}

function writePin ({ pin, value }) {
  return createRPCPromise.bind(this)('gpioWritePinRequest', { pin: gpioPins[pin], value })
}

export {
  setPin,
  setInputPull,
  getPinMode,
  readPin,
  writePin
}
