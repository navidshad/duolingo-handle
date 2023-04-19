import { BaseEvent } from "./types/event"
import { TextAnnotation } from '@/types/vision';

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * Should match preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (data: BaseEvent) => void,
  onMessage: (callback: (event: any, data: BaseEvent) => void) => void,
  takeScreenShot: (coordinateBoundOffset?: { x?: number, y?: number }) => string,
  detectTextFromImage: (base64: string) => Promise<TextAnnotation[]>,
  detectTextFromAudio: (base64: string) => Promise<string>,
  checkValidWord: (word: string) => Promise<boolean>,
  createCompletion: (prompt: string) => Promise<string>,
  getMediaSource: (sourceName?: string) => Promise<string>,
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
