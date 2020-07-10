const BananenBase = require("../src/BananenBase");

new BananenBase("TOKEN")
  .setConfig(require("./config.json"))
  .addModule("loader")
  .addModule("alias")
  .ready((BananenBase) => {
    BananenBase.start();
  });