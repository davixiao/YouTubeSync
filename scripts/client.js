//const socket = io('localhost:3000');
const socket = io.connect('http://localhost:3000');
socket.on('message', (msg) => {
  console.log(msg);
  socket.emit('test', 'from the client');
});

let run = false;
let change = 0;

const msgFront = () => {
  //chrome.runtime.sendMessage('test');
  // Chrome Extension API
  // Look through available tabs for active tab
  if (!run) return;
  change += 10;
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    // tabs parameter should only have one element: the active tab
    chrome.tabs.sendMessage(tabs[0].id, change);
  });
};

chrome.runtime.onMessage.addListener(({ title, payload }) => {
  console.log(title);
  switch (title) {
    case 'MSG_POPUP':
      run = !run;
      break;
    case 'MSG_TIMESKIP':
      socket.emit('_skip', payload);
      break;
    case 'MSG_PAUSE':
      socket.emit('_pause', payload);
      break;
  }
});

setInterval(msgFront, 5000);
