/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

getCabins = async () => {
    console.log('GET CABINS RENDERER')
}
getCabins()

//login button
document.querySelector('#btn-login').addEventListener('click', async () =>{
    //pass on the values from login fields to preload.js (which in turn passes on to main.js)
    await window.exposed.login({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
})