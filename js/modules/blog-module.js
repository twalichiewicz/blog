/**
 * Blog Module for San Diego Theme
 * Handles blog functionality including search, dynamic content, and navigation
 */
(function(SD) {
  'use strict';

  class BlogModule {
    constructor() {
      this.initialized = false;
      this.currentTab = 'blog';
      this.searchIndex = null;
      this.initialContent = {
        html: null,
        url: null
      };
    }

    init() {
      if (this.initialized) return;

      // Store initial content for back navigation
      const blogContentElement = document.querySelector('.blog-content');
      if (blogContentElement) {
        this.initialContent.html = blogContentElement.innerHTML;
        this.initialContent.url = window.location.pathname + window.location.search + window.location.hash;
      }

      // Initialize features
      this.initializeSearch();
      this.initializeExpandButtons();
      this.initializeDynamicNavigation();
      this.initializeProjectToggle();
      this.initializePostsOnlyButton();

      this.initialized = true;
      SD.events.emit('blog:initialized');
    }

    initializeSearch() {
      const searchInput = document.querySelector('#postSearch');
      if (!searchInput) return;

      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });

      // Build search index
      this.buildSearchIndex();
    }

    buildSearchIndex() {
      this.searchIndex = [];
      const posts = document.querySelectorAll('.blog-post, .portfolio-item');
      
      posts.forEach(post => {
        const title = post.querySelector('.post-title, .portfolio-title')?.textContent || '';
        const summary = post.querySelector('.summary')?.textContent || '';
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent);
        
        this.searchIndex.push({
          element: post,
          searchText: `${title} ${summary} ${tags.join(' ')}`.toLowerCase()
        });
      });
    }

    handleSearch(query) {
      if (!this.searchIndex) return;

      const searchTerm = query.toLowerCase().trim();
      
      this.searchIndex.forEach(item => {
        if (!searchTerm || item.searchText.includes(searchTerm)) {
          item.element.style.display = '';
        } else {
          item.element.style.display = 'none';
        }
      });

      SD.events.emit('blog:search', { query: searchTerm });
    }

    initializeExpandButtons() {
      const expandButtons = document.querySelectorAll('.expand-button');
      expandButtons.forEach(btn => {
        btn.addEventListener('click', (e) => this.toggleExpand(e));
      });
    }

    toggleExpand(event) {
      const button = event.currentTarget;
      const postContent = button.closest('.blog-post').querySelector('.post-content');
      
      if (!postContent) return;

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      postContent.style.display = isExpanded ? 'none' : 'block';

      // Play sound effect
      if (SD.utils.sound) {
        SD.utils.sound.playToggle();
      }
    }

    initializeDynamicNavigation() {
      const blogContentElement = document.querySelector('.blog-content');
      if (!blogContentElement) return;

      // Handle browser back/forward
      window.addEventListener('popstate', (event) => {
        if (event.state && event.state.blogContent) {
          this.restoreContent(event.state.blogContent, event.state.url);
        } else {
          this.restoreInitialContent();
        }
      });
    }

    scrollToFullStory() {
      const fullStoryElement = document.getElementById('full-story');
      if (!fullStoryElement) return;

      fullStoryElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    async fetchAndDisplayContent(postUrl) {
      const blogContentElement = document.querySelector('.blog-content');
      if (!blogContentElement) return;

      // Save current state
      const currentState = {
        blogContent: blogContentElement.innerHTML,
        url: window.location.pathname + window.location.search + window.location.hash
      };
      window.history.replaceState(currentState, '', currentState.url);

      try {
        // Show loading state
        blogContentElement.style.opacity = '0.5';
        
        const response = await fetch(postUrl);
        const html = await response.text();
        
        // Parse and extract content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.blog-content');
        
        if (newContent) {
          blogContentElement.innerHTML = newContent.innerHTML;
          
          // Update URL without reloading
          window.history.pushState({ blogContent: newContent.innerHTML, url: postUrl }, '', postUrl);
          
          // Reinitialize features for new content
          this.reinitializeForDynamicContent(blogContentElement);
          
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        // Failed to load content - silently continue
      } finally {
        blogContentElement.style.opacity = '1';
      }

      SD.events.emit('blog:content-loaded', { url: postUrl });
    }

    reinitializeForDynamicContent(container) {
      // Reinitialize carousels
      if (SD.ui.carousels && SD.ui.carousels.initialize) {
        SD.ui.carousels.initialize(container);
      }

      // Reinitialize anchor links
      if (SD.utils.navigation && SD.utils.navigation.initAnchorLinks) {
        SD.utils.navigation.initAnchorLinks();
      }

      // Reinitialize project tabs
      if (SD.ui.tabs.project) {
        SD.ui.tabs.project.init();
      }

      // Reinitialize video autoplay
      if (window.videoAutoplayManager) {
        window.videoAutoplayManager.refresh();
      }

      SD.events.emit('blog:content-reinitialized');
    }

    initializeProjectToggle() {
      const toggleBtn = document.querySelector('.projects-toggle-btn');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        const currentTab = toggleBtn.dataset.currentTab || 'blog';
        const newTab = currentTab === 'blog' ? 'portfolio' : 'blog';
        
        this.switchTab(newTab);
        toggleBtn.dataset.currentTab = newTab;
      });
    }

    initializePostsOnlyButton() {
      const postsOnlyBtn = document.querySelector('.posts-only-btn');
      if (!postsOnlyBtn) return;

      postsOnlyBtn.addEventListener('click', () => {
        this.filterPostsOnly();
      });
    }

    switchTab(tab, playSound = true) {
      // Update mobile tabs if available
      if (SD.ui.tabs.mobile) {
        SD.ui.tabs.mobile.setActiveTab(tab);
      }

      // Play sound effect
      if (playSound && SD.utils.sound) {
        SD.utils.sound.playSlider();
      }

      this.currentTab = tab;
      SD.events.emit('blog:tab-switched', { tab });
    }

    filterPostsOnly() {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      portfolioItems.forEach(item => {
        item.style.display = 'none';
      });

      SD.events.emit('blog:posts-only-filtered');
    }

    restoreContent(html, url) {
      const blogContentElement = document.querySelector('.blog-content');
      if (!blogContentElement) return;

      blogContentElement.innerHTML = html;
      this.reinitializeForDynamicContent(blogContentElement);
    }

    restoreInitialContent() {
      if (this.initialContent.html) {
        this.restoreContent(this.initialContent.html, this.initialContent.url);
      }
    }
  }

  // Create and register the module
  const blogModule = new BlogModule();
  
  // Register with SD namespace
  SD.content.blog = blogModule;
  SD.registerModule('blog', blogModule);

  // Bind methods to maintain context
  SD.content.blog.scrollToFullStory = blogModule.scrollToFullStory.bind(blogModule);
  SD.content.blog.fetchAndDisplayContent = blogModule.fetchAndDisplayContent.bind(blogModule);
  SD.content.blog.initializeProjectToggle = blogModule.initializeProjectToggle.bind(blogModule);
  SD.content.blog.initializePostsOnlyButton = blogModule.initializePostsOnlyButton.bind(blogModule);

})(window.SD || (window.SD = {}));