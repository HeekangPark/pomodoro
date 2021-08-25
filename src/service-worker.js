self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    console.log(url.pathname);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");
    //let search = url.search;
    //let hash = url.hash;
    console.log(pathname);
    if(pathname.startsWith("/api")) {
        pathname = pathname.replace(/^\/api/, "");
        console.log(pathname);
    } else {
        event.respondWith(fetch(event.request));
    }
});