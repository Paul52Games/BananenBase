const BananenBase = require("../src/BananenBase");

new BananenBase("TOKEN")
  .addModule("loader", {
    commands: "/commands"
  })  
  .addModule("alias")
  .ready((BananenBase) => {
    BananenBase.start();
  });