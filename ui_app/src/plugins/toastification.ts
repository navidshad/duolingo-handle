import "vue-toastification/dist/index.css";
import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import type { App } from "vue";

const options: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
};

export function installToastification(app: App) {
  app.use(Toast, options);
}
