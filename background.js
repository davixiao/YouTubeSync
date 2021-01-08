const checkURL = (url) => {
  return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
};

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    if (checkURL(current_tab_info.url)) {
      chrome.tabs.executeScript(null, { file: './content.js' });
    }
  });
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url && checkURL(changeInfo.url)) {
    chrome.tabs.executeScript(null, { file: './content.js' });
  }
});
