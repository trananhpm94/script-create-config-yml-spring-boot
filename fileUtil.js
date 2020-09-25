const path = require("path");
const { lstatSync, readdirSync } = require("fs");

const isFile = (source) => lstatSync(source).isFile();

const getFileNames = (source) =>
  readdirSync(source)
    .map((name) => {
      if (isFile(path.join(source, name))) {
        return name;
      }
    })
    .filter((x) => x != undefined);

module.exports = { isFile, getFileNames };
