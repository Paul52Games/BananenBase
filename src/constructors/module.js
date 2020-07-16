module.exports = class BananenBaseModule {
  constructor({name, dependencies, toConfigure, priority} = {
    name: "???",
    dependencies: [],
    toConfigure: {},
    priority: 1
  }) {
    this.BananenBase = {};
    this.name = name;
    this.dependencies = dependencies || [];
    this.toConfigure = toConfigure || {};
    this.priority = priority || 1;
    this.options = {};
    if (this.priority < 0 || this.priority > 10) this.priority = 1;
    this.ready = true;
  }

  async internal_BB_Execute(thing, ...args) {
    if (thing === "internal.beforeReady" && this.toConfigure && Object.keys(this.toConfigure).length > 0) {
      let toConfigure = (options) => {
        if (this.BananenBase.config && this.BananenBase.config.modules && this.BananenBase.config.modules[this.name]) {
          if (!options) options = {};
          options = {...this.BananenBase.config.modules[this.name], ...options};
        } else if (!options) {
          console.log(`Module configuration "${this.name}" message:\n    No opions found!`);
          options = {};
        }
        for (let i in this.toConfigure) {
          if (this.toConfigure[i].split(".")[0].toLowerCase() === "required" 
            && !options[i]) throw new Error(`Module configuration ${this.name} error:\n    Option ${i.toLowerCase()} required, but not found.`);
          if (typeof options[i] === "undefined") continue;
          if (typeof options[i] !== this.toConfigure[i].split(".")[1]) throw new Error(`Module configuration ${this.name} error:\n    Option ${i} needs to be "${this.toConfigure[i].split(".")[1]}", but it is "${typeof options[i]}".`);
          this.options[i] = options[i];
        }
        let missed = [];
        for (let i in options) {
          if (!this.options[i]) missed.push(i);
        }
        if (missed.length !== 0) console.warn(`Module Configuration ${this.name}:\n    ${missed.length} option(s) added, but not asked for: ${missed.join(", ")}.`);
      }
      this.BananenBase.toConfigure[this.name] = toConfigure;
      return true;
    }
    if (typeof this[thing] !== "function") return true;
    return await this[thing](...args);
  }
}