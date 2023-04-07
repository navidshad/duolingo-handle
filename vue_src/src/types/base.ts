export type ToolType = 'none' | 'words-detector' | 'writing-guide'; 
export type WindowType = 'tools-box' | 'words-detector' | 'writing-guide';

export interface Rectangle {
	width:number,
	height: number,
	x:number,
	y:number,
}