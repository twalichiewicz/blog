/**
 * Example: Refactored Blog Module
 * 
 * This shows how the 500+ line blog.js file would be refactored
 * into a clean, modular architecture.
 * 
 * Original: Complex, mixed patterns, duplicate code, memory leaks
 * Refactored: Clean modules, proper lifecycle, automatic cleanup
 */

import { Component } from './core/Component.js';
import { fadeIn, fadeOut } from './utils/animations.js';
import { debounce } from './utils/helpers.js';

export class BlogModule extends Component {
  static defaults = {
    animationDuration: 300,
    searchDelay: 200,
    postsPerPage: 10
  };

  constructor(element, options = {}) {
    super(element, options);
    
    // Dependencies injected
    this.device = options.device;
    this.storage = options.storage;
    this.eventBus = options.eventBus;
    
    // State
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.posts = [];
  }

  async init() {
    this.cacheElements();
    this.loadState();
    await this.loadPosts();
    this.bindEvents();
    this.setupMobileFeatures();
    
    this.eventBus.emit('blog:ready');
  }

  cacheElements() {
    // Single place to cache all elements
    this.elements = {
      postList: this.element.querySelector('.blog-list'),
      searchInput: this.element.querySelector('.search-input'),
      filterButtons: this.element.querySelectorAll('.filter-btn'),
      loadMoreBtn: this.element.querySelector('.load-more'),
      backToTopBtn: this.element.querySelector('.back-to-top')
    };
  }

  loadState() {
    // Restore user preferences
    this.currentFilter = this.storage.get('blog.filter') || 'all';
    this.updateFilterUI();
  }

  async loadPosts() {
    // Cache post elements for filtering
    this.posts = Array.from(this.elements.postList.querySelectorAll('.post'));
    
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    }
  }

  bindEvents() {
    // Centralized event binding with automatic cleanup
    
    // Search with debouncing
    if (this.elements.searchInput) {
      this.on(this.elements.searchInput, 'input', 
        debounce(this.handleSearch.bind(this), this.options.searchDelay)
      );
    }
    
    // Filter buttons
    this.elements.filterButtons.forEach(btn => {
      this.on(btn, 'click', this.handleFilter);
    });
    
    // Load more
    if (this.elements.loadMoreBtn) {
      this.on(this.elements.loadMoreBtn, 'click', this.loadMore);
    }
    
    // Back to top
    if (this.elements.backToTopBtn) {
      this.on(window, 'scroll', this.handleScroll, { passive: true });
      this.on(this.elements.backToTopBtn, 'click', this.scrollToTop);
    }
    
    // Listen for device changes
    this.on(window, 'device:changed', this.handleDeviceChange);
  }

  setupMobileFeatures() {
    if (!this.device.isMobile()) return;
    
    // Mobile-specific features
    this.element.classList.add('mobile-optimized');
    this.enableTouchGestures();
  }

  handleSearch(event) {
    this.searchQuery = event.target.value.toLowerCase().trim();
    this.filterPosts();
    
    // Track search for analytics
    this.eventBus.emit('blog:search', { query: this.searchQuery });
  }

  handleFilter(event) {
    const button = event.currentTarget;
    this.currentFilter = button.dataset.filter;
    
    // Update UI
    this.updateFilterUI();
    this.filterPosts();
    
    // Save preference
    this.storage.set('blog.filter', this.currentFilter);
    
    // Emit event
    this.eventBus.emit('blog:filter', { filter: this.currentFilter });
  }

  async filterPosts() {
    const visiblePosts = [];
    
    for (const post of this.posts) {
      const matchesFilter = this.matchesFilter(post);
      const matchesSearch = this.matchesSearch(post);
      
      if (matchesFilter && matchesSearch) {
        await this.showPost(post);
        visiblePosts.push(post);
      } else {
        await this.hidePost(post);
      }
    }
    
    this.updateResultsMessage(visiblePosts.length);
  }

  matchesFilter(post) {
    if (this.currentFilter === 'all') return true;
    
    const postCategories = post.dataset.categories?.split(',') || [];
    return postCategories.includes(this.currentFilter);
  }

  matchesSearch(post) {
    if (!this.searchQuery) return true;
    
    const searchableText = [
      post.querySelector('h3')?.textContent,
      post.querySelector('.excerpt')?.textContent,
      post.dataset.tags
    ].join(' ').toLowerCase();
    
    return searchableText.includes(this.searchQuery);
  }

  async showPost(post) {
    if (post.style.display !== 'none') return;
    
    post.style.display = '';
    await fadeIn(post, this.options.animationDuration);
  }

  async hidePost(post) {
    if (post.style.display === 'none') return;
    
    await fadeOut(post, this.options.animationDuration);
  }

  updateFilterUI() {
    this.elements.filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === this.currentFilter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  updateResultsMessage(count) {
    const message = this.element.querySelector('.results-message');
    if (!message) return;
    
    if (count === 0) {
      message.textContent = 'No posts found';
      message.classList.add('empty');
    } else {
      message.textContent = `Showing ${count} post${count !== 1 ? 's' : ''}`;
      message.classList.remove('empty');
    }
  }

  setupLazyLoading() {
    const images = this.element.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Store observer for cleanup
    this.imageObserver = imageObserver;
  }

  async loadMore() {
    const button = this.elements.loadMoreBtn;
    button.disabled = true;
    button.textContent = 'Loading...';
    
    try {
      const newPosts = await this.fetchMorePosts();
      await this.renderNewPosts(newPosts);
      
      if (newPosts.length < this.options.postsPerPage) {
        button.style.display = 'none';
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
      button.textContent = 'Error - Try Again';
    } finally {
      button.disabled = false;
      button.textContent = 'Load More';
    }
  }

  handleScroll() {
    const scrolled = window.pageYOffset > 300;
    this.elements.backToTopBtn.classList.toggle('visible', scrolled);
  }

  scrollToTop(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleDeviceChange(event) {
    const { device } = event.detail;
    
    if (device.type === 'mobile') {
      this.setupMobileFeatures();
    } else {
      this.teardownMobileFeatures();
    }
  }

  enableTouchGestures() {
    // Touch gesture support for mobile
    let touchStartX = 0;
    
    this.on(this.element, 'touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    this.on(this.element, 'touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.eventBus.emit('blog:swipe', { direction: 'left' });
        } else {
          this.eventBus.emit('blog:swipe', { direction: 'right' });
        }
      }
    }, { passive: true });
  }

  teardownMobileFeatures() {
    this.element.classList.remove('mobile-optimized');
  }

  // Clean destruction
  destroy() {
    // Clean up intersection observer
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    
    // Base class handles event cleanup
    super.destroy();
    
    this.eventBus.emit('blog:destroyed');
  }
}

// Usage example:
/*
const blogElement = document.querySelector('.blog');
if (blogElement) {
  const blog = new BlogModule(blogElement, {
    device: app.get('device'),
    storage: app.get('storage'),
    eventBus: app.get('eventBus')
  });
  
  app.register('blog', blog);
}
*/