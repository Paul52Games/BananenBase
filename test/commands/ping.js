const BananenBase = require("../../src/BananenBase");

module.exports = class Command extends BananenBase.command {
  constructor(BananenBase) {
    super(BananenBase, {
      name: "ping",
      description: "Test my reaction speed!",
      usage: "ping",
      examples: [
        "ping"
      ],
      args: [],
      enabled: true
    }, {
      name: "alias",
      value: ["p", "pingpong", "pong"]
    });
  }

  ready() {
    // console.log(`${this.help.name} is ready!`);
  }

  async run(message, _args) {
    let start = Date.now();
    let msg = await message.channel.send("Pinging...");
    msg.edit(`:ping_pong: ${Date.now()-start-this.client.ping}ms\n:blue_heart: ${this.client.ping}ms`);
  }
}