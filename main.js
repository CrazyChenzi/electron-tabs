const { app, BrowserWindow, dialog } = require("electron");

const createWindow = () => {
  let parent = new BrowserWindow();
  let child = new BrowserWindow({ parent });

  parent.loadURL("https://www.google.com");
  child.loadURL("https://www.baidu.com");

  parent.show();
  child.show();
};

app.on('ready', () => createWindow())
