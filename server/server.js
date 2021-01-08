const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {
  clientJoin,
  getCurrentClient,
  clientLeave,
  getRoomClients,
} = require('./clients.js');

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
    socket.broadcast
      .to(client.room)
      .emit('roomMessage', `${client.username} has joined ${client.room}.`);
    io.to(client.room).emit('roomMessage', getRoomClients(client.room));
  });

  // Every 5 seconds, request for timecode from room leader.
  // setInterval(() => {
  //   console.log('sent time request to room leader');
  //   io.to(clients[0].id).emit('requestTime');
  // }, 10000);

  socket.on('sendTime', ({ currentTime }) => {
    console.log('received time request from: ', socket.id, currentTime);
    satisfiedRequests.push(currentTime);
    console.log('array length: ', satisfiedRequests.length);
    console.log('sockets length: ', sockets.length);
    if (isSatisfied()) {
      console.log('sent new time:', calcAvgTime());
      io.emit('adjustTime', calcAvgTime());
      satisfiedRequests = [];
    }
  });

  socket.on('_skip', (payload) => {
    //socket.broadcast.emit('server_skip', payload);
    console.log('user skipped to', payload);
  });

  socket.on('_pause', (payload) => {
    //socket.broadcast.emit('server_pause', payload);
    console.log('paused?', payload);
  });

  socket.on('disconnect', () => {
    const client = clientLeave(socket.id);
    if (client) {
      io.to(client.room).emit('roomMessage', `${client.username} has left.`);
      io.to(client.room).emit('roomMessage', getRoomClients(client.room));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
