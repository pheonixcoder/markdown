const { ipcRenderer } = require('electron')

const openFile = (filename) => {
  ipcRenderer.send('open-document', filename)
}