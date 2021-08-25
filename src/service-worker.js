self.addEventListener('fetch', event => {
    console.log(event.request.url);
    if(event.request.url.startsWith("/api/")) {
        let url = event.request.url.replace(/^api\//, "");
        console.log(url);
    } else {
        event.respondWith(fetch(event.request));
    }
});