import { ToolType } from "./base";

export type EventType = 'system-info' | 'open-tool' | 'close-tools' | 'set-ignore-mouse-event';

export interface BaseEvent {
	type: EventType,
}

export interface RoleEvent extends BaseEvent {
	toolType: ToolType, 
}

export interface SetIgnoreMouseEvents extends BaseEvent {
	value: boolean,
	toolType: ToolType,
}

