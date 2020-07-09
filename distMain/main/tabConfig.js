"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewTabs = void 0;
var electron_1 = require("electron");
var utils_1 = require("../utils/utils");
/**
 * 创建一个新的tab
 * @author blacklisten
 * @date 2020-04-17
 */
var CreateNewTabs = /** @class */ (function () {
    function CreateNewTabs(mainWindow, homeMaxHeight) {
        if (homeMaxHeight === void 0) { homeMaxHeight = 36; }
        this.browserViewList = {}; // 用于存储买个tab标签的实例
        this.homeMaxHeight = 36; // 默认的首页tab高度
        this.mainWindow = mainWindow;
        this.homeMaxHeight = homeMaxHeight;
    }
    /**
     * 初始化程序
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    CreateNewTabs.prototype.init = function () {
        // const [width, height] = this.getSize()
        // this.homeBrowserview = new BrowserView({ webPreferences: {nodeIntegration: true} })
        // this.addBrowserView(this.homeBrowserview)
        // this.homeBrowserview.setBounds({ x: 0, y: 0, width, height })
        // this.homeBrowserview.setAutoResize({ width: true, height: true })
        // this.homeBrowserview.webContents.loadURL('http://localhost:8888/')
        // this.homeBrowserview.webContents.openDevTools()
        // 监听
        this.onCreateBrowserView();
        this.onChangeTabBrowserView();
        this.onHomeBrowserView();
        this.onCloseBrowserView();
    };
    CreateNewTabs.prototype.getSize = function () {
        return this.mainWindow.getSize();
    };
    /**
     * 销毁所有BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    CreateNewTabs.prototype.destroyAllBrowserView = function () {
        var _this = this;
        Object.keys(this.browserViewList).forEach(function (key) {
            _this.browserViewList[key].destroy();
        });
        this.browserViewList = {};
        this.lastBrowserView = null;
        this.nextRemoveBrowserView = null;
        this.homeBrowserview = null;
    };
    /**
     * 销毁一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    CreateNewTabs.prototype.destroyBrowserView = function (browserView) {
        browserView.destroy();
    };
    /**
     * 移除一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    CreateNewTabs.prototype.removeBrowserView = function (browserView) {
        this.mainWindow.removeBrowserView(browserView);
    };
    // 添加一个BrowserView
    CreateNewTabs.prototype.addBrowserView = function (browserView) {
        this.mainWindow.addBrowserView(browserView);
    };
    /**
     * 监听create-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    CreateNewTabs.prototype.onCreateBrowserView = function () {
        var _this = this;
        electron_1.ipcMain.on('create-browser-view', function (_, arg) {
            _this.createBrowserView(arg);
        });
    };
    /**
     * 监听changetab-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    CreateNewTabs.prototype.onChangeTabBrowserView = function () {
        var _this = this;
        electron_1.ipcMain.on('changetab-browser-view', function (_, arg) {
            _this.createBrowserView(arg);
        });
    };
    /**
     * 监听home-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    CreateNewTabs.prototype.onHomeBrowserView = function () {
        var _this = this;
        electron_1.ipcMain.on('home-browser-view', function () {
            if (_this.lastBrowserView) {
                _this.removeBrowserView(_this.lastBrowserView);
            }
        });
    };
    /**
     * 监听close-browser-view
     * @author blacklisten
     * @date 2020-04-17
     * @returns void
     */
    CreateNewTabs.prototype.onCloseBrowserView = function () {
        var _this = this;
        electron_1.ipcMain.on('close-browser-view', function (_, arg) {
            if (_this.browserViewList["" + arg.applicationKey]) {
                _this.removeBrowserView(_this.browserViewList["" + arg.applicationKey]);
                _this.browserViewList["" + arg.applicationKey].destroy();
                delete _this.browserViewList["" + arg.applicationKey];
            }
        });
    };
    /**
     * 添加一个BrowserView
     * @author blacklisten
     * @date 2020-04-17
     * @param {BrowserView} browserView:BrowserView
     * @returns void
     */
    CreateNewTabs.prototype.createBrowserView = function (arg) {
        var _this = this;
        var _a = this.getSize(), width = _a[0], height = _a[1];
        if (!this.browserViewList["" + arg.applicationKey]) {
            this.browserViewList["" + arg.applicationKey] = new electron_1.BrowserView({ webPreferences: { nodeIntegration: true } });
            this.browserViewList["" + arg.applicationKey].setAutoResize({ width: true, height: true });
            this.browserViewList["" + arg.applicationKey].webContents.loadURL("" + arg.applicationUrl);
        }
        else {
            if (this.nextRemoveBrowserView) {
                this.removeBrowserView(this.nextRemoveBrowserView);
            }
        }
        this.addBrowserView(this.browserViewList["" + arg.applicationKey]);
        this.browserViewList["" + arg.applicationKey].setBounds({ x: 0, y: this.homeMaxHeight, width: width, height: height - this.homeMaxHeight });
        if (Object.keys(this.browserViewList).length > 1) {
            this.nextRemoveBrowserView = this.browserViewList["" + arg.applicationKey];
        }
        this.lastBrowserView = this.browserViewList["" + arg.applicationKey];
        electron_1.globalShortcut.register('Shift+V', function () {
            utils_1.DEVTOOLS(_this.lastBrowserView);
        });
    };
    return CreateNewTabs;
}());
exports.CreateNewTabs = CreateNewTabs;
//# sourceMappingURL=tabConfig.js.map