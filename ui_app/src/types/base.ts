// A main window that handles a complete question.
export type ToolType =
  | "none"
  | "conversation"
  | "words-detector"
  | "writing-guide"
  | "voice-recognition"
  | "gap-filler"
  | "speaking";

// A window that does something and return a result to the main window
// where it has been called.
export type SubtoolType = "capture-text";

// An Electron window frame.
export type WindowType =
  | "login"
  | "choose-exam-type"
  | "tools-box"
  | ToolType
  | SubtoolType;

// The type of running mode
// exam: the user is doing an real exam.
// practice: the user is practicing only.
export type IntentionMode = "exam" | "practice";

export interface Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;
}
