/**
 * Blog functionality - Simplified
 * Handles search, mobile tabs, and device detection
 */
import { initializeCarousels, cleanupCarouselInstances } from './carousel.js';
import { initializeMobileTabs } from './mobile-tabs.js';
import videoAutoplayManager from './components/video-autoplay.js';
import ScrollUtility from './utils/scroll-utility.js';
// import AdaptiveVideoManager from './components/adaptive-video.js';

// Initialize adaptive video manager
// const adaptiveVideoManager = new AdaptiveVideoManager();


document.addEventListener('DOMContentLoaded', function () {
	// --- Refactored Initialization Function ---
	function initializeBlogFeatures(container) {
		// Initializing blog features
		// Cache DOM elements within the container
		const elements = {
			searchInput: container.querySelector('#postSearch'),
			expandButtons: container.querySelectorAll('.expand-button'),
			// carousels: container.querySelectorAll('.carousel'), // No longer handled directly here
		};

		// --- Search Functionality ---
		if (elements.searchInput) {
			elements.searchInput.removeEventListener('input', handleSearch);
			elements.searchInput.addEventListener('input', handleSearch);
		}

		// --- Expand Buttons ---
		if (elements.expandButtons.length) {
			elements.expandButtons.forEach(btn => {
				btn.removeEventListener('click', toggleExpand);
				btn.addEventListener('click', toggleExpand);
			});
		}

		// --- Carousels (Delegate to global carousel.js initializer) ---
		if (typeof initializeCarousels === 'function') {
			// Delegating carousel initialization to carousel.js
			initializeCarousels(container);
		} else {
			// initializeCarousels not found
		}

		// --- Video Autoplay --- Only refresh if there are videos in the container
		const hasVideos = container.querySelector('video[data-autoplay="true"]');
		if (hasVideos && videoAutoplayManager && typeof videoAutoplayManager.refresh === 'function') {
			// Refreshing video autoplay manager
			videoAutoplayManager.refresh();
		}

		// --- Adaptive Videos ---
		// if (adaptiveVideoManager && typeof adaptiveVideoManager.refresh === 'function') {
		// 	console.log('[blog.js] Refreshing adaptive video manager for container:', container);
		// 	adaptiveVideoManager.refresh();
		// }
		
		// --- Anchor Links ---
		// Now handled by ScrollUtility which auto-initializes

		// Blog features initialized
	}
	// --- End of Refactored Initialization Function ---

	// Device detection (usually needed only once)
	const isMobile = window.innerWidth <= 768;
	const isDesktop = document.body.classList.contains('device-desktop');

	// Global scroll function available for both standalone and dynamic contexts
	function scrollToFullStory() {
		// Scroll button clicked
		const fullStoryElement = document.getElementById('full-story');
		if (!fullStoryElement) {
			// Full story element not found
			return;
		}

		// Use ScrollUtility for consistent scrolling
		ScrollUtility.scrollToElement(fullStoryElement, {
			behavior: 'smooth',
			block: 'start'
		});
	}

	// Make function globally available immediately
	window.scrollToFullStory = scrollToFullStory;

	// === Dynamic Content Loader for Blog Posts/Projects ===
	function setupDynamicBlogNavigation() {
		const blogContentElement = document.querySelector('.blog-content');
		if (!blogContentElement) {
			return;
		}

		let initialBlogContentHTML = blogContentElement.innerHTML;
		let initialBlogContentURL = window.location.pathname + window.location.search + window.location.hash; // More robust URL capture

		async function fadeOutElement(element, duration = 300) {
			if (!element) return;

			// Check if we have a project-edge-wrapper (don't apply inner wrapper fade logic)
			const hasProjectEdgeWrapper = element.querySelector('.project-edge-wrapper');
			if (hasProjectEdgeWrapper) {
				// Project edge wrapper detected, fading directly
				hasProjectEdgeWrapper.style.opacity = '1';
				hasProjectEdgeWrapper.style.transition = `opacity ${duration}ms ease-in-out`;
				hasProjectEdgeWrapper.style.opacity = '0';
				await new Promise(resolve => setTimeout(resolve, duration));
				return;
			}

			// Always look for content-inner-wrapper when fading blog content
			let targetElement = element;
			if (element === blogContentElement) {
				targetElement = element.querySelector('.content-inner-wrapper');
				if (!targetElement) {
					// .content-inner-wrapper not found, fading blog-content instead
					targetElement = element; // Fallback
				}
			}

			if (!targetElement) {
				// No valid target element found
				return;
			}

			targetElement.style.opacity = '1';
			targetElement.style.transition = `opacity ${duration}ms ease-in-out`;
			targetElement.style.opacity = '0';
			await new Promise(resolve => setTimeout(resolve, duration));
		}

		async function fadeInElement(element, duration = 300) {
			if (!element) return;

			// Check if we have a project-edge-wrapper (don't apply inner wrapper fade logic)
			const hasProjectEdgeWrapper = element.querySelector('.project-edge-wrapper');
			if (hasProjectEdgeWrapper) {
				// Project edge wrapper detected, fading directly
				// Force layout to prevent Chrome rendering issues
				hasProjectEdgeWrapper.style.transform = 'translateZ(0)';
				hasProjectEdgeWrapper.style.willChange = 'opacity';
				hasProjectEdgeWrapper.style.opacity = '0';
				hasProjectEdgeWrapper.style.transition = `opacity ${duration}ms ease-in-out`;

				// Force repaint
				hasProjectEdgeWrapper.offsetHeight;

				await new Promise(resolve => setTimeout(resolve, 20)); // Small delay for style application
				hasProjectEdgeWrapper.style.opacity = '1';
				await new Promise(resolve => setTimeout(resolve, duration));

				// Clean up will-change for performance
				hasProjectEdgeWrapper.style.willChange = 'auto';
				return;
			}

			// Always look for content-inner-wrapper when fading blog content
			let targetElement = element;
			if (element === blogContentElement) {
				targetElement = element.querySelector('.content-inner-wrapper');
				if (!targetElement) {
					// .content-inner-wrapper not found, fading blog-content instead
					targetElement = element; // Fallback
				}
			}

			if (!targetElement) {
				// No valid target element found
				return;
			}

			// Force layout to prevent Chrome rendering issues
			targetElement.style.transform = 'translateZ(0)';
			targetElement.style.willChange = 'opacity';
			targetElement.style.opacity = '0';
			targetElement.style.transition = `opacity ${duration}ms ease-in-out`;

			// Force repaint
			targetElement.offsetHeight;

			await new Promise(resolve => setTimeout(resolve, 20)); // Small delay for style application
			targetElement.style.opacity = '1';
			await new Promise(resolve => setTimeout(resolve, duration));

			// Clean up will-change for performance
			targetElement.style.willChange = 'auto';
		}

		function addOrUpdateBackButton() {
			if (!blogContentElement) return null;

			// Check if we're loading a project-edge-wrapper which already has its own navigation
			const hasProjectEdgeWrapper = blogContentElement.querySelector('.project-edge-wrapper') ||
				blogContentElement.innerHTML.includes('project-edge-wrapper');
			if (hasProjectEdgeWrapper) {
				// Project edge wrapper detected, skipping back button creation
				return null;
			}

			let backButton = blogContentElement.querySelector('.dynamic-back-button');
			if (!backButton) {
				backButton = document.createElement('button');
				backButton.textContent = '← Back';
				backButton.className = 'dynamic-back-button';

				// Consistent placement for all devices
				if (blogContentElement.firstChild) {
					blogContentElement.insertBefore(backButton, blogContentElement.firstChild);
				} else {
					blogContentElement.appendChild(backButton);
				}
			}

			const backButtonClickHandler = async function (event) {
				event.preventDefault();
				
				// Play button press sound effect
				if (window.soundEffects && window.soundEffects.playButtonPress) {
					window.soundEffects.playButtonPress();
				}
				
				// Determine what type of content we're returning from
				const currentHistoryState = history.state;
				const isReturningFromProject = currentHistoryState && currentHistoryState.isProject === true;
				
				// Back button clicked, returning from project
				
				await fadeOutElement(blogContentElement);
				
				// Remove has-dynamic-content class to restore scroll behavior
				blogContentElement.classList.remove('has-dynamic-content');
				
				blogContentElement.innerHTML = initialBlogContentHTML;
				initializeBlogFeatures(blogContentElement);
				initializeLinkListeners(blogContentElement);
				
				// Initialize mobile tabs
				initializeMobileTabs();
				
				// Re-initialize toggles
				initializeProjectToggle();
				initializePostsOnlyButton();
				
				// Ensure tabs are visible again on mobile
				if (window.innerWidth <= 768) {
					const tabsWrapper = blogContentElement.querySelector('.tabs-wrapper');
					if (tabsWrapper) {
						tabsWrapper.style.display = '';
					}
				}
				
				// Set the appropriate tab based on content type
				if (isReturningFromProject) {
					// Coming from a project, show portfolio tab
					setTimeout(() => {
						if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
							window.mobileTabs.switchTab('portfolio', false);
						}
					}, 50);
				} else {
					// Coming from a blog post, show blog tab and clean URL
					setTimeout(() => {
						if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
							window.mobileTabs.switchTab('blog', false);
						}
						// Clean up URL parameter if coming from blog post
						if (window.location.search.includes('tab=portfolio')) {
							history.replaceState({ path: '/', isInitial: true, isDynamic: false }, '', '/');
						}
					}, 50);
				}
				
				// Re-initialize sound effects when returning to home page
				if (window.initializeSoundEffects) {
					// Re-initializing sound effects for back navigation
					window.initializeSoundEffects();
				} else {
					// Fallback: try again after a short delay in case sound effects script is still loading
					setTimeout(() => {
						if (window.initializeSoundEffects) {
							// Re-initializing sound effects for back navigation (delayed)
							window.initializeSoundEffects();
						}
					}, 100);
				}
				await fadeInElement(blogContentElement);
				history.pushState({ path: initialBlogContentURL, isInitial: true, isDynamic: false }, '', initialBlogContentURL);
			};

			const oldHandler = backButton._clickHandler;
			if (oldHandler) backButton.removeEventListener('click', oldHandler);

			backButton.addEventListener('click', backButtonClickHandler);
			backButton._clickHandler = backButtonClickHandler;
			return backButton;
		}

		async function fetchAndDisplayContent(url, isPushState = true, isProject = false) {
			if (!blogContentElement) return;

			// Before clearing content, cleanup any carousel instances managed by carousel.js
			if (typeof cleanupCarouselInstances === 'function') {
				// Cleaning up carousel instances from blogContentElement
				cleanupCarouselInstances(blogContentElement);
			}

			// Add has-dynamic-content class to enable proper scrolling
			blogContentElement.classList.add('has-dynamic-content');

			// No longer preserving tab structure for mobile - treat all devices the same

			// Use consistent fade out/clear approach for all devices
			await fadeOutElement(blogContentElement);
			blogContentElement.innerHTML = '';

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const htmlText = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlText, 'text/html');

				// Updated selector to handle new Substack-style posts
					let contentToExtractSelector = isProject ? 'div.project-edge-wrapper' : 'div.post-wrapper';
				let newContentContainer = doc.querySelector(contentToExtractSelector);

				// Initial selector determined
				// Found content container

				// Fallback for projects: if project-edge-wrapper is not found, try project-wrapper
				if (!newContentContainer && isProject) {
					contentToExtractSelector = 'div.project-wrapper';
					newContentContainer = doc.querySelector(contentToExtractSelector);
					// Fallback selector
					// Fallback content container
				}

				// Fallback: if loading a post and article.post is not found, try div.project-wrapper
				if (!newContentContainer && !isProject) {
					newContentContainer = doc.querySelector('div.project-wrapper');
					// Post fallback to project-wrapper
				}

				const backButton = addOrUpdateBackButton();
				// Back button created

				if (newContentContainer) {
					// Content container found, proceeding with insertion
					// Container classes logged
					// Container HTML preview logged

					const contentFragment = document.createDocumentFragment();

					// Special handling for project-edge-wrapper: don't add extra wrappers
					if (newContentContainer.classList.contains('project-edge-wrapper')) {
						// Project edge wrapper detected, inserting without extra wrappers

						// Find and mark project-wrapper inside edge-wrapper with dynamic-loaded
						const projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
						if (projectWrapperInstance) {
							projectWrapperInstance.classList.add('dynamic-loaded');
							// Added dynamic-loaded to project-wrapper inside edge-wrapper
						}

						const clonedContent = newContentContainer.cloneNode(true);
						contentFragment.appendChild(clonedContent);
					} else {
						// Regular content handling - Use same simple structure for all devices
						const innerWrapper = document.createElement('div');
						innerWrapper.className = 'content-inner-wrapper';
						innerWrapper.style.opacity = '0'; // Start transparent for fade-in

						// Handle project-wrapper inside regular content
						let projectWrapperInstance = null;
						if (newContentContainer.classList.contains('project-wrapper')) {
							projectWrapperInstance = newContentContainer;
						} else {
							projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
						}

						if (projectWrapperInstance && !projectWrapperInstance.classList.contains('dynamic-loaded')) {
							projectWrapperInstance.classList.add('dynamic-loaded');
							// Added dynamic-loaded to project wrapper
						}

						innerWrapper.appendChild(newContentContainer.cloneNode(true));
						contentFragment.appendChild(innerWrapper);
					}

					// Insert content consistently for all devices
					if (backButton) {
						// Inserting content after back button
						backButton.after(contentFragment);
					} else {
						// Appending content directly to blog element
						blogContentElement.appendChild(contentFragment);
					}

					// Content inserted successfully
					initializeBlogFeatures(blogContentElement); // This will now delegate carousel init
					
					// Initialize project tabs for dynamically loaded content
					if (window.initializeProjectTabs) {
						window.initializeProjectTabs(blogContentElement);
					}
					// Initialize project summary for dynamically loaded content
					if (window.initializeProjectSummary) {
						window.initializeProjectSummary(blogContentElement);
					}
					// Re-initialize sound effects for dynamically loaded content
					if (window.initializeSoundEffects) {
						// Re-initializing sound effects for dynamically loaded content
						window.initializeSoundEffects();
					} else {
						// Fallback: try again after a short delay in case sound effects script is still loading
						setTimeout(() => {
							if (window.initializeSoundEffects) {
								// Re-initializing sound effects for dynamically loaded content (delayed)
								window.initializeSoundEffects();
							}
						}, 100);
					}

					// Set up scroll button for dynamic content - multiple attempts
					function setupDynamicScrollButton() {
						const scrollButton = blogContentElement.querySelector('.read-story-button') ||
							blogContentElement.querySelector('#scrollToFullStoryBtn');

						if (scrollButton) {
							// Found scroll button for dynamic content

							// Remove any existing handlers
							scrollButton.onclick = null;

							// Add new handler
							scrollButton.onclick = function (e) {
								e.preventDefault();
								// Dynamic scroll button clicked
								if (window.scrollToFullStory) {
									window.scrollToFullStory();
								} else {
									// scrollToFullStory function not available
								}
							};

							// Dynamic scroll button handler attached
							return true;
						} else {
							// Scroll button not found yet for dynamic content
							return false;
						}
					}

					// Try multiple times with increasing delays
					if (!setupDynamicScrollButton()) {
						setTimeout(setupDynamicScrollButton, 100);
						setTimeout(setupDynamicScrollButton, 300);
						setTimeout(setupDynamicScrollButton, 500);
					}
				} else {
					// ERROR: No content container found
					// Available elements in doc logged
					// isProject flag logged
					// URL logged

					const errorMsg = document.createElement('p');
					errorMsg.textContent = 'Sorry, the content could not be loaded.';
					// Add the inner wrapper conditionally here too if needed, or just append directly?
					// Simplified: just append the error message
					if (backButton) { backButton.after(errorMsg); } else { blogContentElement.appendChild(errorMsg); }
				}

				if (isPushState) {
					history.pushState({ path: url, isProject: isProject, isDynamic: true }, '', url);
				}
			} catch (error) {
				// Error fetching or displaying content
				const errorTechnical = document.createElement('p');
				errorTechnical.textContent = 'There was an error loading the page.';
				let backBtn = blogContentElement.querySelector('.dynamic-back-button');
				if (!backBtn) backBtn = addOrUpdateBackButton();
				if (backBtn) { backBtn.after(errorTechnical); } else { blogContentElement.appendChild(errorTechnical); }
			}
			// Fade in blog content for all devices
			await fadeInElement(blogContentElement);
			// Scroll into view for all devices using ScrollUtility
			ScrollUtility.scrollToElement(blogContentElement, {
				behavior: 'smooth',
				block: 'start'
			});
		}

		function handleLinkClick(event) {
			const link = event.currentTarget;
			if (link.hostname === window.location.hostname &&
				!link.getAttribute('target') &&
				(link.protocol === "http:" || link.protocol === "https:") &&
				!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
			) {
				// Updated selectors for post previews
				const isPostLink = link.classList.contains('post-link-wrapper');
				const isProjectLink = link.matches('a.portfolio-item.has-writeup');

				if (isPostLink || isProjectLink) {
					event.preventDefault();
					const url = link.href;
					fetchAndDisplayContent(url, true, isProjectLink);
				}
			}
		}

		function initializeLinkListeners(parentElement) {
			if (!parentElement) return;
			const linksToProcess = parentElement.querySelectorAll(
				'a.post-link-wrapper, ' +
				'a.portfolio-item.has-writeup'
			);

			linksToProcess.forEach(link => {
				link.removeEventListener('click', handleLinkClick);
				link.addEventListener('click', handleLinkClick);
			});
		}

		initializeLinkListeners(blogContentElement);

		// Resize listener removed - dynamic content now works on all screen sizes

		const handlePopstate = async function (event) {
			// If we're returning to the home page (no state or initial state)
			if (!event.state || event.state.isInitial) {
				// Ensure the page is visible
				document.body.style.opacity = '1';
				document.body.classList.add('loaded');
				const overlay = document.querySelector('.page-transition-overlay');
				if (overlay) {
					overlay.style.display = 'none';
				}
				
				// If blog content was hidden, show it
				if (blogContentElement) {
					blogContentElement.style.opacity = '1';
					const innerWrapper = blogContentElement.querySelector('.content-inner-wrapper');
					if (innerWrapper) {
						innerWrapper.style.opacity = '1';
					}
				}
				return;
			}
			
			if (event.state && event.state.page) {
				const targetUrl = event.state.page;
				// Navigating to target URL

				// Perform fade out
				await fadeOutElement(blogContentElement);

				// Update URL without triggering a reload
				window.history.replaceState({ page: targetUrl }, '', targetUrl);

				// Fetch the new page content
				try {
					const response = await fetch(targetUrl, {
						headers: {
							'X-Requested-With': 'XMLHttpRequest'
						}
					});

					if (response.ok) {
						const html = await response.text();
						const parser = new DOMParser();
						const doc = parser.parseFromString(html, 'text/html');

						// Update the main content
						const newContent = doc.querySelector('.blog');
						if (newContent) {
							blogContentElement.innerHTML = newContent.innerHTML;
							// Initialize features on the new content
							initializeBlogFeatures(blogContentElement);
							// Fade in immediately
							await fadeInElement(blogContentElement);
						}
					}
				} catch (error) {
					// Error fetching page
					// Fade in anyway to show current content
					await fadeInElement(blogContentElement);
				}
			}
		};
		
		window.addEventListener('popstate', handlePopstate);
		
		// Store handler for cleanup
		window._blogPopstateHandler = handlePopstate;

		// Expose fetchAndDisplayContent globally for direct navigation
		window.fetchAndDisplayContent = fetchAndDisplayContent;

		if (!history.state || (!history.state.isDynamic && !history.state.isInitial)) {
			history.replaceState({ path: initialBlogContentURL, isInitial: true, isDynamic: false }, '', initialBlogContentURL);
		}
	}

	if (document.querySelector('.blog-content')) {
		setupDynamicBlogNavigation();
	}

	// Search functionality
	function handleSearch(e) {
		const query = e.target.value.toLowerCase();
		const blogContent = document.querySelector('.blog-content');
		if (!blogContent) return;

		const posts = blogContent.querySelectorAll('.post-list-item');
		const postSeparators = blogContent.querySelectorAll('.post-separator');
		const noResultsMessage = blogContent.querySelector('.no-results-message');
		const postsOnlyButton = blogContent.querySelector('.posts-only-button');
		const isPostsOnly = postsOnlyButton && postsOnlyButton.classList.contains('active');

		let visibleCount = 0;
		const visiblePosts = [];

		posts.forEach(post => {
			const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
			const content = post.textContent.toLowerCase();
			const isMatch = title.includes(query) || content.includes(query);
			
			// Check if it's specifically a "post-long post-preview-card" type
			// Look for the preview card either on the post itself OR nested inside
			const hasPreviewCard = post.querySelector('.post-long.post-preview-card') || 
								  (post.classList.contains('post-long') && post.classList.contains('post-preview-card'));
			
			// It's a regular post if it has the preview card structure
			const isPostType = hasPreviewCard;

			if (isMatch && (!isPostsOnly || isPostType)) {
				post.style.display = '';
				visibleCount++;
				visiblePosts.push(post);
			} else {
				post.style.display = 'none';
			}
		});

		postSeparators.forEach(sep => sep.style.display = 'none');

		visiblePosts.forEach((post, index) => {
			if (index < visiblePosts.length - 1) {
				let nextSibling = post.nextElementSibling;
				while (nextSibling && !nextSibling.classList.contains('post-separator')) {
					nextSibling = nextSibling.nextElementSibling;
				}
				if (nextSibling && nextSibling.classList.contains('post-separator')) {
					nextSibling.style.display = '';
				}
			}
		});

		if (noResultsMessage) {
			noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
		}
	}
	
	// Initialize posts only button
	function initializePostsOnlyButton() {
		const postsOnlyButton = document.querySelector('.posts-only-button');
		if (!postsOnlyButton) return;
		
		// Remove existing listener if any
		postsOnlyButton.removeEventListener('click', handlePostsOnlyClick);
		// Add new listener
		postsOnlyButton.addEventListener('click', handlePostsOnlyClick);
	}
	
	function handlePostsOnlyClick(event) {
		const button = event.currentTarget;
		button.classList.toggle('active');
		const searchInput = document.querySelector('#postSearch');
		if (searchInput) {
			handleSearch({ target: searchInput });
		}
	}

	// Toggle search visibility
	function toggleSearch() {
		const searchContainer = document.querySelector('.search-container');
		if (searchContainer) {
			searchContainer.classList.toggle('active');
			const searchInput = searchContainer.querySelector('#postSearch');
			if (searchContainer.classList.contains('active') && searchInput) {
				searchInput.focus();
			}
		}
	}

	// Initialize project filter functionality with checkboxes
	let activeProjectFilters = new Set(['professional', 'personal']); // Both checked by default
	
	function handleProjectFilterChange(event) {
		const checkbox = event.currentTarget;
		const filterType = checkbox.closest('.filter-checkbox').getAttribute('data-type');
		
		if (checkbox.checked) {
			activeProjectFilters.add(filterType);
		} else {
			activeProjectFilters.delete(filterType);
		}
		
		applyProjectFilters();
	}
	
	function initializeProjectToggle() {
		const filterCheckboxes = document.querySelectorAll('.project-filter-container .filter-input');
		const projectsContent = document.querySelector('#projectsContent');
		
		// If old toggle container exists, ignore it
		const oldToggleContainer = document.querySelector('.project-toggle-container');
		if (oldToggleContainer && !filterCheckboxes.length) {
			return; // Old implementation, skip
		}
		
		if (!filterCheckboxes.length || !projectsContent) return;
		
		// Initialize checkboxes based on current state
		filterCheckboxes.forEach(checkbox => {
			const filterType = checkbox.closest('.filter-checkbox').getAttribute('data-type');
			checkbox.checked = activeProjectFilters.has(filterType);
			
			// Remove any existing listeners
			checkbox.removeEventListener('change', handleProjectFilterChange);
			// Add new listener
			checkbox.addEventListener('change', handleProjectFilterChange);
		});
		
		// Apply the current filters
		applyProjectFilters();
	}
	
	function applyProjectFilters() {
		const projectsContent = document.querySelector('#projectsContent');
		if (!projectsContent) return;
		
		const companyGroups = projectsContent.querySelectorAll('.company-group');
		const projectItems = projectsContent.querySelectorAll('.portfolio-item');
		let hasVisibleProjects = false;
		
		// Show/hide company groups based on active filters
		companyGroups.forEach(group => {
			const groupType = group.getAttribute('data-project-type');
			const shouldShow = activeProjectFilters.has(groupType);
			group.style.display = shouldShow ? '' : 'none';
			if (shouldShow) hasVisibleProjects = true;
		});
		
		// Show/hide individual project items based on active filters
		projectItems.forEach(item => {
			const itemType = item.getAttribute('data-project-type');
			const shouldShow = activeProjectFilters.has(itemType);
			item.style.display = shouldShow ? '' : 'none';
		});
		
		// Handle no results message
		let noResultsMsg = projectsContent.querySelector('.no-projects-message');
		
		if (!hasVisibleProjects && activeProjectFilters.size === 0) {
			if (!noResultsMsg) {
				noResultsMsg = document.createElement('div');
				noResultsMsg.className = 'no-projects-message';
				noResultsMsg.style.textAlign = 'center';
				noResultsMsg.style.padding = '3rem 2rem';
				noResultsMsg.style.color = 'var(--text-color-secondary)';
				projectsContent.appendChild(noResultsMsg);
			}
			noResultsMsg.textContent = 'Please select at least one project type to display.';
		} else if (!hasVisibleProjects) {
			if (!noResultsMsg) {
				noResultsMsg = document.createElement('div');
				noResultsMsg.className = 'no-projects-message';
				noResultsMsg.style.textAlign = 'center';
				noResultsMsg.style.padding = '3rem 2rem';
				noResultsMsg.style.color = 'var(--text-color-secondary)';
				projectsContent.appendChild(noResultsMsg);
			}
			const filterNames = Array.from(activeProjectFilters).join(' or ');
			noResultsMsg.textContent = `No ${filterNames} projects to display.`;
		} else if (noResultsMsg) {
			noResultsMsg.remove();
		}
	}

	// Function to toggle expand
	function toggleExpand() {
		const overflow = this.nextElementSibling;
		const detailsParent = this.closest('details');
		if (detailsParent) {
			this.textContent = detailsParent.open ? 'Show less' : 'Read more';
			return;
		}

		const isExpanded = this.getAttribute('aria-expanded') === 'true';
		this.setAttribute('aria-expanded', !isExpanded);
		if (overflow) {
			overflow.style.maxHeight = isExpanded ? null : `${overflow.scrollHeight}px`;
		}
		this.textContent = isExpanded ? 'Read more' : 'Show less';
	}

	// REMOVE initializeCarousel and openSpotlight from blog.js
	// They are now handled by the global carousel.js

	/*
	// Initialize carousel  -- REMOVE THIS FUNCTION
	function initializeCarousel(carousel) { ... }
	*/

	/*
	// === Spotlight Modal === -- REMOVE THIS FUNCTION and related vars like currentSpotlightIndex
	let currentSpotlightIndex = 0;
	let allSpotlightSlides = []; 
	function openSpotlight(initialSrc, slidesArray, initialIndex) { ... }
	*/

	// Make initialization functions globally available for mobile tabs
	window.initializeProjectToggle = initializeProjectToggle;
	window.initializePostsOnlyButton = initializePostsOnlyButton;

	// Initial setup on page load - moved to end after all functions are defined
	initializeBlogFeatures(document);
	initializeMobileTabs();
	initializeProjectToggle();
	initializePostsOnlyButton();
	// Anchor links are now handled by anchor-links-simple.js

}); 