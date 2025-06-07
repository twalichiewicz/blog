/**
 * Blog functionality - Simplified
 * Handles search, mobile tabs, and device detection
 */
import { initializeCarousels, cleanupCarouselInstances } from './carousel.js';
import { initializeMobileTabs } from './mobile-tabs.js';
import videoAutoplayManager from './components/video-autoplay.js';
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

		// Blog features initialized
	}
	// --- End of Refactored Initialization Function ---

	// Initial setup on page load
	initializeBlogFeatures(document);
	initializeMobileTabs();

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

		// Simple scroll with smooth behavior
		fullStoryElement.scrollIntoView({
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

			// Determine the target for the fade based on screen size (for regular content)
			const isDesktopOrTablet = window.innerWidth > 768;
			let targetElement = element;
			if (isDesktopOrTablet && element === blogContentElement) {
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

			// Determine the target for the fade based on screen size (for regular content)
			const isDesktopOrTablet = window.innerWidth > 768;
			let targetElement = element;
			if (isDesktopOrTablet && element === blogContentElement) {
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

				if (blogContentElement.firstChild) {
					blogContentElement.insertBefore(backButton, blogContentElement.firstChild);
				} else {
					blogContentElement.appendChild(backButton);
				}
			}

			const backButtonClickHandler = async function (event) {
				event.preventDefault();
				
				// Determine what type of content we're returning from
				const currentHistoryState = history.state;
				const isReturningFromProject = currentHistoryState && currentHistoryState.isProject === true;
				
				// Back button clicked, returning from project
				
				await fadeOutElement(blogContentElement);
				blogContentElement.innerHTML = initialBlogContentHTML;
				initializeBlogFeatures(blogContentElement);
				initializeLinkListeners(blogContentElement);
				
				// Initialize mobile tabs
				initializeMobileTabs();
				
				// Set the appropriate tab based on content type
				if (isReturningFromProject) {
					// Coming from a project, show portfolio tab
					setTimeout(() => {
						if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
							window.mobileTabs.switchTab('portfolio', true);
						}
					}, 50);
				} else {
					// Coming from a blog post, show blog tab and clean URL
					setTimeout(() => {
						if (window.mobileTabs && typeof window.mobileTabs.switchTab === 'function') {
							window.mobileTabs.switchTab('blog', true);
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

			await fadeOutElement(blogContentElement);
			blogContentElement.innerHTML = ''; // Clear content AFTER fade out of inner (or whole)

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const htmlText = await response.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(htmlText, 'text/html');

				let contentToExtractSelector = isProject ? 'div.project-edge-wrapper' : 'article.post';
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
						// Regular content: Add the inner wrapper conditionally for desktop/tablet
						const isDesktopOrTablet = window.innerWidth > 768;
						// Desktop/tablet mode detected
						if (isDesktopOrTablet) {
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
						} else {
							// Mobile: Add dynamic-loaded class to .project-wrapper if present
							let projectWrapperInstance = null;
							if (newContentContainer.classList.contains('project-wrapper')) {
								projectWrapperInstance = newContentContainer;
							} else {
								projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
							}

							if (projectWrapperInstance && !projectWrapperInstance.classList.contains('dynamic-loaded')) {
								projectWrapperInstance.classList.add('dynamic-loaded');
								// Added dynamic-loaded to project wrapper (mobile)
							}

							const clonedContent = newContentContainer.cloneNode(true);
							contentFragment.appendChild(clonedContent);
						}
					}

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
			await fadeInElement(blogContentElement);
			blogContentElement.scrollIntoView({ behavior: 'smooth' });
		}

		function handleLinkClick(event) {
			const link = event.currentTarget;
			if (link.hostname === window.location.hostname &&
				!link.getAttribute('target') &&
				(link.protocol === "http:" || link.protocol === "https:") &&
				!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
			) {
				const isPostLink = link.closest('article.post-list-item:not(.post-link)') && link.matches('h3 a');
				const isProjectLink = link.matches('a.portfolio-item.has-writeup');

				// Check if it's a mobile device (e.g., screen width less than 768px)
				const isMobileView = window.innerWidth < 768;

				if ((isPostLink || isProjectLink) && !isMobileView) { // Only proceed with dynamic loading if not mobile
					event.preventDefault();
					const url = link.href;
					fetchAndDisplayContent(url, true, isProjectLink);
				} else if (isPostLink || isProjectLink) {
					// On mobile, allow default link behavior (i.e., navigate to the page)
					// No event.preventDefault() here
					// Optional: you might want to explicitly set target for clarity or specific mobile behavior
					// link.target = '_self'; // or '_blank' if you prefer new tab on mobile for some reason
				}
			}
		}

		function initializeLinkListeners(parentElement) {
			if (!parentElement) return;
			const linksToProcess = parentElement.querySelectorAll(
				'article.post-list-item:not(.post-link) h3 a, a.portfolio-item.has-writeup'
			);

			linksToProcess.forEach(link => {
				link.removeEventListener('click', handleLinkClick);
				link.addEventListener('click', handleLinkClick);
			});
		}

		initializeLinkListeners(blogContentElement);

		// Add resize listener to handle desktop-to-mobile transitions for dynamic content
		let resizeTimeout;
		window.addEventListener('resize', function () {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function () {
				const isMobileView = window.innerWidth <= 768;
				const isDynamicContentLoaded = blogContentElement &&
					(blogContentElement.querySelector('.project-wrapper.dynamic-loaded') ||
						blogContentElement.querySelector('.dynamic-back-button'));

				// If user resized to mobile while viewing dynamic content, redirect to actual page
				if (isMobileView && isDynamicContentLoaded) {
					const currentUrl = window.location.pathname + window.location.search + window.location.hash;
					// Only redirect if we're not already on the initial blog URL
					if (currentUrl !== initialBlogContentURL) {
						// Redirecting to actual page due to mobile resize
						window.location.href = currentUrl;
					}
				}
			}, 150); // Debounce resize events
		});

		window.addEventListener('popstate', async function (event) {
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
		});

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

		let visibleCount = 0;
		const visiblePosts = [];

		posts.forEach(post => {
			const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
			const content = post.textContent.toLowerCase();
			const isMatch = title.includes(query) || content.includes(query);

			if (isMatch) {
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

}); 