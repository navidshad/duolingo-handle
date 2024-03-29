import { app, BrowserWindow } from "electron";
import { TextService } from "./services/text.service";
import { isDev } from "./statics";
import { config } from "dotenv";
import path from "path";
import { StorageService } from "./services/storage.service";

import { WindowsManagerService, WindowType } from "./services/windows.service";

import {
  SetIgnoreMouseEvents,
  BaseEvent,
  CloseToolEvent,
  OpenSubtoolEvent,
  OpenWindowEvent,
  OpenToolEvent,
  RouteMessageEvent,
  ExitEvent,
} from "../../ui_app/src/types/event";
import { TimeService } from "./services/time.service";
import { SoundService } from "./services/sound.service";

// Load environment variables from .env file
const envFileName = isDev() ? ".env" : ".env.production";
config({ path: path.join(__dirname, envFileName) });

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
// declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Initialize services
new TextService();
new StorageService();
new TimeService();
new SoundService();

const windowsManagerService = new WindowsManagerService(
  process.env.BASE_URL,
  MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

function createMainWindow() {
  windowsManagerService.createWindow("login");
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

windowsManagerService.onMessage((data) => {
  console.log(data);

  //
  // To open a window.
  // it just opens a window without closing other windows.
  //
  if (OpenWindowEvent.instanceof(data as BaseEvent)) {
    const OpenToolEvent = data as OpenWindowEvent;
    if (OpenToolEvent.windowType == "none") return;

    windowsManagerService.createWindow(OpenToolEvent.windowType);
  }
  //
  // To open a tool window.
  // Other tools will be closed before opening a new one.
  //
  else if (OpenToolEvent.instanceof(data as BaseEvent)) {
    const OpenToolEvent = data as OpenToolEvent;
    if (OpenToolEvent.toolType == "none") return;

    closeAllTools();
    windowsManagerService.createWindow(OpenToolEvent.toolType);
  }
  //
  // To open a subtool window.
  //
  else if (OpenSubtoolEvent.instanceof(data)) {
    const openSubtoolEvent = data as OpenSubtoolEvent;
    windowsManagerService.createSubtoolWindow(openSubtoolEvent);
  }
  //
  // To set ignore mouse event.
  //
  else if (data.type === "set-ignore-mouse-event") {
    onSetIgnoreMouseEvent(data as SetIgnoreMouseEvents);
  }
  //
  // To Close all tools.
  //
  else if (data.type === "close-tools") {
    closeAllTools();
  }
  //
  // To close a tool window.
  //
  else if (CloseToolEvent.instanceof(data)) {
    windowsManagerService.closeWindow((data as CloseToolEvent).id);
  }
  //
  // To send mesage to all windows.
  // Any windows listening to this channel will receive the message.
  //
  else if (RouteMessageEvent.instanceof(data)) {
    const routeMessageEvent = data as RouteMessageEvent;
    windowsManagerService.sendGlobalMessage(
      routeMessageEvent.channelId,
      routeMessageEvent.data
    );
  }

  // To exit the app.
  //
  else if (ExitEvent.instanceof(data)) {
    app.exit();
  }
});

function closeAllTools() {
  Object.keys(windowsManagerService.windows)
    .filter((key) => key !== "tools-box")
    .forEach((key: WindowType) => windowsManagerService.closeWindow(key));
}

function onSetIgnoreMouseEvent(event: SetIgnoreMouseEvents) {
  windowsManagerService.windows[event.toolType].setIgnoreMouseEvents(
    event.value
  );
  windowsManagerService.sendMessage(event.toolType as WindowType, event);
}
