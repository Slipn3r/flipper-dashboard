const { spawn } = require('child_process')
const path = require('path')
const decoder = new TextDecoder()

const bridgeProcess = spawn(path.join(__dirname, 'flipper_lab_bridge'))

bridgeProcess.stdout.on('data', (data) => {
  process.parentPort.postMessage({
    type: 'stdout',
    data: decoder.decode(data)
  })
})
bridgeProcess.stderr.on('data', (data) => {
  process.parentPort.postMessage({
    type: 'stderr',
    data: decoder.decode(data)
  })
})
bridgeProcess.on('close', (code) => {
  process.parentPort.postMessage({
    type: 'exit',
    code
  })
})

process.parentPort.on('message', (e) => {
  if (e.data.type === 'stdin') {
    const json =
      typeof e.data.json === 'string'
        ? e.data.json
        : JSON.stringify(e.data.json)
    bridgeProcess.stdin.write(json + '\n')
  }
})

function killBeforeExit() {
  console.log('bridgeProcess SIGTERM')
  if (bridgeProcess) {
    try {
      bridgeProcess.kill()
    } catch (error) {
      console.error(error)
    }
  }
}

process.on('SIGTERM', killBeforeExit)
