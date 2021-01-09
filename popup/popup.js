const username = document.getElementById('username');
const roomCode = document.getElementById('roomCode');

const joinRoom = () => {
  // error check
  if (username.value === '' || roomCode.value === '') return;

  // change popup window
  window.location.href = './room.html';
  chrome.browserAction.setPopup({ popup: './popup/room.html' });

  chrome.runtime.sendMessage({
    title: 'MSG_POPUP',
    payload: { username: username.value, room: roomCode.value },
  });
  // chrome.runtime.onMessage.addListener((req) => {
  //   button.innerText = req;
  // });
};

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('joinRoom')
    .addEventListener('click', joinRoom, false);
});
