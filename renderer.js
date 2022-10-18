/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. 
 * Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

getCabins = async () => {
    console.log('renderer, get cabins')
    
    const cabins = await window.exposed.getCabins()
    console.log(cabins)

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
