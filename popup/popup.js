const username = document.getElementById('username');
const roomCode = document.getElementById('roomCode');

const joinRoom = () => {
  if (username.value === '') return;
  window.location.href = './room.html';
  chrome.browserAction.setPopup({ popup: './popup/room.html' });
  chrome.runtime.sendMessage({ title: 'MSG_POPUP', payload: null });
  chrome.runtime.onMessage.addListener((req) => {
    button.innerText = req;
  });
};

const createRoom = () => {
  if (username.value === '') return;
  window.location.href = './room.html';
  chrome.browserAction.setPopup({ popup: './popup/room.html' });
  chrome.runtime.sendMessage({ title: 'MSG_POPUP', payload: null });
  chrome.runtime.onMessage.addListener((req) => {
    button.innerText = req;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('createRoom')
    .addEventListener('click', createRoom, true);

  document.getElementById('joinRoom').addEventListener('click', joinRoom, true);
});
