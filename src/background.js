"use strict";

const {
  app,
  protocol,
  ipcMain,
  BrowserWindow,
  Menu,
  MenuItem,
  dialog,
} = require("electron");
const { createProtocol } = require("vue-cli-plugin-electron-builder/lib");
const installExtension = require("electron-devtools-installer").default;
const path = require("path");
const fs = require("fs");
const fileOperations = require("./fileOperations");
const { dir } = require("console");

const isDevelopment = process.env.NODE_ENV !== "production";
let win = null;
let rightClickPosition = null;
let configFile = {};

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  win.setMenu(null);

  const contextMenu = new Menu();
  contextMenu.append(
    new MenuItem({
      label: "Inspect Element",
      click: () => {
        if (win && rightClickPosition) {
          win.webContents.inspectElement(
            rightClickPosition.x,
            rightClickPosition.y
          );
        }
      },
    })
  );

  win.webContents.on("context-menu", (e, params) => {
    rightClickPosition = { x: params.x, y: params.y };
    if (win) {
      contextMenu.popup({ window: win, x: params.x, y: params.y });
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

app.whenReady().then(() => {
  console.log("userData:", app.getPath("userData"));
  (async () => {
    try {
      configFile = await fileOperations.setConfigFile();
      console.log("ConfgFile:", configFile);
      fileOperations.checkDir();
    } catch (error) {
      console.error("Błąd:", error);
    }
  })();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("open-file-dialog", (event) => {
  const options = {
    title: "Choose an audio file",
    filters: [{ name: "Audio Files", extensions: ["mp3"] }],
    properties: ["openFile"],
  };

  dialog.showOpenDialog(options).then((filePaths) => {
    if (!filePaths.canceled && filePaths.filePaths.length > 0) {
      console.log(filePaths.filePaths);
      event.sender.send("selected-file", filePaths.filePaths[0]);
    }
  });
});

ipcMain.on("save-json-file", (event, jsonString) => {
  if (!win) {
    return;
  }

  const options = {
    title: "Save JSON File",
    defaultPath: app.getPath("documents"),
    filters: [{ name: "JSON Files", extensions: ["json"] }],
  };

  dialog
    .showSaveDialog(win, options)
    .then((result) => {
      if (!result.canceled && result.filePath) {
        fs.writeFile(result.filePath, jsonString, (err) => {
          if (err) {
            event.reply("save-json-file-response", {
              success: false,
              error: err.message,
            });
          } else {
            event.reply("save-json-file-response", {
              success: true,
              filePath: result.filePath,
            });
          }
        });
      } else {
        event.reply("save-json-file-response", {
          success: false,
          error: "Save operation canceled.",
        });
      }
    })
    .catch((err) => {
      event.reply("save-json-file-response", {
        success: false,
        error: err.message,
      });
    });
});

ipcMain.on("get-app-path", (event) => {
  console.log("get file", configFile);
  event.reply("app-path", path.dirname(__dirname), configFile);
});

ipcMain.on("get-file-list", async (event) => {
  try {
    const fileList = await fileOperations.listFilesAndFolders();
    console.log("File-list", fileList);
    event.reply("get-list", fileList);
  } catch (error) {
    console.error(
      "Błąd podczas pobierania listy plików i folderów:",
      error.message
    );
    // Dodaj obsługę błędu, na przykład event.reply z informacją o błędzie
  }
});

const folderPath = "C:/Users/daki_ImBack/Desktop/dane";
ipcMain.on("get-file", () => {
  fileOperations
    .getFilesInFolder(folderPath)
    .then((files) => {
      // Przekazanie danych do aplikacji Vue
      console.log(files);
      win.webContents.send("files", files);
    })
    .catch((err) => {
      console.error("Błąd podczas zbierania plików:", err);
    });
});
