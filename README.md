SpiderMonkey JavaScript and WebAssembly engine Shell Native Messaging Host

Installation and usage on Chrome and Chromium

1. Navigate to `chrome://extensions`.
2. Toggle `Developer mode`.
3. Click `Load unpacked`.
4. Select native-messaging-spidermoney-shell folder.
5. Note the generated extension ID.
6. Open `nm_spidermonkey.json` in a text editor, set `"path"` to absolute path of `nm_spidermonkey.js` and `chrome-extension://<ID>/` using ID from 5 in `"allowed_origins"` array. 
7. Copy the file to Chrome or Chromium configuration folder, e.g., Chromium on \*nix `~/.config/chromium/NativeMessagingHosts`; Chrome dev channel on \*nix `~/.config/google-chrome-unstable/NativeMessagingHosts`; and similar for Chrome For Testing.
8. Make sure `nm_spidermonkey.js` is executable. To download SpiderMonkey shell
```
wget --show-progress \
--progress=bar \
--output-document jsshell.zip \
https://archive.mozilla.org/pub/firefox/nightly/latest-mozilla-central/jsshell-linux-x86_64.zip \
&& unzip jsshell.zip \
&& rm jsshell.zip
```

or using [`jsvu`](https://github.com/GoogleChromeLabs/jsvu)

```
bun install jsvu
./node_modules/.bin/jsvu --os=linux64 --engines=spidermonkey
```
and use the appropriate path to the `js` or `spidermonkey` executable, respectively in `nm_spidermoney.js`, e.g.,

```
#!/usr/bin/env -S /home/user/bin/js
```
or

```
#!/usr/bin/env -S /home/user/.jsvu/engines/spidermonkey/spidermonkey
```
9. To test click `service worker` link in panel of unpacked extension which is DevTools for background.js in MV3 `ServiceWorker`, observe echo'ed message from SpiderMonkey Native Messaging host. See Notes.

### Notes

[SpiderMonkey JavaScript/WebAssembly engine](https://spidermonkey.dev/) Shell does not expect to be used as a Native Messaging host. Stardard input and output are not specified by ECMA-262 so we have to work around that fact in this shell. 

JavaScript *runtimes* tested so far, include QuickJS, txiki.js, Deno, Node.js, Bun. Each process standard input and output differently. With the aforementioned runtimes we can maintain a persistent connect using `connectNative`. See [NativeMessagingHosts](https://github.com/guest271314/NativeMessagingHosts).

While we use `connectNative` here instead of `sendNativeMessage` that is only to send a trailing `"\r\n\r\n"` for `readline()` to stop reading (blocking), echo the message back then call `disconnect()`, repeat for each message, to avoid the `js` shell hanging on subsequent messages from client to host. This means that the s

For the above reasons `native-messaging-spidermonkey-shell` will not be added to the working Native Messaging hosts repository listed above until we get this working as intended. 

The same goes for V8's [`d8`](https://v8.dev/docs/d8) shell, which is still a W.I.P.

For differences between OS and browser implementations see [Chrome incompatibilities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#native_messaging).

# License
Do What the Fuck You Want to Public License [WTFPLv2](http://www.wtfpl.net/about/)

