/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. 
 * Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */


getCabins = async () => {
    const cabins = await window.exposed.getCabins()

    // show login if there are no cabins or failed to get
    if (!cabins || cabins.length == 0) {
        document.querySelector('#login').style.display = 'block' 
        return
    }

    let cabinsList = ""
    for (const cabin of cabins) {
        cabinsList += `
            <div class="cabin">${cabin.address} - ${cabin.size} m2</div>
        `
    }
    document.querySelector('#cabins').innerHTML = cabinsList

}
getCabins()

//login button
document.querySelector('#btn-login').addEventListener('click', async () => {

    document.querySelector('#login_msg').innerText = ''

    //pass on the values from login fields to preload.js (which in turn passes on to main.js)
    const login_failed = await window.exposed.login({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })

    if (login_failed) {
        document.querySelector('#login_msg').innerText = login_failed.msg
        document.querySelector('#cabins').innerHTML = ""
        return
    }

    // empty/hide cabins and login field after succesfull login
    document.querySelector('#cabins').innerHTML = ""
    document.querySelector('#login').style.display = 'none' 
    
    getCabins()
    getServices()
    getOrders()

})


getServices = async () => {
    const services = await window.exposed.getServices()

    let servicesList = ''
    for (const service of services) {
        servicesList += `
            <div class="service">${service.serviceName}</div>
        `
    }
    document.querySelector('#services').innerHTML = servicesList

}
getServices()


getOrders = async () => {
    const orders = await window.exposed.getOrders()

    let ordersList = ''
    for (const order of orders) {
        ordersList += `
            <div class="order">${order.cabinId} - ${order.date}</div>
        `
    }
    document.querySelector('#orders').innerHTML = ordersList

}
getOrders()
