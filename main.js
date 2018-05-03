const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
let APP_PATH = path.resolve(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, subWindow;

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.$ = mainWindow.jQuery = require(path.join(APP_PATH, 'jquery.min'));

    // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createSubWindow (open_url) {
    subWindow = new BrowserWindow({width: 800, height: 600, parent: mainWindow})
    subWindow.$ = subWindow.jQuery = require(path.join(APP_PATH, 'jquery.min'));

    // and load the index.html of the app.
    let baseurl = path.join(__dirname, 'newwindow.html');
    subWindow.loadURL('file://' + baseurl + '?url=' + escape(open_url));

    subWindow.on('closed', function () {
        subWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {

    // Check for a webview
    if (contents.getType() == 'webview') {

        // Listen for any new window events
        contents.on('new-window', (e, url) => {
            e.preventDefault()
            createSubWindow(url)
        })

        contents.on('close', () => {
            subWindow.close();
        })
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
