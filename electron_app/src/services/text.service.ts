import { ipcMain } from "electron";
import nk from "node-key-sender";

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

  private async writeByKeyboard(string: string) {
    for (let i = 0; i < string.length; i++) {
      const char = string[i];
      try {
        await nk.sendKey(char);
      } catch (error) {
        console.error(error);
        break;
      }
    }
  }
}
