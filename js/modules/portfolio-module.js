/**
 * Portfolio Module for San Diego Theme
 * Handles portfolio/project functionality including tabs and summaries
 */
(function(SD) {
  'use strict';

  class PortfolioModule {
    constructor() {
      this.initialized = false;
      this.projectTabs = null;
      this.summaryInitialized = false;
    }

    init() {
      if (this.initialized) return;

      this.initProjectTabs();
      this.initSummary();
      
      this.initialized = true;
      SD.events.emit('portfolio:initialized');
    }

    initProjectTabs() {
      // Initialize project tab system
      SD.ui.tabs.project = {
        init: () => this.setupProjectTabs(),
        activeTab: null
      };

      this.setupProjectTabs();
    }

    setupProjectTabs() {
      const tabButtons = document.querySelectorAll('.project-tab-button');
      const tabContents = document.querySelectorAll('.project-tab-content');

      if (!tabButtons.length || !tabContents.length) return;

      // Set up click handlers
      tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const tabId = button.getAttribute('data-tab');
          this.switchProjectTab(tabId);
        });
      });

      // Activate first tab by default
      const firstTab = tabButtons[0]?.getAttribute('data-tab');
      if (firstTab) {
        this.switchProjectTab(firstTab);
      }

      SD.events.emit('portfolio:project-tabs-initialized');
    }

    switchProjectTab(tabId) {
      const tabButtons = document.querySelectorAll('.project-tab-button');
      const tabContents = document.querySelectorAll('.project-tab-content');

      // Update buttons
      tabButtons.forEach(button => {
        const isActive = button.getAttribute('data-tab') === tabId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive);
      });

      // Update content
      tabContents.forEach(content => {
        const isActive = content.id === tabId;
        content.style.display = isActive ? 'block' : 'none';
        content.setAttribute('aria-hidden', !isActive);
      });

      // Update active tab
      SD.ui.tabs.project.activeTab = tabId;

      // Refresh video autoplay if needed
      if (window.videoAutoplayManager && typeof window.videoAutoplayManager.refresh === 'function') {
        setTimeout(() => {
          window.videoAutoplayManager.refresh();
        }, 100);
      }

      // Play sound effect
      if (SD.utils.sound) {
        SD.utils.sound.playToggle();
      }

      SD.events.emit('portfolio:project-tab-switched', { tabId });
    }

    initSummary() {
      if (this.summaryInitialized) return;

      const summaryElements = document.querySelectorAll('.project-summary');
      const expandButtons = document.querySelectorAll('.expand-summary');

      if (!summaryElements.length) return;

      // Set up expand/collapse functionality
      expandButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const summary = button.closest('.project-section').querySelector('.project-summary');
          if (summary) {
            this.toggleSummary(summary, button);
          }
        });
      });

      // Set up read more links
      const readMoreLinks = document.querySelectorAll('.read-more');
      readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const summary = link.closest('.project-summary');
          if (summary) {
            this.expandSummary(summary);
          }
        });
      });

      this.summaryInitialized = true;
      SD.events.emit('portfolio:summary-initialized');
    }

    toggleSummary(summary, button) {
      const isExpanded = summary.classList.contains('expanded');
      
      if (isExpanded) {
        this.collapseSummary(summary, button);
      } else {
        this.expandSummary(summary, button);
      }
    }

    expandSummary(summary, button) {
      summary.classList.add('expanded');
      
      if (button) {
        button.textContent = 'Show Less';
        button.setAttribute('aria-expanded', 'true');
      }

      // Hide truncated content, show full content
      const truncated = summary.querySelector('.summary-truncated');
      const full = summary.querySelector('.summary-full');
      
      if (truncated) truncated.style.display = 'none';
      if (full) full.style.display = 'block';

      // Play sound effect
      if (SD.utils.sound) {
        SD.utils.sound.playToggle();
      }

      SD.events.emit('portfolio:summary-expanded', { summary });
    }

    collapseSummary(summary, button) {
      summary.classList.remove('expanded');
      
      if (button) {
        button.textContent = 'Show More';
        button.setAttribute('aria-expanded', 'false');
      }

      // Show truncated content, hide full content
      const truncated = summary.querySelector('.summary-truncated');
      const full = summary.querySelector('.summary-full');
      
      if (truncated) truncated.style.display = 'block';
      if (full) full.style.display = 'none';

      // Scroll summary into view if needed
      const summaryTop = summary.getBoundingClientRect().top;
      if (summaryTop < 0) {
        summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Play sound effect
      if (SD.utils.sound) {
        SD.utils.sound.playToggle();
      }

      SD.events.emit('portfolio:summary-collapsed', { summary });
    }

    // Get all projects
    getProjects() {
      const projects = document.querySelectorAll('.portfolio-item');
      return Array.from(projects).map(project => ({
        element: project,
        id: project.id,
        title: project.querySelector('.portfolio-title')?.textContent,
        company: project.querySelector('.company')?.textContent,
        year: project.querySelector('.year')?.textContent
      }));
    }

    // Filter projects by company
    filterByCompany(company) {
      const projects = this.getProjects();
      projects.forEach(project => {
        const show = !company || project.company === company;
        project.element.style.display = show ? 'block' : 'none';
      });

      SD.events.emit('portfolio:filtered', { filter: 'company', value: company });
    }

    // Filter projects by year
    filterByYear(year) {
      const projects = this.getProjects();
      projects.forEach(project => {
        const show = !year || project.year === year;
        project.element.style.display = show ? 'block' : 'none';
      });

      SD.events.emit('portfolio:filtered', { filter: 'year', value: year });
    }

    // Show all projects
    showAll() {
      const projects = document.querySelectorAll('.portfolio-item');
      projects.forEach(project => {
        project.style.display = 'block';
      });

      SD.events.emit('portfolio:filter-cleared');
    }
  }

  // Create and register the module
  const portfolioModule = new PortfolioModule();
  
  // Register with SD namespace
  SD.content.portfolio = portfolioModule;
  SD.registerModule('portfolio', portfolioModule);

  // Bind methods to maintain context
  SD.content.portfolio.initSummary = portfolioModule.initSummary.bind(portfolioModule);

})(window.SD || (window.SD = {}));