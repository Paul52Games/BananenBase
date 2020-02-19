const BananenBase = require("./src/index.js");

new BananenBase("NDA3NTM5NzgyOTU3MjY4OTky.XkhH1g.BPCDz889aXf5DKibEkpNaEmfYz8")
  .addModule("loader", {
    commands: "commands",
    events: "events"
  })
  .ready((BananenBase) => {
    BananenBase.start();
  });
