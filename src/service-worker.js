const VERSION = "1.4.7"

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});


let timer;

function runCountDown(client) {
    timer = setTimeout(() => {
        client.postMessage({
            tick: 1
        });
        runCountDown(client);
    }, 1000);
}

function stopCountDown() {
    clearTimeout(timer);
    timer = undefined;
}

self.addEventListener('install', event => {
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
    let url = new URL(event.request.url);
    let pathname = url.pathname.replace(/^\/pomodoro/, "");

    if (pathname.startsWith("/api")) {
        const processAPICall = async () => {
            pathname = pathname.replace(/^\/api/, "");
            if (pathname.startsWith("/timer")) {
                let client = await clients.get(event.clientId);

                pathname = pathname.replace(/^\/timer/, "");
                if (pathname === "/start") {
                    runCountDown(client);
                } else if (pathname === "/stop") {
                    stopCountDown();
                }
                return new Response(undefined, { status: 200 });
            } else if (pathname.startsWith("/vibrate")) {
                pathname = pathname.replace(/^\/vibrate/, "");
                if (pathname === "/run") {
                    window.navigator.vibrate([200, 100, 200]);
                } else if (pathname === "/break") {
                    window.navigator.vibrate([300]);
                }
            } else {
                return new Response(undefined, { status: 404 });
            }
        }

        event.respondWith(processAPICall());
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
});

