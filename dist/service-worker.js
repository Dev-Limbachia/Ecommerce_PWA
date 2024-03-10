let cacheName = "afterSchoolClub-v1";
let cacheFiles = [
    "index.html",
];

self.addEventListener("install", function (e) {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[Service Worker] Caching files");
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", function (e) {
    // Skip caching for requests with unsupported schemes (e.g., chrome-extension://)
    if (e.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Skip caching for POST requests
    if (e.request.method === 'POST') {
        return;
    }

    e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
            return cachedFile || fetchAndCache(e.request);
        }).catch(function () {
            return fetchAndCache(e.request);
        })
    );
});

function fetchAndCache(request) {
    return fetch(request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        const responseToCache = response.clone();
        caches.open(cacheName).then(function (cache) {
            cache.put(request, responseToCache);
        });

        return response;
    }).catch(function (error) {
        console.error('Error fetching and caching:', error);
        throw error;
    });
}
