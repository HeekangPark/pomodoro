self.addEventListener('fetch', event => {
    console.log("Fetching somthing!!", event.request.url);
    event.respondWith(fetch(event.request));
});