/**
 * Portfolio Notebook Carousel
 * Implements vertical carousel with magnetic snapping for mobile devices
 * Notebooks open when centered and stationary, dim when not centered
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
            
            this.init();
        }
        
        init() {
            
            // Add class to container
            this.container.classList.add('notebook-carousel-mobile');
            
            // Add class to body for CSS fallback
            document.body.classList.add('notebook-carousel-active');
            
            // Add class to projectsContent for browsers without :has() support
            const projectsContent = document.getElementById('projectsContent');
            if (projectsContent) {
                projectsContent.classList.add('has-notebook-carousel');
            }
            
            // Let CSS handle the layout - don't apply inline styles
            
            // Check container dimensions after CSS is applied
            setTimeout(() => {
                const rect = this.container.getBoundingClientRect();
                const computedStyle = getComputedStyle(this.container);
                
                this.containerInfo = {
                    height: rect.height,
                    scrollHeight: this.container.scrollHeight,
                    canScroll: this.container.scrollHeight > rect.height,
                    overflow: computedStyle.overflow,
                    overflowY: computedStyle.overflowY,
                    position: computedStyle.position
                };
                
                // Setup the carousel functionality
                this.setupCarousel();
            }, 100);
            
        }
        
        setupCarousel() {
            // Setup scroll handling
            this.container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
            
            // Setup intersection observer
            this.setupIntersectionObserver();
            
            // Activate first notebook if visible
            this.checkInitialNotebook();
            
        }
        
        checkInitialNotebook() {
            // Check if any notebook is already centered
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;
            
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.top + rect.height / 2;
                const distance = Math.abs(notebookCenter - containerCenter);
                
                if (distance < 50) { // Within 50px of center
                    this.activateNotebook(index);
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
            document.body.classList.remove('notebook-carousel-active');
            
            const projectsContent = document.getElementById('projectsContent');
            if (projectsContent) {
                projectsContent.classList.remove('has-notebook-carousel');
            }
            
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
            setTimeout(initializeCarousel, 100); // Small delay to ensure elements are ready
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
