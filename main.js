/**
 * National Pigeon Unity - Main JavaScript
 * Minimal & Clean - Link tracking and keyboard navigation + Dynamic Rainbow Gradient
 */

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        enableAnalytics: false,
        enableKeyboardNav: true,
        enableDarkMode: true,
    };

    // Soft, Premium Rainbow colors (살짝 톤다운된 고급 색상 팔레트)
    const RAINBOW_COLORS = [
        ['#D84E4E', '#D97D3A'], // Soft Red to Soft Orange
        ['#D97D3A', '#D4B84F'], // Soft Orange to Soft Yellow
        ['#D4B84F', '#5FB55B'], // Soft Yellow to Soft Green
        ['#5FB55B', '#4A90A4'], // Soft Green to Soft Blue
        ['#4A90A4', '#6B5B95'], // Soft Blue to Soft Indigo
        ['#6B5B95', '#9B7B9E'], // Soft Indigo to Soft Violet
        ['#9B7B9E', '#D84E4E'], // Soft Violet to Soft Red
        ['#C89B8B', '#8B9BA8'], // Warm Beige to Cool Gray
        ['#8B9BA8', '#9B8B7B'], // Cool Gray to Warm Gray
        ['#A47B6B', '#7BA893'], // Warm Brown to Sage Green
    ];

    // Gradient animation state
    let gradientState = {
        currentColors: ['#D84E4E', '#D97D3A'],
        currentAngle: 0,
        isAnimating: false,
        animationFrameId: null
    };

    // ===== Initialize =====
    function init() {
        setupLinkTracking();
        setupKeyboardNavigation();
        setupDarkMode();
        setupAccessibility();
        setupDynamicGradient();
    }

    // ===== Dynamic Rainbow Gradient =====
    function setupDynamicGradient() {
        function setGradient(colors, angle) {
            document.body.style.background = `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
            document.body.style.backgroundAttachment = 'fixed';
        }

        function getRandomGradient() {
            const colorPair = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
            const angle = Math.floor(Math.random() * 360);
            return { colors: colorPair, angle };
        }

        function smoothGradientAnimation() {
            const startTime = Date.now();
            const duration = 8000; // 8초에 걸쳐 부드럽게 변경
            const startColors = gradientState.currentColors;
            const startAngle = gradientState.currentAngle;
            const nextGradient = getRandomGradient();
            const targetColors = nextGradient.colors;
            const targetAngle = nextGradient.angle;

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 색상 보간 (RGB 값을 직접 계산하는 방식)
                const currentColors = interpolateColors(startColors, targetColors, progress);
                const currentAngle = startAngle + (targetAngle - startAngle) * progress;

                gradientState.currentColors = currentColors;
                gradientState.currentAngle = currentAngle;

                setGradient(currentColors, currentAngle);

                if (progress < 1) {
                    gradientState.animationFrameId = requestAnimationFrame(animate);
                }
            }

            animate();
        }

        function interpolateColors(color1, color2, progress) {
            const rgb1 = hexToRgb(color1);
            const rgb2 = hexToRgb(color2);

            const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
            const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
            const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

            return [rgbToHex(r, g, b), color2];
        }

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function handleUserInteraction() {
            // 현재 애니메이션 취소
            if (gradientState.animationFrameId) {
                cancelAnimationFrame(gradientState.animationFrameId);
                clearTimeout(gradientState.animationFrameId);
            }

            // 즉시 새로운 랜덤 그라디언트 적용
            const newGradient = getRandomGradient();
            gradientState.currentColors = newGradient.colors;
            gradientState.currentAngle = newGradient.angle;
            setGradient(newGradient.colors, newGradient.angle);
        }

        // 클릭/탭 감지만 유지
        document.addEventListener('click', () => {
            handleUserInteraction();
        });

        // 초기 그라디언트 설정
        setGradient(gradientState.currentColors, gradientState.currentAngle);
    }

    // ===== Link Click Tracking =====
    function setupLinkTracking() {
        const links = document.querySelectorAll('.link-button');
        
        links.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const text = link.querySelector('.link-text').textContent;
                
                // Log to console (replace with analytics service)
                console.log(`[Link ${index + 1}] Clicked: "${text}"`, href);
                
                // Optional: Send to analytics service
                if (CONFIG.enableAnalytics && window.gtag) {
                    gtag('event', 'link_click', {
                        'link_text': text,
                        'link_url': href
                    });
                }
            });
        });
    }

    // ===== Keyboard Navigation =====
    function setupKeyboardNavigation() {
        if (!CONFIG.enableKeyboardNav) return;

        const links = document.querySelectorAll('.link-button');
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const currentIndex = Array.from(links).indexOf(document.activeElement);
                const nextIndex = (currentIndex + 1) % links.length;
                links[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentIndex = Array.from(links).indexOf(document.activeElement);
                const prevIndex = (currentIndex - 1 + links.length) % links.length;
                links[prevIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                links[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                links[links.length - 1].focus();
            }
        });
    }

    // ===== Dark Mode =====
    function setupDarkMode() {
        if (!CONFIG.enableDarkMode) return;

        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem('darkMode');
        
        let isDark = savedMode !== null ? savedMode === 'true' : prefersDark;
        
        function applyDarkMode(dark) {
            if (dark) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        }
        
        // Apply initial mode
        applyDarkMode(isDark);
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            applyDarkMode(e.matches);
        });
    }

    // ===== Accessibility Enhancements =====
    function setupAccessibility() {
        // Skip unnecessary animations for users who prefer reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            document.documentElement.style.scrollBehavior = 'auto';
            console.log('Reduced motion preference detected - animations disabled');
        }
        
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('.link-button');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }

    // ===== Utility: Send Custom Event =====
    window.trackCustomEvent = function(eventName, eventData = {}) {
        console.log(`[Event] ${eventName}`, eventData);
        
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }
    };

    // ===== Utility: Update Link =====
    window.updateLink = function(index, newUrl, newText) {
        const links = document.querySelectorAll('.link-button');
        if (links[index]) {
            links[index].href = newUrl;
            links[index].querySelector('.link-text').textContent = newText;
            console.log(`[Updated] Link ${index + 1}: "${newText}" -> ${newUrl}`);
        }
    };

    // ===== Run on DOM Ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
