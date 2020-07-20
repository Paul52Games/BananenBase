const BananenBase = require("../../src/BananenBase");

module.exports = class Command extends BananenBase.command {
  constructor(BananenBase) {
    super(BananenBase, {
      name: "ping",
      description: "Test my reaction speed!",
      enabled: true
    }, {
      name: "alias",
      value: ["p", "pingpong", "pong"]
    }, {
      name: "args",
      value: {
        usage: "%prefix%ping",
        examples: ["%prefix%ping", "%prefix%ping -avarage"],
        checks: []
      }
    });
  }

  ready() {
    // console.log(`${this.help.name} is ready!`);
  }

  async run(message, _args) {
    let start = Date.now();
    let msg = await message.channel.send("Pinging...");
    let ping = Date.now()-start-this.client.ping;

    if (message.flags.includes("avarage")) {
      await msg.edit("1");
      await msg.edit("2");
      ping = (Date.now()-start-this.client.ping)/3;
    }

    msg.edit(`:ping_pong: ${Math.floor(ping)}ms\n:blue_heart: ${Math.floor(this.client.ping)}ms`);
  }
}