const { remote, ipcRenderer, webFrame } = (window as any).require('electron')

export const sendChangeBrowerView = (msg = 'create-brower-view', options: {applicationKey: string, applicationUrl: string}): void => {
  ipcRenderer.send(msg, options)
}

export const getIpcMainMessage = (callback: (event: any, {message, data}: any) => {}) => {
  ipcRenderer.on('message', (event: any, {message, data}: any) => {
    callback(event, {message, data})
  })
}