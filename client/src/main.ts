import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { Actions } from "./types";
import { setupEngine, writeReq } from "./engine";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const actions = [Actions.GENERATE_BOARD, Actions.SOLVE_BOARD];
  for (const action of actions)
    ipcMain.on(action, (_, args) => {
      writeReq(args);
    });

  const win = createWindow();
  setupEngine((val) => {
    let channel = "RES:";
    switch (val.action) {
      case Actions.GENERATE_BOARD:
        channel += Actions.GENERATE_BOARD;
        break;
      case Actions.SOLVE_BOARD:
        channel += Actions.SOLVE_BOARD;
        break;
    }

    win.webContents.send(channel, val);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
