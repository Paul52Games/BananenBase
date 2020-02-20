module.exports = class StartModule extends require("../moduleFunctions/moduleClass.js") {
  constructor() {
    super({
      dependencies: ["fsscanner"],
      name: "Internal.Loader",
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
      if (this.options.commands) await this.loadCommands(this.options.commands);
      if (this.options.events) await this.loadEvents(this.options.events);
      if (this.options.process_events) await this.loadProcessEvents(this.options.events);
      if (this.options.functions) await this.loadFunctions(this.options.functions);
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
            console.log(`\x1b[36m[Loader]\x1b[0m \x1b[33m[WARN]\x1b[0m Command "${name}" disabled!`);
            continue;
          }
          file.dir = name;
          if (!file.help.name) return console.warn(`Command "${name}" doesn't have a name, so it won't be activated!`);
          this.BananenBase.commands[file.help.name] = file;
        } catch(e) {
          console.log(`\x1b[36m[Loader]\x1b[0m Error while loading command "${name}"!\n${e}`);
        }
      }
      console.log(`\x1b[36m[Loader]\x1b[0m ${Object.keys(this.BananenBase.commands).length} command(s) loaded!`);
      res(true);
    });
  }
  loadEvents(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
      console.log(`\x1b[36m[Loader]\x1b[0m ${files.length} event(s) loaded!`);
      res(true);
    });
  }
  loadProcessEvents(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
      console.log(`\x1b[36m[Loader]\x1b[0m ${files.length} process event(s) loaded!`);
      res(true);
    });
  }
  loadFunctions(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
      console.log(`\x1b[36m[Loader]\x1b[0m ${files.length} function(s) loaded!`);
      res(true);
    });
  }
}