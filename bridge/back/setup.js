
import { ipcMain } from "electron";

import parseNativeRequest from "./parse-native-request";
import * as consts from "../src/consts";

export default mainWindow => {
    // Can't be `require`d before the app is ready
    const protocol = require("electron").protocol;
    protocol.registerStringProtocol("khan", (request, callback) => {
        const data = parseNativeRequest(request);
        mainWindow.webContents.send(
            consts.ipcKhanProtocolEvent, data);
        callback("This response is completely ignored");
    });

    mainWindow.loadURL("file://" + __dirname + "/../static/index.html");

    ipcMain.on("log", (event, args) => {
        console.log(...args);
    });
    ipcMain.on("log:warn", (event, args) => {
        console.warn(...args);
    });
    ipcMain.on("log:error", (event, args) => {
        console.error(...args);
    });
};

