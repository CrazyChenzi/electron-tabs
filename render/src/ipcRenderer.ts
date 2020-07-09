const { remote, ipcRenderer, webFrame } = (window as any).require('electron')
// import { remote, ipcRenderer, webFrame } from 'electron'

// 禁止用户缩放
webFrame.setZoomFactor(1)
webFrame.setVisualZoomLevelLimits(1, 1)

/**
 * 改变BrowserView状态
 * @param msg 信息key
 * @param options 信息参数
 */
export const sendChangeBrowserView = (msg = 'create-browser-view', options: {applicationKey: string, applicationUrl: string}): void => {
  ipcRenderer.send(msg, options)
}

export const sendBrowserWindowHeader = (msg = '', options = {}) => {
  ipcRenderer.send(msg, options)
}

/**
 * 获取回调信息
 * @param callback
 */
export const getIpcMainMessage = (callback: (event: any, {message, data}: any) => {}) => {
  ipcRenderer.on('message', (event: any, {message, data}: any) => {
    callback(event, {message, data})
  })
}

// 最小化客户端
export const minimize = (): void => {
  remote.BrowserWindow.getFocusedWindow()!.minimize()
}

// 最大化客户端
export const maximize = (): void => {
  if (!remote.BrowserWindow.getFocusedWindow()!.isMaximized()) {
    remote.BrowserWindow.getFocusedWindow()!.maximize()
  } else {
    remote.BrowserWindow.getFocusedWindow()!.unmaximize()
  }
}

// 关闭客户端
export const close = (): void => {
  remote.BrowserWindow.getFocusedWindow()!.close()
}
