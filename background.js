globalThis.name = chrome.runtime.getManifest().short_name;

async function sendNativeMessage(message) {
  // let jshelp;
  return new Promise((resolve, reject) => {
    globalThis.port = chrome.runtime.connectNative(globalThis.name);
    port.onMessage.addListener((message) => {
      // if (!jshelp) {
      //  jshelp = new TextDecoder().decode(new Uint8Array(message));
      // } else {
        // console.log(`\x1B[38;2;0;0;255;1m${jshelp}`);
        resolve(message);
        port.disconnect();
      // }
    });
    port.onDisconnect.addListener(() => {
      reject(chrome.runtime.lastError);
    });
    port.postMessage(message);
    // Hack to get the message echoed back from SpiderMonkey shell
    // TODO: Make this persistent, comparable to JavaScript runtimes
    port.postMessage("\r\n\r\n");
  });
}

globalThis.sendNativeMessage = sendNativeMessage;

sendNativeMessage(new Array(209715)).then(console.log).catch(console.error);