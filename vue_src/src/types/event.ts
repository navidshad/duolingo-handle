import { ToolType } from "./base";

export type EventType = 'open-tool' | 'close-tools';

export interface BaseEvent {
	type: EventType,
}

export interface RoleEvent extends BaseEvent {
	toolType: ToolType, 
}