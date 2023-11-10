export const isDev = () => {
  if (process.env["FORCE_PROD"] === "true") return false;

  return process.env["WEBPACK_SERVE"] === "true";
};
