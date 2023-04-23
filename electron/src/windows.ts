import { WindowType } from "../../vue_src/src/types/base";

export interface WindowConfig {
	type: WindowType,
	initConfig: Electron.BrowserWindowConstructorOptions,
}

export const windowsConfigs: WindowConfig[] = [
	{
		type: 'tools-box',
		initConfig: {
			height: 400,
			width: 300,
			title: 'Tools Box',
			alwaysOnTop: true,
			resizable: false,
		}
	},
	{
		type: 'words-detector',
		initConfig: {
			height: 450,
			width: 1024,
			title: 'Words Detector',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
	{
		type: 'writing-guide',
		initConfig: {
			height: 640,
			width: 1024,
			title: 'Writing Guide',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
	{
		type: 'voice-recognition',
		initConfig: {
			height: 145,
			width: 450,
			title: 'Voice Recognition',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	}
]