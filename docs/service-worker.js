importScripts("/pomodoro/precache-manifest.e74ba3423955effa65358b493b988aa3.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

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

self.addEventListener('install', event => {
    console.log("Service worker Installing!");
    event.waitUntil(
        caches.open("Pomodoro").then(cache => {
            cache.addAll([
                '/pomodoro/img/icons/android-chrome-192x192.png',
                '/pomodoro/img/icons/android-chrome-512x512.png',
                '/pomodoro/img/icons/android-chrome-maskable-192x192.png',
                '/pomodoro/img/icons/android-chrome-maskable-512x512.png',
                '/pomodoro/img/icons/favicon-16.png',
                '/pomodoro/img/icons/favicon-32.png',
                '/pomodoro/img/icons/icon-180.png',
                '/pomodoro/img/icons/icon-192.png',
                '/pomodoro/img/icons/icon-512.png',
                '/pomodoro/favicon.ico'
            ]);
        })
    )
});

self.addEventListener('fetch', event => {
    event.waitUntil(async function () {
        let url = new URL(event.request.url);
        let pathname = url.pathname.replace(/^\/pomodoro/, "");
        //let search = url.search;
        //let hash = url.hash;

        if (pathname.startsWith("/api")) {
            pathname = pathname.replace(/^\/api/, "");
            if (pathname.startsWith("/timer")) {
                let client = await clients.get(event.clientId);
                console.log(client, event.request.url);

                pathname = pathname.replace(/^\/countdown/, "");
                if (pathname === "/start") {
                    runCountDown(client);
                } else if (pathname === "/stop") {
                    stopCountDown();
                }

                console.log("sending response!", event.request.url);
                event.respondWith(new Response(new Blob(), { status: 200 }));
            }
        } else {
            event.respondWith(
                caches.match(event.request).then((res) => {
                    if (res) {
                        console.log("from cache", event.request.url);
                        return res;
                    } else {
                        console.log("fetching", event.request.url);
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


