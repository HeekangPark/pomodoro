let timer;

function runCountDown(client) {
    timer = setTimeout(() => {
        console.log("sending msg");
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
    event.waitUntil(async function () {
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

                console.log("sending response!");
                event.respondWith(new Response(new Blob(), { status: 200 }));
            }
        } else {
            console.log("fetching", url);
            event.respondWith(fetch(event.request));
        }
    }());
});

