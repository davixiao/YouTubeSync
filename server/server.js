const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  clientJoin,
  getCurrentClient,
  clientLeave,
  getRoomClients,
} = require('./utils/clients.js');

const {
  roomExists,
  getRoomFromUser,
  addRoom,
  addUserToRoom,
  removeUserFromRoom,
  roomsSize,
  getLeader,
} = require('./utils/rooms.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Page display
app.get('/', (req, res) => {
  res.send('Youtube Sync Server');
});

// Run when client connects
io.on('connection', (socket) => {
  socket.emit('serverMessage', 'CONNECTED TO SERVER');

  socket.on('joinRoom', ({ username, room }) => {
    const client = clientJoin(socket.id, username, room);

    socket.join(client.room);
    socket.emit('roomMessage', 'CONNECTED TO ROOM');
    if (!roomExists(room)) {
      socket.emit('isLeader');
      addRoom(room, socket.id);
    } else {
      addUserToRoom(room, socket.id);
    }
    socket.broadcast
      .to(client.room)
      .emit('roomMessage', `${client.username} has joined ${client.room}.`);
  });

  // Every 10 seconds, request for timecode from room leader.
  setInterval(() => {
    io.to(getLeader(getRoomFromUser(socket.id))).emit('requestTime');
  }, 5000);

  // receive message from party leader
  socket.on('sendTime', (currentTime) => {
    socket.broadcast
      .to(getRoomFromUser(socket.id))
      .emit('adjustTime', currentTime);
    //console.log('received time request from: ', socket.id, currentTime);
  });

  socket.on('_pause', (payload) => {
    socket.broadcast
      .to(getRoomFromUser(socket.id))
      .emit('server_pause', payload);
    //console.log('paused?', payload);
  });

  socket.on('disconnect', () => {
    const client = clientLeave(socket.id);
    removeUserFromRoom(client.room, socket.id);
    if (client && roomExists(client.room)) {
      io.to(getLeader(client.room)).emit('isLeader');
      io.to(client.room).emit('roomMessage', `${client.username} has left.`);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
