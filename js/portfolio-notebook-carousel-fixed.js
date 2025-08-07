/**
 * Fixed Portfolio Notebook Carousel
 * Addresses timing issues with container height
 */

(function() {
    'use strict';
    
    // Check if we're on mobile
    function isMobileDevice() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }
    
    // Main carousel class
    class NotebookCarousel {
        constructor() {
            this.container = document.querySelector('.portfolio-featured-grid');
            
            if (!this.container || !isMobileDevice()) {
                return;
            }
            
            this.notebooks = Array.from(this.container.querySelectorAll('.portfolio-item-wrapper'));
            
            if (this.notebooks.length === 0) {
                return;
            }
            
            this.isScrolling = false;
            this.scrollTimeout = null;
            this.currentActiveIndex = -1;
            this.scrollEndDelay = 150; // ms to wait after scroll stops
            this.initialized = false;
            
            this.init();
        }
        
        init() {
            
            // Force container to have proper dimensions immediately
            this.ensureContainerDimensions();
            
            // Try initialization with retries for timing issues
            this.initWithRetry(0);
        }
        
        ensureContainerDimensions() {
            // Set parent container dimensions first
            const parent = this.container.parentElement;
            if (parent && parent.id === 'projectsContent') {
                parent.style.cssText = `
                    position: relative !important;
                    height: 100vh !important;
                    height: 100dvh !important;
                    overflow: hidden !important;
                `;
            }
            
            // Set carousel container dimensions
            this.container.classList.add('notebook-carousel-mobile');
            this.container.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 40px !important;
                padding: 20px !important;
                box-sizing: border-box !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
                background: #f5f0eb !important;
                z-index: 1000 !important;
            `;
            
            // Dark mode background
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.container.style.background = '#000000 !important';
            }
            
        }
        
        initWithRetry(attemptCount) {
            const maxAttempts = 5;
            
            setTimeout(() => {
                const rect = this.container.getBoundingClientRect();
                const canScroll = this.container.scrollHeight > rect.height;
                
                console.log(`Attempt ${attemptCount + 1}:`, {
                    containerHeight: rect.height,
                    scrollHeight: this.container.scrollHeight,
                    canScroll: canScroll
                });
                
                if (canScroll && rect.height > 0) {
                    // Success! Container is ready
                    this.setupScrolling();
                    this.initialized = true;
                } else if (attemptCount < maxAttempts - 1) {
                    // Retry
                    this.initWithRetry(attemptCount + 1);
                } else {
                }
            }, 200 * (attemptCount + 1)); // Increasing delay
        }
        
        setupScrolling() {
            // Set up scroll listener
            this.container.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Set up intersection observer for zone detection
            this.setupIntersectionObserver();
            
            // Initial positioning
            setTimeout(() => {
                this.checkActiveNotebook();
            }, 100);
            
            // Handle resize
            window.addEventListener('resize', () => {
                if (!isMobileDevice()) {
                    this.destroy();
                } else {
                    this.setupIntersectionObserver();
                }
            });
            
        }
        
        setupIntersectionObserver() {
            // Clean up existing observer
            if (this.observer) {
                this.observer.disconnect();
            }
            
            // Create observer that watches for notebooks in center third of viewport
            const options = {
                root: this.container,
                rootMargin: '-33.33% 0px -33.33% 0px', // Only center third triggers
                threshold: 0.5 // At least 50% visible in center zone
            };
            
            this.observer = new IntersectionObserver((entries) => {
                if (this.isScrolling) return; // Don't process during scroll
                
                entries.forEach(entry => {
                    const index = this.notebooks.indexOf(entry.target);
                    if (entry.isIntersecting && index !== this.currentActiveIndex) {
                        this.activateNotebook(index);
                    }
                });
            }, options);
            
            // Observe all notebooks
            this.notebooks.forEach(notebook => {
                this.observer.observe(notebook);
            });
        }
        
        handleScroll() {
            
            // Set scrolling state
            if (!this.isScrolling) {
                this.isScrolling = true;
                this.deactivateAllNotebooks();
            }
            
            // Clear existing timeout
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Set new timeout
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.snapToNearestNotebook();
            }, this.scrollEndDelay);
        }
        
        snapToNearestNotebook() {
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;
            
            let closestNotebook = null;
            let closestDistance = Infinity;
            let closestIndex = -1;
            
            // Find closest notebook to center
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.top + rect.height / 2;
                const distance = Math.abs(notebookCenter - containerCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNotebook = notebook;
                    closestIndex = index;
                }
            });
            
            if (closestNotebook) {
                // Smooth scroll to center the notebook
                closestNotebook.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Wait for scroll to complete, then activate
                setTimeout(() => {
                    this.checkActiveNotebook();
                }, 300);
            }
        }
        
        checkActiveNotebook() {
            // Re-check which notebook is in center zone
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;
            const zoneHeight = containerRect.height / 3;
            
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.top + rect.height / 2;
                const distanceFromCenter = Math.abs(notebookCenter - containerCenter);
                
                if (distanceFromCenter < zoneHeight / 2) {
                    if (index !== this.currentActiveIndex) {
                        this.activateNotebook(index);
                    }
                }
            });
        }
        
        activateNotebook(index) {
            // Deactivate all first
            this.notebooks.forEach((notebook, i) => {
                notebook.classList.remove('carousel-active', 'carousel-dimmed');
                if (i !== index) {
                    notebook.classList.add('carousel-dimmed');
                }
            });
            
            // Activate the selected notebook
            this.notebooks[index].classList.add('carousel-active');
            this.currentActiveIndex = index;
            
            // Play book sound when notebook opens with same delay as animation
            if (window.playBookSound) {
                // Animation takes 1.8s, play sound slightly after it starts for better timing
                setTimeout(() => {
                    window.playBookSound();
                }, 300); // 300ms delay for optimal timing with animation
            }
        }
        
        deactivateAllNotebooks() {
            this.notebooks.forEach(notebook => {
                notebook.classList.remove('carousel-active', 'carousel-dimmed');
            });
            this.currentActiveIndex = -1;
        }
        
        destroy() {
            // Clean up for desktop mode
            this.container.classList.remove('notebook-carousel-mobile');
            this.container.style.cssText = '';
            this.deactivateAllNotebooks();
            if (this.observer) {
                this.observer.disconnect();
            }
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
        }
    }
    
    // Initialize with delay to ensure elements are loaded
    function initializeCarousel() {
        new NotebookCarousel();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeCarousel, 100);
        });
    } else {
        setTimeout(initializeCarousel, 100);
    }
    
    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', () => {
        setTimeout(initializeCarousel, 100);
    });
    
    // Also try to initialize when portfolio content is loaded
    document.addEventListener('portfolio-loaded', () => {
        setTimeout(initializeCarousel, 100);
    });
    
    // Initialize on window load as fallback
    window.addEventListener('load', () => {
        if (!document.querySelector('.portfolio-featured-grid.notebook-carousel-mobile')) {
            setTimeout(initializeCarousel, 100);
        }
    });
})();