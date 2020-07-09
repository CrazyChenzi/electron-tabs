import { app, BrowserWindow, globalShortcut, ipcMain, dialog } from 'electron'
import { CreateNewTabs } from './tabConfig'
import { DEVTOOLS } from '../utils/utils'

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
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.webContents.loadURL('http://localhost:8888/')

  createNewTabs = new CreateNewTabs(mainWindow, HOMEMAXHEIGHT)
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
    createNewTabs.destroyAllBrowserView()
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', () => {
  createWindow()
  createNewTabs.init()
  globalShortcut.register('CmdOrCtrl+Alt+C', () => {
    DEVTOOLS(mainWindow)
  })
  // mainWindow.reload()
  // mainWindow.webContents.reload()
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

ipcMain.on('open-notice', () => {
  const child = new BrowserWindow({ parent: mainWindow, modal: true, show: true })
  child.loadURL('http://localhost:3000/')
})

ipcMain.on('open-notice-dialog', () => {
  const child = new BrowserWindow({ parent: mainWindow, modal: true })
  child.loadURL('https://www.google.com')
  dialog.showOpenDialog(child)
})
