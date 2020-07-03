import { BrowserView } from 'electron';
/**
 * 创建一个新的tab
 * @author blacklisten
 * @date 2020-04-17
 */
export declare class CreateNewTabs {
    mainWindow: Electron.BrowserWindow;
    browserViewList: {
        [key: string]: BrowserView;
    };
    lastBrowserView: BrowserView;
    nextRemoveBrowserView: BrowserView;
    homeBrowserview: BrowserView;
    homeMaxHeight: number;
    constructor(mainWindow: Electron.BrowserWindow, homeMaxHeight?: number);
    /**
     * 初始化程序
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    init(): void;
    getSize(): number[];
    /**
     * 销毁所有BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    destroyAllBrowserView(): void;
    /**
     * 销毁一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    destroyBrowserView(browserView: BrowserView): void;
    /**
     * 移除一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    removeBrowserView(browserView: BrowserView): void;
    addBrowserView(browserView: BrowserView): void;
    /**
     * 监听create-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    private onCreateBrowserView;
    /**
     * 监听changetab-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    private onChangeTabBrowserView;
    /**
     * 监听home-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    private onHomeBrowserView;
    /**
     * 监听close-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    private onCloseBrowserView;
    /**
     * 添加一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    private createBrowserView;
}
