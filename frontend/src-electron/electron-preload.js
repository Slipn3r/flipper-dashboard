import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bridge', {
  spawn: () => ipcRenderer.send('bridge:spawn'),
  kill: () => ipcRenderer.send('bridge:kill'),
  send: (json) => ipcRenderer.send('bridge:send', json),
  onSpawn: (callback) =>
    ipcRenderer.on('bridge:spawn', (_event, value) => callback(value)),
  onLog: (callback) =>
    ipcRenderer.on('bridge:log', (_event, value) => callback(value)),
  onExit: (callback) =>
    ipcRenderer.on('bridge:exit', (_event, value) => callback(value)),
  onList: (callback) =>
    ipcRenderer.on('bridge:list', (_event, value) => callback(value)),
  onCLIRead: (callback) =>
    ipcRenderer.on('bridge:read/cli', (_event, value) => callback(value)),
  onRPCRead: (callback) =>
    ipcRenderer.on('bridge:read/rpc', (_event, value) => callback(value)),
  onStatus: (callback) =>
    ipcRenderer.on('bridge:status', (_event, value) => callback(value)),
  onError: (callback) =>
    ipcRenderer.on('bridge:error', (_event, value) => callback(value))
})

contextBridge.exposeInMainWorld('fs', {
  saveToTemp: (args) => ipcRenderer.invoke('fs:saveToTemp', args),
  downloadFile: (args) => ipcRenderer.invoke('fs:downloadFile', args),
  downloadFolder: (args) => ipcRenderer.invoke('fs:downloadFolder', args)
})

contextBridge.exposeInMainWorld('logger', {
  log: (level, message, context = 'Renderer') =>
    ipcRenderer.send('logger:message', { level, message, context })
})
