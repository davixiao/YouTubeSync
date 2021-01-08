const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Page display
app.get('/', (req, res) => {
  res.send('Youtube Sync Server');
});

let sockets = [];

// Run when client connects
io.on('connection', (socket) => {
  //sockets.push(socket);
  //console.log(sockets.length);
  socket.emit('joinRoom', 'CONNECTED TO SERVER');

  // Every 5 seconds, check if users are in sync.
  setInterval(() => {
    socket.emit('requestTime');
  }, 5000);

  socket.on('sendTime', (currentTime) => {
    console.log(socket.id, ':', currentTime);
  });

  socket.on('_skip', (payload) => {
    //socket.broadcast.emit('server_skip', payload);
    console.log('user skipped to', payload);
  });

  socket.on('_pause', (payload) => {
    //socket.broadcast.emit('server_pause', payload);
    console.log('paused?', payload);
  });

  socket.on('_disconnect', () => {
    //console.log('user disconnected');
    socket.disconnect();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
