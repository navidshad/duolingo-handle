import { BaseEvent } from "./types/event"
import { TextAnnotations } from '@/types/vision';

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
  onMessage: (event: any, data: BaseEvent) => void,
  takeScreenShot: (coordinateBoundOffset?: { x?: number, y?: number }) => string,
  detectTextFromImage: (base64:string) => Promise<TextAnnotations>
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
