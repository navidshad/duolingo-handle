import { WindowType } from "../../vue_src/src/types/base";

export interface WindowConfig {
	type: WindowType,
	openWithCustomBound?: boolean,
	screenSize?: Boolean,
	initConfig: Electron.BrowserWindowConstructorOptions,
}

const subtoolConfigs: WindowConfig[] = [
	{
		type: 'capture-text',
		screenSize: true,
		initConfig: {
			title: 'Capture Text',
			alwaysOnTop: true,
			resizable: false,
			frame: false,
			transparent: true,
		},
	}
]

export const windowsConfigs: WindowConfig[] = [
	...subtoolConfigs,
	{
		type: 'tools-box',
		initConfig: {
			height: 60,
			width: 750,
			title: 'Tools Box',
			alwaysOnTop: true,
			resizable: true,
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
		type: 'conversation',
		openWithCustomBound: false,
		initConfig: {
			title: 'Conversation',
			alwaysOnTop: true,
			resizable: true,
			frame: false,
			transparent: true,
			height: 600,
			width: 400,
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