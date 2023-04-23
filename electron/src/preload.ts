// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent } from "electron"
import { BaseEvent } from "../../vue_src/src/types/event"
import { captureScreenShotBySourceID } from '../../vue_src/src/helpers/screen'
import { WindowType } from "./services/windows.service"

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (data: BaseEvent) => ipcRenderer.send('message', data),
    onMessage: (callback: (event: IpcRendererEvent, data: BaseEvent) => void) => ipcRenderer.on('message', callback),

    getMediaSource: (name = 'Entire screen') => ipcRenderer.invoke('window:get-media-source', name),
    setBound: (type: WindowType, bound: Electron.Rectangle) => ipcRenderer.invoke('window:set-window-bound', { type, bound }),
    getBound: () => ipcRenderer.invoke('window:get-window-bound'),

    async takeScreenShot(coordinateBoundOffset?: { x?: number, y?: number }) {
        let sourceId = await ipcRenderer.invoke('window:get-media-source');
        let bound = await ipcRenderer.invoke('window:get-window-bound') as Electron.Rectangle;

        bound.x += coordinateBoundOffset?.x || 0;
        bound.y += coordinateBoundOffset?.y || 0;
        bound.height -= coordinateBoundOffset?.y || 0;
        bound.width -= coordinateBoundOffset?.x || 0;

        return captureScreenShotBySourceID(sourceId, bound);
    },

    detectTextFromImage: (base64: string) => ipcRenderer.invoke('gcloud:detect-text', base64),
    detectTextFromAudio: (base64: string) => ipcRenderer.invoke('gcloud:detect-text-from-audio', base64),
    translateText: (data: { phrase: string, lang: string }) => ipcRenderer.invoke('gcloud:translate-text', data),

    checkValidWord: (word: string) => ipcRenderer.invoke('text:validate-word', word),
    createCompletion: (prompt: string) => ipcRenderer.invoke('text:create-completion', prompt),
})