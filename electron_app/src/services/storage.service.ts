import { ipcMain } from "electron";
import Store from "electron-store";

export class StoragService {
  private static instance: StoragService;
  private store: Store;

  constructor() {
    StoragService.instance = this;

    this.store = new Store();

    ipcMain.on(
      "store:write",
      (event, payload: { key: string; value: string }) => this.write(payload)
    );

    ipcMain.handle("store:read", (event, key: string) => this.read(key));
  }

  static getInstance() {
    return this.instance;
  }

  private write(payload: { key: string; value: string }) {
    this.store.set(payload.key, payload.value);
  }

  private read(key: string) {
    return this.store.get(key);
  }
}
