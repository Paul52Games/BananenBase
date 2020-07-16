module.exports = class SecurityModule extends require("../constructors/module.js") {
  constructor() {
    super({
      name: "security",
      toConfigure: {
        defaultPermissions: "optional.object",
        permissionNames: "optional.object"
      }
    });
  }

  afterConfigure() {
    if (!this.options.defaultPermissions) this.options.defaultPermissions = {user: [], bot: []};
    if (!this.options.defaultPermissions.user) this.options.defaultPermissions.user = [];
    if (!this.options.defaultPermissions.bot) this.options.defaultPermissions.bot = [];

    if (!this.options.permissionNames) this.options.permissionNames = {};
  }

  async beforeCommandExecute(message, cmd, continues) {
    if (!continues) return false;
    if (!cmd.arguments.security) return true;
    if (!cmd.arguments.security.permissions) cmd.arguments.security.permissions = {};
    if (!cmd.arguments.security.permissions.bot) cmd.arguments.security.permissions.bot = [];
    if (!cmd.arguments.security.permissions.user) cmd.arguments.security.permissions.user = [];
    if (!cmd.arguments.security.permissionName) cmd.arguments.security.permissionName = false;

    // Bot perms
    let missing = [];
    let botPerms = this.options.defaultPermissions.bot.concat(cmd.arguments.security.permissions.bot);
    let perms = message.channel.permissionsFor(this.BananenBase.client.user);
    botPerms.forEach((perm) => {
      if (!perms.has(perm)) missing.push(perm);
    });
    if (missing.length > 0) {
      message.channel.send(`The bot is missing ${missing.map(x => `**${x.toUpperCase()}**`).join(", ")} to be able to execute this command.`);
      return false;
    }

    // User perms
    let userPerms = this.options.defaultPermissions.user.concat(cmd.arguments.security.permissions.user);
    perms = message.channel.permissionsFor(message.author);
    userPerms.forEach((perm) => {
      if (!perms.has(perm)) missing.push(perm);
    });
    if (missing.length > 0) {
      message.channel.send(`You are missing ${missing.map(x => `**${x.toUpperCase()}**`).join(", ")} to use this command.`);
      return false;
    }

    // Permission levens/checks
    let permName = cmd.arguments.security.permissionName;
    if (this.options.permissionNames[permName]) {
      let hasPermission = await this.options.permissionNames[permName](message, this.BananenBase);
      if (!hasPermission) {
        message.channel.send(`You don't qualify for permission group **${permName}**`);
        return false;
      }
    }
  }
}