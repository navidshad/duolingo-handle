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
    callback: (event: any, data: any) => void,
  ) => void;
  takeScreenShot: (options: {
    coordinateBoundOffset?: { x?: number; y?: number };
    customBound?: Rectangle;
  }) => string;
  // detectTextPositionsFromImage: (base64: string) => Promise<TextAnnotation[]>,
  // detectTextFromImage: (base64: string) => Promise<string>,
  // detectTextFromAudio: (base64: string) => Promise<string>,
  // translateText: (data: { phrase: string, lang: string }) => Promise<string[]>,
  // checkValidWord: (word: string) => Promise<boolean>,
  // createCompletion: (prompt: string, model?: string) => Promise<string>,
  // createChatCompletion: (message: CompletionMessage[], model?: string) => Promise<string>,
  writeByKeyboard: (string: string) => void;
  getMediaSource: (sourceName?: string) => Promise<string>;
  setBound: (type: WindowType, bound: Rectangle) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronApi;
  }
}
