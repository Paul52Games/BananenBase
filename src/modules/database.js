const path = require("path");
const colors = require("../colors.js");

module.exports = class DatabaseModule extends require("../constructors/module.js") {
  constructor() {
    super({
      name: "database",
      toConfigure: {
        name: "required.string",
        development: "optional.boolean",
        guildSettings: "optional.object",
        userSettings: "optional.object",
        inMemory: "optional.boolean"
      },
      dependencies: ["json-config-store", "sqlite3"]
    });
  }

  afterConfigure() {
    this.database = new DataBase({
      development: this.options.development,
      cwd: process.cwd(),
      name: this.options.name
    });
    this.database.isReady().then(() => {
      console.log(`${colors("[Database]").cyan().done()} Database ${colors(this.options.name).green().done()} is ready!`);
      if (!this.options.inMemory) this.database.memory = {};
    });
    this.BananenBase.database = this.database;
    this.defaults = {
      user: this.options.userSettings || {},
      guild: this.options.guildSettings || {}
    }
  }

  async onMessage(message, continues) {
    if (!continues) return false;
    message.author.dbId = `user-${message.author.id}`;
    message.author.settings = await this.database.get(message.author.dbId);
    if (!message.author.settings) message.author.settings = this.defaults.user;

    message.guild.dbId = `guild-${message.guild.id}`;
    message.guild.settings = await this.database.get(message.guild.dbId);
    if (!message.guild.settings) message.guild.settings = this.defaults.guild;
  }
}

class DataBase {
  constructor({development = false, cwd = __dirname, name ="database"} = {development: false, cwd: __dirname, name: "database"}) {
    if (development) {
      this.database = new (require("json-config-store"))({
        cwd: cwd,
        configName: `${name}.json`
      });
      this.database.isReady = () => new Promise((res) => res());
      return this.database;
    }
    this.memory = {};
    this.ready = false;
    const sqlite3 = require("sqlite3");
    this.sqlite = new sqlite3.Database(path.join(cwd, `${name}.sqlite`));
    let i = setInterval(() => {
      if (!this.sqlite.open) return;
      clearInterval(i);
      this.sqlite.run("CREATE TABLE IF NOT EXISTS BananenBase (key TEXT, value TEXT);", () => {
        this.sqlite.all("SELECT * FROM BananenBase;", (err, data) => {
          if (err) throw err;
          data.forEach(d => {
            this.memory[d.key] = JSON.parse(d.value);
          });
          this.ready = true;
        });
      });
    });
  }

  isReady() {
    return new Promise((res) => {
      let i = setInterval(() => {
        if (!this.ready) return;
        res();
        clearInterval(i);
      }, 10);
    })
  }

  get(key) {
    if (this.memory[key]) return this.memory[key];
    return new Promise((res) => {
      this.sqlite.all(`SELECT value FROM BananenBase WHERE key='${key}';`, [], (err, data) => {
        if (err) throw err;
        if (data.length === 0) return res(undefined);
        res(data[0].key);
      });
    }); 
  }

  set(key, value) {
    this.memory[key] = value;
    return new Promise((res) => {
      this.sqlite.all(`SELECT * FROM BananenBase where key='${key}'`, [], (err, data) => {
        if (err) throw err;
        let sql = "";
        if (data.length === 0) sql = `INSERT INTO BananenBase (key, value) VALUES ('${key}', '${JSON.stringify(value)}')`;
        else sql = `UPDATE BananenBase SET value='${JSON.stringify(value)}' WHERE key='${key}'`;
        this.sqlite.all(sql, [], (err) => {
          if (err) throw err;
          res(true);
        });
      });
    });
  }

  delete(key) {
    delete this.memory[key];
    return new Promise((res) => {
      this.sqlite.all(`DELETE FROM BananenBase WHERE key='${key}'`, [], (err) => {
        if (err) throw err;
        res(true);
      });
    });
  }
}
