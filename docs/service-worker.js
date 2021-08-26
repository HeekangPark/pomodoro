importScripts("/pomodoro/precache-manifest.a61bd9109daed43995458588565d716e.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

let timer;

function runCountDown(client) {
    timer = setTimeout(() => {
        client.postMessage({
            tick: 1
        });
        runCountDown();
    }, 1000);
}

function stopCountDown() {
    clearTimeout(timer);
    timer = undefined;
}

self.addEventListener('fetch', event => {
    let url = new URL(event.request.url);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");
    //let search = url.search;
    //let hash = url.hash;

    if (pathname.startsWith("/api")) {
        pathname = pathname.replace(/^\/api/, "");
        if (pathname === "/timer") {
            let client = await clients.get(event.clientId);

            pathname = pathname.replace(/^\/countdown/, "");
            if (pathname === "/start") {
                runCountDown(client);
            } else if (pathname === "/stop") {
                stopCountDown();
            }

            event.respondWith(new Response(new Blob(), {status: 200}));
        }
    } else {
        event.respondWith(fetch(event.request));
    }
});


