onmessage = function (e) {
  switch (e.data.message) {
    case 'connect':
      connect()
      break
    case 'disconnect':
      closePort()
      break
    case 'reopenPort':
      reopenPort()
      break
  }
}

let port

async function connect () {
  const ports = await navigator.serial.getPorts({ filters: this.filters })
    .catch(error => {
      self.postMessage({
        message: 'connectionStatus',
        operation: 'connect',
        error
      })
    })
  port = ports[0]
  return openPort()
}

async function openPort () {
  await port.open({ baudRate: 1 })
    .then(() => {
      self.postMessage({
        message: 'connectionStatus',
        operation: 'connect',
        status: 'success'
      })
    })
    .catch(error => {
      self.postMessage({
        message: 'connectionStatus',
        operation: 'connect',
        error
      })
    })
  self.postMessage({
    message: 'getReadableStream',
    stream: port.readable
  }, [port.readable])
  self.postMessage({
    message: 'getWritableStream',
    stream: port.writable
  }, [port.writable])
}

async function closePort (attempts = 1) {
  await port.close()
    .then(() => {
      self.postMessage({
        message: 'connectionStatus',
        operation: 'disconnect',
        status: 'success'
      })
    })
    .catch(error => {
      // in case reader and writer don't get unlocked even with the added delay of 1ms
      if (attempts < 3) {
        attempts++
        return setTimeout(() => closePort(attempts), 100)
      }
      self.postMessage({
        message: 'connectionStatus',
        operation: 'disconnect',
        error
      })
    })
}

async function reopenPort () {
  await closePort()
  return openPort()
}
