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
      res();
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
      if (files.length === 0) {
        console.warn(`[Warn] No commands found in the commands folder!`);
        return res();
      }
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        try {
          new file();
        } catch(e) {
          // ...
        }
      }
    });
  }
  loadEvents(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
    });
  }
  loadProcessEvents(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
    });
  }
  loadFunctions(folder) {
    return new Promise(async (res) => {
      let files = await this.getFiles(folder);
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // ...
      }
    });
  }
}