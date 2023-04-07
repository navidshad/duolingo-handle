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