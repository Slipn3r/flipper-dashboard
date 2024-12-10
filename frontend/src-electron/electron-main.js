import {
  app,
  BrowserWindow,
  shell,
  utilityProcess,
  ipcMain,
  dialog
} from 'electron'
import path from 'path'
// import os from 'os'
import fs from 'fs'
import {
  createLogger,
  config as winstonConfig,
  format as winstonFormat,
  transports as winstonTransports
} from 'winston'

const extraResourcesPath =
  process.env.NODE_ENV === 'production'
    ? '../../extraResources'
    : '../../src-electron/extraResources'

const bridge = {
  process: null,
  queue: [],
  processingQueue: false,
  accumulator: '',
  webContents: null,

  spawn(event) {
    if (bridge.process) {
      bridge.kill()
    }

    try {
      bridge.webContents = event.sender
      bridge.process = utilityProcess.fork(
        path.resolve(
          __dirname,
          extraResourcesPath,
          'serial-bridge/bridgeProcess.js'
        )
      )
      bridge.process.on('message', (message) => {
        if (bridge.accumulator.length) {
          message.data = bridge.accumulator + message.data
        }
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
  kill() {
    bridge.process?.removeAllListeners()
    bridge.process?.kill()
  },
  send(event, json) {
    try {
      if (bridge.process && json) {
        bridge.process.postMessage({ type: 'stdin', json })
      }
    } catch (error) {
      console.error(error)
    }
  },
  processQueue() {
    bridge.processingQueue = true
    while (bridge.queue.length > 0) {
      const message = bridge.queue.shift()
      bridge.handleMessage(message)
    }
    bridge.processingQueue = false
  },
  handleMessage(message) {
    if (message.type === 'stdout') {
      let payload = {}

      try {
        payload = JSON.parse(message.data)
        bridge.accumulator = ''
      } catch (error) {
        const pos = parseInt(
          error.message.slice(
            error.message.indexOf('at position ') + 12,
            error.message.indexOf(' (line')
          )
        )
        if (!isNaN(pos)) {
          if (
            error.message.includes(
              'Unexpected non-whitespace character after JSON'
            )
          ) {
            const json = message.data.slice(0, pos)
            payload = JSON.parse(json)
            bridge.accumulator = ''
            const nextMessage = {
              type: 'stdout',
              data: message.data.slice(pos)
            }
            bridge.queue.unshift(nextMessage)
          } else {
            bridge.accumulator += message.data.slice(0, pos)
            return
          }
        } else {
          console.log(error.message)
          payload.type = 'failed to parse'
          payload.json = message.data
        }
      }

      if (payload.type === 'read' && payload.data) {
        bridge.webContents?.send(`bridge:read/${payload.data.mode}`, payload)
      } else if (payload.type === 'list') {
        bridge.webContents?.send('bridge:list', payload.data)
      } else if (payload.type === 'status') {
        bridge.webContents?.send('bridge:status', payload.data)
      } else if (payload.type === 'error') {
        bridge.webContents?.send('bridge:error', payload)
      } else {
        console.log(payload)
      }
    } else if (message.type === 'stderr') {
      bridge.webContents?.send('bridge:log', message)
    } else if (message.type === 'exit') {
      bridge.webContents?.send('bridge:exit', message.code)
    }
  }
}

const filesystem = {
  async saveToTemp(event, args) {
    try {
      const { filename, buffer } = args
      const tempPath = path.join(app.getPath('temp'), filename)
      fs.writeFileSync(tempPath, buffer)
      return { status: 'ok', path: tempPath }
    } catch (error) {
      console.error(error)
      return { status: 'error', message: error.message }
    }
  },
  async downloadFile(event, args) {
    try {
      const { filename, rawData } = args
      const result = await dialog.showSaveDialog({
        defaultPath: filename
      })

      if (result.canceled || !result.filePath) {
        return { status: 'warning', path: result.filePath || filename }
      }

      const filePath = result.filePath
      fs.writeFileSync(filePath, rawData)

      return { status: 'ok', path: filePath }
    } catch (error) {
      console.error(error)
      return { status: 'error', message: error.message }
    }
  },
  async downloadFolder(event, args) {
    try {
      const { structure, isUserAction } = args
      let { basePath = '' } = args

      let targetPath = basePath
      if (isUserAction) {
        const result = await dialog.showSaveDialog({
          defaultPath: structure.name
        })

        if (result.canceled || !result.filePath) {
          return { status: 'warning', path: structure.path }
        }

        basePath = targetPath = result.filePath

        fs.mkdirSync(targetPath)
      }

      for (let index = 0; index < structure.data.length; index++) {
        const element = structure.data[index]
        targetPath = `${basePath}/${element.name}`

        if (element.type === 1) {
          fs.mkdirSync(targetPath)

          await filesystem.downloadFolder(undefined, {
            isUserAction: false,
            structure: element,
            basePath: targetPath
          })
        }

        if (element.type === 0) {
          fs.writeFileSync(targetPath, element.rawData)
        }
      }

      return { status: 'ok', path: basePath }
    } catch (error) {
      console.error(error)
      return { status: 'error', message: error.message }
    }
  }
}

const getSessionLogFile = () => {
  const logDir = path.join(app.getPath('logs'))
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  return path.join(
    logDir,
    `session_${new Date().toISOString().replace(/[:.]/g, '-')}.log`
  )
}

const winstonLogger = createLogger({
  levels: winstonConfig.npm.levels,
  level: 'info',
  format: winstonFormat.combine(
    winstonFormat.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS' }),
    winstonFormat.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new winstonTransports.File({
      filename: getSessionLogFile(),
      level: 'debug'
    })
  ]
})

const logger = {
  message(event, { level, message, context }) {
    winstonLogger.log({ level, message: `[${context}] ${message}` })
  }
}

// NOTE: needed in case process is undefined under Linux
// const platform = process.platform || os.platform()

// let mainWindow: BrowserWindow | undefined;
let mainWindow

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1100,
    minWidth: 1100,
    height: 650,
    minHeight: 650,
    useContentSize: true,
    sandbox: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL).then(() => {
    if (process.env.DEBUGGING && process.env.NODE_ENV === 'production') {
      mainWindow.title = `${app.getName()} v.${app.getVersion()}`
    }
  })

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools({ mode: 'undocked', activate: false })
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.showInactive()
  })

  mainWindow.on('close', () => {
    mainWindow.hide()
    // mainWindow.destroy()
  })

  mainWindow.on('closed', () => {
    mainWindow = undefined
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  ipcMain.on('bridge:spawn', bridge.spawn)
  ipcMain.on('bridge:kill', bridge.kill)
  ipcMain.on('bridge:send', bridge.send)
  ipcMain.handle('fs:saveToTemp', filesystem.saveToTemp)
  ipcMain.handle('fs:downloadFile', filesystem.downloadFile)
  ipcMain.handle('fs:downloadFolder', filesystem.downloadFolder)
  ipcMain.on('logger:message', logger.message)

  createWindow()
})

app.on('window-all-closed', () => {
  bridge.kill()

  // NOTE: If is needed to replicate the behavior on macOS
  // if (platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow()
  }
})
