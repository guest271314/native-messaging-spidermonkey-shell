globalThis.name = chrome.runtime.getManifest().short_name;

globalThis.port = chrome.runtime.connectNative(globalThis.name);

port.onMessage.addListener((message) => {
  console.log(message);
});

port.onDisconnect.addListener(() => {
  console.log(chrome.runtime.lastError);
});

globalThis.postNativeMessage = (message) => {
  port.postMessage(message);
  // SpiderMonkey shell won't close STDIN without this trailing newline
  port.postMessage("\r\n\r\n");
};

postNativeMessage(Array(209715));
