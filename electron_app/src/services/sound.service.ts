import { ipcMain } from "electron";
import fs from "fs";
import recorder from "node-record-lpcm16";

export class SoundService {
  private static instance: SoundService;
  recording: null | any = null;

  constructor() {
    SoundService.instance = this;

    // Register IPC Events
    ipcMain.handle("sound:record", () => {
      if (this.recording !== null)
        return Promise.reject("Another recording in progress");

      return this.recordSound();
    });

    ipcMain.handle("sound:stop", (_event, recordId: string) => {
      return this.stopSound(recordId);
    });
  }

  static getInstance() {
    return this.instance;
  }

  private async recordSound() {
    const title = new Date().getTime();
    const file = fs.createWriteStream(`${title}.wav`, { encoding: "binary" });

    try {
      this.recording = recorder.record();
      this.recording.stream().pipe(file);

      return Promise.resolve(title);
    } catch (error) {
      fs.unlinkSync(`${title}.wav`);
      return Promise.reject(error);
    }
  }

  private stopSound(recordid: string) {
    this.recording.stop();
    this.recording = null;

    const file = fs.readFileSync(`${recordid}.wav`);
    fs.unlinkSync(`${recordid}.wav`);

    const base64 = Buffer.from(file).toString("base64");
    return Promise.resolve(base64);
  }
}
