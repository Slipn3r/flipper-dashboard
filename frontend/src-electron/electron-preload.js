import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bridge', {
  spawn: () => ipcRenderer.send('bridge:spawn'),
  kill: () => ipcRenderer.send('bridge:kill'),
  send: json => ipcRenderer.send('bridge:send', json),
  onLog: callback => ipcRenderer.on('bridge:log', (_event, value) => callback(value)),
  onExit: callback => ipcRenderer.on('bridge:exit', (_event, value) => callback(value)),
  onList: callback => ipcRenderer.on('bridge:list', (_event, value) => callback(value)),
  onCLIRead: callback => ipcRenderer.on('bridge:read/cli', (_event, value) => callback(value)),
  onRPCRead: callback => ipcRenderer.on('bridge:read/rpc', (_event, value) => callback(value))
})
