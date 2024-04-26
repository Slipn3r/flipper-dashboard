import { app, BrowserWindow, nativeTheme, utilityProcess, ipcMain } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'
const extraResourcesPath = process.env.WEBPACK_SERVE === 'true' ? 'extraResources' : '../extraResources'

const bridge = {
  process: null,
  queue: [],
  processingQueue: false,
  spawn (event) {
    if (bridge.process) {
      bridge.kill()
    }

    try {
      bridge.webContents = event.sender
      bridge.process = utilityProcess.fork(path.resolve(__dirname, extraResourcesPath, 'serial-bridge/bridgeProcess.js'))
      bridge.process.on('message', message => {
        bridge.queue.push(message)
        if (!bridge.processingQueue) {
          bridge.processQueue()
        }
      })
      bridge.webContents.send('bridge:spawn')
    } catch (error) {
      console.error(error)
    }
  },
  kill () {
    bridge.process?.removeAllListeners()
    bridge.process?.kill()
  },
  send (event, json) {
    try {
      if (bridge.process && json) {
        bridge.process.postMessage({ type: 'stdin', json })
      }
    } catch (error) {
      console.error(error)
    }
  },
  processQueue () {
    bridge.processingQueue = true
    while (bridge.queue.length > 0) {
      const message = bridge.queue.shift()
      bridge.handleMessage(message)
    }
    bridge.processingQueue = false
  },
  handleMessage (message) {
    if (message.type === 'stdout') {
      let payload = {}

      try {
        payload = JSON.parse(message.data)
      } catch (error) {
        if (error.message.includes('Unexpected non-whitespace character after JSON')) {
          const pos = parseInt(error.message.slice(error.message.indexOf('at position ') + 12, error.message.indexOf(' (line')))
          if (!isNaN(pos)) {
            const json = message.data.slice(0, pos)
            payload = JSON.parse(json)
            const nextMessage = {
              type: 'stdout',
              data: message.data.slice(pos)
            }
            bridge.queue.unshift(nextMessage)
          }
        } else {
          console.log(error.message)
          payload.type = 'failed to parse'
          payload.json = message.data
        }
      }

      if (payload.type === 'read' && payload.data) {
        bridge.webContents.send(`bridge:read/${payload.data.mode}`, payload)
      } else if (payload.type === 'list') {
        bridge.webContents.send('bridge:list', payload.data)
      } else if (payload.type === 'status') {
        bridge.webContents.send('bridge:status', payload.data)
      } else if (payload.type === 'error') {
        bridge.webContents.send('bridge:error', payload)
      } else {
        console.log(payload)
      }
    } else if (message.type === 'stderr') {
      bridge.webContents.send('bridge:log', message)
    } else if (message.type === 'exit') {
      bridge.webContents.send('bridge:exit', message.code)
    }
  }
}

const filesystem = {
  async saveToTemp (event, args) {
    try {
      const { filename, buffer } = args
      const tempPath = path.join(app.getPath('temp'), filename)
      fs.writeFileSync(tempPath, buffer)
      return { status: 'ok', path: tempPath }
    } catch (error) {
      console.error(error)
      return { status: 'error', message: error.message }
    }
  }
}

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

let mainWindow

async function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    sandbox: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools()
  } else {
    if (process.env.PRODUCTION) {
      mainWindow.webContents.on('devtools-opened', () => {
        mainWindow.webContents.closeDevTools()
      })
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.showInactive()
  })
}

app.whenReady()
  .then(() => {
    /*
      Usage (browser side):

      bridge.onMessage(console.log)
      bridge.spawn()
      bridge.send({
        type: 'write',
        name: 'Amogus',
        data: btoa('led bl 128\r'),
        mode: 'cli'
      })
    */

    ipcMain.on('bridge:spawn', bridge.spawn)
    ipcMain.on('bridge:kill', bridge.kill)
    ipcMain.on('bridge:send', bridge.send)
    ipcMain.handle('fs:saveToTemp', filesystem.saveToTemp)

    createWindow()
  })

app.on('window-all-closed', () => {
  bridge.kill()
  app.quit()
})

/* app.on('will-quit', () => {
  bridge.kill()
}) */

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
