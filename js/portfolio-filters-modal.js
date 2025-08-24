/**
 * Portfolio Filters Modal
 * Handles the modal UI for portfolio filters
 */
(function() {
    'use strict';
    
    let pendingFilters = new Map(); // Temporary filters while modal is open
    let originalFilters = new Map(); // Store original state when opening modal
    
    function initFiltersModal() {
        const openButton = document.getElementById('openFiltersModal');
        const modal = document.getElementById('filtersModal');
        const closeButton = modal?.querySelector('.filters-modal-close');
        const backdrop = modal?.querySelector('.filters-modal-backdrop');
        const applyButton = modal?.querySelector('.filters-apply');
        const clearButton = modal?.querySelector('.filter-clear');
        
        if (!openButton || !modal) return;
        
        // Open modal
        openButton.addEventListener('click', () => {
            openModal(modal);
            playSound('smallClick');
        });
        
        // Close modal handlers
        closeButton?.addEventListener('click', () => {
            closeModal(modal);
            playSound('smallClick');
        });
        
        backdrop?.addEventListener('click', () => {
            closeModal(modal);
        });
        
        // Apply filters
        applyButton?.addEventListener('click', () => {
            applyFilters();
            closeModal(modal);
            playSound('smallClick');
        });
        
        // Clear filters in modal
        clearButton?.addEventListener('click', () => {
            clearModalFilters();
            playSound('smallClick');
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal(modal);
            }
        });
        
        // Initialize filter pills in modal
        const modalFilterPills = modal.querySelectorAll('.filter-pill');
        modalFilterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                toggleModalFilter(pill);
                playSound('toggleSound');
            });
        });
    }
    
    function openModal(modal) {
        // Store current filter state
        if (window.portfolioFilters && window.portfolioFilters.getActiveFilters) {
            originalFilters = new Map(window.portfolioFilters.getActiveFilters());
            pendingFilters = new Map(originalFilters);
        }
        
        // Sync modal filter pills with current state
        syncModalFilters();
        
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus();
    }
    
    function closeModal(modal) {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset to original filters if not applied
        pendingFilters = new Map(originalFilters);
        syncModalFilters();
        
        // Return focus to open button
        document.getElementById('openFiltersModal')?.focus();
    }
    
    function toggleModalFilter(pill) {
        const filter = pill.dataset.filter;
        const category = pill.dataset.category;
        
        if (!pendingFilters.has(category)) {
            pendingFilters.set(category, new Set());
        }
        
        const categoryFilters = pendingFilters.get(category);
        
        if (categoryFilters.has(filter)) {
            categoryFilters.delete(filter);
            pill.classList.remove('active');
        } else {
            categoryFilters.add(filter);
            pill.classList.add('active');
        }
        
        updateModalClearButton();
    }
    
    function syncModalFilters() {
        const modal = document.getElementById('filtersModal');
        const pills = modal?.querySelectorAll('.filter-pill');
        
        pills?.forEach(pill => {
            const filter = pill.dataset.filter;
            const category = pill.dataset.category;
            const isActive = pendingFilters.get(category)?.has(filter) || false;
            
            pill.classList.toggle('active', isActive);
        });
        
        updateModalClearButton();
    }
    
    function clearModalFilters() {
        pendingFilters.clear();
        
        const modal = document.getElementById('filtersModal');
        const pills = modal?.querySelectorAll('.filter-pill');
        pills?.forEach(pill => pill.classList.remove('active'));
        
        updateModalClearButton();
    }
    
    function applyFilters() {
        // Apply pending filters to the main filter system
        if (window.portfolioFilters && window.portfolioFilters.setActiveFilters) {
            window.portfolioFilters.setActiveFilters(pendingFilters);
        }
        
        // Trigger filter update
        window.dispatchEvent(new CustomEvent('portfolio-filters-changed', {
            detail: { filters: pendingFilters }
        }));
    }
    
    function updateModalClearButton() {
        const modal = document.getElementById('filtersModal');
        const clearButton = modal?.querySelector('.filter-clear');
        if (!clearButton) return;
        
        const hasFilters = Array.from(pendingFilters.values()).some(set => set.size > 0);
        clearButton.disabled = !hasFilters;
    }
    
    function playSound(soundName) {
        if (window.soundEffects && window.soundEffects.play) {
            window.soundEffects.play(soundName);
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFiltersModal);
    } else {
        initFiltersModal();
    }
    
    // Reinitialize on dynamic content load
    window.addEventListener('portfolio-loaded', initFiltersModal);
})();