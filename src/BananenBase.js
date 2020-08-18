const loadModule = require("./moduleFunctions/moduleLoader.js");
const colors = require("./colors.js");
global._BB_startingDir = __dirname;

module.exports = exports = class BananenBase {
  constructor(token) {
    if (!token) throw new Error("Invalid Discord Bot Token!");
    if (typeof token === "object") throw new Error("Warning! You're currently using BananenBase V4! Look at the update guild: https://github.com/Paultje52/BananenBase/wiki/update-guide:-V3-to-V4");
    console.log(colors("Loading the BananenBase...").blue().done());
    this.token = token;
    this.loading = true;
    this.installingDependencies = 0;
    this.toConfigure = {};
    this.commandChecks = [];
    this.modules = [];
    this.config = {
      prefix: "."
    };

    this.debug = () => {};

    console.warn = (...args) => {
      console.log(colors("[Warn]").yellow().done(), ...args);
    }

    this.addModule("start");
  }

  set(key, value) {
    this[key] = value;
    this.debug(`${key} changed`);
    return this;
  }

  addModule(name, options) {
    this.loadingModules = true;
    if (typeof name === "object") {
      name.forEach(module => {this.addModule(module, options);});
      return this;
    }
    this.debug(`Adding module ${name}!`);
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
    this.debug(`Config changed!`);
    return this;
  }
  
  ready(func = () => {}) {
    return new Promise((res) => {
      this.readyFunction = [func, res];
      this.i = setInterval(() => {
        if (this.loading || this.loadingModules || this.installingDependencies) return;
        for (let module in this.modules) {
          module = this.modules[module];
          if ((!module.ready || module.installingDependencies) && module.name) return;
        }
        this.debug(`BananenBase is ready!`);
        clearInterval(this.i);
        func(this);
        res(this);
      });
    });
  }
}

let modules = require("./moduleFunctions/moduleList.js");
modules.setExport(exports);

exports.Command = require("./constructors/Command.js");
exports.Event = require("./constructors/Event.js");
exports.Module = require("./constructors/Module.js");
exports.Database = require("./constructors/Database.js");

exports.colors = require("./colors.js");
exports.version = require("../package.json").version;

exports.command = exports.Command;
exports.event = exports.Event;
exports.module = exports.Module;