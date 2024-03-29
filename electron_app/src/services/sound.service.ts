import { ipcMain } from "electron";
import fs from "fs";
import recorder from "node-record-lpcm16";
import { join } from "path";
import { tmpdir, platform } from "os";

function getPathFromTemp(name: string) {
  return join(tmpdir(), name);
}

function getSoxPath() {
  switch (platform()) {
    case "darwin":
      return join(process.resourcesPath, "sox", "mac");
    case "win32":
      return join(process.resourcesPath, "sox", "win32");
    default:
      throw new Error("Unsupported platform: " + platform());
  }
}

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
    const file = fs.createWriteStream(getPathFromTemp(`${title}.wav`), {
      encoding: "binary",
    });

    try {
      const platformType = platform();
      const recordConfig = {
        recorder: "sox",
        recorderPath: getSoxPath(),
        execFile: platformType == "win32" ? "sox.exe" : "sox",
      };

      this.recording = recorder.record(recordConfig);

      this.recording.stream().pipe(file);

      return Promise.resolve(title);
    } catch (error) {
      this.recording = null;
      console.log("Error recording sound", error, "sox path:" + getSoxPath());
      return Promise.reject([error, "sox path:" + getSoxPath()]);
    }
  }

  private stopSound(recordid: string) {
    this.recording.stop();
    this.recording = null;

    const file = fs.readFileSync(getPathFromTemp(`${recordid}.wav`));
    fs.unlinkSync(getPathFromTemp(`${recordid}.wav`));

    const base64 = Buffer.from(file).toString("base64");
    return Promise.resolve(base64);
  }
}
