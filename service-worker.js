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

    // Check if the request method is POST
    if (e.request.method === 'POST') {
        // Handle POST requests differently
        // In this example, we clear the entire cache after a successful POST request
        e.respondWith(
            fetch(e.request).then(function (response) {
                // Clear entire cache
                caches.delete(cacheName).then(function() {
                    console.log("[Service Worker] Cache cleared after successful POST request.");
                    // Reload the page to fetch updated data
                    self.clients.matchAll().then(function(clients) {
                        clients.forEach(function(client) {
                            client.postMessage({ type: 'reload' });
                        });
                    });
                });
                return response;
            }).catch(function () {
                // In case of an error, serve the response from the cache if available
                return caches.match(e.request);
            })
        );
    } else {
        // Skip caching for PUT requests
        if (e.request.method === 'PUT') {
            return;
        }
        
        // For other request methods (e.g., GET), check the cache first
        e.respondWith(
            caches.match(e.request).then(function (cachedFile) {
                if (cachedFile) {
                    console.log("[Service Worker] Resource fetched from the cache for: " + e.request.url);
                    return cachedFile;
                } else {
                    return fetch(e.request).then(function (response) {
                        return caches.open(cacheName).then(function (cache) {
                            cache.put(e.request, response.clone());
                            console.log("[Service Worker] Resource fetched and saved in the cache for: " +
                                e.request.url);
                            return response;
                        });
                    });
                }
            })
        );
    }
});
