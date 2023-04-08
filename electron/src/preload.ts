// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent } from "electron"
import { BaseEvent } from "../../vue_src/src/types/event"
import { captureScreenShot } from '../../vue_src/src/helpers/screen'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (data: BaseEvent) => ipcRenderer.send('message', data),
    onMessage: (callback: (event: IpcRendererEvent, data: BaseEvent) => void) => ipcRenderer.on('message', callback),

    detectTextFromImage: (base64: string) => ipcRenderer.invoke('vision:detect-text', base64),

    checkValidWord: (word:string) => ipcRenderer.invoke('text:validate-word', word),

    takeScreenShot: async (coordinateBoundOffset?: { x?: number, y?: number }) => {
        let sourceId = await ipcRenderer.invoke('window:get-media-source');
        let bound = await ipcRenderer.invoke('window:get-window-bound') as Electron.Rectangle;

        bound.x += coordinateBoundOffset?.x || 0;
        bound.y += coordinateBoundOffset?.y || 0;
        bound.height -= coordinateBoundOffset?.y || 0;
        bound.width -= coordinateBoundOffset?.x || 0;

        return captureScreenShot(sourceId, bound);
    },

})