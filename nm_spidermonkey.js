#!/usr/bin/env -S JS_STDERR=err.txt /home/user/.jsvu/spidermonkey/spidermonkey
// /home/user/bin/js
// SpiderMonkey Shell Native Messaging host (W.I.P.)
// guest271314 7-7-2023, 6-16-2024

function encodeMessage(str) {
    return new Uint8Array([...str].map((s) => s.codePointAt()));
  }
  // Call readline() twice to catch `\r\n\r\n"`
  let done = false;
  
  function getMessage() {
    const stdin = readline();
    const data = encodeMessage(stdin); // new Uint8Array([...stdin].map((s) => s.codePointAt()));
    const view = new DataView(data.buffer);
    const length = view.getUint32(0, true);
    const message = data.subarray(4);
    if (done) {
      return void 0;
    }
    if (!done) {
      // https://stackoverflow.com/a/52434176
      // const previous = redirect("length.txt");
      // putstr(`${length}`);
      // redirect(previous); // restore the redirection to stdout
      // os.file.writeTypedArrayToFile("input.txt", message);
      done = true;
      return message;
    }
  }
  
  function sendMessage(message) {
    os.file.writeTypedArrayToFile(
      "/proc/self/fd/1",
      new Uint32Array([message.length]),
    );
    os.file.writeTypedArrayToFile("/proc/self/fd/1", message);
  }
  
  function main() {
    // Send help() to client
    // const previous = redirect("help.txt");
    // putstr(help());
    // redirect(previous); // restore the redirection to stdout
    // const h = read("help.txt", "binary");
    // sendMessage(encodeMessage(JSON.stringify([...h])));
    // TODO: Make this persistent, comparable to JavaScript runtimes
    while (true) {
      const message = getMessage();
      if (message) {
        sendMessage(message);
      } else {
        break;
      }
    }
  }
  
  try {
    main();
  } catch (e) {
    os.file.writeTypedArrayToFile(
      "caught.txt",
      encodeMessage(JSON.stringify(e.message)),
    );
    quit();
  }
  