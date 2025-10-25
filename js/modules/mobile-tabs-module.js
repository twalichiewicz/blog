/**
 * Mobile Tabs Module for San Diego Theme
 * Handles tab functionality for mobile and desktop views
 */
(function(SD) {
  'use strict';

  class MobileTabsModule {
    constructor() {
      this.initialized = false;
      this.config = {
        tabsWrapperSelector: '.tabs-wrapper',
        tabContainerSelector: '.mobile-tabs',
        tabButtonSelector: '.tab-button',
        postsContentId: 'postsContent',
        projectsContentId: 'projectsContent',
        searchBarSelector: '.search-bar'
      };
      this.elements = {};
      this.activeTab = 'blog';
      this.isMobile = false;
    }

    init() {
      if (this.initialized) return;

      this.cacheElements();
      this.checkDevice();
      this.setupEventListeners();
      this.checkInitialTab();
      
      this.initialized = true;
      SD.events.emit('mobile-tabs:initialized');
    }

    destroy() {
      // Clean up event listeners
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
      
      // Reset state
      this.initialized = false;
      this.elements = {};
      
      SD.events.emit('mobile-tabs:destroyed');
    }

    cacheElements() {
      this.elements = {
        tabsWrapper: document.querySelector(this.config.tabsWrapperSelector),
        tabContainer: document.querySelector(this.config.tabContainerSelector),
        blogTab: document.querySelector('[data-tab="blog"]'),
        portfolioTab: document.querySelector('[data-tab="portfolio"]'),
        postsContent: document.getElementById(this.config.postsContentId),
        projectsContent: document.getElementById(this.config.projectsContentId),
        searchBar: document.querySelector(this.config.searchBarSelector)
      };
    }

    checkDevice() {
      this.isMobile = window.innerWidth <= 768;
      document.body.classList.toggle('mobile-tabs-active', this.isMobile);
    }

    setupEventListeners() {
      // Tab click handlers
      if (this.elements.blogTab) {
        this.elements.blogTab.addEventListener('click', () => this.switchTab('blog'));
      }
      
      if (this.elements.portfolioTab) {
        this.elements.portfolioTab.addEventListener('click', () => this.switchTab('portfolio'));
      }

      // Window resize handler
      this.resizeHandler = this.debounce(() => {
        const wasMobile = this.isMobile;
        this.checkDevice();
        
        if (wasMobile !== this.isMobile) {
          this.handleDeviceChange();
        }
      }, 250);
      
      window.addEventListener('resize', this.resizeHandler);

      // Handle browser back/forward
      window.addEventListener('popstate', (event) => {
        if (event.state && event.state.tab) {
          this.switchTab(event.state.tab, false, false);
        }
      });
    }

    checkInitialTab() {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      
      if (tabParam === 'portfolio' || tabParam === 'works') {
        this.switchTab('portfolio', false);
      } else if (tabParam === 'blog' || tabParam === 'words') {
        this.switchTab('blog', false);
      }

      // Check hash for anchor links
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash.startsWith('project-')) {
          this.switchTab('portfolio', false);
        }
      }
    }

    switchTab(tab, playSound = true, updateHistory = true) {
      if (tab === this.activeTab) return;

      this.activeTab = tab;

      // Update tab buttons
      this.updateTabButtons(tab);

      // Update content visibility
      this.updateContentVisibility(tab);

      // Handle search bar visibility
      this.updateSearchBarVisibility(tab);

      // Play sound effect
      if (playSound && SD.utils.sound) {
        SD.utils.sound.playSlider();
      }

      // Update URL
      if (updateHistory) {
        this.updateURL(tab);
      }

      // Emit event
      SD.events.emit('mobile-tabs:switched', { tab });
    }

    updateTabButtons(activeTab) {
      const tabs = document.querySelectorAll(this.config.tabButtonSelector);
      tabs.forEach(tab => {
        const isActive = tab.dataset.tab === activeTab;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
      });
    }

    updateContentVisibility(activeTab) {
      if (this.elements.postsContent) {
        this.elements.postsContent.style.display = activeTab === 'blog' ? 'block' : 'none';
      }
      
      if (this.elements.projectsContent) {
        this.elements.projectsContent.style.display = activeTab === 'portfolio' ? 'block' : 'none';
      }
    }

    updateSearchBarVisibility(activeTab) {
      if (this.elements.searchBar) {
        this.elements.searchBar.style.display = activeTab === 'blog' ? 'block' : 'none';
      }
    }

    updateURL(tab) {
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      
      const state = { tab };
      window.history.pushState(state, '', url);
    }

    handleDeviceChange() {
      if (!this.isMobile) {
        // Show both contents on desktop
        if (this.elements.postsContent) {
          this.elements.postsContent.style.display = 'block';
        }
        if (this.elements.projectsContent) {
          this.elements.projectsContent.style.display = 'block';
        }
        if (this.elements.searchBar) {
          this.elements.searchBar.style.display = 'block';
        }
      } else {
        // Apply current tab state on mobile
        this.updateContentVisibility(this.activeTab);
        this.updateSearchBarVisibility(this.activeTab);
      }
    }

    setActiveTab(tab) {
      this.switchTab(tab, false);
    }

    getActiveTab() {
      return this.activeTab;
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  }

  // Create and register the module
  const mobileTabsModule = new MobileTabsModule();
  
  // Register with SD namespace
  SD.ui.tabs.mobile = mobileTabsModule;
  SD.registerModule('mobile-tabs', mobileTabsModule);

})(window.SD || (window.SD = {}));