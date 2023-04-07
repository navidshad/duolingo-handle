import { BrowserWindow, ipcMain } from 'electron';
import { WindowType } from '../../../vue_src/src/types/base';
import { BaseEvent } from '../../../vue_src/src/types/event';
import { windowsConfigs, WindowConfig } from '../windows';

export { WindowType } from '../../../vue_src/src/types/base';
export { BaseEvent, RoleEvent, SetIgnoreMouseEvents } from '../../../vue_src/src/types/event';

export class WindowsManagerService {
	entryPagePath: string;
	defaultPreloadPath: string;

	windows: { [key: string]: BrowserWindow } = {};

	constructor(entryPagePath: string, defaultPreloadPath: string) {
		this.entryPagePath = entryPagePath;
		this.defaultPreloadPath = defaultPreloadPath;
	}

	getWindowConfig(type: WindowType) {
		return windowsConfigs.find(item => item.type === type) as WindowConfig;
	}

	createWindow(type: WindowType) {
		const { initConfig } = this.getWindowConfig(type);

		// Setup preload script
		//
		if (!initConfig.webPreferences) {
			initConfig.webPreferences = {
				preload: this.defaultPreloadPath,
			}
		} else {
			initConfig.webPreferences.preload = this.defaultPreloadPath
		}

		// Create the browser window.
		const window = new BrowserWindow(initConfig);

		// and load the index.html of the app.
		window.loadURL(this.entryPagePath + `/#/${type}`);

		// Open the DevTools.
		// window.webContents.openDevTools();

		if (!this.windows[type]) {
			this.windows[type] = window;
		} else {
			this.closeWindow(type);
			this.windows[type] = window;
		}
	};

	closeWindow(type: WindowType) {
		if (!this.windows[type]) return;

		this.windows[type].destroy();
		this.windows[type] = null
	}

	sendMessage(type: WindowType, data: BaseEvent) {
		const win = this.windows[type];

		if (!win) return;

		win.webContents.send('message', data)
	}

	onMessage(callback: (data: BaseEvent) => void) {
		ipcMain.on('message', (event, data: BaseEvent) => {
			// const webContents = event.sender
			// const win = BrowserWindow.fromWebContents(webContents)
			callback(data);
		})
	}
}