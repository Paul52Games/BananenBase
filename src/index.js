const loadModule = require("./moduleFunctions/moduleLoader.js");
global._BB_startingDir = __dirname;

module.exports = exports = class BananenBase {
  constructor(token) {
    if (!token) throw new Error("Invalid Discord Bot Token!");
    console.log("Starting the BananenBase...");
    let modules = [require("./modules/start.js")];
    this.token = token;
    this.loading = true;
    this.toConfigure = {};
    this.commandChecks = [];
    setTimeout(async () => {
      for (let i = 0; i < modules.length; i++) {
        await loadModule(modules[i], this);
      }
      if (!this.start) await loadModule("./modules/start.js", this);
      this.loading = false;
    });
  }

  addModule(name, options) {
    this.loadingModules = true;
    setTimeout(async () => {
      let oldName = name;
      if (typeof name === "string" && !name.includes("/") && !name.includes("\\")) name = require("./moduleFunctions/moduleList.js")[name.toLowerCase()];
      let module = await loadModule(name, this).catch((_e) => {
        throw new Error(`Module "${oldName}" not found!`);
      });
      if (this.toConfigure[module.name.toLowerCase()]) await this.toConfigure[module.name.toLowerCase()](options);
      await module.internal_BB_Execute("afterConfigure");
      await module.internal_BB_Execute("beforeReady");
      this.loadingModules = false;
    });
    return this;
  }
  
  ready(func = () => {}) {
    return new Promise((res) => {
      let i = setInterval(() => {
        if (this.loading || this.loadingModules) return;
        func(this);
        res(this);
        clearInterval(i);
      });
    });
  }
}

let modules = require("./moduleFunctions/moduleList.js");
modules.setExport(exports);

exports.command = require("./modules/loader/commandConstructor.js");