module.exports = (server) => {
    const io = require('socket.io')(server)
    io.on('connection', (socket) => {
        socket.on('sendMsg', (data) => {
            console.log(data)
            io.emit('cbMsg', 'receive')
        })
    })
}