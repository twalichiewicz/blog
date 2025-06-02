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
		console.log('[blog.js] initializeBlogFeatures Start');
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
			console.log('[blog.js] Delegating carousel initialization to initializeCarousels for container:', container);
			initializeCarousels(container);
		} else {
			console.warn('[blog.js] initializeCarousels not found!');
		}

		// --- Video Autoplay ---
		if (videoAutoplayManager && typeof videoAutoplayManager.refresh === 'function') {
			console.log('[blog.js] Refreshing video autoplay manager for container:', container);
			videoAutoplayManager.refresh();
		}

		// --- Adaptive Videos ---
		// if (adaptiveVideoManager && typeof adaptiveVideoManager.refresh === 'function') {
		// 	console.log('[blog.js] Refreshing adaptive video manager for container:', container);
		// 	adaptiveVideoManager.refresh();
		// }

		console.log('[blog.js] initializeBlogFeatures End');
	}
	// --- End of Refactored Initialization Function ---

	// Initial setup on page load
	initializeBlogFeatures(document);
	initializeMobileTabs();

	// Device detection (usually needed only once)
	const isMobile = window.innerWidth <= 768;
	const isDesktop = document.body.classList.contains('device-desktop');

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

			// Determine the target for the fade based on screen size
			const isDesktopOrTablet = window.innerWidth > 768;
			let targetElement = element;
			if (isDesktopOrTablet && element === blogContentElement) {
				targetElement = element.querySelector('.content-inner-wrapper');
				if (!targetElement) {
					console.warn('FadeOut: .content-inner-wrapper not found, fading blog-content instead.');
					targetElement = element; // Fallback
				}
			}

			if (!targetElement) {
				console.error('FadeOut: No valid target element found.');
				return;
			}

			targetElement.style.opacity = '1';
			targetElement.style.transition = `opacity ${duration}ms ease-in-out`;
			targetElement.style.opacity = '0';
			await new Promise(resolve => setTimeout(resolve, duration));
		}

		async function fadeInElement(element, duration = 300) {
			if (!element) return;

			// Determine the target for the fade based on screen size
			const isDesktopOrTablet = window.innerWidth > 768;
			let targetElement = element;
			if (isDesktopOrTablet && element === blogContentElement) {
				targetElement = element.querySelector('.content-inner-wrapper');
				if (!targetElement) {
					console.warn('FadeIn: .content-inner-wrapper not found, fading blog-content instead.');
					targetElement = element; // Fallback
				}
			}

			if (!targetElement) {
				console.error('FadeIn: No valid target element found.');
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
				await fadeOutElement(blogContentElement);
				blogContentElement.innerHTML = initialBlogContentHTML;
				initializeBlogFeatures(blogContentElement);
				initializeLinkListeners(blogContentElement);
				initializeMobileTabs();
				// Re-initialize sound effects when returning to home page
				if (window.initializeSoundEffects) {
					console.log('[blog.js] Re-initializing sound effects for back navigation');
					window.initializeSoundEffects();
				} else {
					// Fallback: try again after a short delay in case sound effects script is still loading
					setTimeout(() => {
						if (window.initializeSoundEffects) {
							console.log('[blog.js] Re-initializing sound effects for back navigation (delayed)');
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
				console.log('[blog.js fetchAndDisplayContent] Cleaning up carousel instances from blogContentElement');
				cleanupCarouselInstances(blogContentElement);
			}

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

				const contentToExtractSelector = isProject ? 'div.project-wrapper' : 'article.post';
				let newContentContainer = doc.querySelector(contentToExtractSelector);

				// Fallback: if loading a post and article.post is not found, try div.project-wrapper
				if (!newContentContainer && !isProject) {
					newContentContainer = doc.querySelector('div.project-wrapper');
				}

				const backButton = addOrUpdateBackButton();

				if (newContentContainer) {
					const contentFragment = document.createDocumentFragment();
					// Add the inner wrapper conditionally for desktop/tablet
					const isDesktopOrTablet = window.innerWidth > 768;
					if (isDesktopOrTablet) {
						const innerWrapper = document.createElement('div');
						innerWrapper.className = 'content-inner-wrapper';
						innerWrapper.style.opacity = '0'; // Start transparent for fade-in

						// Ensure newContentContainer itself gets dynamic-loaded if it's the project-wrapper
						// or find the project-wrapper within it.
						let projectWrapperInstance = null;
						if (newContentContainer.classList.contains('project-wrapper')) {
							projectWrapperInstance = newContentContainer;
						} else {
							projectWrapperInstance = newContentContainer.querySelector('.project-wrapper');
						}

						if (projectWrapperInstance) {
							projectWrapperInstance.classList.add('dynamic-loaded');
							console.log('Added dynamic-loaded to:', projectWrapperInstance);
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

						if (projectWrapperInstance) {
							projectWrapperInstance.classList.add('dynamic-loaded');
							console.log('Added dynamic-loaded to (mobile):', projectWrapperInstance);
						}

						const clonedContent = newContentContainer.cloneNode(true);
						contentFragment.appendChild(clonedContent);
					}

					if (backButton) {
						backButton.after(contentFragment);
					} else {
						blogContentElement.appendChild(contentFragment);
					}
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
						console.log('[blog.js] Re-initializing sound effects for dynamically loaded content');
						window.initializeSoundEffects();
					} else {
						// Fallback: try again after a short delay in case sound effects script is still loading
						setTimeout(() => {
							if (window.initializeSoundEffects) {
								console.log('[blog.js] Re-initializing sound effects for dynamically loaded content (delayed)');
								window.initializeSoundEffects();
							}
						}, 100);
					}
				} else {
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
				console.error('Error fetching or displaying content:', error);
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
						console.log('[blog.js] Redirecting to actual page due to mobile resize:', currentUrl);
						window.location.href = currentUrl;
					}
				}
			}, 150); // Debounce resize events
		});

		window.addEventListener('popstate', async function (event) {
			console.log('[blog.js popstate] Event triggered', event.state);
			const state = event.state;
			const currentFullUrl = window.location.pathname + window.location.search + window.location.hash;

			if (state && state.isDynamic) {
				await fetchAndDisplayContent(state.path, false, state.isProject);
			} else if (state && state.isInitial) {
				if (blogContentElement && blogContentElement.innerHTML !== initialBlogContentHTML) {
					// Before restoring HTML, cleanup any carousels in the current dynamic content
					if (typeof cleanupCarouselInstances === 'function') {
						console.log('[blog.js popstate] Cleaning up carousel instances from current dynamic content before restoring initial HTML');
						cleanupCarouselInstances(blogContentElement);
					}
					await fadeOutElement(blogContentElement);
					if (blogContentElement) {
						console.log('[blog.js popstate] Restoring initial HTML...');
						blogContentElement.innerHTML = initialBlogContentHTML;
						// Ensure the restored content is ready for fadeInElement logic
						const isDesktopOrTablet = window.innerWidth > 768;
						const innerWrapper = blogContentElement.querySelector('.content-inner-wrapper');
						if (isDesktopOrTablet && innerWrapper) {
							innerWrapper.style.opacity = '0'; // Prepare for fade-in
						} else if (!isDesktopOrTablet) {
							blogContentElement.style.opacity = '0'; // Prepare for fade-in on mobile
						}
						console.log('[blog.js popstate] HTML restored. Initializing features (delegates carousel)...');
						initializeBlogFeatures(blogContentElement);
						initializeLinkListeners(blogContentElement);
						initializeMobileTabs();
						// Initialize project tabs for dynamically loaded content
						if (window.initializeProjectTabs) {
							window.initializeProjectTabs(blogContentElement);
						}
						// Initialize project summary for dynamically loaded content
						if (window.initializeProjectSummary) {
							window.initializeProjectSummary(blogContentElement);
						}
						// Re-initialize sound effects for popstate navigation
						if (window.initializeSoundEffects) {
							console.log('[blog.js] Re-initializing sound effects for popstate navigation');
							window.initializeSoundEffects();
						}
						console.log('[blog.js popstate] Features initialized. Waiting for waveTextReady...');

						// Wait for wave text to signal readiness
						const waveContainer = document.querySelector('.wave-container');
						const fadeInTimeoutDuration = 500; // Max wait time in ms
						let fadeInTimer = null;

						const performFadeIn = async () => {
							clearTimeout(fadeInTimer);
							console.log('[blog.js popstate] Proceeding with fade-in.');
							await fadeInElement(blogContentElement);
							console.log('[blog.js popstate] Fade in complete.');
						};

						if (waveContainer) {
							waveContainer.addEventListener('waveTextReady', function onWaveReady() {
								console.log('[blog.js popstate] waveTextReady event received.');
								performFadeIn();
								// Note: No need to remove listener due to { once: true }
							}, { once: true });

							// Fallback timeout in case the event never fires
							fadeInTimer = setTimeout(() => {
								console.warn('[blog.js popstate] waveTextReady event timed out. Fading in anyway.');
								performFadeIn();
							}, fadeInTimeoutDuration);
						} else {
							console.warn('[blog.js popstate] Wave container not found for event listener. Fading in after short delay.');
							// Fallback if no wave container exists on the page
							await new Promise(resolve => setTimeout(resolve, 100)); // Keep small delay
							await performFadeIn(); // Call the async function
						}
					}
				}
			} else if (!state && currentFullUrl === initialBlogContentURL) {
				if (blogContentElement && blogContentElement.innerHTML !== initialBlogContentHTML) {
					await fadeOutElement(blogContentElement);
					if (blogContentElement) {
						console.log('[blog.js popstate] Restoring initial HTML (no state fallback)...');
						blogContentElement.innerHTML = initialBlogContentHTML;
						// Ensure the restored content is ready for fadeInElement logic
						const isDesktopOrTablet = window.innerWidth > 768;
						const innerWrapper = blogContentElement.querySelector('.content-inner-wrapper');
						if (isDesktopOrTablet && innerWrapper) {
							innerWrapper.style.opacity = '0'; // Prepare for fade-in
						} else if (!isDesktopOrTablet) {
							blogContentElement.style.opacity = '0'; // Prepare for fade-in on mobile
						}
						console.log('[blog.js popstate] HTML restored (no state fallback). Initializing features...');
						initializeBlogFeatures(blogContentElement);
						initializeLinkListeners(blogContentElement);
						initializeMobileTabs();
						// Initialize project tabs for dynamically loaded content
						if (window.initializeProjectTabs) {
							window.initializeProjectTabs(blogContentElement);
						}
						// Initialize project summary for dynamically loaded content
						if (window.initializeProjectSummary) {
							window.initializeProjectSummary(blogContentElement);
						}
						// Re-initialize sound effects for popstate navigation (no state fallback)
						if (window.initializeSoundEffects) {
							console.log('[blog.js] Re-initializing sound effects for popstate navigation (no state fallback)');
							window.initializeSoundEffects();
						}
						console.log('[blog.js popstate] Features initialized (no state fallback). Waiting for waveTextReady...');

						// Wait for wave text to signal readiness (duplicate logic for this branch)
						const waveContainer = document.querySelector('.wave-container');
						const fadeInTimeoutDuration = 500; // Max wait time in ms
						let fadeInTimer = null;

						const performFadeIn = async () => {
							clearTimeout(fadeInTimer);
							console.log('[blog.js popstate] Proceeding with fade-in (no state fallback).');
							await fadeInElement(blogContentElement);
							console.log('[blog.js popstate] Fade in complete (no state fallback).');
						};

						if (waveContainer) {
							waveContainer.addEventListener('waveTextReady', function onWaveReady() {
								console.log('[blog.js popstate] waveTextReady event received (no state fallback).');
								performFadeIn();
							}, { once: true });

							// Fallback timeout
							fadeInTimer = setTimeout(() => {
								console.warn('[blog.js popstate] waveTextReady event timed out (no state fallback). Fading in anyway.');
								performFadeIn();
							}, fadeInTimeoutDuration);
						} else {
							console.warn('[blog.js popstate] Wave container not found (no state fallback). Fading in after short delay.');
							await new Promise(resolve => setTimeout(resolve, 100)); // Keep small delay
							await performFadeIn(); // Call the async function
						}
					}
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