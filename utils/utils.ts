import { BrowserView, BrowserWindow } from 'electron'

export const DEVTOOLS = (win: BrowserView | BrowserWindow) => {
  const isOpen = win.webContents.isDevToolsOpened()
  if (isOpen) {
    win.webContents.closeDevTools()
  } else {
    win.webContents.openDevTools()
  }
}
