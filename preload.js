/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('exposed', {

  getCabins: () => ipcRenderer.invoke('get-cabins'),

  login: (data) => ipcRenderer.invoke('login', data),

  getServices: () => ipcRenderer.invoke('get-services'),

  getOrders: () => ipcRenderer.invoke('get-orders')

})
