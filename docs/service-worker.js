importScripts("/pomodoro/precache-manifest.870d42406272213b6d5be017dabe759a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

let timer;

function runCountDown(client) {
    console.log("in runCountDown()");
    timer = setTimeout(() => {
        console.log("sending msg");
        client.postMessage({
            tick: 1
        });
        runCountDown();
    }, 1000);
}

function stopCountDown() {
    console.log("in stopCountDown()");
    clearTimeout(timer);
    timer = undefined;
}

/*
self.addEventListener('install', event => {
    console.log("Service worker Installing!");
    event.waitUntil(
        caches.open("Pomodoro").then(cache => {
            cache.addAll([
                '/pomodoro',
                '/js/app.js',
                '/js/chunk-vendors.js',
                '/js/about.js',
                '/manifest.json',
                '/img/logo.png',
                '/img/icons/android-icon-144x144.png',
                '/img/icons/android-icon-48x48.png'
            ]);
        })
    )
});*/

self.addEventListener('fetch', event => {
    console.log("Fetching somthing!!", event.request.url);
    event.waitUntil(async function () {
        let url = new URL(event.request.url);
        let pathname = url.pathname.replace(/^\/pomodoro/, "");
        //let search = url.search;
        //let hash = url.hash;

        if (pathname.startsWith("/api")) {
            pathname = pathname.replace(/^\/api/, "");
            if (pathname === "/timer") {
                let client = await clients.get(event.clientId);
                console.log(client);

                pathname = pathname.replace(/^\/countdown/, "");
                if (pathname === "/start") {
                    runCountDown(client);
                } else if (pathname === "/stop") {
                    stopCountDown();
                }

                console.log("sending response!");
                event.respondWith(new Response(new Blob(), { status: 200 }));
            }
        } else {
            event.respondWith(
                caches.match(event.request).then((res) => {
                    if (res) {
                        console.log("from cache");
                        return res;
                    } else {
                        console.log("fetching");
                        return fetch(event.request).then((r) => {
                            return caches.open("Pomodoro").then((cache) => {
                                cache.put(event.request.url, r.clone());
                                return r;
                            });
                        }).catch(() => {
                            return caches.open("Pomodoro").then((cache) => {
                                return cache.match(event.request);
                            });
                        });
                    }
                })
            );
        }
    }());
});


