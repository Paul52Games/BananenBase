module.exports = async (message, BananenBase) => {
  message.tmp = {};

  let canGoFuther = true;
  // BananenBase.modules = BananenBase.modules.sort((a, b) => a.priority-b.priority);
  // TODO: Sorting
  for (let i in BananenBase.modules) {
    let res = await BananenBase.modules[i].internal_BB_Execute("onMessage", message, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;

  let prefix = BananenBase.prefix;
  if (message.guild && message.guild.settings && message.guild.settings.prefix) prefix = message.guild.settings.prefix;
  if (message.author && message.author.settings && message.author.settings.prefix) prefix = message.guild.author.prefix;
  if (!prefix) prefix = ".";

  BananenBase.client.emit("BananenBase.Message", message);

  if (!message.content.toLowerCase().startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  let cmd = BananenBase.commands[command] || message.tmp.command;
  if (!cmd) return;
  delete message.tmp;

  for (let i = 0; i < BananenBase.modules.length; i++) {
    let res = await BananenBase.modules[i].internal_BB_Execute("beforeCommandExecute", message, cmd, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;

  cmd.run(message, args);
  
  for (let i = 0; i < BananenBase.modules.length; i++) {
    let res = await BananenBase.modules[i].internal_BB_Execute("afterCommandExecute", message, cmd, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;
}