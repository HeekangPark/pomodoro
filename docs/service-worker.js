importScripts("/pomodoro/precache-manifest.ccec1e41e7e6e8b587da8afa315ba9c8.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");
    //let search = url.search;
    //let hash = url.hash;
    
    if(pathname.startsWith("/api")) {
        pathname = event.request.url.replace(/^\/api/, "");
        console.log(pathname);
    } else {
        event.respondWith(fetch(event.request));
    }
});
