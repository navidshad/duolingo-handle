import { BrowserWindow } from 'electron';
import { WindowType } from '../../../vue_src/src/types/base';

export interface WindowConfig {
	type: WindowType,
	initConfig: Electron.BrowserWindowConstructorOptions,
}

const windowsConfigs: WindowConfig[] = [
	{
		type: 'tools-box',
		initConfig: {
			height: 400,
			width: 230,
			title: 'Tools Box',
		}
	},
	{
		type: 'words-detector',
		initConfig: {
			height: 640,
			width: 512,
			title: 'Words Detector'
		}
	}
]

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
		window.loadURL(this.entryPagePath);

		// Open the DevTools.
		// window.webContents.openDevTools();

		if (this.windows[type] === undefined) {
			this.windows[type] = window;
		} else {
			this.windows[type].close();
			this.windows[type] = window;
		}
	};
}