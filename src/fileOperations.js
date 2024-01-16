// fileFunctions.js
const fs = require("fs").promises;
const path = require("path");
const { app } = require("electron");

function setConfigFile() {
  let dirPath = path.resolve(app.getPath("userData"));
  const configPath = path.join(dirPath, "AppConfig.json");
  const configFile = { projectDir: dirPath, toDo: "todo" };
  const jsonString = JSON.stringify(configFile, null, 2);

  return new Promise((resolve, reject) => {
    createFileIfNotExists(configPath, jsonString, (fileExists) => {
      if (fileExists) {
        console.log("Plik już istnieje:", configPath);
        loadJsonFile(configPath)
          .then((jsonData) => resolve(jsonData))
          .catch((error) => reject(error));
      } else {
        console.log("Plik został utworzony pomyślnie:", configPath);
        resolve(configFile);
      }
    });
  });
}

async function checkDir() {
  const dirName = "Sounds";
  const dirPath = path.join(path.resolve(app.getPath("userData")), dirName);

  try {
    // Sprawdź istnienie katalogu
    await fs.stat(dirPath);

    console.log(`Folder już istnieje: ${dirPath}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Katalog nie istnieje, utwórz go
      try {
        await fs.mkdir(dirPath);
        console.log(`Utworzono folder: ${dirPath}`);
      } catch (mkdirError) {
        console.error(
          `Wystąpił błąd przy tworzeniu folderu: ${mkdirError.message}`
        );
        // Dodaj kod obsługujący błąd, na przykład, logowanie, powiadomienie itp.
      }
    } else {
      console.error(`Wystąpił błąd przy sprawdzaniu folderu: ${error.message}`);
      // Dodaj kod obsługujący błąd, na przykład, logowanie, powiadomienie itp.
    }
  }
}

function createFileIfNotExists(filePath, content, callback) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(filePath, content, (writeErr) => {
        if (writeErr) {
          console.error("Błąd podczas tworzenia pliku:", writeErr);
          callback(false); // Informacja o nieistnieniu pliku
        } else {
          callback(true); // Informacja o utworzeniu pliku
        }
      });
    } else {
      // Plik już istnieje
      callback(true); // Informacja o istnieniu pliku
    }
  });
}

async function loadJsonFile(filePath) {
  try {
    // Odczytaj zawartość pliku JSON
    const fileContent = await fs.readFile(filePath, "utf8");

    // Przekształć zawartość pliku JSON na obiekt JavaScript
    const jsonData = JSON.parse(fileContent);

    return jsonData;
  } catch (error) {
    console.error("Błąd podczas wczytywania pliku JSON:", error);
    throw error; // Przekaż błąd dalej, jeśli funkcję wywołano w kontekście innej funkcji
  }
}

//-zbieranie plików i folderów, skanowana lista z path
async function listFilesAndFolders(directoryPath) {
  directoryPath = path.resolve(app.getPath("userData"));
  try {
    if (!directoryPath || typeof directoryPath !== "string") {
      throw new Error("Invalid path argument. Must be a non-empty string.");
    }

    const entries = await fs.readdir(directoryPath);

    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directoryPath, entry);

        try {
          const stats = await fs.stat(fullPath);

          return {
            name: entry,
            type: stats.isDirectory() ? "folder" : "file",
            path: fullPath,
          };
        } catch (statError) {
          console.error(
            `Wystąpił błąd przy pobieraniu statystyk dla ${entry}: ${statError.message}`
          );
          // Jeżeli wystąpił błąd podczas pobierania statystyk, zwróć obiekt z informacją o błędzie
          return {
            name: entry,
            type: "error",
            path: fullPath,
            error: statError.message,
          };
        }
      })
    );

    return items;
  } catch (error) {
    console.error(
      `Wystąpił błąd podczas listowania plików i folderów: ${error.message}`
    );
    throw error;
  }
}

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
  setConfigFile,
  loadJsonFile,
  checkDir,
  listFilesAndFolders,
};
