// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: false // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {


  createWindow()

  // Check original template for MacOS stuff!
})

ipcMain.handle('get-cabins', async () => {
  console.log('main, get cabins')

  const resp = await fetch('http://localhost:3101' + '/cabins', {
    timeout: 3000
  })

  const cabins = await resp.json()

})

// Example functions for communication between main and renderer (backend/frontend)
// Node sends comment to the browser, renderer.js
//ipcMain.handle('get-stuff-from-main', () => 'Main says something')
// The browser sends comment to node, main.js
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))


app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})


