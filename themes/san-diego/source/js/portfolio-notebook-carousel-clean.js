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
            console.log('[Carousel Debug] Force initialization requested');
            initializeCarousel();
        },
        checkState: () => {
            console.log('[Carousel Debug] Current state:', {
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
            console.log('[Carousel Debug] NotebookCarousel constructor called');
            
            // Clean up any existing instance
            if (currentCarouselInstance) {
                console.log('[Carousel Debug] Cleaning up existing carousel instance');
                currentCarouselInstance.destroy();
            }
            
            this.container = document.querySelector('.portfolio-featured-grid');
            this.projectsContent = document.getElementById('projectsContent');
            
            console.log('[Carousel Debug] Container found:', !!this.container);
            console.log('[Carousel Debug] ProjectsContent found:', !!this.projectsContent);
            console.log('[Carousel Debug] Is mobile device:', isMobileDevice());
            
            // Check tab visibility
            if (this.projectsContent) {
                console.log('[Carousel Debug] ProjectsContent display:', window.getComputedStyle(this.projectsContent).display);
                console.log('[Carousel Debug] ProjectsContent opacity:', window.getComputedStyle(this.projectsContent).opacity);
                console.log('[Carousel Debug] ProjectsContent visibility:', window.getComputedStyle(this.projectsContent).visibility);
            }
            
            if (!this.container || !this.projectsContent || !isMobileDevice()) {
                console.log('[Carousel Debug] Prerequisites not met, exiting constructor');
                return;
            }
            
            this.notebooks = Array.from(this.container.querySelectorAll('.portfolio-item-wrapper'));
            
            console.log('[Carousel Debug] Found notebooks:', this.notebooks.length);
            
            if (this.notebooks.length === 0) {
                console.log('[Carousel Debug] No notebooks found, exiting');
                return;
            }
            
            this.isScrolling = false;
            this.scrollTimeout = null;
            this.currentActiveIndex = -1;
            this.scrollEndDelay = 100; // ms to wait after scroll stops - balanced for mobile
            this.initialized = false;
            this.carouselObserver = null; // Observer to track carousel visibility
            this.initialPositioningComplete = false; // Flag to prevent activation during initial setup
            
            // Store this instance globally
            currentCarouselInstance = this;
            
            this.init();
        }
        
        init() {
            console.log('[Carousel Debug] Initializing carousel');
            // Set up the scrollable container structure
            this.setupContainers();
            
            // Wait for layout to settle, then set up scrolling
            requestAnimationFrame(() => {
                console.log('[Carousel Debug] Setting up scrolling after animation frame');
                this.setupScrolling();
                this.initialized = true;
                
                // Check if browser has already restored scroll position
                if (this.container.scrollLeft > 0) {
                    console.log('[Carousel Debug] Scroll position already set:', this.container.scrollLeft);
                    // Wait a bit for layout to settle then check active
                    setTimeout(() => {
                        this.checkActiveNotebook();
                    }, 100);
                }
            });
        }
        
        setupContainers() {
            console.log('[Carousel Debug] Setting up containers');
            // Make projectsContent the scrollable container
            this.projectsContent.classList.add('has-notebook-carousel');
            
            // Add carousel class to the grid
            this.container.classList.add('notebook-carousel-mobile');
            
            // Add body class as fallback
            document.body.classList.add('notebook-carousel-active');
            
            // Check for stored scroll position
            const storedScrollPosition = sessionStorage.getItem('carouselScrollPosition');
            if (storedScrollPosition) {
                console.log('[Carousel Debug] Found stored scroll position:', storedScrollPosition);
                // Don't reset, will restore position later
            } else {
                this.container.scrollLeft = 0;
                console.log('[Carousel Debug] No stored position, reset scrollLeft to 0');
            }
            
            // Ensure notebooks have fixed sizes
            this.notebooks.forEach((notebook, index) => {
                // Size is handled by CSS, just ensure they're properly styled
                notebook.style.flexShrink = '0';
                console.log('[Carousel Debug] Notebook', index, 'classes:', notebook.className);
            });
        }
        
        setupScrolling() {
            // Set up scroll listener on the carousel container itself for horizontal scroll
            this.container.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Disable hover effects on touch devices by adding a class
            if ('ontouchstart' in window) {
                document.body.classList.add('touch-device');
            }
            
            // Set up intersection observer for zone detection
            this.setupIntersectionObserver();
            
            // Set up visibility observer to track when carousel goes out of view
            this.setupVisibilityObserver();
            
            // Let browser handle scroll restoration, just check active notebook
            setTimeout(() => {
                console.log('[Carousel Debug] Checking active notebook, scroll position:', this.container.scrollLeft);
                this.initialPositioningComplete = true;
                this.checkActiveNotebook();
            }, 200);
            
            // Handle resize
            window.addEventListener('resize', () => {
                if (!isMobileDevice()) {
                    this.destroy();
                } else if (!this.initialized) {
                    this.init();
                }
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
            
            console.log('[Carousel Debug] Setting up intersection observer with options:', options);
            
            this.observer = new IntersectionObserver((entries) => {
                console.log('[Carousel Debug] Intersection observer callback fired, initialPositioningComplete:', this.initialPositioningComplete);
                
                if (!this.initialPositioningComplete) {
                    console.log('[Carousel Debug] Skipping - initial positioning not complete');
                    return; // Don't process during initial setup
                }
                
                // Find the most centered notebook among intersecting entries
                let mostCentered = null;
                let bestCenterDistance = Infinity;
                
                const containerRect = this.container.getBoundingClientRect();
                const containerCenter = containerRect.left + containerRect.width / 2;
                
                console.log('[Carousel Debug] Container center:', containerCenter);
                console.log('[Carousel Debug] Processing', entries.length, 'entries');
                
                entries.forEach(entry => {
                    const rect = entry.target.getBoundingClientRect();
                    const notebookCenter = rect.left + rect.width / 2;
                    const distanceFromCenter = Math.abs(notebookCenter - containerCenter);
                    
                    console.log('[Carousel Debug] Entry:', {
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
                
                // Activate immediately when centered, even while scrolling
                if (mostCentered) {
                    const index = this.notebooks.indexOf(mostCentered);
                    console.log('[Carousel Debug] Most centered notebook index:', index, 'current active:', this.currentActiveIndex);
                    if (index !== -1 && index !== this.currentActiveIndex) {
                        console.log('[Carousel Debug] Activating notebook at index:', index);
                        this.activateNotebook(index);
                    }
                } else {
                    console.log('[Carousel Debug] No centered notebook found');
                }
            }, options);
            
            // Observe all notebooks
            console.log('[Carousel Debug] Observing', this.notebooks.length, 'notebooks');
            this.notebooks.forEach((notebook, index) => {
                this.observer.observe(notebook);
                console.log('[Carousel Debug] Started observing notebook at index:', index);
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
            // Clear existing timeout
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Always check active notebook on scroll to handle browser scroll restoration
            if (this.initialPositioningComplete) {
                this.checkActiveNotebook();
            }
            
            // Set new timeout for snapping
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.snapToNearestNotebook();
            }, this.scrollEndDelay);
            
            // Mark as scrolling but don't deactivate notebooks
            this.isScrolling = true;
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
                
                // Wait for scroll to complete, then activate
                setTimeout(() => {
                    this.checkActiveNotebook();
                }, 200); // Balanced delay to ensure scroll completes
            }
        }
        
        checkActiveNotebook() {
            console.log('[Carousel Debug] checkActiveNotebook called');
            // Re-check which notebook is in center zone horizontally
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            
            console.log('[Carousel Debug] Container center:', containerCenter);
            
            let closestNotebook = null;
            let closestDistance = Infinity;
            let closestIndex = -1;
            
            // Find the single notebook closest to center
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.left + rect.width / 2;
                const distanceFromCenter = Math.abs(notebookCenter - containerCenter);
                
                console.log('[Carousel Debug] Notebook', index, 'center:', notebookCenter, 'distance:', distanceFromCenter);
                
                if (distanceFromCenter < closestDistance) {
                    closestDistance = distanceFromCenter;
                    closestNotebook = notebook;
                    closestIndex = index;
                }
            });
            
            console.log('[Carousel Debug] Closest notebook index:', closestIndex, 'current active:', this.currentActiveIndex);
            
            // Only activate if it's a different notebook than currently active
            if (closestIndex !== -1 && closestIndex !== this.currentActiveIndex) {
                console.log('[Carousel Debug] Activating notebook at index:', closestIndex);
                this.activateNotebook(closestIndex);
            } else {
                console.log('[Carousel Debug] No change needed, keeping current active notebook');
            }
        }
        
        activateNotebook(index) {
            console.log('[Carousel Debug] activateNotebook called with index:', index);
            
            // If there's a currently active notebook, animate it closing
            if (this.currentActiveIndex !== -1 && this.currentActiveIndex !== index) {
                const previousNotebook = this.notebooks[this.currentActiveIndex];
                const previousIndex = this.currentActiveIndex;
                console.log('[Carousel Debug] Closing previous notebook at index:', this.currentActiveIndex);
                
                // Add closing class to trigger closing animation
                previousNotebook.classList.add('carousel-closing');
                
                // After the closing animation completes, remove active class and clean up
                setTimeout(() => {
                    previousNotebook.classList.remove('carousel-active', 'carousel-closing');
                    previousNotebook.classList.add('carousel-dimmed');
                }, 800); // Match the closing animation duration
            }
            
            // Dim all notebooks except the one being activated
            this.notebooks.forEach((notebook, i) => {
                if (i !== index && i !== this.currentActiveIndex) {
                    notebook.classList.remove('carousel-active');
                    notebook.classList.add('carousel-dimmed');
                }
            });
            
            // Remove dimmed state and activate the selected notebook
            this.notebooks[index].classList.remove('carousel-dimmed');
            this.notebooks[index].classList.add('carousel-active');
            this.currentActiveIndex = index;
            
            console.log('[Carousel Debug] Notebook activated. Classes on notebook:', this.notebooks[index].className);
            
            // Play book sound when notebook opens with same delay as animation
            if (window.playBookSound) {
                console.log('[Carousel Debug] Playing book sound');
                // Play sound immediately for better responsiveness
                setTimeout(() => {
                    window.playBookSound();
                }, 50); // Minimal delay for immediate feedback
            }
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
            console.log('[Carousel Debug] Restoring scroll position to:', targetScrollLeft);
            
            // Disable scroll snap temporarily
            this.container.style.scrollSnapType = 'none';
            this.container.scrollLeft = targetScrollLeft;
            
            // Re-enable scroll snap after positioning
            setTimeout(() => {
                this.container.style.scrollSnapType = 'x mandatory';
                this.checkActiveNotebook();
            }, 100);
            
            console.log('[Carousel Debug] Scroll position restored to:', targetScrollLeft);
        }
        
        destroy() {
            console.log('[Carousel Debug] Destroying carousel instance');
            
            // Clean up for desktop mode
            if (this.projectsContent) {
                this.projectsContent.classList.remove('has-notebook-carousel');
            }
            
            if (this.container) {
                this.container.classList.remove('notebook-carousel-mobile');
                // Create a new bound function for removal
                const scrollHandler = this.handleScroll.bind(this);
                this.container.removeEventListener('scroll', scrollHandler);
            }
            
            document.body.classList.remove('notebook-carousel-active');
            document.body.classList.remove('touch-device');
            
            this.notebooks.forEach(notebook => {
                notebook.style.flexShrink = '';
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
            this.currentActiveIndex = -1;
            
            // Clear global reference
            if (currentCarouselInstance === this) {
                currentCarouselInstance = null;
            }
        }
    }
    
    // Initialize with delay to ensure elements are loaded
    function initializeCarousel() {
        console.log('[Carousel Debug] initializeCarousel called');
        console.log('[Carousel Debug] Window width:', window.innerWidth);
        console.log('[Carousel Debug] Has touch:', 'ontouchstart' in window);
        console.log('[Carousel Debug] Is mobile device:', isMobileDevice());
        
        // Check if we're on mobile and the portfolio tab is active
        if (!isMobileDevice()) {
            console.log('[Carousel Debug] Not mobile device, skipping initialization');
            return;
        }
        
        const container = document.querySelector('.portfolio-featured-grid');
        console.log('[Carousel Debug] Portfolio grid found:', !!container);
        if (!container) return;
        
        // Check if carousel is already initialized
        if (container.classList.contains('notebook-carousel-mobile')) {
            console.log('[Carousel Debug] Carousel already initialized');
            // If there's a stored position, try to restore it on the existing instance
            const storedScrollPosition = sessionStorage.getItem('carouselScrollPosition');
            if (storedScrollPosition && currentCarouselInstance) {
                console.log('[Carousel Debug] Restoring position on existing instance');
                currentCarouselInstance.restoreScrollPosition(parseInt(storedScrollPosition, 10));
                sessionStorage.removeItem('carouselScrollPosition');
            }
            return;
        }
        
        // Clean up any existing instance
        if (currentCarouselInstance) {
            console.log('[Carousel Debug] Cleaning up existing instance');
            currentCarouselInstance.destroy();
        }
        
        // Check if portfolio content is actually visible
        const projectsContent = document.getElementById('projectsContent');
        if (projectsContent) {
            const isVisible = window.getComputedStyle(projectsContent).display !== 'none' &&
                            window.getComputedStyle(projectsContent).visibility !== 'hidden' &&
                            window.getComputedStyle(projectsContent).opacity !== '0';
            console.log('[Carousel Debug] Projects content visible:', isVisible);
            
            if (!isVisible) {
                console.log('[Carousel Debug] Projects content not visible, delaying initialization');
                // Try again after a short delay
                setTimeout(() => initializeCarousel(), 100);
                return;
            }
        }
        
        console.log('[Carousel Debug] Creating new NotebookCarousel instance');
        new NotebookCarousel();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        console.log('[Carousel Debug] DOM still loading, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[Carousel Debug] DOMContentLoaded fired');
            initializeCarousel();
        });
    } else {
        console.log('[Carousel Debug] DOM already loaded, initializing immediately');
        initializeCarousel();
    }
    
    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', () => {
        console.log('[Carousel Debug] contentLoaded event fired');
        initializeCarousel();
    });
    
    // Also try to initialize when portfolio content is loaded
    document.addEventListener('portfolio-loaded', () => {
        console.log('[Carousel Debug] portfolio-loaded event fired');
        initializeCarousel();
    });
    
    // Initialize on window load as fallback
    window.addEventListener('load', () => {
        console.log('[Carousel Debug] window load event fired');
        if (!document.querySelector('.portfolio-featured-grid.notebook-carousel-mobile')) {
            console.log('[Carousel Debug] Carousel not found on window load, initializing');
            initializeCarousel();
        } else {
            console.log('[Carousel Debug] Carousel already exists on window load');
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