import { ipcMain } from "electron";
import { StorageService } from "./storage.service";
import { IntentionMode } from "../../../ui_app/src/types/base";
import { WindowsManagerService } from "./windows.service";
import { TimeTickEvent } from "../../../ui_app/src/types/event";

export class TimeService {
  private static instance: TimeService;

  remainingTime = 0;
  interval: NodeJS.Timer = null;

  constructor() {
    TimeService.instance = this;

    // Register IPC Events
    ipcMain.handle("time:start", () => this.startTimer());
  }

  static getInstance() {
    return this.instance;
  }

  private startTimer() {
    if (this.interval != null) return;

    const mode = StorageService.getInstance().store.get(
      "runtimeMode"
    ) as IntentionMode;

    if (mode === "exam") {
      this.remainingTime = 60 * 80;
    } else if (mode === "practice") {
      this.remainingTime = 60 * 35;
    }

    this.interval = setInterval(() => this.onTick(), 1000);
  }

  private onTick() {
    const timeEvent = new TimeTickEvent({ remains: this.remainingTime });
    WindowsManagerService.getInstance().sendMessage("tools-box", timeEvent);

    if (this.remainingTime === 0) {
      clearInterval(this.interval);
    }

    this.remainingTime += -1;
  }
}
