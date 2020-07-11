const childProcess = require("child_process");
const color = require("../colors.js");

module.exports = function loadModule(file, BananenBaseClass) {
  return new Promise(async (res, rej) => {
    try {
      if (typeof file === "string") file = require(path);
      let a = new file();
      a.BananenBase = BananenBaseClass;
      a.internal_BB_Execute("beforeload");
      a.ready = false;
      a.installingDependencies = true;
      res(a);
      try {
        for (let i = 0; i < a.dependencies.length; i++) {
          require(a.dependencies[i]);
        }
        delete a.installingDependencies;
        await a.internal_BB_Execute("onload");
        a.ready = true;
        await a.internal_BB_Execute("internal.beforeReady");
        BananenBaseClass.modules.push(a);
      } catch(e) {
        console.log(`Installing dependencies for ${color(a.name).yellow().done()}...`);
        childProcess.exec(`npm i -s ${a.dependencies.join(" ")}`, async () => {
          try {
            for (let i = 0; i < a.dependencies.length; i++) {
              require(a.dependencies[i]);
            }
          } catch(e) {
            return console.log(color(`Installing dependencies for "${a.name}" didn't go as planned!`, e));
          }
          console.log(color(`Dependencies for ${color(a.name).yellow().done()} installed!`).cyan().done());
          delete a.installingDependencies;
          await a.internal_BB_Execute("onload");
          a.ready = true;
          await a.internal_BB_Execute("internal.beforeReady");
          BananenBaseClass.modules.push(a);
        });
      }
    } catch(e) {
      rej(e);
    }
  });
}