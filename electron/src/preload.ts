// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (data:any) => ipcRenderer.send('message', data),
    onMessage: (callback:(data:any) => void) => ipcRenderer.on('message', callback),
})