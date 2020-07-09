module.exports = class Event {
  constructor(BananenBase, settings) {
    if (!settings.event) throw new Error("No event name!");
    this.event = settings.event;
    
    this.client = BananenBase.client;
    this._BananenBase = BananenBase;

    this.enabled = settings.enabled;
    if (typeof this.enabled !== "boolean") this.enabled = true;
  }

  run() {}
}