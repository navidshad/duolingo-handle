export type ToolType = 'none' | 'words-detector' | 'writing-guide' | 'voice-recognition'; 
export type WindowType = 'tools-box' | 'words-detector' | 'writing-guide' | 'voice-recognition';

export interface Rectangle {
	width:number,
	height: number,
	x:number,
	y:number,
}