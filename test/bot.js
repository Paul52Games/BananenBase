const BananenBase = require("../src/BananenBase");

new BananenBase("TOKEN")
  .setConfig(require("./config.json"))
  .addModule(["loader", "alias", "database", "messageflags", "args"])
  .addModule("security", {
    defaultPermissions: {
      user: ["SEND_MESSAGES"],
      bot: ["EMBED_LINKS"]
    },
    permissionNames: {
      botOwner: (message, BananenBase) => {
        let botOwners = ["327462385361092621", "259776081316282368"];
        return botOwners.includes(message.author.id);
      }
    }
  })
  .ready((BananenBase) => {
    BananenBase.start();
  });