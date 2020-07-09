
import { BrowserView, ipcMain, globalShortcut } from 'electron'
import { DEVTOOLS } from '../utils/utils'

/**
 * 创建一个新的tab
 * @author blacklisten
 * @date 2020-04-17
 */
export class CreateNewTabs {
  public mainWindow: Electron.BrowserWindow // 主窗口的实例
  public browserViewList: {[key: string]: BrowserView} = {}  // 用于存储买个tab标签的实例
  public lastBrowserView: BrowserView  // 上一个被选中的标签页
  public nextRemoveBrowserView: BrowserView  // 当存在两个以上标签页(包含首页)时，下一次切换需要移除的标签页
  public homeBrowserview: BrowserView  // 首页的browserview
  public homeMaxHeight = 36 // 默认的首页tab高度

  constructor(mainWindow: Electron.BrowserWindow, homeMaxHeight = 36) {
    this.mainWindow = mainWindow
    this.homeMaxHeight = homeMaxHeight
  }
  /**
   * 初始化程序
   * @author blacklisten
   * @date 2020-04-17
   * @returns void
   */
  public init(): void {
    // const [width, height] = this.getSize()
    // this.homeBrowserview = new BrowserView({ webPreferences: {nodeIntegration: true} })
    // this.addBrowserView(this.homeBrowserview)
    // this.homeBrowserview.setBounds({ x: 0, y: 0, width, height })
    // this.homeBrowserview.setAutoResize({ width: true, height: true })
    // this.homeBrowserview.webContents.loadURL('http://localhost:8888/')
    // this.homeBrowserview.webContents.openDevTools()

    // 监听
    this.onCreateBrowserView()
    this.onChangeTabBrowserView()
    this.onHomeBrowserView()
    this.onCloseBrowserView()
  }
  public getSize(): number[] {
    return this.mainWindow.getSize()
  }

  /**
   * 销毁所有BrowserView
   * @author blacklisten
   * @date 2020-04-17
   * @param {BrowserView} browserView:BrowserView
   * @returns void
   */
  public destroyAllBrowserView(): void {
    Object.keys(this.browserViewList).forEach((key) => {
      this.browserViewList[key].destroy()
    })
    this.browserViewList = {}
    this.lastBrowserView = null
    this.nextRemoveBrowserView = null
    this.homeBrowserview = null
  }
  /**
   * 销毁一个BrowserView
   * @author blacklisten
   * @date 2020-04-17
   * @param {BrowserView} browserView:BrowserView
   * @returns void
   */
  public destroyBrowserView(browserView: BrowserView): void {
    browserView.destroy()
  }
  /**
   * 移除一个BrowserView
   * @author blacklisten
   * @date 2020-04-17
   * @param {BrowserView} browserView:BrowserView
   * @returns void
   */
  public removeBrowserView(browserView: BrowserView): void {
    this.mainWindow.removeBrowserView(browserView)
  }
  // 添加一个BrowserView
  public addBrowserView(browserView: BrowserView): void {
    this.mainWindow.addBrowserView(browserView)
  }

  /**
   * 监听create-browser-view
   * @author blacklisten
   * @date 2020-04-17
   * @returns void
   */
  private onCreateBrowserView(): void {
    ipcMain.on('create-browser-view', (_, arg) => {
      this.createBrowserView(arg)
    })
  }

  /**
   * 监听changetab-browser-view
   * @author blacklisten
   * @date 2020-04-17
   * @returns void
   */
  private onChangeTabBrowserView(): void {
    ipcMain.on('changetab-browser-view', (_, arg) => {
      this.createBrowserView(arg)
    })
  }
  /**
   * 监听home-browser-view
   * @author blacklisten
   * @date 2020-04-17
   * @returns void
   */
  private onHomeBrowserView(): void {
    ipcMain.on('home-browser-view', () => {
      if (this.lastBrowserView) {
        this.removeBrowserView(this.lastBrowserView)
      }
    })
  }

  /**
   * 监听close-browser-view
   * @author blacklisten
   * @date 2020-04-17
   * @returns void
   */
  private onCloseBrowserView(): void {
    ipcMain.on('close-browser-view', (_, arg) => {
      if (this.browserViewList[`${arg.applicationKey}`]) {
        this.removeBrowserView(this.browserViewList[`${arg.applicationKey}`])
        this.browserViewList[`${arg.applicationKey}`].destroy()
        delete this.browserViewList[`${arg.applicationKey}`]
      }
    })
  }
  /**
   * 添加一个BrowserView
   * @author blacklisten
   * @date 2020-04-17
   * @param {BrowserView} browserView:BrowserView
   * @returns void
   */
  private createBrowserView(arg: any): void {
    const [width, height] = this.getSize()
    if (!this.browserViewList[`${arg.applicationKey}`]) {
      this.browserViewList[`${arg.applicationKey}`] = new BrowserView({ webPreferences: {nodeIntegration: true} })
      this.browserViewList[`${arg.applicationKey}`].setAutoResize({ width: true, height: true })
      this.browserViewList[`${arg.applicationKey}`].webContents.loadURL(`${arg.applicationUrl}`)
    } else {
      if (this.nextRemoveBrowserView) {
        this.removeBrowserView(this.nextRemoveBrowserView)
      }
    }
    this.addBrowserView(this.browserViewList[`${arg.applicationKey}`])
    this.browserViewList[`${arg.applicationKey}`].setBounds({ x: 0, y: this.homeMaxHeight, width, height: height - this.homeMaxHeight })
    if (Object.keys(this.browserViewList).length > 1) {
      this.nextRemoveBrowserView = this.browserViewList[`${arg.applicationKey}`]
    }
    this.lastBrowserView = this.browserViewList[`${arg.applicationKey}`]
    globalShortcut.register('CmdOrCtrl+Alt+V', () => {
      DEVTOOLS(this.lastBrowserView)
    })
  }
}
