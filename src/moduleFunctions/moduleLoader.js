const childProcess = require("child_process");
const color = require("../colors.js");

module.exports = function loadModule(file, BananenBaseClass) {
  return new Promise(async (res, rej) => {
    try {
      if (typeof file === "string") file = require(file);
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
        await a.internal_BB_Execute("internal.beforeReady");
        BananenBaseClass.modules.push(a);
        a.ready = true;
      } catch(e) {
        BananenBaseClass.installingDependencies++;
        console.log(`Installing dependencies for ${color(a.name).yellow().done()}...`);
        childProcess.exec(`npm i -s ${a.dependencies.join(" ")}`, () => { setTimeout(async () => {

          BananenBaseClass.installingDependencies--;
          if (BananenBaseClass.installingDependencies === 0) {
            BananenBaseClass.ready = true;
            BananenBaseClass.modules = [];
            clearInterval(BananenBaseClass.i);

            console.log(color(`\nAll dependencies installed, reboot required!`).cyan().done());   
            setTimeout(() => {
              process.exit(1);
            }, 1000);
          }
          console.log(color(`Dependencies for ${color(a.name).yellow().done()} installed!`).cyan().done());
          delete a.installingDependencies;
          await a.internal_BB_Execute("onload");
          await a.internal_BB_Execute("internal.beforeReady");
          BananenBaseClass.modules.push(a);
          a.ready = true;

          BananenBaseClass.start = () => {};

        }, 1000); });
      }
    } catch(e) {
      rej(e);
    }
  });
}

// function wait(time) {
//   return new Promise((res) => {
//     setTimeout(res, time, true);
//   });
// }

// function untilPackageInstalled(packages, tries = 0) {
//   return new Promise(async (res) => {
//     if (tries === 5) return res(false);
//     try {
//       for (let i = 0; i < packages.length; i++) {
//         require(packages[i]);
//       }
//       res(true);
//     } catch(e) {
//       await wait(1000);
//       try {
//         for (let i = 0; i < packages.length; i++) {
//           delete require.cache[require.resolve(packages[i])];
//         }
//       } catch(e) {}
//       res(await untilPackageInstalled(packages), tries+1);
//     }
//   });
// }