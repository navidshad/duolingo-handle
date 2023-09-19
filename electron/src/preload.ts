// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent } from "electron"
import { BaseEvent, RouteMessageEvent } from "../../vue_src/src/types/event"
import { captureScreenShotBySourceID } from '../../vue_src/src/helpers/screen'
import { WindowType } from "./services/windows.service"

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    // Send message to main process
    //
    sendMessage: (data: BaseEvent) => ipcRenderer.send('message', data),
    sendMessageByChannel: (channelId: string, data: any) => {
        const event = new RouteMessageEvent({ channelId, data });
        ipcRenderer.send('message', event);
    },

    // Receive message from main process
    onMessage: (callback: (event: IpcRendererEvent, data: BaseEvent) => void) => ipcRenderer.on('message', callback),
    onMessageByChannel: (channelId: string, callback: (data: any) => void) => {
        ipcRenderer.on(channelId, (event: IpcRendererEvent, data: any) => callback(data))
    },

    getMediaSource: (name = 'Entire screen') => ipcRenderer.invoke('window:get-media-source', name),
    setBound: (type: WindowType, bound: Electron.Rectangle) => ipcRenderer.invoke('window:set-window-bound', { type, bound }),
    getBound: () => ipcRenderer.invoke('window:get-window-bound'),

    async takeScreenShot({ coordinateBoundOffset, customBound }: {
        // To capture screenshot from window frame.
        coordinateBoundOffset?: { x?: number, y?: number }
        // To capture screenshot with custom bound, regardless of window frame.
        customBound?: Electron.Rectangle
    }) {
        let sourceId = await ipcRenderer.invoke('window:get-media-source');
        let bound;

        if (!customBound) {
            bound = await ipcRenderer.invoke('window:get-window-bound') as Electron.Rectangle;

            bound.x += coordinateBoundOffset?.x || 0;
            bound.y += coordinateBoundOffset?.y || 0;
            bound.height -= coordinateBoundOffset?.y || 0;
            bound.width -= coordinateBoundOffset?.x || 0;
        }

        else if (customBound) {
            bound = customBound;
        }

        return captureScreenShotBySourceID(sourceId, bound);
    },

    detectTextPositionsFromImage: (base64: Text) => ipcRenderer.invoke('gcloud:detect-text-positions', base64),
    detectTextFromImage: (base64: Text) => ipcRenderer.invoke('gcloud:detect-text', base64),
    detectTextFromAudio: (base64: string) => ipcRenderer.invoke('gcloud:detect-text-from-audio', base64),
    translateText: (data: { phrase: string, lang: string }) => ipcRenderer.invoke('gcloud:translate-text', data),

    checkValidWord: (word: string) => ipcRenderer.invoke('text:validate-word', word),
    createCompletion: (prompt: string, model: string) => ipcRenderer.invoke('text:create-completion', { prompt, model }),
    createChatCompletion: (messages: [], model: string) => ipcRenderer.invoke('text:create-chat-completion', { messages, model }),
    writeByKeyboard: (string: string) => ipcRenderer.invoke('text:write-by-keyboard', string),
})