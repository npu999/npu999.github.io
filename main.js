/**
 * National Pigeon Unity - Main JavaScript
 * Minimal & Clean - Link tracking and keyboard navigation
 */

(function() {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        enableAnalytics: false,
        enableKeyboardNav: true,
        enableDarkMode: true,
    };

    // ===== Initialize =====
    function init() {
        setupLinkTracking();
        setupKeyboardNavigation();
        setupDarkMode();
        setupAccessibility();
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
