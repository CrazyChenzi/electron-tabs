import { app, BrowserWindow, BrowserView, ipcMain } from 'electron'

let mainWindow: Electron.BrowserWindow
let browserViewList: {[key: string]: BrowserView} | null = {}
let lastBrowerView: BrowserView
let nextRemoveBrowerView: BrowserView
let homeBrowerview: BrowserView
const HOMEMAXHEIGHT = 36

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

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, '../index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
    Object.keys(browserViewList).forEach((key) => {
      browserViewList[key].destroy()
    })
    browserViewList = null
    lastBrowerView = null
    nextRemoveBrowerView = null
    homeBrowerview = null
  })
}

app.on('ready', () => {
  createWindow()
  const [width, height] = mainWindow.getSize()
  homeBrowerview = new BrowserView({ webPreferences: {nodeIntegration: true} })
  mainWindow.addBrowserView(homeBrowerview)
  homeBrowerview.setBounds({ x: 0, y: 0, width, height })
  homeBrowerview.setAutoResize({ width: true, height: true })
  homeBrowerview.webContents.loadURL('http://localhost:8888/')
  // homeBrowerview.webContents.openDevTools()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
})

const createBrowerView = (arg: any) => {
  const [width, height] = mainWindow.getSize()
  if (!browserViewList[`${arg.applicationKey}`]) {
    console.log('111')
    browserViewList[`${arg.applicationKey}`] = new BrowserView({ webPreferences: {nodeIntegration: true} })
    browserViewList[`${arg.applicationKey}`].setAutoResize({ width: true, height: true })
    browserViewList[`${arg.applicationKey}`].webContents.loadURL(`${arg.applicationUrl}`)
  } else {
    if (nextRemoveBrowerView) {
      mainWindow.removeBrowserView(nextRemoveBrowerView)
    }
  }
  mainWindow.addBrowserView(browserViewList[`${arg.applicationKey}`])
  browserViewList[`${arg.applicationKey}`].setBounds({ x: 0, y: HOMEMAXHEIGHT, width, height: height - HOMEMAXHEIGHT })
  if (Object.keys(browserViewList).length > 1) {
    nextRemoveBrowerView = browserViewList[`${arg.applicationKey}`]
  }
  lastBrowerView = browserViewList[`${arg.applicationKey}`]
}

ipcMain.on('create-brower-view', (event, arg) => {
  createBrowerView(arg)
})
ipcMain.on('changetab-brower-view', (event, arg) => {
  createBrowerView(arg)
})
ipcMain.on('home-brower-view', (event, arg) => {
  if (lastBrowerView) {
    console.log(lastBrowerView, '222')
    mainWindow.removeBrowserView(lastBrowerView)
  }
  // mainWindow.addBrowserView(homeBrowerview)
})

ipcMain.on('close-brower-view', (event, arg) => {
  if (browserViewList[`${arg.applicationKey}`]) {
    mainWindow.removeBrowserView(browserViewList[`${arg.applicationKey}`])
    browserViewList[`${arg.applicationKey}`].destroy()
    delete browserViewList[`${arg.applicationKey}`]
  }
})