const colors = require("../colors.js");

module.exports = class LoaderModule extends require("../constructors/module.js") {
  constructor() {
    super({
      dependencies: ["fsscanner"],
      name: "loader",
      toConfigure: {
        commands: "optional.string", 
        events: "optional.string", 
        process_events: "optional.string", 
        functions: "optional.string"
      }
    });
  }

  afterConfigure() {
    return new Promise(async (res) => {
      this.ready = false;
      if (this.options.commands) await this.loadCommands(this.options.commands);
      if (this.options.events) await this.loadEvents(this.options.events);
      if (this.options.process_events) await this.loadProcessEvents(this.options.events);
      if (this.options.functions) await this.loadFunctions(this.options.functions);
      this.ready = true;
      res(true);
    });
  }

  getFiles(folder) {
    return new Promise((res) => {
      const fsscanner = require("fsscanner");
      const fs = require("fs");
      if (!fs.existsSync(`${process.cwd()}/${folder}`)) return res([]);
      fsscanner.scan(`${process.cwd()}/${folder}`, [fsscanner.criteria.pattern(".js"), fsscanner.criteria.type("F")], (err, results) => { 
        if (err) throw new Error(`FsScanner error: Error while scanning ${process.cwd()}/${folder}!\n${err}`);
        res(results);
      });
    });
  }

  loadCommands(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      this.BananenBase.commands = {};
      if (files.length === 0) {
        console.warn(`No commands found in the commands folder!`);
        return res();
      }
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let name = file;
        try {
          file = require(file);
          file = new file(this.BananenBase);
          if (!file.enabled) {
            console.warn(`${colors("[Loader]").cyan().done()} Command "${name}" disabled!`);
            continue;
          }
          file.dir = name;
          if (!file.help.name) return console.warn(`${colors("[Loader]").cyan().done()} Command "${name}" doesn't have a name, so it won't be activated!`);
          this.BananenBase.commands[file.help.name] = file;
        } catch(e) {
          console.log(`${colors("[Loader]").cyan().done()} Error while loading command "${name}"!\n${e}`);
        }
      }
      console.log(`${colors("[Loader]").cyan().done()} ${Object.keys(this.BananenBase.commands).length} command(s) loaded!`);
      res(true);
    });
  }

  loadEvents(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let name = file;
        try {
          file = require(file);
          file = new file(this.BananenBase);
          if (!file.enabled) {
            console.warn(`${colors("[Loader]").cyan().done()} Event "${name}" disabled!`);
            continue;
          }
          file.dir = name;
          this.BananenBase.client.on(file.event, (...args) => {
            file.run(...args);
          });
        } catch(e) {}
      }
      console.log(`${colors("[Loader]").cyan().done()} ${files.length} event(s) loaded!`);
      res(true);
    });
  }
}