// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron'),
  path = require('path'),
  fetch = require('electron-fetch').default,
  Store = require('electron-store'),  // 'localstorage' for electron
  store = new Store()

require('dotenv').config()

console.log(process.env.DOTENV_TEST)
const CABIN_API_URL = process.env.CABIN_API_URL
const SERVICE_API_URL = process.env.SERVICE_API_URL

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
  //mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {
  createWindow()
  // Check original template for MacOS stuff!
})


//Login function
ipcMain.handle('login', async (event, data) => {
  try {
    const resp = await fetch(CABIN_API_URL + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 3000
    })
    const user = await resp.json()

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
  try {
    const resp = await fetch(SERVICE_API_URL + '/cabins', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 3000
    })
    const cabins = await resp.json()
    if (resp.status > 201) {
      return false
    }

    return cabins

  } catch (error) {
    console.log(error.message)
    return false
  }
})

// Get services
ipcMain.handle('get-services', async () => {
  try {
    const resp = await fetch(SERVICE_API_URL + '/services', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 3000
    })

    const services = await resp.json()
    if (resp.status > 201) return false
    return services

  } catch (error) {
    console.log(error.message)
    return false
  }
})

// Get bookings
ipcMain.handle('get-orders', async () => {
  try {
    const resp = await fetch(SERVICE_API_URL + '/orders', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 3000
    })

    const orders = await resp.json()
    if (resp.status > 201) return false
    return orders

  } catch (error) {
    console.log(error.message)
    return false
  }
})


app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})
