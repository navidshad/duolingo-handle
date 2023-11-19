export const isDev = () => {
  if (process.env["FORCE_PROD"] === "true") return false;

  return process.env["WEBPACK_SERVE"] === "true";
};

export const SystemInfoKey = {
  isDev: "systeminfo_isdev",
  platform: "systeminfo_platform",
};
