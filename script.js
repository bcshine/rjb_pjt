// 웹페이지가 완전히 로드된 후에 실행되는 코드
document.addEventListener('DOMContentLoaded', function() {
    console.log('헤더가 성공적으로 로드되었습니다!');
    
    // 로그인 버튼을 찾아서 변수에 저장하기
    const loginBtn = document.querySelector('.login-btn');
    
    // 네비게이션 링크들을 찾아서 변수에 저장하기
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 로그인 모달 열기/닫기 기능
    const loginModal = document.getElementById('login-modal');
    const loginModalClose = document.getElementById('login-modal-close');
    loginBtn.addEventListener('click', function() {
        loginModal.classList.add('show');
    });
    loginModalClose.addEventListener('click', function() {
        loginModal.classList.remove('show');
    });
    // 모달 바깥 클릭 시 닫기
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
        }
    });
    
    // 각 네비게이션 링크에 클릭 이벤트 추가하기
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            // 외부 링크(https로 시작)면 기본 동작 허용
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                return; // 기본 동작(새 창 이동) 허용
            }
            event.preventDefault();
            // a 태그의 href 속성에서 #id 추출
            const targetId = href;
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // 헤더 높이만큼 보정해서 부드럽게 스크롤
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: sectionTop,
                        behavior: 'smooth'
                    });
                    return;
                }
            }
            // 기존 알림창은 제거
        });
    });
    
    // 스크롤할 때 헤더 스타일 변경하기
    window.addEventListener('scroll', function() {
        // 헤더 요소를 찾기
        const header = document.querySelector('.header');
        
        // 스크롤 위치를 확인하기
        const scrollPosition = window.scrollY;
        
        // 스크롤이 50px 이상 되면 헤더에 그림자 효과 추가하기
        if (scrollPosition > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            // 스크롤이 50px 미만이면 원래 그림자로 되돌리기
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // 모바일에서 햄버거 메뉴 기능 (향후 확장용)
    function createMobileMenu() {
        // 모바일 화면에서만 실행되는 코드
        if (window.innerWidth <= 768) {
            console.log('모바일 화면에서 실행 중입니다.');
            
            // 모바일 메뉴 버튼이 없으면 만들기
            if (!document.querySelector('.mobile-menu-btn')) {
                const mobileMenuBtn = document.createElement('button');
                mobileMenuBtn.className = 'mobile-menu-btn';
                mobileMenuBtn.innerHTML = '☰'; // 햄버거 메뉴 아이콘
                mobileMenuBtn.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 5px;
                    margin-left: 10px;
                `;
                
                // 헤더 오른쪽에 모바일 메뉴 버튼 추가하기
                const headerRight = document.querySelector('.header-right');
                headerRight.appendChild(mobileMenuBtn);
                
                // 모바일 메뉴 버튼 클릭 이벤트 추가하기
                mobileMenuBtn.addEventListener('click', function() {
                    alert('모바일 메뉴가 준비 중입니다!');
                });
            }
        }
    }
    
    // 페이지 로드 시 모바일 메뉴 확인하기
    createMobileMenu();
    
    // 화면 크기가 변경될 때마다 모바일 메뉴 확인하기
    window.addEventListener('resize', createMobileMenu);
    
    // 헤더 로고 클릭 이벤트 추가하기
    const logo = document.querySelector('.logo');
    logo.addEventListener('click', function() {
        // 로고를 클릭하면 페이지 맨 위로 스크롤하기
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드럽게 스크롤하기
        });
        console.log('로고가 클릭되어 페이지 맨 위로 이동합니다.');
    });
    
    // 히어로 슬라이더 기능 구현하기
    function initHeroSlider() {
        console.log('히어로 슬라이더를 초기화합니다.');
        
        // 슬라이더 관련 요소들을 찾기
        const slides = document.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        // 현재 활성화된 슬라이드 번호 (0부터 시작)
        let currentSlide = 0;
        
        // 슬라이드 개수
        const totalSlides = slides.length;
        
        // 슬라이드를 변경하는 함수
        function changeSlide(slideIndex) {
            // 슬라이드 번호가 범위를 벗어나지 않도록 조정하기
            if (slideIndex < 0) {
                slideIndex = totalSlides - 1; // 마지막 슬라이드로
            } else if (slideIndex >= totalSlides) {
                slideIndex = 0; // 첫 번째 슬라이드로
            }
            
            // 현재 슬라이드 비활성화하기
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            // 새로운 슬라이드 활성화하기
            currentSlide = slideIndex;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            console.log('슬라이드가 ' + (currentSlide + 1) + '번째로 변경되었습니다.');
        }
        
        // 다음 슬라이드로 이동하는 함수
        function nextSlide() {
            changeSlide(currentSlide + 1);
        }
        
        // 이전 슬라이드로 이동하는 함수
        function prevSlide() {
            changeSlide(currentSlide - 1);
        }
        
        // 자동 슬라이딩 타이머 (3초마다)
        let autoSlideTimer = setInterval(nextSlide, 3000);
        
        // 마우스가 슬라이더 위에 있을 때 자동 슬라이딩 일시정지
        const heroSection = document.querySelector('.hero-section');
        heroSection.addEventListener('mouseenter', function() {
            clearInterval(autoSlideTimer);
            console.log('자동 슬라이딩이 일시정지되었습니다.');
        });
        
        // 마우스가 슬라이더를 벗어나면 자동 슬라이딩 재시작
        heroSection.addEventListener('mouseleave', function() {
            autoSlideTimer = setInterval(nextSlide, 3000);
            console.log('자동 슬라이딩이 재시작되었습니다.');
        });
        
        // 이전 버튼 클릭 이벤트
        prevBtn.addEventListener('click', function() {
            prevSlide();
            console.log('이전 버튼이 클릭되었습니다.');
        });
        
        // 다음 버튼 클릭 이벤트
        nextBtn.addEventListener('click', function() {
            nextSlide();
            console.log('다음 버튼이 클릭되었습니다.');
        });
        
        // 인디케이터 클릭 이벤트
        indicators.forEach(function(indicator, index) {
            indicator.addEventListener('click', function() {
                changeSlide(index);
                console.log('인디케이터 ' + (index + 1) + '번이 클릭되었습니다.');
            });
        });
        
        // 키보드 화살표 키로 슬라이드 조작하기
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                prevSlide();
                console.log('왼쪽 화살표 키가 눌렸습니다.');
            } else if (event.key === 'ArrowRight') {
                nextSlide();
                console.log('오른쪽 화살표 키가 눌렸습니다.');
            }
        });
        
        // 터치 스와이프 기능 (모바일용)
        let touchStartX = 0;
        let touchEndX = 0;
        
        heroSection.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        });
        
        heroSection.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50; // 스와이프 감지 임계값
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 왼쪽으로 스와이프 (다음 슬라이드)
                    nextSlide();
                    console.log('왼쪽으로 스와이프하여 다음 슬라이드로 이동했습니다.');
                } else {
                    // 오른쪽으로 스와이프 (이전 슬라이드)
                    prevSlide();
                    console.log('오른쪽으로 스와이프하여 이전 슬라이드로 이동했습니다.');
                }
            }
        }
        
        console.log('히어로 슬라이더가 성공적으로 초기화되었습니다.');
    }
    
    // 히어로 슬라이더 초기화하기
    initHeroSlider();
    
    // 예약하기 버튼 기능 추가하기
    const reservationBtns = document.querySelectorAll('.btn-secondary');
    reservationBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            alert('예약 기능이 준비 중입니다!');
            console.log('예약하기 버튼이 클릭되었습니다.');
        });
    });

    // 모바일 햄버거 메뉴 토글
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('show');
        });
        // 메뉴 클릭 시 자동 닫힘
        mobileNav.querySelectorAll('.mobile-nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('show');
            });
        });
    }
});

// 페이지 로드 상태를 확인하는 함수
function checkPageLoad() {
    if (document.readyState === 'loading') {
        console.log('페이지가 아직 로딩 중입니다...');
    } else if (document.readyState === 'interactive') {
        console.log('페이지가 상호작용 가능한 상태입니다.');
    } else if (document.readyState === 'complete') {
        console.log('페이지 로딩이 완료되었습니다!');
    }
}

// 페이지 로드 상태 확인하기
checkPageLoad(); 