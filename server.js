const path = require('path')
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Server Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room)

      socket.emit('message', formatMessage(botName,'Welcome to ChatCord!'));
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat `));

    });
    console.log(socket.id + ' has joined the chat.');

    //io.emit() will send a message to everyone

    //Listen for chat message:
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
        console.log(`${user.username} in room ${user.room} sends: `+msg)
    })

    //Runs when client disconnects
    socket.on('disconnect', () => {
        console.log(user.username + ' has left.')
        const user = userLeave(socket.id);

        if(user){
          io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log('Server running on port '+ PORT));
