const colors = require("../colors.js");

module.exports = class StartModule extends require("../constructors/module.js") {
  constructor() {
    super({
      dependencies: ["discord.js"],
      name: "start",
      toConfigure: {
        disabled: "boolean.optional"
      }
    });
  }

  onload() {
    this.BananenBase.loading = false;
  }

  afterConfigure() {
    if (this.options.disabled) return;
    const discord = require("discord.js");
    this.client = new discord.Client();
    this.BananenBase.client = this.client;
    this.BananenBase.start = () => {
      this.start();
    }
  }

  async start() {
    await this.waitForModuleReady();

    this.client.login(this.BananenBase.token);
    console.log(`BananenBase loaded with ${colors(this.BananenBase.modules.length).green().done()} modules!\n\n${colors("Starting Discord Bot...").magenta().done()}`);
    this.messageHandler = require("../message.js");

    this.client.on("message", (message) => {
      this.messageHandler(message, this.BananenBase);
    }); 

    this.BananenBase.client = this.client;
    this.client.on("ready", () => {
      for (let i = 0; i < this.BananenBase.modules.length; i++) {
        let module = this.BananenBase.modules[i];
        module.internal_BB_Execute("onReady");
      }
      for (let i in this.BananenBase.commands) {
        let command = this.BananenBase.commands[i];
        if (typeof command.ready === "function") command.ready();
      }
      console.log(colors(`Discord bot ${colors(this.client.user.username).white().done()}\x1b[32m is online!`).green().done());
    });
  }

  waitForModuleReady() {
    return new Promise((res) => {
      let interval = setInterval(() => {
        for (let module of this.BananenBase.modules) {
          if (!module.ready) return;
        }
        clearInterval(interval);
        res(true);
      });
    });
  }
}