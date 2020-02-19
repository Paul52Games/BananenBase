const fs = require("fs");
let files = fs.readdirSync(`${global._BB_startingDir}/modules/`, {
  encoding: "utf8"
});
if (!files) files = [];
let list = {};
files.forEach(f => {
  list[f.split(".")[0].toLowerCase()] = require(`${global._BB_startingDir}/modules/${f}`);
});

module.exports = exports = list;

exports.setExport = (exports) => {
  if (!exports.modules) exports.modules = {};

  for (let i in list) {
    exports.modules[i] = list[i];
  }
};