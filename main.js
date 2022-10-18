// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

//move to dotenv,
const API_URL = "https://nylund-svarvar.azurewebsites.net"

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true // true to hide, press Alt to show when hidden
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

//Login function
ipcMain.handle('login', async (event, data) => {
  //log just to see if function runs
  console.log('login (main)')
  try {
    const resp = await fetch(API_URL + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 3000
    })
    const user = await resp.json()
    console.log(user)
    if (resp.status > 201) return false

    return true

  } catch (error) {
    console.log(error.message)
    return false
  }
})

// Get cabins
ipcMain.handle('get-cabins', async () => {
  console.log('main, get cabins')

  try {
    const res = await fetch(API_URL + '/cabins', {
      timeout: 3000
    })
  
    const cabins = await res.json()
    return cabins

  } catch (error) {
    console.log(error.message)
    return false
  }
})


// Example 
// Node sends comment to the browser, renderer.js
ipcMain.handle('get-stuff-from-main', () => 'Main says something')
// The browser sends comment to node, main.js
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))


app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})
