// elements for form
const msgform = document.querySelector('#myform')
const msginput = msgform.querySelector('input')
const msgbutton = msgform.querySelector('button')
const lbutton = document.querySelector('#mybtn')
const msg = document.querySelector('#message')

// templets
const msgtemp = document.querySelector('#msg-tem').innerHTML
const msgtemp2 = document.querySelector('#msg-tem2').innerHTML
const sidebartemp = document.querySelector('#msg-tem3').innerHTML

// options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

// autoscroll
const autoscroll = () =>{
    // for new message
    const newmsg = msg.lastElementChild
    // height of new message
    const newmsgstyle = getComputedStyle(newmsg)
    const newmsgmargin = parseInt(newmsgstyle.marginBottom)
    const newmsgheight = newmsg.offsetHeight + newmsgmargin
    // visible height
    const visibleheight = msg.offsetHeight
    // container height
    const containerheight = msg.scrollHeight
    const scrolloffset = msg.scrollTop + visibleheight
    if(containerheight - newmsgheight <= scrolloffset){
        msg.scrollTop = msg.scrollHeight
    }
}

// for recieving server message
const socket = io()
socket.on('wlcmesg', (m) => {
    console.warn(m)
    const html = Mustache.render(msgtemp,{
        username:m.username,
        message:m.text,
        createdAt:moment(m.createdAt).format('h:mm A')
    })
    msg.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
// for recieving location message
socket.on('locationmesg',(l)=>{
    console.log(l)
    const html = Mustache.render(msgtemp2,{
        username:l.username,
        url:l.url,
        createdAt:moment(l.createdAt).format('h:mm A')
    })
    msg.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
// for room data
socket.on('roomdata',({room,users})=>{
    const html = Mustache.render(sidebartemp,{
        room,
        users
    })
    document.querySelector('#mysidebar').innerHTML = html
})

// for sending message to server
msgform.addEventListener('submit', (e) => {
    e.preventDefault()
    msgbutton.setAttribute('disabled', 'disabled')
    const msg = msginput.value
    socket.emit('sendmsg', msg, () => {
        msgbutton.removeAttribute('disabled')
        msginput.value = ' '
        msginput.focus()
        console.log('The message is sent')
    })
})

// for sending location to server
lbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('you do not have support for this function! kindly update your browser ')
    }
    lbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendlocation', location, () => {
            lbutton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})
// for username and room send to server
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})


// socket.on('countupdate',(count)=>{
//     console.warn('this is from client side and count is updated',count)
// })
// document.querySelector('#mybtn').addEventListener('click',()=>{
//     // count = count +1
//     console.log('clicked')
//     socket.emit('increment')
// })