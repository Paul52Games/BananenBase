const loadModule = require("./moduleFunctions/moduleLoader.js");
const colors = require("./colors.js");
global._BB_startingDir = __dirname;

module.exports = exports = class BananenBase {
  constructor(token) {
    if (!token) throw new Error("Invalid Discord Bot Token!");
    console.log(colors("Loading the BananenBase...").blue().done());
    let modules = [require("./modules/start.js")];
    this.token = token;
    this.loading = true;
    this.toConfigure = {};
    this.commandChecks = [];
    this.modules = [];
    this.config = {
      prefix: "."
    };
    setTimeout(async () => {
      for (let i = 0; i < modules.length; i++) {
        await loadModule(modules[i], this);
      }
      if (!this.start) await loadModule("./modules/start.js", this);
      this.loading = false;
    });

    console.warn = (...args) => {
      process.stdout.write(colors("[Warn]").yellow().done(), ...args);
      console.log(...args);
    }
  }

  set(key, value) {
    this[key] = value;
    return this;
  }

  addModule(name, options) {
    this.loadingModules = true;
    if (typeof name === "object") {
      name.forEach(module => {this.addModule(module, options);});
      return this;
    }
    setTimeout(async () => {
      let oldName = name;
      if (typeof name === "string" && !name.includes("/") && !name.includes("\\")) name = require("./moduleFunctions/moduleList.js")[name.toLowerCase()];
      let module = await loadModule(name, this).catch((_e) => {
        throw new Error(`Module "${oldName}" not found!`);
      });
      this.modules[module.name] = module;
      let i = setInterval(async () => {
        if (!module.ready || module.installingDependencies) return;
        clearInterval(i);
        if (this.toConfigure[module.name.toLowerCase()]) await this.toConfigure[module.name.toLowerCase()](options);
        await module.internal_BB_Execute("afterConfigure");
        this.loadingModules = false;
      });
    });
    return this;
  }

  setConfig(config) {
    this.config = config;
    if (!this.config.prefix) this.config.prefix = ".";
    return this;
  }
  
  ready(func = () => {}) {
    return new Promise((res) => {
      let i = setInterval(() => {
        if (this.loading || this.loadingModules) return;
        for (let module in this.modules) {
          module = this.modules[module];
          if (!module.ready || module.installingDependencies) return;
        }
        func(this);
        res(this);
        clearInterval(i);
      });
    });
  }
}

let modules = require("./moduleFunctions/moduleList.js");
modules.setExport(exports);

exports.command = require("./constructors/command.js");
exports.event = require("./constructors/event.js");
exports.module = require("./constructors/module.js");
exports.colors = require("./colors.js");