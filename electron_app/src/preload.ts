// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {
  IpcRendererEvent,
  Rectangle,
  contextBridge,
  ipcRenderer,
} from "electron";
import { BaseEvent, RouteMessageEvent } from "../../ui_app/src/types/event";
import { WindowType } from "./services/windows.service";

export const captureScreenShotBySourceID = (
  sourceId: string,
  bound: Rectangle
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const video = document.createElement("video");

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const captureStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sourceId,
          },
        } as any,
      });

      video.srcObject = captureStream;

      // Set canvase size as same as the window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      video.onloadedmetadata = (e) => {
        video.play();

        // https://cloudinary.com/guides/automatic-image-cropping/cropping-images-in-javascript
        context.drawImage(
          video,
          bound.x,
          bound.y,
          bound.width,
          bound.height,
          0,
          0,
          bound.width,
          bound.height
        );

        const frame = canvas.toDataURL("image/png").split("base64,")[1];
        captureStream.getTracks().forEach((track) => track.stop());
        resolve(frame);
      };
    } catch (err) {
      reject(err);
    }
  });
};

contextBridge.exposeInMainWorld("electronAPI", {
  // Send message to main process
  //
  sendMessage: (data: BaseEvent) => ipcRenderer.send("message", data),
  sendMessageByChannel: (channelId: string, data: any) => {
    const event = new RouteMessageEvent({ channelId, data });
    ipcRenderer.send("message", event);
  },

  // Receive message from main process
  //
  onMessage: (callback: (event: IpcRendererEvent, data: BaseEvent) => void) =>
    ipcRenderer.on("message", callback),
  onMessageByChannel: (channelId: string, callback: (data: any) => void) => {
    ipcRenderer.on(channelId, (event: IpcRendererEvent, data: any) =>
      callback(data)
    );
  },

  // Timer
  //
  startTimer: () => ipcRenderer.invoke("time:start"),

  // Window
  //
  getMediaSource: (name = "Entire screen") =>
    ipcRenderer.invoke("window:get-media-source", name),
  setBound: (type: WindowType, bound: Electron.Rectangle) =>
    ipcRenderer.invoke("window:set-window-bound", { type, bound }),
  getBound: () => ipcRenderer.invoke("window:get-window-bound"),

  // Store
  //
  writeInStore: (key: string, value: string) =>
    ipcRenderer.send("store:write", { key, value }),
  readFromStore: (key: string) => ipcRenderer.invoke("store:read", key),

  //
  // Tools
  //
  async takeScreenShot({
    coordinateBoundOffset,
    customBound,
  }: {
    // To capture screenshot from window frame.
    coordinateBoundOffset?: { x?: number; y?: number };
    // To capture screenshot with custom bound, regardless of window frame.
    customBound?: Electron.Rectangle;
  }) {
    let sourceId = await ipcRenderer.invoke("window:get-media-source");
    let bound;

    if (!customBound) {
      bound = (await ipcRenderer.invoke(
        "window:get-window-bound"
      )) as Electron.Rectangle;

      bound.x += coordinateBoundOffset?.x || 0;
      bound.y += coordinateBoundOffset?.y || 0;
      bound.height -= coordinateBoundOffset?.y || 0;
      bound.width -= coordinateBoundOffset?.x || 0;
    } else if (customBound) {
      bound = customBound;
    }

    return captureScreenShotBySourceID(sourceId, bound);
  },

  startRecording: () => ipcRenderer.invoke("sound:record"),
  stopRecording: (recordId: string) =>
    ipcRenderer.invoke("sound:stop", recordId),

  writeByKeyboard: (string: string) =>
    ipcRenderer.invoke("text:write-by-keyboard", string),
});
