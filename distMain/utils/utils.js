"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVTOOLS = void 0;
exports.DEVTOOLS = function (win) {
    var isOpen = win.webContents.isDevToolsOpened();
    if (isOpen) {
        win.webContents.closeDevTools();
    }
    else {
        win.webContents.openDevTools();
    }
};
//# sourceMappingURL=utils.js.map