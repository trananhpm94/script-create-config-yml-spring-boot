const { getFileNames } = require("./fileUtil");
const { createFileConfig } = require("./app");
const extract = require("extract-zip");
const { join } = require("path");
const fs = require("fs");
const del = require("del");
const CURRENT_PATH_PRPOJECT = process.cwd();
const CURRENT_PATH_APP_CREATE_COFNIG = __dirname;
const ZIP_PATH = join(CURRENT_PATH_PRPOJECT, "unzip");
const FILE_APPLICATION_YML_PATH = join(
  ZIP_PATH,
  "BOOT-INF/classes/application.yml"
);
const FOLDER_FILE_CONFIG = join(CURRENT_PATH_PRPOJECT, "config");

const getFileJarName = () => {
  const fileNames = getFileNames(CURRENT_PATH_PRPOJECT);
  const fileJarNames = fileNames.filter((path) => path.endsWith(".jar"));
  if (fileJarNames.length === 0) {
    console.error("Không tìm thấy file jar");
  }
  if (fileJarNames.length > 1) {
    console.error("Có nhiều file jar");
  }
  return fileJarNames[0];
};

const unzipFileJar = async () => {
  const fileJarName = getFileJarName();
  if (!fileJarName) {
    return;
  }
  try {
    await extract(join(CURRENT_PATH_PRPOJECT, fileJarName), {
      dir: ZIP_PATH,
    });
    console.log("Unzip thành công");
  } catch (err) {
    console.error("Unzip lỗi", err);
    // handle any errors
  }
};

const clearAfterRun = async () => {
  await del(ZIP_PATH);
};

const main = async () => {
  await unzipFileJar();
  await createFileConfig({
    fileApplicationYmlPath: FILE_APPLICATION_YML_PATH,
    folderFileConfig: FOLDER_FILE_CONFIG,
  });
  clearAfterRun();
};

main();
