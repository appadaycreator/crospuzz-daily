// CrosPuzz Service Worker
// Version: 1.0.6

const CACHE_NAME = 'crospuzz-v1.0.6';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/app.js',
    '/static/puzzles/puzzles.json',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Inter:wght@300;400;500;700&display=swap'
];

// Install event
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    // puzzles.jsonは常に最新版を取得
    if (event.request.url.includes('puzzles.json')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // レスポンスをクローンしてキャッシュに保存
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // オフライン時はキャッシュから取得
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // その他のリソースは通常のキャッシュ戦略
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// Background sync function
function doBackgroundSync() {
    // Implement background sync logic here
    console.log('Performing background sync...');
    return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received');
    
    const options = {
        body: '新しいクロスワードパズルが利用可能です！',
        icon: '/assets/images/icon-192x192.png',
        badge: '/assets/images/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '今すぐプレイ',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: '閉じる',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('CrosPuzz', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker loaded successfully'); 