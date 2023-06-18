import { WindowType } from "../../vue_src/src/types/base";

export interface WindowConfig {
	type: WindowType,
	openWithCustomBound?: boolean,
	initConfig: Electron.BrowserWindowConstructorOptions,
}

export const windowsConfigs: WindowConfig[] = [
	{
		type: 'tools-box',
		initConfig: {
			height: 60,
			width: 650,
			title: 'Tools Box',
			alwaysOnTop: true,
			resizable: false,
		}
	},
	{
		type: 'words-detector',
		openWithCustomBound: true,
		initConfig: {
			title: 'Words Detector',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
	{
		type: 'writing-guide',
		openWithCustomBound: true,
		initConfig: {
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
			height: 100,
			width: 450,
			title: 'Voice Recognition',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
	{
		type: 'gap-filler',
		openWithCustomBound: true,
		initConfig: {
			title: 'Gap Filler',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
	{
		type: 'speaking',
		openWithCustomBound: true,
		initConfig: {
			title: 'Speaking',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
		}
	},
]