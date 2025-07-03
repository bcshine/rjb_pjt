// Service Worker 버전
const CACHE_NAME = 'haeyul-mandoo-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  // 이미지 파일들
  '/images/image_01.jpg',
  '/images/image_02.jpg',
  '/images/image_03.jpg',
  '/images/image_09.jpg.png',
  '/images/image_10.png',
  '/images/image_11.png',
  '/images/image_12.png',
  '/images/image_13.png',
  '/images/image_14.png',
  '/images/image_15.png.png',
  '/images/image_16.jpg',
  '/images/image_17.jpg',
  '/images/image_19.png',
  '/images/image_20.png',
  '/images/image_21.png',
  '/images/image_22.png',
  // 외부 리소스
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
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

// 네트워크 요청 가로채기 (캐시 우선 전략)
self.addEventListener('fetch', event => {
  // 네이버/카카오/구글 지도는 캐싱하지 않음
  if (event.request.url.includes('map.naver.com') || 
      event.request.url.includes('map.kakao.com') ||
      event.request.url.includes('maps.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 캐시에서 반환
        if (response) {
          console.log('Service Worker: 캐시에서 제공', event.request.url);
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(event.request)
          .then(response => {
            // 유효하지 않은 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제 (한 번만 사용 가능하므로)
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 오프라인 페이지 제공 (추후 구현 가능)
            console.log('Service Worker: 네트워크 요청 실패', event.request.url);
            
            // HTML 요청인 경우 메인 페이지 제공
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// 백그라운드 동기화 (추후 구현 가능)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: 백그라운드 동기화 실행');
  }
});

// 푸시 알림 (추후 구현 가능)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '해율만두전골에서 새로운 소식이 있습니다!',
    icon: '/images/image_14.png',
    badge: '/images/image_09.jpg.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/images/image_14.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('해율만두전골', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 