import { BaseEvent } from "./types/event"

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
  sendMessage: (data:BaseEvent) => void,
  onMessage: (event:any, data:BaseEvent) => void,
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
