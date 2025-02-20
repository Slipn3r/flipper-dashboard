import { spawn } from 'child_process'
import { resolve } from 'path'
const decoder = new TextDecoder()

import { fileURLToPath } from 'node:url'
const currentDir = fileURLToPath(new URL('.', import.meta.url))

const bridgeProcess = spawn(resolve(currentDir, 'flipper_lab_bridge'))

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
