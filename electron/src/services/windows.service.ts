import { BrowserWindow, desktopCapturer, ipcMain, screen } from 'electron';
import { Rectangle as CustomRect, WindowType } from '../../../vue_src/src/types/base';
import { BaseEvent } from '../../../vue_src/src/types/event';
import { windowsConfigs, WindowConfig } from '../windows';

export { WindowType, Rectangle } from '../../../vue_src/src/types/base';
export { BaseEvent, RoleEvent, SetIgnoreMouseEvents, } from '../../../vue_src/src/types/event';

export class WindowsManagerService {
	entryPagePath: string;
	defaultPreloadPath: string;

	windows: { [key: string]: BrowserWindow } = {};

	constructor(entryPagePath: string, defaultPreloadPath: string) {
		this.entryPagePath = entryPagePath;
		this.defaultPreloadPath = defaultPreloadPath;

		// Events
		ipcMain.handle('window:get-media-source', this.onAskForMediaSourceId)
		ipcMain.handle('window:get-window-bound', this.onAskForBound)
		ipcMain.handle('window:set-window-bound', (event, data) => {
			this.onSetBound(this, event, data);
		})
	}

	private async onAskForMediaSourceId(event: Electron.IpcMainInvokeEvent, name = 'Entire screen') {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		return await desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
			for (const source of sources) {
				if (source.name === name) {
					return source.id
				}
			}
		})
	}

	private async onAskForBound(event: Electron.IpcMainInvokeEvent) {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		return win.getBounds();
	}

	private onSetBound(_this: WindowsManagerService, event: Electron.IpcMainInvokeEvent, { type, bound }: { type: WindowType, bound: CustomRect }) {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)

		// Calculate max taskbar height
		const screenWorkArea = screen.getPrimaryDisplay().workArea;
		const screenArea = screen.getPrimaryDisplay().bounds;
		const macTaskbarHeight = Math.abs(screenArea.y - screenWorkArea.y);
		const widthDifference = bound.screenWidth - screenWorkArea.width

		// bound.y -= macTaskbarHeight;
		// bound.height -= macTaskbarHeight
		// bound.x -= widthDifference;

		// win.setBounds(bound as any);
		win.close();

		let initPath = `/#/${type}`;
		const { initConfig } = _this.getWindowConfig(type);
		initConfig.width = bound.width
		initConfig.height = bound.height;
		initConfig.x = bound.x
		initConfig.y = bound.y

		this.createWindowsWithConfig(initConfig, initPath, type)
	}

	getWindowConfig(type: WindowType) {
		return JSON.parse(JSON.stringify(windowsConfigs.find(item => item.type === type))) as WindowConfig;
	}

	createWindow(type: WindowType) {
		const { initConfig, openWithCustomBound = false } = this.getWindowConfig(type);

		// Setup preload script
		//
		if (!initConfig.webPreferences) {
			initConfig.webPreferences = {
				preload: this.defaultPreloadPath,
			}
		} else {
			initConfig.webPreferences.preload = this.defaultPreloadPath
		}

		let initPath = '';

		// and load the index.html of the app.
		if (openWithCustomBound == false) {
			initPath = `/#/${type}`;
		} else {
			initPath = `/#/create-bound?type=${type}`;
			const { width, height } = screen.getPrimaryDisplay().workArea
			initConfig.width = width
			initConfig.height = height;
			initConfig.x = 0
			initConfig.y = 0
		}

		this.createWindowsWithConfig(initConfig, initPath, type);
	};

	createWindowsWithConfig(
		config: Electron.BrowserWindowConstructorOptions,
		initPath: string,
		type: WindowType,
	) {
		// Create the browser window.
		const window = new BrowserWindow(config);
		window.loadURL(this.entryPagePath + initPath);

		// Open the DevTools.
		// window.webContents.openDevTools();

		if (!this.windows[type]) {
			this.windows[type] = window;
		} else {
			this.closeWindow(type);
			this.windows[type] = window;
		}
	}

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