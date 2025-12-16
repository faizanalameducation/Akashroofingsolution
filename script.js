document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    const loadingPercentage = document.querySelector('.loading-percentage');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;

        loadingBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }, 500);
        }
    }, 100);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenuOverlay.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // Hero Background Slider - Manual control only (no auto-slide)
    const heroBgs = document.querySelectorAll('.hero-bg');
    const prevBtn = document.getElementById('prev-hero');
    const nextBtn = document.getElementById('next-hero');
    const currentIndexEl = document.getElementById('current-index');
    let currentHeroIndex = 0;

    function updateHero(index) {
        heroBgs.forEach(bg => bg.classList.remove('active'));
        heroBgs[index].classList.add('active');
        currentIndexEl.textContent = `0${index + 1}`;
    }

    nextBtn.addEventListener('click', () => {
        currentHeroIndex = (currentHeroIndex + 1) % heroBgs.length;
        updateHero(currentHeroIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentHeroIndex = (currentHeroIndex - 1 + heroBgs.length) % heroBgs.length;
        updateHero(currentHeroIndex);
    });

    // Ping-Pong Video Loop (play forward, then reverse, repeat)
    // Ping-Pong Video Loop (play forward, then reverse, repeat)
    const heroVideos = document.querySelectorAll('.hero-bg video');

    heroVideos.forEach(video => {
        let isReversing = false;
        let animationFrameId = null;
        let lastTime = 0;
        const reverseSpeed = 1.0; // 1.0 = normal speed

        // Remove default loop attribute - we'll handle looping manually
        video.removeAttribute('loop');

        video.addEventListener('ended', () => {
            // Video finished playing forward, start reversing
            isReversing = true;
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(reverseVideo);
        });

        function reverseVideo(timestamp) {
            if (!isReversing) return;

            // Calculate time delta for smooth playback regardless of frame rate
            const deltaTime = (timestamp - lastTime) / 1000; // in seconds
            lastTime = timestamp;

            // Prevent huge jumps if tab was inactive
            if (deltaTime > 0.1) {
                animationFrameId = requestAnimationFrame(reverseVideo);
                return;
            }

            if (video.currentTime <= 0) {
                // Reached the beginning, stop reversing and play forward
                isReversing = false;
                cancelAnimationFrame(animationFrameId);
                video.currentTime = 0;
                video.play();
            } else {
                // Step back in time based on delta and speed
                video.currentTime = Math.max(0, video.currentTime - (deltaTime * reverseSpeed));
                animationFrameId = requestAnimationFrame(reverseVideo);
            }
        }

        // Handle manual pause/play to stop reversal if needed
        video.addEventListener('play', () => {
            if (isReversing) {
                isReversing = false;
                cancelAnimationFrame(animationFrameId);
            }
        });

        // Make sure video plays when it becomes visible
        video.play().catch(() => {
            // Autoplay might be blocked, user interaction needed
            console.log('Autoplay blocked, waiting for user interaction');
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });
});
