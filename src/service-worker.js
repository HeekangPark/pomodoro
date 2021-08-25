self.addEventListener('fetch', event => {
    let api_re = /^api\//;
    if(api_re.test(event.request.url)) {
        let url = event.request.url.replace(/^api\//, "");
        console.log(url);
    } else {
        event.respondWith(fetch(event.request));
    }
});