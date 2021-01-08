// Retrieve the Youtube Player
const youtubePlayer = document.getElementsByClassName(
  'video-stream html5-main-video'
)[0];

// Chrome Extension API
// Listen for message from popup.js
chrome.runtime.onMessage.addListener((req) => {
  youtubePlayer.currentTime = req;
});
