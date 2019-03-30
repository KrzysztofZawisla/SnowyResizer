# SnowyResizer
2KB framework to load last Windows size for electron.

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
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
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

## Syntax
```javascript
//Object declaration
const variableName = new SnowyResizer("window as string", windowObject, nedbInstance);
//Example: 
const mainWindowResizer = new SnowyResizer("mainWindow", mainWindow, db);

// Executeing size handling function in main process
variableName.resizeHandler();
//Example:
mainWindowResizer.resizeHandler();

//Executeing size handling function in renderer process
SnowyResizer.resizeCallHandler("window as string", ipcRenderer);
//Example:
SnowyResizer.resizeCallHandler("mainWindow", ipcRenderer);
```
