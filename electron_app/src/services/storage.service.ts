import { ipcMain } from "electron";
import Store from "electron-store";
import { SystemInfoKey, isDev } from "../statics";

export class StorageService {
  private static instance: StorageService;
  store: Store;

  constructor() {
    StorageService.instance = this;

    this.store = new Store();

    ipcMain.on(
      "store:write",
      (event, payload: { key: string; value: string }) => this.write(payload)
    );

    ipcMain.handle("store:read", (event, key: string) => this.read(key));

    // Write system info
    //
    this.write({ key: SystemInfoKey.isDev, value: isDev.toString() });
    this.write({ key: SystemInfoKey.platform, value: process.platform });
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
