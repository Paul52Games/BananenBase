module.exports = class Command {
  constructor(BananenBase, settings, ..._args) {
    this.client = BananenBase.client;
    this._BananenBase = BananenBase;

    this.enabled = settings.enabled;
    if (typeof this.enabled !== "boolean") this.enabled = true;

    this.help = {
      name: settings.name || "",
      description: settings.description || false
    };
    this.help.name.toLowerCase();

    let args = [...arguments];
    args.shift();
    args.shift();
    this.arguments = {};
    args.forEach(ar => {
      if (typeof ar !== "object" || (!ar.name && !ar.n) || (!ar.value && !ar.v)) return console.warn(`[Warn] Command ${this.path}: Argument ${ar} isn't valid!`);
      let name = ar.name || ar.n;
      this.arguments[name.toLowerCase()] = ar.value || ar.v;
    });

    this.check = (message) => {
      let positive = true;
      for (let i = 0; i < this._BananenBase.commandChecks.length; i++) {
        let check = this._BananenBase.commandChecks[i];
        if (check(message, this)) continue;
        positive = false;
        break;
      }
      if (!positive) return false;
      return true;
    };
  }
}