// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent } from "electron"
import { BaseEvent } from "../../vue_src/src/types/event"
import { captureScreenShot } from '../../vue_src/src/helpers/screen'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (data: BaseEvent) => ipcRenderer.send('message', data),
    onMessage: (callback: (event: IpcRendererEvent, data: BaseEvent) => void) => ipcRenderer.on('message', callback),

    takeScreenShot: async () => {
        let sourceId = await ipcRenderer.invoke('get-media-source');
        let bound = await ipcRenderer.invoke('get-window-bound') as Electron.Rectangle;
        return captureScreenShot(sourceId, bound);
    }
})