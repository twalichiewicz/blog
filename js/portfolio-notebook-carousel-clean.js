/**
 * Clean Portfolio Notebook Carousel
 * Fixes double scrollbar, ensures portfolio-more-section is visible,
 * and maintains fixed notebook sizes
 */

(function() {
    'use strict';
    
    // Global reference to current carousel instance
    let currentCarouselInstance = null;
    
    // Export for debugging
    window._notebookCarouselDebug = {
        getInstance: () => currentCarouselInstance,
        forceInitialize: () => {
            initializeCarousel();
        },
        checkState: () => {
                instance: !!currentCarouselInstance,
                initialized: currentCarouselInstance?.initialized,
                activeIndex: currentCarouselInstance?.currentActiveIndex,
                notebookCount: currentCarouselInstance?.notebooks?.length,
                container: !!document.querySelector('.portfolio-featured-grid.notebook-carousel-mobile')
            });
        }
    };
    
    // Check if we're on mobile
    function isMobileDevice() {
        return window.innerWidth <= 768 || 'ontouchstart' in window;
    }
    
    // Main carousel class
    class NotebookCarousel {
        constructor() {
            
            // Clean up any existing instance
            if (currentCarouselInstance) {
                currentCarouselInstance.destroy();
            }
            
            this.container = document.querySelector('.portfolio-featured-grid');
            this.projectsContent = document.getElementById('projectsContent');
            
            
            // Check tab visibility
            if (this.projectsContent) {
            }
            
            if (!this.container || !this.projectsContent || !isMobileDevice()) {
                return;
            }
            
            this.notebooks = Array.from(this.container.querySelectorAll('.portfolio-item-wrapper'));
            
            
            if (this.notebooks.length === 0) {
                return;
            }
            
            this.isScrolling = false;
            this.isTouching = false;
            this.isActivating = false; // Prevent multiple activations
            this.scrollTimeout = null;
            this.currentActiveIndex = -1;
            this.scrollEndDelay = 100; // ms to wait after scroll stops - balanced for mobile
            this.initialized = false;
            this.carouselObserver = null; // Observer to track carousel visibility
            this.initialPositioningComplete = false; // Flag to prevent activation during initial setup
            this.allowActivation = false; // Prevent any activation until user interaction
            
            // Store this instance globally
            currentCarouselInstance = this;
            
            this.init();
        }
        
        init() {
            // Set up the scrollable container structure
            this.setupContainers();
            
            // Wait for layout to settle, then set up scrolling
            requestAnimationFrame(() => {
                this.setupScrolling();
                this.initialized = true;
                
                // Check if browser has already restored scroll position
                if (this.container.scrollLeft > 0) {
                    // Don't activate any notebook automatically - wait for user interaction
                }
            });
        }
        
        setupContainers() {
            // Make projectsContent the scrollable container
            this.projectsContent.classList.add('has-notebook-carousel');
            
            // Add carousel class to the grid
            this.container.classList.add('notebook-carousel-mobile');
            
            // Add body class as fallback
            document.body.classList.add('notebook-carousel-active');
            
            // Check for stored scroll position
            const storedScrollPosition = sessionStorage.getItem('carouselScrollPosition');
            if (storedScrollPosition) {
                // Don't reset, will restore position later
            } else {
                this.container.scrollLeft = 0;
            }
            
            // Let CSS handle all sizing
            this.notebooks.forEach((notebook, index) => {
            });
        }
        
        setupScrolling() {
            // Set up scroll listener on the carousel container itself for horizontal scroll
            this.container.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Add touch event listeners for immediate response
            this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
            this.container.addEventListener('touchmove', this.handleTouchMove.bind(this));
            this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // Disable hover effects on touch devices by adding a class
            if ('ontouchstart' in window) {
                document.body.classList.add('touch-device');
            }
            
            // Set up intersection observer for zone detection
            this.setupIntersectionObserver();
            
            // Set up visibility observer to track when carousel goes out of view
            this.setupVisibilityObserver();
            
            // Wait for all notebooks to fully load before allowing any activation
            this.waitForNotebooksToLoad().then(() => {
                this.initialPositioningComplete = true;
                // Still don't enable activation automatically - wait for user interaction
            });
            
            // Handle resize
            window.addEventListener('resize', () => {
                if (!isMobileDevice()) {
                    this.destroy();
                } else if (!this.initialized) {
                    this.init();
                }
            });
        }
        
        waitForNotebooksToLoad() {
            return new Promise((resolve) => {
                // Check if all notebooks are already loaded
                const checkLoaded = () => {
                    const allNotebooks = this.container.querySelectorAll('.portfolio-item--featured');
                    const loadedNotebooks = this.container.querySelectorAll('.portfolio-item--featured.notebook-content-loaded, .portfolio-item--featured.notebook-loaded');
                    
                    
                    if (loadedNotebooks.length === allNotebooks.length) {
                        resolve();
                        return true;
                    }
                    return false;
                };
                
                // Check immediately
                if (checkLoaded()) return;
                
                // Otherwise, poll until all are loaded
                const checkInterval = setInterval(() => {
                    if (checkLoaded()) {
                        clearInterval(checkInterval);
                    }
                }, 100);
                
                // Timeout after 5 seconds to prevent infinite waiting
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 5000);
            });
        }
        
        setupIntersectionObserver() {
            // Clean up existing observer
            if (this.observer) {
                this.observer.disconnect();
            }
            
            // Create observer that watches for notebooks in center zone
            const options = {
                root: this.container, // Use the carousel container as the scroll root
                rootMargin: '0px -30% 0px -30%', // Center 40% of viewport for earlier activation
                threshold: 0.3 // Lower threshold for quicker response
            };
            
            
            this.observer = new IntersectionObserver((entries) => {
                
                if (!this.initialPositioningComplete || !this.allowActivation) {
                    return; // Don't process during initial setup or before user interaction
                }
                
                // Don't process if we're actively scrolling or touching
                if (this.isScrolling || this.isTouching) {
                    return;
                }
                
                // Find the most centered notebook among intersecting entries
                let mostCentered = null;
                let bestCenterDistance = Infinity;
                
                const containerRect = this.container.getBoundingClientRect();
                const containerCenter = containerRect.left + containerRect.width / 2;
                
                
                entries.forEach(entry => {
                    const rect = entry.target.getBoundingClientRect();
                    const notebookCenter = rect.left + rect.width / 2;
                    const distanceFromCenter = Math.abs(notebookCenter - containerCenter);
                    
                        isIntersecting: entry.isIntersecting,
                        notebookIndex: this.notebooks.indexOf(entry.target),
                        notebookCenter: notebookCenter,
                        distanceFromCenter: distanceFromCenter,
                        intersectionRatio: entry.intersectionRatio
                    });
                    
                    if (entry.isIntersecting) {
                        if (distanceFromCenter < bestCenterDistance) {
                            bestCenterDistance = distanceFromCenter;
                            mostCentered = entry.target;
                        }
                    }
                });
                
                // Activate only when not scrolling and notebook is centered
                if (mostCentered && !this.isScrolling && !this.isTouching) {
                    const index = this.notebooks.indexOf(mostCentered);
                    if (index !== -1 && index !== this.currentActiveIndex) {
                        this.activateNotebook(index);
                    }
                } else {
                }
            }, options);
            
            // Observe all notebooks
            this.notebooks.forEach((notebook, index) => {
                this.observer.observe(notebook);
            });
        }
        
        setupVisibilityObserver() {
            // Clean up existing observer
            if (this.carouselObserver) {
                this.carouselObserver.disconnect();
            }
            
            // Create observer to track when carousel goes out of view
            const options = {
                root: null, // Use viewport as root
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% or less is visible
            };
            
            this.carouselObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // When carousel is scrolled out of view (less than 10% visible)
                    if (!entry.isIntersecting && this.currentActiveIndex !== -1) {
                        this.resetAllNotebooks();
                    }
                });
            }, options);
            
            // Observe the carousel container
            this.carouselObserver.observe(this.container);
        }
        
        handleScroll() {
            // Enable activation on first user scroll
            if (!this.allowActivation) {
                this.allowActivation = true;
            }
            
            // Clear existing timeout
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Mark as scrolling
            this.isScrolling = true;
            
            // Close all notebooks and remove opacity during scroll
            this.closeAllNotebooksForScroll();
            
            // Set new timeout for when scrolling stops
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                // Only snap to nearest if user has interacted
                if (this.allowActivation) {
                    this.snapToNearestNotebook();
                }
            }, this.scrollEndDelay);
        }
        
        handleTouchStart(e) {
            // Enable activation on first user touch
            if (!this.allowActivation) {
                this.allowActivation = true;
            }
            
            // Immediately close all notebooks when touch starts
            this.isTouching = true;
            this.closeAllNotebooksForScroll();
        }
        
        handleTouchMove(e) {
            // Keep notebooks closed during touch move
            if (!this.isTouching) {
                this.isTouching = true;
                this.closeAllNotebooksForScroll();
            }
        }
        
        handleTouchEnd(e) {
            // Mark touch as ended
            this.isTouching = false;
            // The scroll end timeout will handle reactivation
        }
        
        closeAllNotebooksForScroll() {
            // Immediately remove all active states and animations
            this.notebooks.forEach(notebook => {
                // Force remove all animation classes immediately
                notebook.classList.remove('carousel-active', 'carousel-dimmed', 'carousel-closing');
                
                // Don't manipulate notebook styles - let CSS handle everything
                
                // Portfolio info visibility handled by CSS
            });
            
            this.currentActiveIndex = -1;
            this.isActivating = false; // Clear any activation in progress
        }
        
        snapToNearestNotebook() {
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            
            let closestNotebook = null;
            let closestDistance = Infinity;
            let closestIndex = -1;
            
            // Find closest notebook to center horizontally
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.left + rect.width / 2;
                const distance = Math.abs(notebookCenter - containerCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestNotebook = notebook;
                    closestIndex = index;
                }
            });
            
            if (closestNotebook) {
                // Calculate scroll position to center the notebook
                const containerWidth = this.container.offsetWidth;
                const notebookWidth = closestNotebook.offsetWidth;
                const targetScrollLeft = closestNotebook.offsetLeft - (containerWidth - notebookWidth) / 2;
                
                // Smooth scroll to center
                this.container.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
                
                // Wait for scroll to complete, then check if we should activate
                setTimeout(() => {
                    // Only check active notebook if activation is allowed
                    if (this.allowActivation) {
                        this.checkActiveNotebook();
                    }
                }, 200); // Balanced delay to ensure scroll completes
            }
        }
        
        checkActiveNotebook() {
            
            // Don't activate if not allowed yet
            if (!this.allowActivation) {
                return;
            }
            
            // Re-check which notebook is in center zone horizontally
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            
            
            let closestNotebook = null;
            let closestDistance = Infinity;
            let closestIndex = -1;
            
            // Find the single notebook closest to center
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.left + rect.width / 2;
                const distanceFromCenter = Math.abs(notebookCenter - containerCenter);
                
                
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestNotebook = notebook;
                    closestIndex = index;
                }
            });
            
            
            // Only activate if it's a different notebook than currently active
            if (closestIndex !== -1 && closestIndex !== this.currentActiveIndex) {
                this.activateNotebook(closestIndex);
            } else {
            }
        }
        
        activateNotebook(index) {
            
            // Don't activate if we're currently scrolling, touching, already activating, or activation not allowed
            if (this.isScrolling || this.isTouching || this.isActivating || !this.allowActivation) {
                return;
            }
            
            // Set flag to prevent concurrent activations
            this.isActivating = true;
            
            // If there's a currently active notebook, animate it closing
            if (this.currentActiveIndex !== -1 && this.currentActiveIndex !== index) {
                const previousNotebook = this.notebooks[this.currentActiveIndex];
                const previousIndex = this.currentActiveIndex;
                
                // Add closing class to trigger closing animation
                previousNotebook.classList.add('carousel-closing');
                
                // After the closing animation completes, remove active class and clean up
                setTimeout(() => {
                    previousNotebook.classList.remove('carousel-active', 'carousel-closing');
                    previousNotebook.classList.add('carousel-dimmed');
                }, 800); // Match the closing animation duration
            }
            
            // Update all notebooks - no dimming at all
            this.notebooks.forEach((notebook, i) => {
                // Don't manipulate styles - CSS handles everything
                
                if (i === index) {
                    // Activate the selected notebook
                    notebook.classList.remove('carousel-dimmed');
                    notebook.classList.add('carousel-active');
                } else {
                    // All other notebooks remain normal - no dimming
                    notebook.classList.remove('carousel-active', 'carousel-dimmed');
                }
            });
            
            this.currentActiveIndex = index;
            
            
            // Play book sound when notebook opens with same delay as animation
            if (window.playBookSound) {
                // Play sound immediately for better responsiveness
                setTimeout(() => {
                    window.playBookSound();
                }, 50); // Minimal delay for immediate feedback
            }
            
            // Clear the activating flag after animation starts
            setTimeout(() => {
                this.isActivating = false;
            }, 300); // Clear after initial animation phase
        }
        
        deactivateAllNotebooks() {
            this.notebooks.forEach(notebook => {
                notebook.classList.remove('carousel-active', 'carousel-dimmed');
            });
            this.currentActiveIndex = -1;
        }
        
        resetAllNotebooks() {
            // If there's an active notebook, close it with animation
            if (this.currentActiveIndex !== -1) {
                const activeNotebook = this.notebooks[this.currentActiveIndex];
                activeNotebook.classList.add('carousel-closing');
                
                // Remove closing class after animation
                setTimeout(() => {
                    activeNotebook.classList.remove('carousel-closing');
                }, 100);
            }
            
            // Reset all notebooks to default state
            this.notebooks.forEach(notebook => {
                notebook.classList.remove('carousel-active', 'carousel-dimmed', 'carousel-closing');
            });
            
            this.currentActiveIndex = -1;
        }
        
        restoreScrollPosition(targetScrollLeft) {
            
            // Disable scroll snap temporarily
            this.container.style.scrollSnapType = 'none';
            this.container.scrollLeft = targetScrollLeft;
            
            // Re-enable scroll snap after positioning
            setTimeout(() => {
                this.container.style.scrollSnapType = 'x mandatory';
                this.checkActiveNotebook();
            }, 100);
            
        }
        
        destroy() {
            
            // Clean up for desktop mode
            if (this.projectsContent) {
                this.projectsContent.classList.remove('has-notebook-carousel');
            }
            
            if (this.container) {
                this.container.classList.remove('notebook-carousel-mobile');
                // Remove all event listeners
                this.container.removeEventListener('scroll', this.handleScroll.bind(this));
                this.container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
                this.container.removeEventListener('touchmove', this.handleTouchMove.bind(this));
                this.container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
            }
            
            document.body.classList.remove('notebook-carousel-active');
            document.body.classList.remove('touch-device');
            
            this.notebooks.forEach(notebook => {
                notebook.classList.remove('carousel-active', 'carousel-dimmed', 'carousel-closing');
            });
            
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            
            if (this.carouselObserver) {
                this.carouselObserver.disconnect();
                this.carouselObserver = null;
            }
            
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = null;
            }
            
            this.initialized = false;
            this.initialPositioningComplete = false;
            this.allowActivation = false;
            this.currentActiveIndex = -1;
            this.isTouching = false;
            
            // Clear global reference
            if (currentCarouselInstance === this) {
                currentCarouselInstance = null;
            }
        }
    }
    
    // Initialize with delay to ensure elements are loaded
    function initializeCarousel() {
        
        // Check if we're on mobile and the portfolio tab is active
        if (!isMobileDevice()) {
            return;
        }
        
        const container = document.querySelector('.portfolio-featured-grid');
        if (!container) return;
        
        // Check if carousel is already initialized
        if (container.classList.contains('notebook-carousel-mobile')) {
            // If there's a stored position, try to restore it on the existing instance
            const storedScrollPosition = sessionStorage.getItem('carouselScrollPosition');
            if (storedScrollPosition && currentCarouselInstance) {
                currentCarouselInstance.restoreScrollPosition(parseInt(storedScrollPosition, 10));
                sessionStorage.removeItem('carouselScrollPosition');
            }
            return;
        }
        
        // Clean up any existing instance
        if (currentCarouselInstance) {
            currentCarouselInstance.destroy();
        }
        
        // Check if portfolio content is actually visible
        const projectsContent = document.getElementById('projectsContent');
        if (projectsContent) {
            const isVisible = window.getComputedStyle(projectsContent).display !== 'none' &&
                            window.getComputedStyle(projectsContent).visibility !== 'hidden' &&
                            window.getComputedStyle(projectsContent).opacity !== '0';
            
            if (!isVisible) {
                // Try again after a short delay
                setTimeout(() => initializeCarousel(), 100);
                return;
            }
        }
        
        new NotebookCarousel();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeCarousel();
        });
    } else {
        initializeCarousel();
    }
    
    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', () => {
        initializeCarousel();
    });
    
    // Also try to initialize when portfolio content is loaded
    document.addEventListener('portfolio-loaded', () => {
        initializeCarousel();
    });
    
    // Initialize on window load as fallback
    window.addEventListener('load', () => {
        if (!document.querySelector('.portfolio-featured-grid.notebook-carousel-mobile')) {
            initializeCarousel();
        } else {
        }
    });
    
    // Handle window resize to toggle between desktop and mobile
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const container = document.querySelector('.portfolio-featured-grid');
            if (!container) return;
            
            const isMobile = window.innerWidth <= 768;
            const hasCarousel = container.classList.contains('notebook-carousel-mobile');
            
            if (isMobile && !hasCarousel) {
                // Switch to mobile carousel
                initializeCarousel();
            } else if (!isMobile && hasCarousel) {
                // Switch back to desktop grid
                container.classList.remove('notebook-carousel-mobile');
                container.style.removeProperty('display');
                container.style.removeProperty('overflow-x');
                container.style.removeProperty('overflow-y');
                container.style.removeProperty('scroll-snap-type');
                
                // Remove carousel-specific classes from notebooks
                const notebooks = container.querySelectorAll('.portfolio-item-wrapper');
                notebooks.forEach(notebook => {
                    notebook.classList.remove('carousel-active', 'carousel-dimmed');
                });
                
                // Remove has-notebook-carousel from parent
                const portfolioList = container.closest('.portfolio-list, .portfolio-list--redesigned');
                if (portfolioList) {
                    portfolioList.classList.remove('has-notebook-carousel');
                }
                
                // Remove body class
                document.body.classList.remove('notebook-carousel-active');
            }
        }, 250);
    });
})();