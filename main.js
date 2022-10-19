// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron'),
  path = require('path'),
  fetch = require('electron-fetch').default,
  Store = require('electron-store'),  // 'localstorage' for electron
  store = new Store()

require('dotenv').config()

console.log(process.env.DOTENV_TEST)
const API_URL = process.env.CABIN_API_URL

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

    // failed login
    if (resp.status > 201) return user
    // successfull login
    // TODO: check if exists
    store.set('jwt', user.token)
    // login failed = false -> get cabins
    return false

  } catch (error) {
    console.log(error.message)
    return {'msg': 'Failed to log in.'}
  }
})

// Get cabins
ipcMain.handle('get-cabins', async () => {
  console.log('main, get cabins')
  try {
    const resp = await fetch(API_URL + '/cabins', { // TODO: CHANGE TO CORRECT URL
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 3000
    })

    const cabins = await resp.json()
    if (resp.status > 201) return false
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
