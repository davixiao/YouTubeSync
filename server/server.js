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

// keep track of satisfied time requests
let satisfiedRequests = [];

const isSatisfied = () => {
  return satisfiedRequests.length === sockets.length;
  //return satisfiedRequests.every((req) => req.returned === true);
};

const calcAvgTime = () => {
  return (
    satisfiedRequests.reduce((acc, vidTime) => acc + vidTime) /
    satisfiedRequests.length
  );
};

// Run when client connects
io.on('connection', (socket) => {
  sockets.push(socket);
  //console.log(sockets.length);
  socket.emit('joinRoom', 'CONNECTED TO SERVER');

  // Every 5 seconds, check if users are in sync.
  setInterval(() => {
    console.log('sent time request');
    socket.emit('requestTime');
  }, 10000);

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

  socket.on('_disconnect', () => {
    //console.log('user disconnected');
    socket.disconnect();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
