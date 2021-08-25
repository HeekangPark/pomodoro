self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    console.log(url.pathname);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");
    //let search = url.search;
    //let hash = url.hash;
    console.Console(pathname);
    if(pathname.startsWith("/api")) {
        pathname = event.request.url.replace(/^\/api/, "");
        console.log(pathname);
    } else {
        event.respondWith(fetch(event.request));
    }
});