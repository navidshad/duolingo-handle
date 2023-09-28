import { Rectangle, WindowType } from "./types/base";
import { BaseEvent } from "./types/event";
import { TextAnnotation } from "@/types/vision";
import { CompletionMessage } from "./types/gpt";

/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * Should match preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (data: BaseEvent) => void;
  sendMessageByChannel: (channelId: string, data: any) => void;
  onMessage: (callback: (event: any, data: BaseEvent) => void) => void;
  onMessageByChannel: (
    channelId: string,
    callback: (event: any, data: any) => void
  ) => void;

  // Store
  //
  writeInStore: (key: string, value: string) => void;
  readFromStore: (key: string) => Promise<string>;

  takeScreenShot: (options: {
    coordinateBoundOffset?: { x?: number; y?: number };
    customBound?: Rectangle;
  }) => string;

  writeByKeyboard: (string: string) => void;
  getMediaSource: (sourceName?: string) => Promise<string>;
  setBound: (type: WindowType, bound: Rectangle) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}
