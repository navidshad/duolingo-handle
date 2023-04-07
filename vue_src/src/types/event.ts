import { ToolType } from "./base";

export type EventType = 'open-tool';

export interface BaseEvent {
	type: EventType,
}

export interface RoleEvent extends BaseEvent {
	toolType: ToolType, 
}