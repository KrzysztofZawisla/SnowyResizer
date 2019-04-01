class SnowyResizer {
  constructor(name, windowObject, db) {
    this.name = name;
    this.windowObject = windowObject;
    this.db = db;
    this.width = 0;
    this.height = 0;
    this.fullscreen = true;
    this.screenSizeValue = null;
  }
  resizeHandler() {
    try {
      this.db.find({ name: this.name }, (err, docs) => {
        if(docs == "") {
          this.db.insert({ name: this.name, width: this.width, height: this.height, fullscreen: this.fullscreen });
        } else {
          this.fullscreen = docs[0].fullscreen;
          this.width = docs[0].width;
          this.height = docs[0].height;
          if(this.fullscreen === true) {
            this.windowObject.maximize();
          } else {
            this.windowObject.webContents.send(this.name, this.width, this.height);
          }
        }
      });
      this.windowObject.on("resize", () => {
        this.screenSizeValue = this.windowObject.getSize();
        this.width = this.screenSizeValue[0];
        this.height = this.screenSizeValue[1];
        this.fullscreen = this.windowObject.isMaximized();
        this.db.update({ name: this.name }, { $set: { width: this.width, height: this.height, fullscreen: this.fullscreen }});
      });
    }
    catch {
      console.log("Unexpected error");
    }
  }
  static resizeCallHandler(name, ipcRenderer) {
    try {
      ipcRenderer.on(name, (e, width, height) => {
        window.resizeTo(width, height);
      });
    }
    catch {
      console.log("Unexpected error");
    }
  }
}

module.exports = SnowyResizer;
