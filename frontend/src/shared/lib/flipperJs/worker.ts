let workerPort: SerialPort | undefined = undefined

const workerConnect = async () => {
  const ports: SerialPort[] = await navigator.serial
    .getPorts()
    .catch((error) => {
      postMessage({
        message: 'connectionStatus',
        operation: 'connect',
        error
      })

      return []
    })
  workerPort = ports[0]
  await workerOpenPort()
}

const workerOpenPort = async ({ reopen = false } = {}) => {
  if (!workerPort) {
    postMessage({
      message: 'connectionStatus',
      operation: reopen ? 'reopenConnect' : 'connect',
      error: 'No port selected'
    })
    return
  }

  await workerPort
    .open({ baudRate: 1 })
    .then(() => {
      postMessage({
        message: 'connectionStatus',
        operation: reopen ? 'reopenConnect' : 'connect',
        status: 'success'
      })

      if (workerPort) {
        if (workerPort.readable) {
          postMessage(
            {
              message: 'getReadableStream',
              stream: workerPort.readable
            },
            // eslint-disable-next-line
            // @ts-ignore
            [workerPort.readable]
          )
        }
        if (workerPort.writable) {
          postMessage(
            {
              message: 'getWritableStream',
              stream: workerPort.writable
            },
            // eslint-disable-next-line
            // @ts-ignore
            [workerPort.writable]
          )
        }

        // Listen for disconnects
        workerPort.ondisconnect = () => {
          postMessage({
            message: 'connectionStatus',
            operation: 'portDisconnect',
            status: 'success'
          })
          workerPort = undefined
        }
      }
    })
    .catch((error) => {
      postMessage({
        message: 'connectionStatus',
        operation: reopen ? 'reopenConnect' : 'connect',
        error
      })
    })
}

let attempts = 1
const workerClosePort = async ({ reopen = false } = {}) => {
  if (!workerPort) {
    postMessage({
      message: 'connectionStatus',
      operation: 'disconnect',
      error: 'No port selected'
    })
    return
  }

  try {
    await workerPort
      .close()
      .then(() => {
        attempts = 1

        postMessage({
          message: 'connectionStatus',
          operation: reopen ? 'reopenDisconnect' : 'disconnect',
          status: 'success'
        })
      })
      .catch((error) => {
        // in case reader and writer don't get unlocked even with the added delay of 1ms
        if (attempts < 3) {
          attempts++
          return setTimeout(
            () =>
              workerClosePort({
                reopen
              }),
            100
          )
        }
        postMessage({
          message: 'connectionStatus',
          operation: reopen ? 'reopenDisconnect' : 'disconnect',
          error
        })
      })
  } catch (error) {
    postMessage({
      message: 'connectionStatus',
      operation: 'disconnect',
      error: 'Error closing port: ' + error
    })
  }
}

async function workerReopenPort() {
  await workerClosePort({
    reopen: true
  })
  await workerOpenPort({
    reopen: true
  })
}

onmessage = async (event) => {
  const { operation } = event.data

  switch (operation) {
    case 'connect':
      await workerConnect()
      break

    case 'openPort':
      await workerOpenPort()
      break

    case 'disconnect':
      await workerClosePort()
      break

    case 'reopenPort':
      await workerReopenPort()
      break

    default:
      postMessage({
        message: 'error',
        operation: 'onmessage',
        error: 'Unknown operation'
      })
  }
}
