// modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

// file imports
const {
  clientJoin,
  getCurrentClient,
  clientLeave,
  getRoomClients,
  clients,
} = require('./utils/clients.js');

const {
  roomExists,
  getRoomFromUser,
  addRoom,
  addUserToRoom,
  removeUserFromRoom,
  roomsSize,
  getLeader,
  rooms,
} = require('./utils/rooms.js');

// server setup
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'chrome-extension://kmgehjafppoflmeeimcegnacppejngca',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Page display
app.get('/', (req, res) => {
  res.send('Youtube Sync Server');
});

// Run when client connects
io.on('connection', (socket) => {
  socket.emit('serverMessage', 'CONNECTED TO SERVER');

  // When user joins the room
  socket.on('joinRoom', ({ username, room }) => {
    // Either create a new room or user joins room.
    if (!roomExists(room)) {
      socket.emit('isLeader');
      addRoom(room, socket.id);
    } else {
      addUserToRoom(room, socket.id);
    }

    // Store the user/client and put them in room
    const client = clientJoin(socket.id, username, room);
    socket.join(client.room);

    // tell user they have connected
    socket.emit('roomMessage', 'CONNECTED TO ROOM');

    // tell user who the room leader is:
    socket.emit('newLeader', getCurrentClient(getLeader(room)).username);

    // tell other room users that user has connected
    socket.broadcast
      .to(client.room)
      .emit('roomMessage', `${client.username} has joined ${client.room}.`);
  });

  // when user leaves the room
  socket.on('leaveRoom', () => {
    const room = getRoomFromUser(socket.id);
    socket.leave(room);
    removeUserFromRoom(room, socket.id);
    if (roomExists(room)) {
      io.to(getLeader(room)).emit('isLeader');
      // tell user who the room leader is:
      socket.broadcast
        .to(room)
        .emit('newLeader', getCurrentClient(getLeader(room)).username);
      io.to(room).emit(
        'roomMessage',
        `${getCurrentClient(socket.id).username} has left.`
      );
    }
    clientLeave(socket.id);
  });

  // Every 5 seconds, request for timecode from room leader.
  setInterval(() => {
    if (getRoomFromUser(socket.id)) {
      io.to(getLeader(getRoomFromUser(socket.id))).emit('requestTime');
    }
  }, 5000);

  // receive new timecode from party leader
  socket.on('sendTime', (payload) => {
    socket.broadcast.to(getRoomFromUser(socket.id)).emit('adjustTime', payload);
  });

  // when party leader sends a pause
  socket.on('_pause', (payload) => {
    socket.broadcast
      .to(getRoomFromUser(socket.id))
      .emit('server_pause', payload);
  });

  // user force disconnect
  socket.on('disconnect', () => {
    const client = clientLeave(socket.id);
    if (client) {
      removeUserFromRoom(client.room, socket.id);
      if (roomExists(client.room)) {
        io.to(getLeader(client.room)).emit('isLeader');
        // tell user who the room leader is:
        socket.broadcast
          .to(client.room)
          .emit('newLeader', getCurrentClient(getLeader(client.room)));
        io.to(client.room).emit('roomMessage', `${client.username} has left.`);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
