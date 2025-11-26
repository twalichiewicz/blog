/**
 * Portfolio Filter System
 * Handles filtering of portfolio items by tags
 */
(function() {
    'use strict';

    let activeFilters = new Map(); // Map of category -> Set of active filters
    
    function initPortfolioFilters() {
        const filterPills = document.querySelectorAll('.filter-pill');
        const clearButton = document.querySelector('.filter-clear');
        const portfolioItems = document.querySelectorAll('.portfolio-item-wrapper');
        
        if (!filterPills.length || !portfolioItems.length) return;
        
        // Initialize filter pill click handlers
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => toggleFilter(pill));
        });
        
        // Initialize clear button
        if (clearButton) {
            clearButton.addEventListener('click', clearAllFilters);
            updateClearButton();
        }
    }
    
    function toggleFilter(pill) {
        const filter = pill.dataset.filter;
        const category = pill.dataset.category;
        
        if (!category || !filter) return;
        
        // Initialize category set if needed
        if (!activeFilters.has(category)) {
            activeFilters.set(category, new Set());
        }
        
        const categoryFilters = activeFilters.get(category);
        
        if (categoryFilters.has(filter)) {
            categoryFilters.delete(filter);
            pill.classList.remove('active');
        } else {
            categoryFilters.add(filter);
            pill.classList.add('active');
        }
        
        // Clean up empty categories
        if (categoryFilters.size === 0) {
            activeFilters.delete(category);
        }
        
        // Play sound effect
        if (window.soundEffects && window.soundEffects.play) {
            window.soundEffects.play('toggle');
        }
        
        applyFilters();
        updateClearButton();
        
        // Emit event for dropdown to update count
        window.dispatchEvent(new Event('portfolio-filters-applied'));
    }
    
    function applyFilters() {
        const portfolioItems = document.querySelectorAll('.portfolio-item-wrapper');
        
        portfolioItems.forEach(item => {
            let shouldShow = true;
            
            // Check each active category
            for (const [category, filters] of activeFilters) {
                if (filters.size === 0) continue;
                
                const itemData = item.dataset[category] || '';
                const itemTags = itemData.split(' ').filter(t => t);
                
                // Check if item has at least one active filter from this category
                const hasMatch = Array.from(filters).some(filter => 
                    itemTags.includes(filter)
                );
                
                if (!hasMatch) {
                    shouldShow = false;
                    break;
                }
            }
            
            // Show/hide item
            if (shouldShow) {
                item.classList.remove('filtered-out');
            } else {
                item.classList.add('filtered-out');
            }
        });
        
        // Update visible count
        updateVisibleCount();
    }
    
    function clearAllFilters() {
        activeFilters.clear();
        
        // Remove active class from all pills
        document.querySelectorAll('.filter-pill.active').forEach(pill => {
            pill.classList.remove('active');
        });
        
        // Show all items
        document.querySelectorAll('.portfolio-item-wrapper').forEach(item => {
            item.classList.remove('filtered-out');
        });
        
        // Play sound effect
        if (window.soundEffects && window.soundEffects.play) {
            window.soundEffects.play('smallClick');
        }
        
        updateClearButton();
        updateVisibleCount();
        
        // Trigger portfolio parallax update
        window.dispatchEvent(new Event('portfolio-updated'));
        
        // Emit event for dropdown to update count
        window.dispatchEvent(new Event('portfolio-filters-applied'));
    }
    
    function updateClearButton() {
        const clearButton = document.querySelector('.filter-clear');
        if (!clearButton) return;
        
        const hasActiveFilters = activeFilters.size > 0;
        clearButton.disabled = !hasActiveFilters;
    }
    
    function updateVisibleCount() {
        const total = document.querySelectorAll('.portfolio-item-wrapper').length;
        const visible = document.querySelectorAll('.portfolio-item-wrapper:not(.filtered-out)').length;
        
        // Could add a visible count indicator if desired
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioFilters);
    } else {
        initPortfolioFilters();
    }
    
    // Reinitialize after dynamic content loads
    document.addEventListener('blog:content-loaded', initPortfolioFilters);
    document.addEventListener('portfolio:loaded', initPortfolioFilters);
    
    // Listen for filter changes from modal
    window.addEventListener('portfolio-filters-changed', (e) => {
        if (e.detail && e.detail.filters) {
            activeFilters = new Map(e.detail.filters);
            applyFilters();
        }
    });
    
    // Expose API for modal
    window.portfolioFilters = {
        getActiveFilters: () => activeFilters,
        setActiveFilters: (filters) => {
            activeFilters = new Map(filters);
            applyFilters();
        }
    };
})();