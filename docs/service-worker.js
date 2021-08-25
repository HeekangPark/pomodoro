importScripts("/pomodoro/precache-manifest.7e80c0836807fa8c6160759b9777b9cd.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    console.log(url.pathname);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");
    //let search = url.search;
    //let hash = url.hash;
    console.log(pathname);
    if(pathname.startsWith("/api")) {
        pathname = event.request.url.replace(/^\/api/, "");
        console.log(pathname);
    } else {
        event.respondWith(fetch(event.request));
    }
});
