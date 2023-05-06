/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
self.addEventListener("push", e => {
  const data = e.data.json();
  self.registration.showNotification("New resealed!",
  // title of the notification
  {
    body: data.name,
    //the body of the push notification
    data: data
  });
});
self.addEventListener("notificationclick", event => {
  // console.log("On notification click");

  // Data can be attached to the notification so that you
  // can process it in the notificationclick handler.
  // console.log(`Notification Data: ${JSON.stringify(event.notification.data)}`);
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(clientList => {
    for (const client of clientList) {
      if (client.url === "/" && "focus" in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(event.notification.data.link);
  }));
  event.notification.close();
});
/******/ })()
;