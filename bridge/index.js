#!/usr/bin/env electron
/**
 * This is the main Electron file. It creates the window & sets things up -
 * not much going on here.
 *
 * The bulk of the interesting work starts in ./src/index.js
 */

require("babel/register");

var app = require("app");
var BrowserWindow = require("browser-window");
var mainWindow = null;
var setup = require("./back/setup");
var ipcMain = require("electron").ipcMain;

app.on("window-all-closed", function() {
    app.quit();
});

app.on("ready", function() {

    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1200, height: 1000 });

    setup(mainWindow);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", function() {
        mainWindow = null;
    });

    ipcMain.on("done", function(event, errors, total) {
        app.quit();
        process.exit(errors.length === 0 ? 0 : 1);
    });
});
