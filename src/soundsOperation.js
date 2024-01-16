// fileFunctions.js
const fs = require("fs");
const path = require("path");

// Funkcja do zbierania plików z folderu
function getFilesInFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.map((file) => path.join(folderPath, file)));
      }
    });
  });
}

module.exports = {
  getFilesInFolder,
};
