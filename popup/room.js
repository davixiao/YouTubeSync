const leaveRoom = () => {
  window.location.href = './popup.html';
  chrome.browserAction.setPopup({ popup: './popup/popup.html' });
  chrome.runtime.sendMessage({
    title: 'MSG_POPUP',
    payload: null,
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('leaveRoom')
    .addEventListener('click', leaveRoom, false);
});
