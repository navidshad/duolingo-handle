const { createRest } = require("@modular-rest/server");
const permissionGroups = require("./permissions").permissionGroups;

const path = require("path");

// Load .env file
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("public dir", path.join(__dirname, "public"));

// Create the rest server
// The createRest function returns a promise
const app = createRest({
  port: 8081,
  modulesPath: path.join(__dirname, "modules"),
  staticPath: {
    rootDir: "public",
    log: true,
  },
  mongo: {
    mongoBaseAddress: process.env.MONGO_BASE_ADDRESS || "mongodb://mongo:27017",
    dbPrefix: "duolingo_",
  },
  onBeforeInit: (koaApp) => {
    // do something before init with the koa app
  },
  adminUser: {
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
  },
  verificationCodeGeneratorMethod: function () {
    return "123456";
  },
  permissionGroups: permissionGroups,
});
