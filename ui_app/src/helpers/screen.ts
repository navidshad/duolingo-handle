import {
  detectTextFromImage,
  detectTextPositionsFromImage,
} from "../services/ai";

import type { Rectangle } from "../types/base";

export const extractAnnotationsFromScreen = async (
  coordinateBoundOffset?:
    | {
        x?: number | undefined;
        y?: number | undefined;
      }
    | undefined
) => {
  const base64 = await window.electronAPI.takeScreenShot({
    coordinateBoundOffset,
  });
  return detectTextPositionsFromImage(base64);
};

export const extractTextFromScreen = async (
  coordinateBoundOffset?:
    | {
        x?: number | undefined;
        y?: number | undefined;
      }
    | undefined
) => {
  const base64 = await window.electronAPI.takeScreenShot({
    coordinateBoundOffset,
  });
  return detectTextFromImage(base64);
};

export const extractTextWithCustomBound = async (bound: Rectangle) => {
  const base64 = await window.electronAPI.takeScreenShot({
    customBound: bound,
  });
  return detectTextFromImage(base64);
};
