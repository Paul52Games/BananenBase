module.exports = async (message, BananenBase) => {
  message.tmp = {};
  if (!message.guild || message.author.bot) return;

  let canGoFuther = true;
  // BananenBase.modules = BananenBase.modules.sort((a, b) => a.priority-b.priority);
  // TODO: Sorting
  for (let i in BananenBase.modules) {
    if (Object.keys(BananenBase.modules[i]).length === 0) continue;
    let res = await BananenBase.modules[i].internal_BB_Execute("onMessage", message, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;
  
  BananenBase.client.emit("BananenBase.Message", message);

  let prefix = BananenBase.config.prefix;
  if (message.guild && message.guild.settings && message.guild.settings.prefix) prefix = message.guild.settings.prefix;
  if (message.author && message.author.settings && message.author.settings.prefix) prefix = message.guild.author.prefix;
  if (!prefix) prefix = ".";
  message.prefix = prefix;

  if (!message.content.toLowerCase().startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  let cmd = BananenBase.commands[command] || message.tmp.command;
  if (!cmd) return;
  delete message.tmp;

  message.args = args;
  for (let i = 0; i < BananenBase.modules.length; i++) {
    if (Object.keys(BananenBase.modules[i]).length === 0) continue;
    let res = await BananenBase.modules[i].internal_BB_Execute("beforeCommandExecute", message, cmd, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;
  delete message.args;

  cmd.run(message, args);
  
  for (let i = 0; i < BananenBase.modules.length; i++) {
    if (Object.keys(BananenBase.modules[i]).length === 0) continue;
    let res = await BananenBase.modules[i].internal_BB_Execute("afterCommandExecute", message, cmd, canGoFuther);
    if (typeof res === "boolean" && !res) canGoFuther = false;
  }
  if (!canGoFuther) return;
}