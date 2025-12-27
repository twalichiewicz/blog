/**
 * Notebook Skeleton Loader
 * Manages the visibility of skeleton UI placeholders for notebooks
 */
(function() {
    'use strict';
    
    // Check for :has() support
    const supportsHas = CSS.supports('selector(:has(*))');
    
    function observeNotebookImages() {
        const portfolioItems = document.querySelectorAll('.portfolio-item--featured');
        
        portfolioItems.forEach(item => {
            // Skip if already marked as loaded
            if (item.classList.contains('notebook-content-loaded') || 
                item.classList.contains('notebook-loaded')) {
                return;
            }
            
            const notebookImages = item.querySelectorAll('.notebook-pages-custom, .notebook-page-left-custom');
            
            if (notebookImages.length === 0) {
                // No images, mark as loaded immediately
                markItemAsLoaded(item);
                return;
            }
            
            // Check each image
            let loadedCount = 0;
            const totalImages = notebookImages.length;
            
            notebookImages.forEach(img => {
                // If image is already loaded (cached)
                if (img.complete && img.naturalHeight !== 0) {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        markItemAsLoaded(item);
                    }
                } else {
                    // Wait for image to load
                    img.addEventListener('load', function onLoad() {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            markItemAsLoaded(item);
                        }
                        img.removeEventListener('load', onLoad);
                    });
                    
                    // Handle error case
                    img.addEventListener('error', function onError() {
                        loadedCount++;
                        if (loadedCount === totalImages) {
                            markItemAsLoaded(item);
                        }
                        img.removeEventListener('error', onError);
                    });
                }
            });
        });
    }
    
    function markItemAsLoaded(item) {
        // Add loaded class with a slight delay to ensure smooth transition
        setTimeout(() => {
            item.classList.add('notebook-content-loaded');
            // Also add fallback class for browsers without :has()
            if (!supportsHas) {
                item.classList.add('notebook-loaded');
            }
        }, 100);
    }
    
    function markNotebooksAsLoaded() {
        // For browsers without :has(), also check for notebook structure
        if (!supportsHas) {
            const portfolioItems = document.querySelectorAll('.portfolio-item--featured');
            portfolioItems.forEach(item => {
                const notebook = item.querySelector('.notebook');
                if (notebook && notebook.querySelector('.back-cover')) {
                    // Check for images
                    const hasImages = notebook.querySelector('.notebook-pages-custom, .notebook-page-left-custom');
                    if (!hasImages) {
                        item.classList.add('notebook-loaded');
                    }
                }
            });
        }
        
        // Observe all notebook images
        observeNotebookImages();
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', markNotebooksAsLoaded);
    } else {
        markNotebooksAsLoaded();
    }
    
    // Run on dynamic content load
    document.addEventListener('contentLoaded', markNotebooksAsLoaded);
    document.addEventListener('portfolio-loaded', markNotebooksAsLoaded);
    
    // Also check when all images load
    window.addEventListener('load', markNotebooksAsLoaded);
})();