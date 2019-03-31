# SnowyResizer
1KB framework to load last window's size for electron.

This library is handling window size of last launch and setup this values as initial.  
NeDB package is require. Link to npm => https://www.npmjs.com/package/nedb

## Installation
To install SnowyResizer:
```
npm i snowyresizer
```
To install NeDB:
```
npm i nedb
```

## Example of usage in main process
```javascript
const electron = require("electron");
const url = require("url");
const path = require("path");
const Datastore = require("nedb");
const SnowyResizer = require("snowyresizer");

const { app, BrowserWindow } = electron;

const db = new Datastore({
  filename: "LocalDb/globalDb.db",
  autoload: true
});

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "SnowyResizer - test",
    show: false,
    minHeight: 600,
    minWidth: 500
  });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));
  const mainWindowResizer = new SnowyResizer("mainWindow", mainWindow, db);
  mainWindow.on("ready-to-show", () => {
    mainWindowResizer.resizeHandler();
    mainWindow.show();
  });
  mainWindow.on("closed", () => {
    app.quit();
  });
});
```

## Example of usage in renderer process
```javascript
const SnowyResizer = require("snowyresizer");
const electron = require("electron");

const { ipcRenderer } = electron;

SnowyResizer.resizeCallHandler("mainWindow", ipcRenderer);
```

## Syntax
```javascript
//Object declaration
const variableName = new SnowyResizer("window as string", windowObject, NeDBInstance);
//Example: 
const mainWindowResizer = new SnowyResizer("mainWindow", mainWindow, db);

//Executing size handling function in main process
variableName.resizeHandler();
//Example:
mainWindowResizer.resizeHandler();

//Executing size handling function in renderer process
SnowyResizer.resizeCallHandler("window as string", ipcRenderer);
//Example:
SnowyResizer.resizeCallHandler("mainWindow", ipcRenderer);
```
