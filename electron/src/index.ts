import { app, BrowserWindow } from 'electron';
import { WindowsManagerService, RoleEvent, WindowType, SetIgnoreMouseEvents } from './services/windows.service';

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const windowsManagerService = new WindowsManagerService(MAIN_WINDOW_WEBPACK_ENTRY, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createMainWindow() {
  windowsManagerService.createWindow('tools-box')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

windowsManagerService.onMessage((data) => {
  console.log(data);

  if (data.type === 'open-tool') onOpenTool(data as RoleEvent);
  else if (data.type === 'close-tools') closeAllTools();
  else if (data.type === 'set-ignore-mouse-event') onSetIgnoreMouseEvent(data as SetIgnoreMouseEvents);
})

function closeAllTools() {
  Object.keys(windowsManagerService.windows)
    .forEach((key: WindowType) => {
      if (key == 'tools-box') return;
      windowsManagerService.closeWindow(key);
    })
}

function onOpenTool(event: RoleEvent) {
  if (event.toolType == 'none') return;
  closeAllTools()
  windowsManagerService.createWindow(event.toolType)
}

function onSetIgnoreMouseEvent(event:SetIgnoreMouseEvents) {
  windowsManagerService.windows[event.toolType].setIgnoreMouseEvents(event.value);
}
