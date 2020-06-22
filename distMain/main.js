"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var tabConfig_1 = require("./tabConfig");
var mainWindow;
var HOMEMAXHEIGHT = 36;
var createNewTabs;
var createWindow = function () {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.webContents.loadURL('http://localhost:8888/');
    mainWindow.webContents.openDevTools();
    createNewTabs = new tabConfig_1.CreateNewTabs(mainWindow, HOMEMAXHEIGHT);
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
        createNewTabs.destroyAllBrowserView();
    });
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });
};
electron_1.app.on('ready', function () {
    createWindow();
    createNewTabs.init();
    // mainWindow.reload()
    // mainWindow.webContents.reload()
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
        mainWindow = null;
        createNewTabs.destroyAllBrowserView();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
        createNewTabs.init();
    }
});
