import { app, BrowserWindow } from 'electron'
import { CreateNewTabs } from './tabConfig'

let mainWindow: Electron.BrowserWindow
const HOMEMAXHEIGHT = 36
let createNewTabs: CreateNewTabs

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    // frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  createNewTabs = new CreateNewTabs(mainWindow, HOMEMAXHEIGHT)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
    createNewTabs.destroyAllBrowserView()
  })
}

app.on('ready', () => {
  createWindow()
  createNewTabs.init()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    mainWindow = null
    createNewTabs.destroyAllBrowserView()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
    createNewTabs.init()
  }
})
