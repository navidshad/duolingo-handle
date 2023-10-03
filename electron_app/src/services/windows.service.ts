import { BrowserWindow, desktopCapturer, ipcMain, screen } from "electron";
import { WindowType } from "../../../ui_app/src/types/base";
import { BaseEvent, OpenSubtoolEvent } from "../../../ui_app/src/types/event";
import { windowsConfigs, WindowConfig } from "../windows";

export { WindowType } from "../../../ui_app/src/types/base";
export {
  BaseEvent,
  OpenToolEvent,
  SetIgnoreMouseEvents,
} from "../../../ui_app/src/types/event";

export class WindowsManagerService {
  entryPagePath: string;
  defaultPreloadPath: string;

  windows: { [key: string]: BrowserWindow } = {};

  constructor(entryPagePath: string, defaultPreloadPath: string) {
    this.entryPagePath = entryPagePath;
    this.defaultPreloadPath = defaultPreloadPath;

    // Events
    ipcMain.handle("window:get-media-source", this.onAskForMediaSourceId);
    ipcMain.handle("window:get-window-bound", this.onAskForBound);
    ipcMain.handle("window:set-window-bound", this.onSetBound);
  }

  private async onAskForMediaSourceId(
    event: Electron.IpcMainInvokeEvent,
    name = "Entire screen"
  ) {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);

    return await desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        for (const source of sources) {
          if (source.name === name) {
            return source.id;
          }
        }
      });
  }

  private async onAskForBound(event: Electron.IpcMainInvokeEvent) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    return win.getBounds();
  }

  private onSetBound(
    event: Electron.IpcMainInvokeEvent,
    { bound }: { type: WindowType; bound: Electron.Rectangle }
  ) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);

    win.setBounds(bound);
  }

  getWindowConfig(type: WindowType) {
    return windowsConfigs.find((item) => item.type === type) as WindowConfig;
  }

  createWindow(type: WindowType) {
    const { initConfig, openWithCustomBound = false } =
      this.getWindowConfig(type);

    // Setup preload script
    //
    if (!initConfig.webPreferences) {
      initConfig.webPreferences = {
        preload: this.defaultPreloadPath,
      };
    } else {
      initConfig.webPreferences.preload = this.defaultPreloadPath;
    }

    // Create the browser window.
    const window = new BrowserWindow(initConfig);

    // and load the index.html of the app.
    if (openWithCustomBound == false) {
      window.loadURL(this.entryPagePath + `/#/${type}`);
    } else {
      window.loadURL(this.entryPagePath + `/#/create-bound?type=${type}`);
      const { width, height } = screen.getPrimaryDisplay().workArea;
      window.setBounds({ width, height, x: 0, y: 0 });
    }

    // Open the DevTools.
    // window.webContents.openDevTools();

    if (!this.windows[type]) {
      this.windows[type] = window;
    } else {
      this.closeWindow(type);
      this.windows[type] = window;
    }
  }

  createSubtoolWindow(subtool: OpenSubtoolEvent) {
    const { initConfig, screenSize } = this.getWindowConfig(
      subtool.subtoolType
    );

    // Setup preload script
    //
    if (!initConfig.webPreferences) {
      initConfig.webPreferences = {
        preload: this.defaultPreloadPath,
      };
    } else {
      initConfig.webPreferences.preload = this.defaultPreloadPath;
    }

    // Create the browser window.
    const window = new BrowserWindow(initConfig);

    const params = new URLSearchParams();
    params.append("channelId", subtool.channelId);
    params.append("props", subtool.props);

    // And load the index.html of the app.
    window.loadURL(
      this.entryPagePath + `/#/sub/${subtool.subtoolType}?${params.toString()}`
    );

    if (screenSize) {
      const { width, height } = screen.getPrimaryDisplay().workArea;
      window.setBounds({ width, height, x: 0, y: 0 });
    }

    // Open the DevTools.
    // window.webContents.openDevTools();

    const hashKey = `${subtool.channelId}`;

    if (!this.windows[hashKey]) {
      this.windows[hashKey] = window;
    } else {
      this.windows[hashKey] = window;
    }
  }

  closeWindow(type: string) {
    if (!this.windows[type]) return;

    this.windows[type].destroy();
    this.windows[type] = null;
  }

  sendMessage(type: WindowType, data: BaseEvent) {
    const win = this.windows[type];

    if (!win) return;

    win.webContents.send("message", data);
  }

  sendGlobalMessage(channelId: string, data: any) {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(channelId, data);
    });
  }

  onMessage(callback: (data: BaseEvent) => void) {
    ipcMain.on("message", (event, data: BaseEvent) => callback(data));
  }
}
