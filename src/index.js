import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import {readFileSync} from 'fs'
import * as showdown from 'showdown'

let converter = new showdown.Converter();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let documents = []

ipcMain.on('open-document', (event, filename) => {
  console.log('open-document', filename)
  if (filename === 'new') {
    let files = dialog.showOpenDialog({properties: ['openFile']})
    if (files && files.length === 1) {
      const fileContents = readFileSync(files[0], 'utf-8')
      filename = `data:text/html,<html>
    <body>
      Hello world
      <hr />
      ${converter.makeHtml(fileContents)}
    </body>
  </html>`
    }
  }
  openDocument(filename)
})

const createWindow = () => {
  let filename = `file://${__dirname}/index.html`
  console.log('Process ', process.argv)

  openDocument(filename);
};

const openDocument = (filename) => {
  // Create the browser window.
  let newDoc = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  newDoc.loadURL(filename);

  // Open the DevTools.
  // newDoc.webContents.openDevTools();

  // Emitted when the window is closed.
  newDoc.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    newDoc = null;
  });

  documents.push(newDoc);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (documents.length > 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
