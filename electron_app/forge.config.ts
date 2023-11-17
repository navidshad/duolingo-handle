import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";
import { join } from "path";

const config: ForgeConfig = {
  packagerConfig: {
    buildVersion: new Date().getTime().toString(),
    extendInfo: {
      NSMicrophoneUsageDescription:
        "This app needs access to your microphone because of the voice recognition feature.",
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            // html: './src/public/index.html',
            // js: './src/public/renderer.ts',
            name: "main_window",
            preload: {
              js: join(__dirname, "/src/preload.ts"),
            },
          },
        ],
      },
    }),
  ],
};

export default config;
