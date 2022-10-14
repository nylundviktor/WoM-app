/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

getCabins = async () => {
    console.log('GET CABINS RENDERER')
    
    const cabins = await window.exposed.getCabins()
    console.log(cabins)

}
getCabins()

document.querySelector('#btn-login').addEventListener('click', async () =>{
    await window.exposed.login()
})
