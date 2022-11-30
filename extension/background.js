chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, {
      message: 'TabUpdated'
    });
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const authTokenHeader = details.requestHeaders.find((reqHeader) => reqHeader.name === "authorization");
    if (!authTokenHeader || !authTokenHeader.value){
      return;
    }

    if (authTokenHeader.value.includes("%3D")){
      chrome.cookies.set({
        url: 'https://twitter.com/*',
        name: "search_extension_auth_token",
        value: authTokenHeader.value
      });
    }
  },
  {
    urls: [ "https://twitter.com/*" ]
  },
  ['requestHeaders']
);