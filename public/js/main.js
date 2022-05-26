const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')

const socket = io();

// Get usernmae and room from url
const { username, room }= Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


// Join chatroom
socket.emit('joinRoom', {username, room})

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message =>{
    console.log(message);
    outputMessage(message);


    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get message text
    const msg = e.target.elements.msg.value;

    document.querySelector('#msg').value = '';

    //Emitting message to server
    socket.emit('chatMessage', msg)
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="meta">'+message.username+' <span>'+message.time+'</span></p>'+message.text+'<p class="text"></p>';
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
  roomName.innerTest = room
}

//Add user to DOM

function outputUsers(users){
  userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}
