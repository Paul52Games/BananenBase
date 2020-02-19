const BananenBase = require("./src/index.js");

new BananenBase("TOKEN")
  .addModule("loader", {
    commands: "commands",
    events: "events"
  })
  .ready((BananenBase) => {
    BananenBase.start();
  });
