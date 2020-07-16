module.exports = class Args extends require("../constructors/module.js") {
  constructor() {
    super({
      name: "args"
    });
  }

  async beforeCommandExecute(message, cmd, continues) {
    if (!continues) return false;
    if (!cmd.arguments.args) return true;

    let argumentChecks = cmd.arguments.args.checks;
    let usage = cmd.arguments.args.usage.replace("%prefix%", message.prefix);
    let example = cmd.arguments.args.examples[Math.floor(Math.random() * cmd.arguments.args.examples.length)].replace("%prefix%", message.prefix);

    let canContinue = true;
    for (let i = 0; i < argumentChecks.length; i++) {
      let arg = argumentChecks[i];
      let result = await arg.test(message, message.args[i]);
      if (!result) {
        canContinue = false;
        message.channel.send(`Argument **${arg.name}** isn't valid!\nCommand usage: **${usage}**\nExample: \`${example}\``);
        break;
      }
    }

    return canContinue;
  }
}