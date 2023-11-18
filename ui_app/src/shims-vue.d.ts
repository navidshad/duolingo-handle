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
  // Send message to main process
  //
  sendMessage: (data: BaseEvent) => void;
  sendMessageByChannel: (channelId: string, data: any) => void;

  // Receive message from main process
  //
  onMessage: (callback: (event: any, data: BaseEvent) => void) => void;
  onMessageByChannel: (
    channelId: string,
    callback: (event: any, data: any) => void
  ) => void;

  // Timer
  //
  startTimer: () => Promise<void>;

  // Window
  //
  getMediaSource: (sourceName?: string) => Promise<string>;
  setBound: (type: WindowType, bound: Rectangle) => void;
  getBound: () => Promise<Rectangle>;

  // Store
  //
  writeInStore: (key: string, value: string) => void;
  readFromStore: (key: string) => Promise<string>;

  //
  // Tools
  //
  takeScreenShot: (options: {
    coordinateBoundOffset?: { x?: number; y?: number };
    customBound?: Rectangle;
  }) => string;

  /// @returns recordId
  startRecording: () => Promise<string>;
  /// @returns base64 string
  stopRecording: (recordId: string) => Promise<string>;

  writeByKeyboard: (string: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}
