let port = null;

onmessage = async (event) => {
  const { type } = event.data;

  if (type === 'connect') {
    connect();
  }

  if (type === 'disconnect') {
    closePort()
  }

  if (type === 'reopenPort') {
    reopenPort()
  }
};

const connect = async () => {
  try {
    const ports = await navigator.serial.getPorts()
    port = ports[0];
    postMessage({ type: 'log', data: 'Connected' });
    await openPort();
  } catch (error) {
    postMessage({ type: 'error', data: 'Error connecting: ' + error });
  }
}

const openPort = async () => {
  if (!port) {
    postMessage({ type: 'error', data: 'No port selected' });
    return;
  }

  try {
    await port.open({ baudRate: 1 });
    postMessage({ type: 'log', data: 'Port opened'  });

    postMessage({
      type: 'getReadableStream',
      stream: port.readable
    }, [port.readable])
    postMessage({
      type: 'getWritableStream',
      stream: port.writable
    }, [port.writable])

    // Listen for disconnects
    port.ondisconnect = () => {
      postMessage({ type: 'disconnected', data: 'Device disconnected' });
      port = null;
    };
  } catch (error) {
    postMessage({ type: 'error', data: 'Error opening port: ' + error });
  }
}

const closePort = async () => {
  if (!port) {
    postMessage({ type: 'error', data: 'No port selected' });
    return;
  }

  try {
    await port.close();
    postMessage({ type: 'log', data: 'Port closed' });
    port = null;
  } catch (error) {
    postMessage({ type: 'error', data: 'Error closing port: ' + error });
    postMessage({
      message: 'connectionStatus',
      operation: 'disconnect',
      error: 'Error closing port: ' + error
    })
  }
}

async function reopenPort () {
  if (!port.readable && !port.writable) {
    await closePort()
    await openPort()
  }
}
