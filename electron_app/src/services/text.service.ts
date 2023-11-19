import { ipcMain } from "electron";
import robotjs from "robotjs";

export class TextService {
  private static instance: TextService;

  constructor() {
    TextService.instance = this;

    // Register IPC Events
    ipcMain.handle("text:write-by-keyboard", (event, data) =>
      this.writeByKeyboard(data)
    );
  }

  static getInstance() {
    return this.instance;
  }

  private writeByKeyboard(string: string) {
    robotjs.typeStringDelayed(string, 1000);
  }
}
