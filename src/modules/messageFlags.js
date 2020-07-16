module.exports = class MessageFlags extends require("../constructors/module.js") {
  constructor() {
    super({
      name: "messageflags",
      toConfigure: {
        prefix: "optional.string"
      }
    });
  }

  afterConfigure() {
    this.prefix = this.options.prefix || "-";
  }

  onMessage(message) {
    let flags = [];
    let args = message.content.split(/ +/g);
    args.forEach(arg => {
      if (arg.startsWith(this.prefix)) flags.push(arg.split(this.prefix).slice(1).join(this.prefix));
    });
    message.flags = flags;

  }
}