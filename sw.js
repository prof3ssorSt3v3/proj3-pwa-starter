//service worker for suggest-a-movie app

let staticName = 'static-v1';
let dynamicName = 'dynamic-v1';
let dbVersion = 1;
let cacheSize = 65;
let staticList = [
  '/',
  '/index.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v78/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];
let dynamicList = [];

self.addEventListener('install', (ev) => {
  //install event - browser has installed this version
});

self.addEventListener('activate', (ev) => {
  //activate event - browser now using this version
});

self.addEventListener('fetch', (ev) => {
  //fetch event - web page is asking for an asset
});

self.addEventListener('message', ({ data }) => {
  //message received from a web page that uses this sw
});

const sendMessage = async (msg) => {
  //send a message from the service worker to the webpage(s)
  let allClients = await clients.matchAll({ includeUncontrolled: true });
  return Promise.all(
    allClients.map((client) => {
      let channel = new MessageChannel();
      channel.port1.onmessage = onMessage;
      //port1 for send port2 for receive
      return client.postMessage(msg, [channel.port2]);
    })
  );
};
