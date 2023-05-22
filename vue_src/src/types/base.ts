export type ToolType = 'none' | 'words-detector' | 'writing-guide' | 'voice-recognition' | 'gap-filler' | 'speaking';
export type WindowType = 'tools-box' | ToolType;

export interface Rectangle {
	width: number,
	height: number,
	x: number,
	y: number,
}