importScripts("/pomodoro/precache-manifest.2edc1113f451786362ac3cca18cc0603.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('fetch', event => {
    let api_re = /^api\//;
    if(api_re.test(event.request.url)) {
        let url = event.request.url.replace(/^api\//, "");
        console.log(url);
    } else {
        event.respondWith(fetch(event.request));
    }
});
