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
    console.log("\nStarting!");
  }
}