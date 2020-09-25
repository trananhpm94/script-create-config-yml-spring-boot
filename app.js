//requiring path and fs modules
const path = require("path");
const fs = require("fs");
const { lstatSync, readdirSync } = require("fs");

const getLevel = (line = "") => {
  return line.split("").findIndex((str) => str != " ");
};

const createFileConfig = ({ fileApplicationYmlPath, folderFileConfig }) => {
  const dataSource = fs.readFileSync(fileApplicationYmlPath, "utf8");
  const lineData = dataSource.split("\n");
  const linesDataObj = lineData.map((line, i) => {
    return {
      index: i,
      level: getLevel(line),
      data: line,
    };
  });

  const getParentLevel = (index) => {
    const line = linesDataObj[index];
    const lineLevel = line.level;
    if (lineLevel === 0) {
      return null;
    }
    let parentLevel = null;
    let indexCheck = index - 1;
    while (indexCheck >= 0 && parentLevel === null) {
      if (linesDataObj[indexCheck].level < lineLevel) {
        parentLevel = linesDataObj[indexCheck];
      }
      indexCheck = indexCheck - 1;
    }
    return parentLevel;
  };

  const linesUpdate = lineData
    .map((line, i) => {
      if (line.includes("update_me")) {
        const nextLine = lineData[i + 1];
        const data = {
          index: i + 1,
          level: getLevel(nextLine),
          update: true,
          data: nextLine,
        };
        return data;
      }
      return null;
    })
    .filter((item) => item);

  const linesParent = {};

  linesUpdate.forEach((line) => {
    let indexCheck = line.index;
    let parentLevel = getParentLevel(indexCheck);
    while (parentLevel) {
      linesParent[parentLevel.index] = parentLevel;
      indexCheck = parentLevel.index;
      parentLevel = getParentLevel(indexCheck);
    }
  });

  const linesConfig = [...linesUpdate, ...Object.values(linesParent)].sort(
    (a, b) => a.index - b.index
  );

  if (!fs.existsSync(folderFileConfig)) {
    fs.mkdirSync(folderFileConfig);
  }

  const directoryPathData = path.join(
    folderFileConfig,
    `application-config.yml`
  );
  fs.writeFileSync(
    directoryPathData,
    linesConfig.map((line) => line.data).join("\r\n"),
    "utf8"
  );
  fs.writeFileSync(
    path.join(folderFileConfig, `application.yml`),
    lineData.join("\r\n"),
    "utf8"
  );
  console.log("Create file config thành công");
};

module.exports = { createFileConfig };
