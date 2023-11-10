import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import CopyWebpackPlugin from "copy-webpack-plugin";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "./.env", to: "" },
        { from: "./.env.production", to: "" },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
};
