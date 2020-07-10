const childProcess = require("child_process");
const color = require("../colors.js");

module.exports = function loadModule(file, BananenBaseClass) {
  return new Promise(async (res, rej) => {
    try {
      if (typeof file === "string") file = require(path);
      let a = new file();
      a.BananenBase = BananenBaseClass;
      a.internal_BB_Execute("beforeload");
      try {
        for (let i = 0; i < a.dependencies.length; i++) {
          require(a.dependencies[i]);
        }
        a.internal_BB_Execute("onload");
        await a.internal_BB_Execute("internal.beforeReady");
        BananenBaseClass.modules.push(a);
        res(a);
      } catch(e) {
        console.log(`Installing dependencies for ${color(a.name).yellow().done()}...`);
        childProcess.exec(`npm i -s ${a.dependencies.join(" ")}`, async () => {
          console.log(colors(`Dependencies for ${color(a.name).yellow().done()} installed!`).cyan().done());
          a.internal_BB_Execute("onload");
          await a.internal_BB_Execute("internal.beforeReady");
          BananenBaseClass.modules.push(a);
          res(a);
        });
      }
    } catch(e) {
      rej(e);
    }
  });
}