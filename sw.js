var CACHE_NAME = 'dcard-laila-cristina-v01-01';
var urlsToCache = [
	'./',
	'./index.html',
	'./offline.html',
	'./404.html',
	'./favicon/android-chrome-512x512.png',
	'./favicon/android-chrome-192x192.png',
	'./css/all.css',
    './css/brands.css',
    './css/fontawesome.css',
    './css/modal.css',
	'./webfonts/fa-brands-400.eot',
	'./webfonts/fa-brands-400.svg',
	'./webfonts/fa-brands-400.ttf',
	'./webfonts/fa-brands-400.woff',
	'./webfonts/fa-brands-400.woff2',
	'./webfonts/fa-regular-400.eot',
	'./webfonts/fa-regular-400.svg',
	'./webfonts/fa-regular-400.ttf',
	'./webfonts/fa-regular-400.woff',
	'./webfonts/fa-regular-400.woff2',
	'./webfonts/fa-solid-900.eot',
	'./webfonts/fa-solid-900.svg',
	'./webfonts/fa-solid-900.ttf',
	'./webfonts/fa-solid-900.woff',
	'./webfonts/fa-solid-900.woff2',
	'./imgs/laila-cristina-01.png',
	'./imgs/laila-cristina-04.png',
	'./imgs/laila-cristina-12.png',
	'./imgs/laila-cristina-13.png',
	'./imgs/laila-cristina-15.jpg',
	'./imgs/laila-cristina-16.jpg',
	'./imgs/laila-cristina-background-01.png',
	'./imgs/laila-cristina-logo-cartao-digital-puro-v01-02.png',
	'./imgs/laila-cristina-proposta-area-de-lazer.jpg',
	'./imgs/laila-cristina-proposta-de-fachada.jpg',
	'./imgs/laila-cristina-proposta-de-home-office.jpg',
	'./imgs/laila-cristina-proposta-residencia-rural.jpg',
	'./imgs/laila-cristina-qrcode.png',
	'./imgs/laila-cristina-thumb-video-01.png',
	'./imgs/laila-cristina-thumb-video-02.png',
	'./imgs/laila-cristina-thumb-video-03.png',
	'./imgs/laila-cristina-thumb-video-04.png',
	'./imgs/laila-cristina-video-01.mp4',
	'./imgs/laila-cristina-video-02.mp4',
	'./imgs/laila-cristina-video-03.mp4',
	'./imgs/laila-cristina-video-04.mp4',
	'./imgs/laila-cristina0logotipo-v01.png',
	'./imgs/mauricio-jun-ti-v02.png'
];
self.addEventListener('install', (event) => {
	event.waitUntil( // Ensures the service worker doesn't finish installing until all files are cached
		caches.open(CACHE_NAME)
		.then((cache) => {
			console.log('Opened cache');
			return cache.addAll(urlsToCache); // Attempts to cache all resources in one go
		})
		.catch((error) => {
			console.error('Failed to cache resources during install:', error);
			// If any single request fails, the entire transaction is rolled back and the worker installation fails
		})
	);
});
/*
self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					// Return true if you want to remove this cache,
					// but remember that caches are shared across
					// the whole origin
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
		})
	);
});
*/
self.addEventListener('activate', function(event) {
	const currentCache = CACHE_NAME;
	event.waitUntil(
	  caches.keys().then(function(cacheNames) {
		return Promise.all(
		  cacheNames.map(function(cacheName) {
			if (cacheName !== currentCache) {
			  return caches.delete(cacheName);
			}
		  })
		);
	  })
	);
});
/* FETCH */
self.addEventListener('fetch', function(event) {
	const requestUrl = new URL(event.request.url);
	const isRoot = requestUrl.pathname === '/' || requestUrl.pathname === '/gemima-mansoor/';
  
	event.respondWith(
	  caches.match(event.request).then(function(response) {
		if (response) return response;
  
		// Se for requisição para a raiz, tenta buscar do cache primeiro
		if (isRoot) {
		  // Tenta buscar do cache o index.html
		  return caches.match('./index.html').then(function(cached) {
			if (cached) return cached;
			// Se não estiver em cache, tenta fetch da rede
			return fetch('./index.html').catch(() => caches.match('./offline.html'));
		  });
		}
  
		return fetch(event.request).then(function(response) {
		  if (response.status === 404 && !isRoot) {
			return caches.match('./404.html') || response;
		  }
		  return response;
		}).catch(function() {
		  return caches.match('./offline.html');
		});
	  })
	);
  });