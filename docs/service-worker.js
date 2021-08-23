importScripts("/pomodoro/precache-manifest.1984babf0e2dc473cdbd76d4c08fd762.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('fetch', event => {
    console.log("Fetching somthing!!", event.request.url);
    event.respondWith(fetch(event.request));
});
