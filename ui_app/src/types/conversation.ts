export interface DialogType {
	type: "topic" | "voice-dialog" | "choice-dialog";
	// Topic text
	content?: string;
	// Voice text
	caption?: string;
	// Choice text
	options?: string;
	// Right Choice
	answer?: string;
}