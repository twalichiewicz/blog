/**
 * Portfolio Notebook Carousel with State Management
 * Simple carousel that persists active slide and applies hover animation to active item
 */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'portfolio-carousel-state';
    let currentInstance = null;
    
    class NotebookCarousel {
        constructor() {
            this.container = document.querySelector('.portfolio-featured-grid');
            if (!this.container || !this.isMobile()) return;
            
            // Clean up any existing instance
            if (currentInstance) {
                currentInstance.destroy();
            }
            
            this.notebooks = Array.from(this.container.querySelectorAll('.portfolio-item-wrapper'));
            if (this.notebooks.length === 0) return;
            
            // Load saved state
            this.activeIndex = this.loadState();
            this.isScrolling = false;
            
            // Check if this is the first time showing portfolio tab in this session
            // This resets on new browser sessions but persists during navigation
            const isBackNavigation = sessionStorage.getItem('portfolio-back-navigation') === 'true';
            if (isBackNavigation) {
                // Clear the flag
                sessionStorage.removeItem('portfolio-back-navigation');
                this.isInitialTabLoad = false;
            } else {
                this.isInitialTabLoad = !sessionStorage.getItem('portfolio-tab-shown');
            }
            
            currentInstance = this;
            this.init();
        }
        
        isMobile() {
            return window.innerWidth <= 768;
        }
        
        loadState() {
            try {
                const state = localStorage.getItem(STORAGE_KEY);
                if (state) {
                    const parsed = JSON.parse(state);
                    return parsed.activeIndex || 0;
                }
            } catch (e) {
                console.error('Failed to load carousel state:', e);
            }
            return 0;
        }
        
        saveState() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    activeIndex: this.activeIndex,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.error('Failed to save carousel state:', e);
            }
        }
        
        init() {
            // Add carousel class
            this.container.classList.add('notebook-carousel-mobile');
            document.body.classList.add('notebook-carousel-active');
            
            // Set up scroll handling
            this.container.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Save state when navigating away
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.href && !link.href.startsWith('#')) {
                    this.saveState();
                }
            });
            
            // Save state when tab switches
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.dataset.type !== 'portfolio') {
                        this.saveState();
                    }
                });
            });
            
            // Save state before page unload
            window.addEventListener('beforeunload', () => {
                this.saveState();
            });
            
            // Restore position and activate
            requestAnimationFrame(() => {
                if (this.isInitialTabLoad) {
                    // First time showing portfolio tab in this session
                    // Just scroll to first notebook but don't activate
                    this.scrollToNotebook(0, false);
                    // Mark that portfolio tab has been shown
                    sessionStorage.setItem('portfolio-tab-shown', 'true');
                    this.isInitialTabLoad = false;
                } else {
                    // Returning to portfolio tab or via back button
                    // Restore the saved position and activate
                    this.scrollToNotebook(this.activeIndex, false);
                    this.activateNotebook(this.activeIndex);
                }
            });
        }
        
        handleScroll() {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Much shorter delay for quicker response
            this.scrollTimeout = setTimeout(() => {
                this.snapToNearest();
            }, 50);
        }
        
        snapToNearest() {
            const containerRect = this.container.getBoundingClientRect();
            const center = containerRect.left + containerRect.width / 2;
            
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            this.notebooks.forEach((notebook, index) => {
                const rect = notebook.getBoundingClientRect();
                const notebookCenter = rect.left + rect.width / 2;
                const distance = Math.abs(notebookCenter - center);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            
            if (closestIndex !== this.activeIndex) {
                this.activateNotebook(closestIndex);
                this.saveState();
            }
            
            // Ensure perfect centering
            this.scrollToNotebook(closestIndex, true);
        }
        
        scrollToNotebook(index, smooth = true) {
            const notebook = this.notebooks[index];
            if (!notebook) return;
            
            const containerWidth = this.container.offsetWidth;
            const notebookWidth = notebook.offsetWidth;
            const targetScrollLeft = notebook.offsetLeft - (containerWidth - notebookWidth) / 2;
            
            this.container.scrollTo({
                left: targetScrollLeft,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
        
        activateNotebook(index) {
            // Validate index
            if (index < 0 || index >= this.notebooks.length) return;
            
            // Remove all active states
            this.notebooks.forEach((notebook, i) => {
                notebook.classList.remove('carousel-active');
                notebook.classList.toggle('carousel-inactive', i !== index);
            });
            
            // Add active state to current
            this.notebooks[index].classList.add('carousel-active');
            this.activeIndex = index;
            
            // Play sound effect
            if (window.playBookSound) {
                window.playBookSound();
            }
        }
        
        checkAndRestorePosition() {
            const savedState = this.loadState();
            if (savedState !== this.activeIndex) {
                this.activeIndex = savedState;
                this.scrollToNotebook(savedState, false);
                this.activateNotebook(savedState);
            }
        }
        
        destroy() {
            // Save state before destroying
            this.saveState();
            
            if (this.container) {
                this.container.classList.remove('notebook-carousel-mobile');
                this.container.removeEventListener('scroll', this.handleScroll.bind(this));
            }
            
            document.body.classList.remove('notebook-carousel-active');
            
            this.notebooks.forEach(notebook => {
                notebook.classList.remove('carousel-active', 'carousel-inactive');
            });
            
            if (currentInstance === this) {
                currentInstance = null;
            }
        }
    }
    
    // Initialize on various events
    function initialize(isBackNavigation = false) {
        const container = document.querySelector('.portfolio-featured-grid');
        if (!container) return;
        
        // Check if we're on mobile and portfolio is visible
        if (window.innerWidth > 768) return;
        
        const projectsContent = document.getElementById('projectsContent');
        if (!projectsContent) return;
        
        // Check if portfolio tab is actually visible
        const isVisible = window.getComputedStyle(projectsContent).display !== 'none';
        if (!isVisible) return;
        
        // If coming from back navigation, mark it in sessionStorage
        if (isBackNavigation) {
            sessionStorage.setItem('portfolio-back-navigation', 'true');
        }
        
        // Don't reinitialize if already initialized and at correct position
        if (currentInstance && currentInstance.container && currentInstance.container.classList.contains('notebook-carousel-mobile')) {
            // Just ensure the position is restored
            const state = currentInstance.loadState();
            if (state !== currentInstance.activeIndex) {
                currentInstance.activeIndex = state;
                currentInstance.scrollToNotebook(state, false);
                currentInstance.activateNotebook(state);
            }
            return;
        }
        
        new NotebookCarousel();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Re-initialize on dynamic content load
    document.addEventListener('contentLoaded', initialize);
    document.addEventListener('portfolio-loaded', initialize);
    
    // Export for debugging
    window._notebookCarousel = {
        getInstance: () => currentInstance,
        reinitialize: initialize
    };
})();