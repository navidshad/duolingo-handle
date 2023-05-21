export type ToolType = 'none' | 'words-detector' | 'writing-guide' | 'voice-recognition' | 'gap-filler';
export type WindowType = 'tools-box' | 'words-detector' | 'writing-guide' | 'voice-recognition' | 'gap-filler';

export interface Rectangle {
	width: number,
	height: number,
	x: number,
	y: number,
}