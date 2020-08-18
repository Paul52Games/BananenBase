module.exports = class StartModule extends require("../constructors/Module.js") {
  constructor() {
    super({
      name: "alias",
      priority: 0
    });
  }

  onMessage(message) {
    let prefix = this.BananenBase.prefix;
    if (this.BananenBase.config && this.BananenBase.config.prefix) prefix = this.BananenBase.config.prefix;
    if (message.guild && message.guild.settings && message.guild.settings.prefix) prefix = message.guild.settings.prefix;
    if (message.author && message.author.settings && message.author.settings.prefix) prefix = message.guild.author.prefix;
    if (!prefix) prefix = ".";

    if (!message.content.toLowerCase().startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    
    for (let i in this.BananenBase.commands) {
      let cmd = this.BananenBase.commands[i];
      if (cmd.arguments.alias && cmd.arguments.alias.includes(command)) message.tmp.command = cmd;
    }
  }
}
