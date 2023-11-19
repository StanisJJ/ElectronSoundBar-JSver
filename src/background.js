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
// const path = require("path");
const fs = require("fs");

const isDevelopment = process.env.NODE_ENV !== "production";
let win = null;
let rightClickPosition = null;

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

// ipcMain.on("save-to-file", (event, content) => {
//   if (!win) {
//     return;
//   }

//   const options = {
//     title: "Zapisz do pliku",
//     defaultPath: app.getPath("documents"),
//     filters: [{ name: "Pliki tekstowe", extensions: ["txt"] }],
//   };

//   dialog
//     .showSaveDialog(win, options)
//     .then((result) => {
//       if (!result.canceled && result.filePath) {
//         fs.writeFile(result.filePath, content, (err) => {
//           if (err) {
//             event.reply("save-to-file-response", {
//               success: false,
//               error: err.message,
//             });
//           } else {
//             event.reply("save-to-file-response", {
//               success: true,
//               filePath: result.filePath,
//             });
//           }
//         });
//       } else {
//         event.reply("save-to-file-response", {
//           success: false,
//           error: "Operacja zapisu została anulowana.",
//         });
//       }
//     })
//     .catch((err) => {
//       event.reply("save-to-file-response", {
//         success: false,
//         error: err.message,
//       });
//     });
// });
