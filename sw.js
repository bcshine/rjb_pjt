// Service Worker 버전
const CACHE_NAME = 'haeyul-mandoo-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  // 핵심 이미지만 캐싱
  './images/image_02.jpg',
  './images/image_03.jpg',
  './images/image_09.jpg.png',
  './images/image_10.png',
  './images/image_11.png',
  './images/image_12.png',
  './images/image_13.png',
  './images/image_14.png',
  './images/image_15.png.png',
  './images/image_16.jpg',
  './images/image_17.jpg'
];

// Service Worker 설치
self.addEventListener('install', event => {
  console.log('Service Worker: 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 파일 캐싱 중...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: 설치 완료');
        return self.skipWaiting(); // 즉시 활성화
      })
      .catch(error => {
        console.log('Service Worker: 캐싱 실패', error);
      })
  );
});

// Service Worker 활성화
self.addEventListener('activate', event => {
  console.log('Service Worker: 활성화 중...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 이전 버전 캐시 삭제
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 이전 캐시 삭제', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: 활성화 완료');
      return self.clients.claim(); // 즉시 제어 시작
    })
  );
});

// 네트워크 요청 가로채기 (간소화된 버전)
self.addEventListener('fetch', event => {
  // 외부 지도 서비스는 캐싱하지 않음
  if (event.request.url.includes('map.') || 
      event.request.url.includes('maps.') ||
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에서 발견하면 반환
        if (response) {
          return response;
        }

        // 네트워크에서 가져오기
        return fetch(event.request).catch(() => {
          // 오프라인 시 메인 페이지 반환
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// Service Worker 완료 