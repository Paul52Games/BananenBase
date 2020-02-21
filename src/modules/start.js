module.exports = class StartModule extends require("../moduleFunctions/moduleClass.js") {
  constructor() {
    super({
      dependencies: ["discord.js"],
      name: "Internal.Start"
    });
  }

  onload() {
    const discord = require("discord.js");
    this.client = new discord.Client();
    this.BananenBase.client = this.client;
    this.BananenBase.start = () => {
      this.start();
    }
  }

  start() {
    this.client.login(this.BananenBase.token);
    console.log(`BananenBase loaded with ${this.BananenBase.modules.length} modules!\n\nStarting Discord Bot...`);
    this.messageHandler = require("../message.js");
    this.client.on("message", (message) => {
      this.messageHandler(message, this.BananenBase);
    }); 
    this.client.on("ready", () => {
      for (let i = 0; i < this.BananenBase.modules.length; i++) {
        let module = this.BananenBase.modules[i];
        module.internal_BB_Execute("onReady");
      }
      for (let i in this.BananenBase.commands) {
        let command = this.BananenBase.commands[i];
        if (typeof command.ready === "function") command.ready();
      }
      console.log("Discord Bot Online!");
    });
  }
}