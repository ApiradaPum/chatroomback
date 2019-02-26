let express = require('express')
let bodyParser = require('body-parser')
const app = express()
let http = require('http')
let socketIO = require('socket.io')

let port = 8080
let users = [];

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const server = app.listen(port, function () {
  console.log('server running on ' + port)
})


const io = socketIO.listen(server);
io.on('connection', client => {
    console.log('user connected')  
    client.on('disconnect', () => {
        if(!client.username) return;
        users.splice(users.indexOf(client.username),1);
        updateUsernames();
        console.log('user disconnected')
    })

    client.on('sent-message', (data) => {
        io.sockets.emit('new-message', {message:data.input, user: data.username})
      //io.sockets.emit('new-message', message)
    })

    client.on('new user', (data) => {
        //callback(true)
        client.username = data.username;
        users.push(client.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

})



