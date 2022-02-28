const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generatemsg, generatelocationmsg } = require('./utils/message')
const { addusers,
    removeusers,
    getusers,
    getusersbyroom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000
const pdpath = path.join(__dirname, '../public')
app.use(express.static(pdpath))



io.on('connection', (socket) => {

    // console.warn('new connection')
    // for send msg


    // for join message reciving
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addusers({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('wlcmesg', generatemsg('admin','Welcome!'))
        socket.broadcast.to(user.room).emit('wlcmesg', generatemsg('admin',`${user.username} has joined !`))
        io.to(user.room).emit('roomdata',{
            room: user.room,
            users:getusersbyroom(user.room)
        })
        callback()
    })
    // for recieving msg
    socket.on('sendmsg', (m, callback) => {
        const user = getusers(socket.id)
        io.to(user.room).emit('wlcmesg', generatemsg(user.username,m))
        callback()
    })

    // for disconnecting message
    socket.on('disconnect', () => {
        const user = removeusers(socket.id)
        if (user) {
            io.to(user.room).emit('wlcmesg', generatemsg('admin',`${user.username} has left!`))
            io.to(user.room).emit('roomdata',{
                room: user.room,
                users:getusersbyroom(user.room)
            })
        }

    })
    // for location send (recieve)
    socket.on('sendlocation', (l, callback) => {
        const user = getusers(socket.id)
        io.to(user.room).emit('locationmesg', generatelocationmsg(user.username,`https://google.com/maps?q=${l.latitude},${l.longitude}`))
        callback()
    })

})
server.listen(port, () => {
    console.log('server is on')
})
