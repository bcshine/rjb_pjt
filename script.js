// 일반 웹사이트 - PWA 기능 제거됨

// 웹페이지가 완전히 로드된 후에 실행되는 코드
document.addEventListener('DOMContentLoaded', function() {
    // 기본 요소들
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const loginModalClose = document.getElementById('login-modal-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const logo = document.querySelector('.logo');
    
    // 로그인 모달
    loginBtn?.addEventListener('click', () => loginModal.classList.add('show'));
    loginModalClose?.addEventListener('click', () => loginModal.classList.remove('show'));
    window.addEventListener('click', e => {
        if (e.target === loginModal) loginModal.classList.remove('show');
    });
    
    // 네비게이션 스크롤
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href?.startsWith('http')) return;
            
            event.preventDefault();
            if (href?.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
    
    // 헤더 스크롤 효과
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.style.boxShadow = window.scrollY > 50 
            ? '0 2px 20px rgba(0, 0, 0, 0.15)' 
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // 로고 클릭
    logo?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 모바일 메뉴
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('show');
        });
        
        // 메뉴 링크 클릭 시 닫기
        mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href')?.startsWith('#')) {
                    mobileNav.classList.remove('show');
                }
            });
        });
        
        // 외부 클릭 시 닫기
        document.addEventListener('click', e => {
            if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('show');
            }
        });
    }
    
    // 슬라이더
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const heroSection = document.querySelector('.hero-section');
    
    let currentSlide = 0;
    let autoSlideTimer;
    
    function changeSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        slides[currentSlide]?.classList.remove('active');
        indicators[currentSlide]?.classList.remove('active');
        
        currentSlide = index;
        slides[currentSlide]?.classList.add('active');
        indicators[currentSlide]?.classList.add('active');
    }
    
    function nextSlide() { changeSlide(currentSlide + 1); }
    function prevSlide() { changeSlide(currentSlide - 1); }
    
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 3000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
    }
    
    // 슬라이더 이벤트
    if (slides.length > 0) {
        startAutoSlide();
        
        heroSection?.addEventListener('mouseenter', stopAutoSlide);
        heroSection?.addEventListener('mouseleave', startAutoSlide);
        
        prevBtn?.addEventListener('click', prevSlide);
        nextBtn?.addEventListener('click', nextSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => changeSlide(index));
        });
        
        // 키보드 제어
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });
        
        // 터치 스와이프
        let touchStartX = 0;
        heroSection?.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroSection?.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        });
    }
    
    // 예약 버튼
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('예약 기능이 준비 중입니다!');
        });
    });
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