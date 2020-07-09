const BananenBase = require("../src/BananenBase");

new BananenBase("TOKEN")
  .addModule("loader", {
    commands: "/commands",
    events: "/events"
  })  
  .addModule("alias")
  .setConfig(require("./config.json"))
  .ready((BananenBase) => {
    BananenBase.start();
  });