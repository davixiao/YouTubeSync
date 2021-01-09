// const socket = io('http://localhost:3000');
const socket = io.connect('http://localhost:3000');

let run = false;
let isLeader = false;

socket.on('serverMessage', (msg) => {
  console.log(msg);
});

socket.on('roomMessage', (msg) => {
  console.log(msg);
});

socket.on('isLeader', () => {
  //console.log('became leader');
  isLeader = true;
});

socket.on('server_pause', (toPause) => {
  if (!isLeader) {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      // tabs parameter should only have one element: the active tab
      if (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          title: 'setPause',
          payload: toPause,
        });
      }
    });
  }
});
//
socket.on('adjustTime', (newTime) => {
  if (!isLeader) {
    if (newTime) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        // tabs parameter should only have one element: the active tab
        if (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            title: 'setTime',
            payload: newTime,
          });
        }
      });
    }
  }
});

const getTime = (currentTime) => {
  //console.log('sent time request: ', currentTime);
  socket.emit('sendTime', currentTime);
};

socket.on('requestTime', () => {
  //console.log('Received time request');
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    // tabs parameter should only have one element: the active tab
    if (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { title: 'getTime', payload: null },
        getTime
      );
    }
  });
});

chrome.runtime.onMessage.addListener(({ title, payload }) => {
  switch (title) {
    case 'MSG_POPUP':
      run = !run;
      if (run) {
        socket.emit('joinRoom', payload); //{ username: 'David', room: 'test' });
      } else {
        isLeader = false;
        socket.emit('leaveRoom');
      }

      break;
    case 'MSG_TIMESKIP':
      if (isLeader) {
        //console.log('sent a timeskip request', payload);
        socket.emit('sendTime', payload);
      }
      break;
    case 'MSG_PAUSE':
      if (isLeader) {
        //console.log('sent a pause request');
        socket.emit('_pause', payload);
      }
      break;
  }
});

//setInterval(msgFront, 5000);
