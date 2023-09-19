import { SubtoolType, ToolType } from "./base";

export type EventType = 'system-info' | 'routeMesage' | 'open-subtool' | 'open-tool' | 'close-tools' | 'close-tool' | 'set-ignore-mouse-event';

export interface BaseEvent {
	type: EventType,
}

// To open a tool window.
export class RoleEvent implements BaseEvent {
	type: EventType;
	toolType?: ToolType;

	static instanceof(obj: BaseEvent) {
		return obj.type === 'open-tool';
	}

	constructor({ toolType }: { toolType?: ToolType }) {
		this.type = 'open-tool';
		this.toolType = toolType;
	}
}

// To open a subtool window.
export class OpenSubtoolEvent implements BaseEvent {
	type: EventType;
	subtoolType: SubtoolType;
	props?: string;
	channelId: string;

	static instanceof(obj: BaseEvent) {
		return obj.type === 'open-subtool';
	}

	constructor({ subtoolType, props, channelId }: { subtoolType: SubtoolType, props?: string, channelId: string }) {
		this.type = 'open-subtool';
		this.subtoolType = subtoolType;
		this.props = props;
		this.channelId = channelId;
	}
}

// To close a window with id
export class CloseToolEvent implements BaseEvent {
	type: EventType;
	id: string;

	static instanceof(obj: BaseEvent) {
		return obj.type === 'close-tool';
	}

	constructor({ id }: { id: string }) {
		this.type = 'close-tool';
		this.id = id;
	}
}

// To send a message from a window to another.
export class RouteMessageEvent implements BaseEvent {
	type: EventType;
	channelId: string;
	data: any;

	static instanceof(obj: BaseEvent) {
		return obj.type === 'routeMesage';
	}

	constructor({ channelId, data }: { channelId: string, data: any }) {
		this.type = 'routeMesage';
		this.channelId = channelId;
		this.data = data;
	}
}

export interface SetIgnoreMouseEvents extends BaseEvent {
	value: boolean,
	toolType: ToolType,
}

