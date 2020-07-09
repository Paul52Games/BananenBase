const BananenBase = require("../../src/BananenBase");

module.exports = class ReadyTester extends BananenBase.event {
  constructor(BananenBase) {
    super(BananenBase, {
      event: "ready"
    });
  }

  run() {
    console.log("Message of the custom ready event!");
  }
}