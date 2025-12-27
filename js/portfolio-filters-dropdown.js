/**
 * Portfolio Filters Dropdown
 * Handles the dropdown UI for portfolio filters with auto-apply
 */
(function() {
    'use strict';
    
    let isDropdownOpen = false;
    let dropdownTimeout = null;
    
    function initFiltersDropdown() {
        const toggleButton = document.getElementById('filtersToggle');
        const dropdown = document.getElementById('filtersDropdown');
        const dropdownContainer = document.querySelector('.filters-dropdown-container');
        
        if (!toggleButton || !dropdown) return;
        
        // Toggle dropdown on button click
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (isDropdownOpen && !dropdownContainer.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Handle mouse leave with delay
        dropdownContainer.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                if (isDropdownOpen) {
                    closeDropdown();
                }
            }, 300); // Small delay to prevent accidental closes
        });
        
        // Cancel close if mouse re-enters
        dropdownContainer.addEventListener('mouseenter', () => {
            if (dropdownTimeout) {
                clearTimeout(dropdownTimeout);
                dropdownTimeout = null;
            }
        });
        
        // Update filter count pip
        updateFilterCountPip();
        
        // Listen for filter changes
        window.addEventListener('portfolio-filters-applied', updateFilterCountPip);
        
        // Also listen for portfolio loaded event to update count
        window.addEventListener('portfolio-loaded', updateFilterCountPip);
    }
    
    function toggleDropdown() {
        const dropdown = document.getElementById('filtersDropdown');
        
        if (isDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    function openDropdown() {
        const dropdown = document.getElementById('filtersDropdown');
        const toggleButton = document.getElementById('filtersToggle');
        
        dropdown.style.display = 'block';
        toggleButton.classList.add('active');
        isDropdownOpen = true;
        
        // Play sound
        if (window.soundEffects && window.soundEffects.play) {
            window.soundEffects.play('smallClick');
        }
        
        // Focus first filter pill
        setTimeout(() => {
            const firstPill = dropdown.querySelector('.filter-pill');
            firstPill?.focus();
        }, 100);
    }
    
    function closeDropdown() {
        const dropdown = document.getElementById('filtersDropdown');
        const toggleButton = document.getElementById('filtersToggle');
        
        dropdown.style.display = 'none';
        toggleButton.classList.remove('active');
        isDropdownOpen = false;
        
        // Clear any pending timeout
        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
            dropdownTimeout = null;
        }
    }
    
    function updateFilterCountPip() {
        const pip = document.querySelector('.filter-count-pip');
        if (!pip) return;
        
        let totalActiveFilters = 0;
        
        // Count active filters
        if (window.portfolioFilters && window.portfolioFilters.getActiveFilters) {
            const activeFilters = window.portfolioFilters.getActiveFilters();
            for (const [category, filters] of activeFilters) {
                totalActiveFilters += filters.size;
            }
        }
        
        // Update pip
        if (totalActiveFilters > 0) {
            pip.textContent = totalActiveFilters;
            pip.style.display = 'inline-flex';
        } else {
            pip.style.display = 'none';
        }
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFiltersDropdown);
    } else {
        initFiltersDropdown();
    }
    
    // Reinitialize on dynamic content load
    window.addEventListener('portfolio-loaded', initFiltersDropdown);
    document.addEventListener('blog:content-loaded', initFiltersDropdown);
})();