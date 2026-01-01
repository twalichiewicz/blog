/**
 * Main JavaScript Entry Point
 * Import and initialize all modules
 */
import { initSectionAnimations, initColumnTitleScrollDetection } from './utils/animations.js';
import { initializeSoundEffects } from './utils/sound-effects.js';
import { initResponsiveTables } from './components/responsive-tables.js';

let impactCharacterModulePromise = null;
let impactLiquidModulePromise = null;

const impactLiquidState = {
	isOpen: false,
	isTransitioning: false,
	closePromise: null,
	activeTarget: null,
	coveredTarget: null,
	mountTarget: null,
	isEmbedded: false,
	keydownHandler: null
};

function loadImpactCharacterModule() {
	if (!impactCharacterModulePromise) {
		impactCharacterModulePromise = import('./components/impact-character.js');
	}
	return impactCharacterModulePromise;
}

function startImpactCharacter() {
	return loadImpactCharacterModule()
		.then((module) => module.startImpactCharacter?.())
		.catch(() => {});
}

function stopImpactCharacter() {
	if (!impactCharacterModulePromise) return;
	impactCharacterModulePromise
		.then((module) => module.stopImpactCharacter?.())
		.catch(() => {});
}

function loadImpactLiquidModule() {
	if (!impactLiquidModulePromise) {
		impactLiquidModulePromise = import('./components/impact-liquid.js');
	}
	return impactLiquidModulePromise;
}

function startImpactLiquidOverlay(options) {
	return loadImpactLiquidModule()
		.then((module) => module.startImpactLiquidOverlay?.(options))
		.catch(() => null);
}

function stopImpactLiquidOverlay() {
	if (!impactLiquidModulePromise) return Promise.resolve();
	return impactLiquidModulePromise
		.then((module) => module.stopImpactLiquidOverlay?.())
		.catch(() => {});
}

document.addEventListener('DOMContentLoaded', function () {
	// Initialize sound effects first
	initializeSoundEffects();
	
	// Check for 404 redirect and show toast
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.get('error') === '404' && !window._404ToastShown) {
		window._404ToastShown = true; // Prevent duplicate toasts
		const path = urlParams.get('path') || 'the requested page';
		
		// Function to show toast when SD namespace is ready
		const showToastWhenReady = () => {
			if (window.SD && window.SD.ui && window.SD.ui.showToast) {
				window.SD.ui.showToast(`<strong>404</strong><br>That page isn't found`, 'info', 5000);
				
				// Clean up URL after showing toast
				urlParams.delete('error');
				urlParams.delete('path');
				const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '') + window.location.hash;
				window.history.replaceState({}, '', newUrl);
			} else {
				// Try again in 100ms if SD namespace not ready
				setTimeout(showToastWhenReady, 100);
			}
		};
		
		// Start trying after a small initial delay
		setTimeout(showToastWhenReady, 300);
	}

	// Initialize color scheme functionality
	// Theme system removed - using prefers-color-scheme only

	// Initialize mobile expandable header
	initMobileExpandableHeader();

	// Initialize animations for sections
	initSectionAnimations({
		sectionSelector: '.section',
		blogPostSelector: '.blog-post',
		portfolioItemSelector: '.portfolio-item'
	});

	// Initialize column title scroll detection
	initColumnTitleScrollDetection({
		postsContentId: 'postsContent',
		projectsContentId: 'projectsContent'
	});
	
	// Initialize responsive table enhancements
	initResponsiveTables();
	document.addEventListener('contentLoaded', initResponsiveTables);
	document.addEventListener('portfolio-loaded', initResponsiveTables);
	
	// Initialize notebook hover sounds
	initNotebookHoverSounds();
});

/**
 * Initialize sound effects for notebook hover on desktop
 */
function initNotebookHoverSounds() {
	let hoverTimeout = null;
	
	function addNotebookHoverSound() {
		const notebooks = document.querySelectorAll('.portfolio-featured-grid .portfolio-item-wrapper');
		notebooks.forEach(notebook => {
			// Remove any existing listeners to prevent duplicates
			notebook.removeEventListener('mouseenter', handleNotebookHover);
			notebook.removeEventListener('mouseleave', handleNotebookLeave);
			notebook.addEventListener('mouseenter', handleNotebookHover);
			notebook.addEventListener('mouseleave', handleNotebookLeave);
		});
	}
	
	function handleNotebookHover() {
		// Only play sound on desktop (not mobile)
		if (window.innerWidth > 768) {
			// Clear any existing timeout
			if (hoverTimeout) {
				clearTimeout(hoverTimeout);
			}
			
			// Animation takes 1.8s, play sound slightly after hover starts
			hoverTimeout = setTimeout(() => {
				// Check if sound system is ready
				if (window.playBookSound) {
					window.playBookSound();
				} else if (window.soundEffects && window.soundEffects.play) {
					// Fallback to direct sound effects call
					window.soundEffects.play('book');
				}
			}, 300); // 300ms delay for optimal timing with animation
		}
	}
	
	function handleNotebookLeave() {
		// Cancel sound if user leaves before it plays
		if (hoverTimeout) {
			clearTimeout(hoverTimeout);
			hoverTimeout = null;
		}
	}
	
	// Wait for sound system to be ready
	function initWhenReady() {
		if (window.soundEffects || window.playBookSound) {
			addNotebookHoverSound();
		} else {
			// Try again in a moment
			setTimeout(initWhenReady, 100);
		}
	}
	
	// Initial setup
	initWhenReady();
	
	// Re-add listeners when content is dynamically loaded
	document.addEventListener('contentLoaded', addNotebookHoverSound);
	document.addEventListener('portfolio-loaded', addNotebookHoverSound);
}

/**
 * Theme system removed - now using prefers-color-scheme media queries only
 */

/**
 * Initialize mobile expandable header functionality
 */
function initMobileExpandableHeader() {
	const expandButton = document.querySelector('.mobile-expand-button');
	const profileHeader = document.querySelector('.profile-header');
	const expandableContent = document.querySelector('.mobile-expandable-content');
	const blogContent = document.querySelector('.blog-content');
	
	if (!expandButton || !profileHeader || !expandableContent) return;
	
	// Add click event listener to the expand button
	expandButton.addEventListener('click', function() {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		
		// Toggle expanded state
		profileHeader.setAttribute('data-expanded', !isExpanded);
		expandButton.setAttribute('aria-expanded', !isExpanded);
		
		// Add sliding animation to blog content
		if (!isExpanded && blogContent) {
			blogContent.style.transition = 'transform 0.3s ease';
			blogContent.style.transform = 'translateY(0)';
			// Reset after animation
			setTimeout(() => {
				blogContent.style.transition = '';
				blogContent.style.transform = '';
			}, 300);
		}
		
		// Trigger sound effect if available
		if (window.playButtonSound) {
			window.playButtonSound();
		}
	});
	
	// Close on outside click
	const handleOutsideClick = function(event) {
		const isExpanded = profileHeader.getAttribute('data-expanded') === 'true';
		if (isExpanded && !profileHeader.contains(event.target)) {
			profileHeader.setAttribute('data-expanded', 'false');
			expandButton.setAttribute('aria-expanded', 'false');
		}
	};
	document.addEventListener('click', handleOutsideClick);
	
	// Store handler for cleanup
	profileHeader._outsideClickHandler = handleOutsideClick;
}

const mobileActionState = {
	active: false,
	currentType: null,
	isTransitioning: false,
	headerHost: null,
	contentHost: null,
	impactInlineWrapper: null,
	impactInlineHeaderPlaceholder: null,
	impactInlineContentPlaceholder: null,
	contentInnerWrapperPlaceholder: null,
	blogContent: null,
	contentInnerWrapper: null,
	tabsWrapper: null,
	tabsElement: null,
	tabsBacking: null,
	contentWrapper: null,
	impactToggle: null,
	contactToggle: null,
	cachedNodes: {},
	keydownHandler: null,
	rollCleanupTimeout: null,
	rollOutTimeout: null,
	impactTimers: []
};

const mobileContactMenuState = {
	isOpen: false,
	menu: null,
	wrapper: null,
	profileHeader: null,
	outsideClickHandler: null,
	keydownHandler: null,
	scrollHandler: null,
	openScrollTop: 0,
	headerHeight: 0
};

function isMobileActionViewport() {
	return window.innerWidth <= 768;
}

function getPageScrollTop() {
	const scrollElement = document.scrollingElement || document.documentElement;
	const scrollTop = window.pageYOffset || scrollElement.scrollTop || document.body.scrollTop || 0;
	return Math.max(0, scrollTop);
}

function getHeaderHeight() {
	const header = document.querySelector('.blog-header') || document.querySelector('.profile-header');
	if (!header) return 0;
	const rect = header.getBoundingClientRect();
	return rect.height || 0;
}

function getMobileActionTimings() {
	const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	return {
		transition: reducedMotion ? 0 : 640,
		fade: reducedMotion ? 0 : 280,
		rollFade: reducedMotion ? 0 : 480,
		darkTransition: reducedMotion ? 0 : 520
	};
}

function clearImpactModeTimers() {
	if (!mobileActionState.impactTimers.length) return;
	mobileActionState.impactTimers.forEach((timer) => window.clearTimeout(timer));
	mobileActionState.impactTimers = [];
}

function scheduleImpactModeTimer(callback, delay) {
	const timer = window.setTimeout(() => {
		mobileActionState.impactTimers = mobileActionState.impactTimers.filter((id) => id !== timer);
		callback();
	}, delay);
	mobileActionState.impactTimers.push(timer);
	return timer;
}

function setImpactModeActive(isActive) {
	if (!document.body) return;
	document.body.classList.toggle('impact-mode', isActive);
	document.body.classList.toggle('dark-mode-forced', isActive);
}

function setImpactInlineActive(isActive) {
	if (!document.body) return;
	document.body.classList.toggle('impact-inline-active', isActive);
}

function ensureMobileActionElements() {
	if (!mobileActionState.blogContent || !document.contains(mobileActionState.blogContent)) {
		mobileActionState.blogContent = document.querySelector('.blog-content');
	}
	if (!mobileActionState.contentInnerWrapper) {
		mobileActionState.contentInnerWrapper = document.querySelector('.content-inner-wrapper');
	} else if (
		!document.contains(mobileActionState.contentInnerWrapper) &&
		!mobileActionState.contentInnerWrapperPlaceholder
	) {
		mobileActionState.contentInnerWrapper = document.querySelector('.content-inner-wrapper');
	}
	if (!mobileActionState.headerHost || !document.contains(mobileActionState.headerHost)) {
		mobileActionState.headerHost = document.querySelector('.mobile-action-header');
	}
	if (!mobileActionState.contentHost || !document.contains(mobileActionState.contentHost)) {
		mobileActionState.contentHost = document.querySelector('.mobile-action-content');
	}
	if (!mobileActionState.tabsWrapper || !document.contains(mobileActionState.tabsWrapper)) {
		mobileActionState.tabsWrapper = document.querySelector('.tabs-wrapper');
	}
	if (!mobileActionState.tabsElement || !document.contains(mobileActionState.tabsElement)) {
		mobileActionState.tabsElement = document.querySelector('.mobile-tabs');
	}
	if (!mobileActionState.tabsBacking || !document.contains(mobileActionState.tabsBacking)) {
		mobileActionState.tabsBacking = document.querySelector('.mobile-tabs-backing');
	}
	if (!mobileActionState.contentWrapper || !document.contains(mobileActionState.contentWrapper)) {
		mobileActionState.contentWrapper = document.querySelector('.content-wrapper');
	}
	if (!mobileActionState.impactToggle || !document.contains(mobileActionState.impactToggle)) {
		mobileActionState.impactToggle = document.querySelector('.mobile-impact-button');
	}
	if (!mobileActionState.contactToggle || !document.contains(mobileActionState.contactToggle)) {
		mobileActionState.contactToggle = document.querySelector('.mobile-contact-button');
	}
	return Boolean(
		mobileActionState.headerHost &&
		mobileActionState.contentHost &&
		mobileActionState.tabsWrapper &&
		mobileActionState.contentWrapper
	);
}

function detachContentInnerWrapper() {
	const { blogContent, contentInnerWrapper } = mobileActionState;
	if (!blogContent || !contentInnerWrapper) return false;
	if (contentInnerWrapper.parentElement !== blogContent) return false;
	if (mobileActionState.contentInnerWrapperPlaceholder) return true;

	const placeholder = document.createElement('div');
	placeholder.style.display = 'none';
	placeholder.dataset.placeholder = 'content-inner-wrapper';
	blogContent.insertBefore(placeholder, contentInnerWrapper);
	mobileActionState.contentInnerWrapperPlaceholder = placeholder;
	contentInnerWrapper.remove();
	return true;
}

function restoreContentInnerWrapper() {
	const { blogContent, contentInnerWrapper, contentInnerWrapperPlaceholder } = mobileActionState;
	if (!blogContent || !contentInnerWrapper || !contentInnerWrapperPlaceholder) return false;
	if (!contentInnerWrapperPlaceholder.parentElement) return false;

	contentInnerWrapperPlaceholder.parentElement.insertBefore(contentInnerWrapper, contentInnerWrapperPlaceholder);
	contentInnerWrapperPlaceholder.remove();
	mobileActionState.contentInnerWrapperPlaceholder = null;
	return true;
}

function ensureImpactInlineWrapper() {
	const blogContent = mobileActionState.blogContent;
	if (!blogContent) return null;

	if (!mobileActionState.impactInlineWrapper || !document.contains(mobileActionState.impactInlineWrapper)) {
		const wrapper = document.createElement('div');
		wrapper.className = 'impact-inline-wrapper';
		wrapper.setAttribute('aria-hidden', 'true');

		if (mobileActionState.contentInnerWrapper && mobileActionState.contentInnerWrapper.parentElement === blogContent) {
			blogContent.insertBefore(wrapper, mobileActionState.contentInnerWrapper);
		} else {
			blogContent.insertBefore(wrapper, blogContent.firstChild);
		}
		mobileActionState.impactInlineWrapper = wrapper;
	}

	return mobileActionState.impactInlineWrapper;
}

function promoteImpactInlineHosts() {
	const wrapper = ensureImpactInlineWrapper();
	if (!wrapper) return false;

	const { headerHost, contentHost } = mobileActionState;
	if (!headerHost || !contentHost) return false;

	if (!mobileActionState.impactInlineHeaderPlaceholder || !document.contains(mobileActionState.impactInlineHeaderPlaceholder)) {
		const placeholder = document.createElement('div');
		placeholder.style.display = 'none';
		placeholder.dataset.placeholder = 'mobile-action-header';
		headerHost.parentElement?.insertBefore(placeholder, headerHost);
		mobileActionState.impactInlineHeaderPlaceholder = placeholder;
	}

	if (!mobileActionState.impactInlineContentPlaceholder || !document.contains(mobileActionState.impactInlineContentPlaceholder)) {
		const placeholder = document.createElement('div');
		placeholder.style.display = 'none';
		placeholder.dataset.placeholder = 'mobile-action-content';
		contentHost.parentElement?.insertBefore(placeholder, contentHost);
		mobileActionState.impactInlineContentPlaceholder = placeholder;
	}

	if (headerHost.parentElement !== wrapper) {
		wrapper.appendChild(headerHost);
	}
	if (contentHost.parentElement !== wrapper) {
		wrapper.appendChild(contentHost);
	}

	wrapper.setAttribute('aria-hidden', 'false');
	return true;
}

function restoreImpactInlineHosts() {
	const wrapper = mobileActionState.impactInlineWrapper;
	if (wrapper) {
		wrapper.setAttribute('aria-hidden', 'true');
	}

	const { headerHost, contentHost } = mobileActionState;

	const headerPlaceholder = mobileActionState.impactInlineHeaderPlaceholder;
	if (headerHost && headerPlaceholder?.parentElement) {
		headerPlaceholder.parentElement.insertBefore(headerHost, headerPlaceholder);
		headerPlaceholder.remove();
	}
	mobileActionState.impactInlineHeaderPlaceholder = null;

	const contentPlaceholder = mobileActionState.impactInlineContentPlaceholder;
	if (contentHost && contentPlaceholder?.parentElement) {
		contentPlaceholder.parentElement.insertBefore(contentHost, contentPlaceholder);
		contentPlaceholder.remove();
	}
	mobileActionState.impactInlineContentPlaceholder = null;
}

function syncMobileTabsBacking() {
	const { tabsWrapper, tabsElement, tabsBacking } = mobileActionState;
	if (!tabsWrapper || !tabsElement || !tabsBacking) return;
	const tabsRect = tabsElement.getBoundingClientRect();
	if (!tabsRect.width || !tabsRect.height) return;
	const wrapperRect = tabsWrapper.getBoundingClientRect();
	const left = tabsRect.left - wrapperRect.left;
	const top = tabsRect.top - wrapperRect.top;

	tabsWrapper.style.setProperty('--mobile-tabs-left', `${left}px`);
	tabsWrapper.style.setProperty('--mobile-tabs-top', `${top}px`);
	tabsWrapper.style.setProperty('--mobile-tabs-width', `${tabsRect.width}px`);
	tabsWrapper.style.setProperty('--mobile-tabs-height', `${tabsRect.height}px`);
}

function startMobileTabsRoll({ fadeOut = false, direction = 'forward' } = {}) {
	const tabsElement = mobileActionState.tabsElement;
	if (!tabsElement?.classList.contains('has-slider-element')) return;
	syncMobileTabsBacking();
	if (mobileActionState.tabsWrapper) {
		mobileActionState.tabsWrapper.classList.add('is-rolling');
		mobileActionState.tabsWrapper.classList.remove('is-rolling-out');
	}
	tabsElement.classList.add('is-rolling');
	tabsElement.classList.toggle('is-rolling-back', direction === 'back');
	if (mobileActionState.rollCleanupTimeout) {
		clearTimeout(mobileActionState.rollCleanupTimeout);
		mobileActionState.rollCleanupTimeout = null;
	}
	if (mobileActionState.rollOutTimeout) {
		clearTimeout(mobileActionState.rollOutTimeout);
		mobileActionState.rollOutTimeout = null;
	}
	const { transition, rollFade } = getMobileActionTimings();
	const totalDuration = transition + (fadeOut ? rollFade : 0);
	if (transition === 0) {
		if (fadeOut) {
			mobileActionState.tabsWrapper?.classList.add('is-rolling-out');
		} else {
			mobileActionState.tabsWrapper?.classList.remove('is-rolling');
		}
		tabsElement.classList.remove('is-rolling', 'is-rolling-back');
		return totalDuration;
	}
	if (fadeOut) {
		mobileActionState.rollOutTimeout = window.setTimeout(() => {
			mobileActionState.tabsWrapper?.classList.add('is-rolling-out');
		}, transition);
	}
	mobileActionState.rollCleanupTimeout = window.setTimeout(() => {
		mobileActionState.tabsWrapper?.classList.remove('is-rolling');
		if (fadeOut) {
			mobileActionState.tabsWrapper?.classList.remove('is-rolling-out');
		}
		tabsElement.classList.remove('is-rolling', 'is-rolling-back');
		mobileActionState.rollCleanupTimeout = null;
	}, totalDuration);
	return totalDuration;
}

function resetMobileTabsRollState() {
	if (mobileActionState.rollCleanupTimeout) {
		clearTimeout(mobileActionState.rollCleanupTimeout);
		mobileActionState.rollCleanupTimeout = null;
	}
	if (mobileActionState.rollOutTimeout) {
		clearTimeout(mobileActionState.rollOutTimeout);
		mobileActionState.rollOutTimeout = null;
	}
	mobileActionState.tabsWrapper?.classList.remove('is-rolling', 'is-rolling-out');
	mobileActionState.tabsElement?.classList.remove('is-rolling', 'is-rolling-back');
}

function ensureMobileContactMenuElements() {
	if (!mobileContactMenuState.menu || !document.contains(mobileContactMenuState.menu)) {
		mobileContactMenuState.menu = document.querySelector('.mobile-contact-menu');
	}
	if (!mobileContactMenuState.wrapper || !document.contains(mobileContactMenuState.wrapper)) {
		mobileContactMenuState.wrapper = document.querySelector('.mobile-contact-menu-wrapper');
	}
	if (!mobileContactMenuState.profileHeader || !document.contains(mobileContactMenuState.profileHeader)) {
		mobileContactMenuState.profileHeader = document.querySelector('.profile-header');
	}
	if (!mobileActionState.contactToggle || !document.contains(mobileActionState.contactToggle)) {
		mobileActionState.contactToggle = document.querySelector('.mobile-contact-button');
	}
	if (!mobileActionState.impactToggle || !document.contains(mobileActionState.impactToggle)) {
		mobileActionState.impactToggle = document.querySelector('.mobile-impact-button');
	}

	return Boolean(mobileContactMenuState.menu && mobileContactMenuState.wrapper && mobileContactMenuState.profileHeader);
}

function setContactMenuExpanded(isExpanded) {
	if (!mobileActionState.contactToggle) return;
	mobileActionState.contactToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
}

function openMobileContactMenu() {
	if (!isMobileActionViewport()) return false;
	if (!ensureMobileContactMenuElements()) return false;
	if (mobileContactMenuState.isOpen) return true;

	mobileContactMenuState.isOpen = true;
	mobileContactMenuState.profileHeader.classList.add('is-contact-menu-open');
	mobileContactMenuState.menu.classList.add('is-open');
	mobileContactMenuState.menu.setAttribute('aria-hidden', 'false');
	mobileContactMenuState.openScrollTop = getPageScrollTop();
	mobileContactMenuState.headerHeight = getHeaderHeight();
	mobileContactMenuState.menu.querySelectorAll('.mobile-contact-option').forEach((item) => {
		item.removeAttribute('tabindex');
	});
	setMobileActionToggleState('contact');
	setContactMenuExpanded(true);

	if (!mobileContactMenuState.outsideClickHandler) {
		mobileContactMenuState.outsideClickHandler = (event) => {
			if (!mobileContactMenuState.isOpen) return;
			if (mobileContactMenuState.wrapper?.contains(event.target)) return;
			closeMobileContactMenu();
		};
		document.addEventListener('click', mobileContactMenuState.outsideClickHandler);
	}

	if (!mobileContactMenuState.keydownHandler) {
		mobileContactMenuState.keydownHandler = (event) => {
			if (event.key === 'Escape') {
				closeMobileContactMenu();
			}
		};
		document.addEventListener('keydown', mobileContactMenuState.keydownHandler);
	}

	if (!mobileContactMenuState.scrollHandler) {
		mobileContactMenuState.scrollHandler = () => {
			if (!mobileContactMenuState.isOpen) return;
			const currentScrollTop = getPageScrollTop();
			const threshold = mobileContactMenuState.headerHeight || getHeaderHeight();
			if (threshold <= 0) return;
			if (currentScrollTop - mobileContactMenuState.openScrollTop >= threshold) {
				closeMobileContactMenu();
			}
		};
		window.addEventListener('scroll', mobileContactMenuState.scrollHandler, { passive: true });
	}

	return true;
}

function closeMobileContactMenu() {
	if (!mobileContactMenuState.isOpen) return false;

	mobileContactMenuState.isOpen = false;
	mobileContactMenuState.profileHeader?.classList.remove('is-contact-menu-open');
	mobileContactMenuState.menu?.classList.remove('is-open');
	mobileContactMenuState.menu?.setAttribute('aria-hidden', 'true');
	mobileContactMenuState.menu?.querySelectorAll('.mobile-contact-option').forEach((item) => {
		item.setAttribute('tabindex', '-1');
	});
	setContactMenuExpanded(false);

	const restoreType = mobileActionState.active ? mobileActionState.currentType : null;
	setMobileActionToggleState(restoreType);

	if (mobileContactMenuState.outsideClickHandler) {
		document.removeEventListener('click', mobileContactMenuState.outsideClickHandler);
		mobileContactMenuState.outsideClickHandler = null;
	}
	if (mobileContactMenuState.keydownHandler) {
		document.removeEventListener('keydown', mobileContactMenuState.keydownHandler);
		mobileContactMenuState.keydownHandler = null;
	}
	if (mobileContactMenuState.scrollHandler) {
		window.removeEventListener('scroll', mobileContactMenuState.scrollHandler);
		mobileContactMenuState.scrollHandler = null;
	}
	mobileContactMenuState.openScrollTop = 0;
	mobileContactMenuState.headerHeight = 0;

	return true;
}

function toggleMobileContactMenu() {
	if (mobileContactMenuState.isOpen) {
		return closeMobileContactMenu();
	}
	return openMobileContactMenu();
}

function getModalNodes(type) {
	if (mobileActionState.cachedNodes[type]) {
		return mobileActionState.cachedNodes[type];
	}

	const modal = document.getElementById(`${type}-modal`);
	if (!modal) return null;

	const sheet = modal.querySelector(`.${type}-modal-sheet`);
	const header = modal.querySelector(`.${type}-modal-header`);
	if (!sheet || !header) return null;

	const nodes = { modal, sheet, header };
	mobileActionState.cachedNodes[type] = nodes;
	return nodes;
}

function mountMobileActionNodes(type) {
	const nodes = getModalNodes(type);
	if (!nodes) return false;

	const { modal, sheet, header } = nodes;
	if (modal.classList.contains('active')) {
		modal.classList.remove('active');
		modal.style.display = 'none';
		document.body.style.overflow = '';
	}

	if (sheet.parentElement !== mobileActionState.contentHost) {
		mobileActionState.contentHost.appendChild(sheet);
	}
	if (header.parentElement !== mobileActionState.headerHost) {
		mobileActionState.headerHost.appendChild(header);
	}

	mobileActionState.headerHost.dataset.mode = type;
	mobileActionState.contentHost.dataset.mode = type;
	return true;
}

function restoreMobileActionNodes(type) {
	const nodes = getModalNodes(type);
	if (!nodes) return;

	const { modal, sheet, header } = nodes;
	if (sheet.parentElement !== modal) {
		modal.appendChild(sheet);
	}
	if (header.parentElement !== sheet) {
		sheet.insertBefore(header, sheet.firstChild);
	}
}

function showMobileActionHosts() {
	const { headerHost, contentHost } = mobileActionState;
	if (!headerHost || !contentHost) return;

	headerHost.style.display = 'block';
	contentHost.style.display = 'block';
	headerHost.setAttribute('aria-hidden', 'false');
	contentHost.setAttribute('aria-hidden', 'false');

	requestAnimationFrame(() => {
		headerHost.classList.add('is-visible');
		contentHost.classList.add('is-visible');
	});
}

function hideMobileActionHosts(onComplete) {
	const { headerHost, contentHost } = mobileActionState;
	if (!headerHost || !contentHost) {
		if (typeof onComplete === 'function') onComplete();
		return;
	}

	headerHost.classList.remove('is-visible');
	contentHost.classList.remove('is-visible');
	headerHost.setAttribute('aria-hidden', 'true');
	contentHost.setAttribute('aria-hidden', 'true');

	const { fade } = getMobileActionTimings();
	window.setTimeout(() => {
		headerHost.style.display = 'none';
		contentHost.style.display = 'none';
		if (typeof onComplete === 'function') onComplete();
	}, fade);
}

function runImpactInlineEnhancements() {
	const delay = getMobileActionTimings().fade;
	window.setTimeout(() => {
		if (!mobileActionState.active || mobileActionState.currentType !== 'impact') return;
		initImpactGridAnimations();
		fitTextInTiles();
		startImpactCharacter();
	}, delay);
}

function attachMobileActionKeydown() {
	if (mobileActionState.keydownHandler) return;
	mobileActionState.keydownHandler = (event) => {
		if (event.key === 'Escape') {
			closeMobileAction();
		}
	};
	document.addEventListener('keydown', mobileActionState.keydownHandler);
}

function detachMobileActionKeydown() {
	if (!mobileActionState.keydownHandler) return;
	document.removeEventListener('keydown', mobileActionState.keydownHandler);
	mobileActionState.keydownHandler = null;
}

function updateMobileActionLabel(button, isActive) {
	if (!button) return;
	const defaultLabel = button.dataset.labelDefault;
	const activeLabel = button.dataset.labelActive;
	if (!defaultLabel && !activeLabel) return;
	button.setAttribute('aria-label', isActive ? (activeLabel || defaultLabel) : (defaultLabel || activeLabel));
}

function setMobileActionToggleState(activeType) {
	const { impactToggle, contactToggle } = mobileActionState;
	if (!impactToggle || !contactToggle) return;

	const isImpact = activeType === 'impact';
	const isContact = activeType === 'contact';
	const hasActive = Boolean(activeType);
	const setDisabled = (button, disabled) => {
		if (!button) return;
		if (disabled) {
			button.setAttribute('disabled', 'true');
			button.setAttribute('aria-disabled', 'true');
		} else {
			button.removeAttribute('disabled');
			button.removeAttribute('aria-disabled');
		}
	};

	impactToggle.classList.toggle('is-active', isImpact);
	impactToggle.classList.toggle('is-muted', hasActive && !isImpact);
	impactToggle.setAttribute('aria-pressed', isImpact ? 'true' : 'false');
	updateMobileActionLabel(impactToggle, isImpact);
	setDisabled(impactToggle, hasActive && !isImpact);

	contactToggle.classList.toggle('is-active', isContact);
	contactToggle.classList.toggle('is-muted', hasActive && !isContact);
	contactToggle.setAttribute('aria-pressed', isContact ? 'true' : 'false');
	updateMobileActionLabel(contactToggle, isContact);
	setDisabled(contactToggle, hasActive && !isContact);

	const profileHeader = document.querySelector('.profile-header');
	if (profileHeader) {
		profileHeader.classList.toggle('is-impact-open', isImpact);
	}
}

function openMobileAction(type) {
	if (!isMobileActionViewport()) return false;
	if (!ensureMobileActionElements()) return false;
	if (mobileContactMenuState.isOpen) {
		closeMobileContactMenu();
	}

	if (mobileActionState.isTransitioning) {
		return true;
	}

	if (mobileActionState.active) {
		if (mobileActionState.currentType === type) {
			closeMobileAction();
			return true;
		}

		const previousType = mobileActionState.currentType;
		mobileActionState.isTransitioning = true;
		setMobileActionToggleState(type);

		if (type === 'impact') {
			clearImpactModeTimers();
			setImpactModeActive(true);
			promoteImpactInlineHosts();
			setImpactInlineActive(true);
			detachContentInnerWrapper();
		} else if (previousType === 'impact') {
			stopImpactCharacter();
			clearImpactModeTimers();
			restoreContentInnerWrapper();
			restoreImpactInlineHosts();
			setImpactInlineActive(false);
			setImpactModeActive(false);
		}

		hideMobileActionHosts(() => {
			restoreMobileActionNodes(mobileActionState.currentType);
			const mounted = mountMobileActionNodes(type);
			if (!mounted) {
				if (type === 'impact') {
					restoreContentInnerWrapper();
					restoreImpactInlineHosts();
					setImpactInlineActive(false);
					setImpactModeActive(false);
				} else if (previousType === 'impact') {
					clearImpactModeTimers();
					setImpactModeActive(true);
					promoteImpactInlineHosts();
					setImpactInlineActive(true);
					detachContentInnerWrapper();
				}

				const recoveryMounted = mountMobileActionNodes(previousType);
				if (recoveryMounted) {
					showMobileActionHosts();
					if (previousType === 'impact') {
						runImpactInlineEnhancements();
					}
				}

				setMobileActionToggleState(previousType);
				mobileActionState.isTransitioning = false;
				return;
			}

			showMobileActionHosts();
			mobileActionState.currentType = type;
			mobileActionState.isTransitioning = false;
			if (type === 'impact') {
				runImpactInlineEnhancements();
			}
		});

		return true;
	}

	clearImpactModeTimers();
	setMobileActionToggleState(type);
	mobileActionState.isTransitioning = true;
	const timings = getMobileActionTimings();

	const startRollAndFade = () => {
		let rollDuration = timings.transition;
		if (mobileActionState.tabsElement?.classList.contains('has-slider-element')) {
			const computedDuration = startMobileTabsRoll({ fadeOut: true });
			if (computedDuration !== undefined) {
				rollDuration = computedDuration;
			}
		}
		if (mobileActionState.contentWrapper) {
			mobileActionState.contentWrapper.classList.add('is-fading');
		}

		const finishOpen = () => {
			if (mobileActionState.tabsElement) {
				mobileActionState.tabsElement.style.display = 'none';
			}
			if (mobileActionState.contentWrapper) {
				mobileActionState.contentWrapper.style.display = 'none';
			}

			if (type === 'impact') {
				promoteImpactInlineHosts();
				setImpactInlineActive(true);
				detachContentInnerWrapper();
			}

			const mounted = mountMobileActionNodes(type);
			if (!mounted) {
				if (mobileActionState.tabsElement) {
					mobileActionState.tabsElement.style.display = '';
				}
				setMobileActionToggleState(null);
				resetMobileTabsRollState();
				if (mobileActionState.contentWrapper) {
					mobileActionState.contentWrapper.style.display = '';
					mobileActionState.contentWrapper.classList.remove('is-fading');
				}
				if (type === 'impact') {
					restoreContentInnerWrapper();
					restoreImpactInlineHosts();
					setImpactInlineActive(false);
					setImpactModeActive(false);
				}
				mobileActionState.isTransitioning = false;
				return;
			}

			showMobileActionHosts();
			mobileActionState.active = true;
			mobileActionState.currentType = type;
			mobileActionState.isTransitioning = false;
			attachMobileActionKeydown();
			if (type === 'impact') {
				runImpactInlineEnhancements();
			}
		};

		if (type === 'impact') {
			scheduleImpactModeTimer(finishOpen, rollDuration);
		} else {
			window.setTimeout(finishOpen, rollDuration);
		}
	};

	if (type === 'impact') {
		setImpactModeActive(true);
		if (timings.darkTransition > 0) {
			scheduleImpactModeTimer(startRollAndFade, timings.darkTransition);
		} else {
			startRollAndFade();
		}
	} else {
		restoreContentInnerWrapper();
		setImpactInlineActive(false);
		restoreImpactInlineHosts();
		setImpactModeActive(false);
		startRollAndFade();
	}

	return true;
}

function closeMobileAction() {
	if (!mobileActionState.active || mobileActionState.isTransitioning) {
		return false;
	}

	const closingImpact = mobileActionState.currentType === 'impact';
	if (closingImpact) {
		stopImpactCharacter();
		clearImpactModeTimers();
	}
	mobileActionState.isTransitioning = true;
	setMobileActionToggleState(null);
	hideMobileActionHosts(() => {
		if (closingImpact) {
			restoreContentInnerWrapper();
			restoreImpactInlineHosts();
			setImpactInlineActive(false);
		}
		restoreMobileActionNodes(mobileActionState.currentType);
		mobileActionState.currentType = null;
		mobileActionState.active = false;

		if (mobileActionState.tabsElement) {
			mobileActionState.tabsElement.style.display = '';
		}
		if (mobileActionState.contentWrapper) {
			mobileActionState.contentWrapper.style.display = '';
		}
		const rollDuration = startMobileTabsRoll({ direction: 'back' });
		if (closingImpact) {
			const clearDelay = typeof rollDuration === 'number' ? rollDuration : getMobileActionTimings().transition;
			if (clearDelay === 0) {
				setImpactModeActive(false);
			} else {
				scheduleImpactModeTimer(() => {
					setImpactModeActive(false);
				}, clearDelay);
			}
		}

		requestAnimationFrame(() => {
			if (mobileActionState.contentWrapper) {
				mobileActionState.contentWrapper.classList.remove('is-fading');
			}
			if (window.mobileTabs && typeof window.mobileTabs.updateSlider === 'function') {
				requestAnimationFrame(() => {
					window.mobileTabs.updateSlider();
				});
			}
			mobileActionState.isTransitioning = false;
		});

		detachMobileActionKeydown();
	});

	return true;
	}

	// Impact Modal functionality
	function extractImpactTileValue(valueEl) {
		if (!valueEl) return '';
		let output = '';
		valueEl.childNodes.forEach((node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				output += node.textContent || '';
				return;
			}

			if (node.nodeType !== Node.ELEMENT_NODE) return;

			const el = node;
			if (el.classList?.contains('counter') && el.dataset?.target) {
				output += String(el.dataset.target);
				return;
			}

			output += el.textContent || '';
		});

		return output.replace(/\s+/g, ' ').trim();
	}

	function collectImpactLiquidStats() {
		const overrideStats = [
			{
				value: '$30M+',
				label: 'Commercial Engine',
				detail:
					'Directly enabled new ARR and secured at-risk enterprise revenue through strategic UX interventions and rapid crisis resolution.'
			},
			{
				value: '100+',
				label: 'Platform Transformation',
				detail:
					'Spearheaded the unification of a 100+ product ecosystem, achieving a 5x increase in developer velocity and standardized design-to-code pipelines.'
			},
			{
				value: '250x',
				label: 'Velocity Shift',
				detail:
					'Re-engineered core publishing workflows, collapsing legacy 3-week cycles into under 2 hours to enable real-time business agility.'
			},
			{
				value: '$9.2M',
				label: 'Efficiency Architect',
				detail:
					'Delivered $9.2M in annual operational savings by optimizing engineering workflows and automating over 15,000 daily manual tasks.'
			},
			{
				value: '85%',
				label: 'Proactive Problem Solving',
				detail:
					'Reduced the global support burden by 85% by identifying and designing out systemic friction points before they reached the customer.'
			},
			{
				value: '12TB',
				label: 'Infrastructure Optimization',
				detail:
					'Led a design-for-efficiency initiative that eliminated 12TB of redundant data storage, lowering cloud overhead and improving platform performance.'
			},
			{
				value: '50K+',
				label: 'Full-Stack Leadership',
				detail:
					'Shipped over 50,000 lines of production-ready code, proving that design leadership can directly accelerate the build.'
			},
			{
				value: '22%',
				label: 'Market-Leading Conversion',
				detail:
					'Engineered a high-performance user journey that achieved a 22% conversion rate, doubling the industry standard of 12%.'
			},
			{
				value: '85%',
				label: 'Best-in-Class Retention',
				detail:
					'Cultivated an ecosystem that maintains an 85% user retention rate, significantly outperforming competitors in the enterprise space.'
			},
			{
				value: '$1.3M',
				label: 'Customer-Centric Savings',
				detail:
					'Developed cost-saving features that directly returned $1.3M to users, strengthening brand trust and long-term loyalty.'
			},
			{
				value: '5+ yrs',
				label: 'Design Longevity',
				detail:
					'Created a suite of strategic tools with an average lifespan of 5+ years, proving the durability and long-term ROI of the design vision.'
			}
		];
		if (overrideStats.length) return overrideStats;

		const modal = document.getElementById('impact-modal');
		if (!modal) return null;

		const tiles = Array.from(modal.querySelectorAll('.impact-tile'));
		const stats = tiles
			.map((tile) => {
				const valueEl = tile.querySelector('.tile-value');
				const value = extractImpactTileValue(valueEl) || valueEl?.textContent?.trim();
				const label = tile.querySelector('.tile-label')?.textContent?.trim();
				const detail = tile.querySelector('.tile-detail')?.textContent?.trim();
				if (!value) return null;
				return { value, label, detail };
			})
			.filter(Boolean);

		return stats.length ? stats : null;
	}

	function getImpactLiquidTargets() {
		const hostCandidate = !isMobileActionViewport() ? document.querySelector('.blog-content') : null;
		const host = hostCandidate && document.contains(hostCandidate) ? hostCandidate : null;
		const isEmbedded = Boolean(host);
		const fallbackTarget = document.body || null;

		return {
			isEmbedded,
			host,
			mountTarget: isEmbedded ? host : fallbackTarget,
			coveredTarget: isEmbedded ? host : fallbackTarget,
			activeTarget: isEmbedded ? host : fallbackTarget
		};
	}

	function setImpactLiquidActive(target, isActive) {
		if (!target?.classList) return;
		target.classList.toggle('impact-liquid-active', isActive);
	}

	function clearImpactLiquidCovered(target) {
		if (!target?.classList) return;
		target.classList.remove('impact-liquid-covered');
	}

	function getImpactLiquidCloseAnchor() {
		let closeAnchor = null;
		const impactButton = document.querySelector('.profile-header .mobile-impact-button');
		const buttonsContainer = document.querySelector('.profile-header .mobile-buttons-container');
		if (impactButton && typeof impactButton.getBoundingClientRect === 'function') {
			const impactRect = impactButton.getBoundingClientRect();
			const containerRect =
				buttonsContainer && typeof buttonsContainer.getBoundingClientRect === 'function'
					? buttonsContainer.getBoundingClientRect()
					: impactRect;
			const collapsedWidth = impactRect.width;
			const expandedWidth = Math.max(impactRect.width, containerRect.right - impactRect.left);
			closeAnchor = {
				top: impactRect.top,
				left: impactRect.left,
				collapsedWidth,
				expandedWidth,
				height: impactRect.height
			};
		}
		return closeAnchor;
	}

	function getDesktopImpactToggle() {
		return document.querySelector('.impact-report-btn');
	}

	function setDesktopImpactToggleState(isActive) {
		const toggle = getDesktopImpactToggle();
		if (!toggle) return;
		const defaultText = toggle.dataset.textDefault || toggle.textContent?.trim() || 'Stats';
		const activeText = toggle.dataset.textActive || defaultText;
		toggle.classList.toggle('is-active', isActive);
		toggle.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		updateMobileActionLabel(toggle, isActive);
		toggle.textContent = isActive ? activeText : defaultText;
	}

	function attachImpactLiquidKeydown() {
		if (impactLiquidState.keydownHandler) return;
		impactLiquidState.keydownHandler = (event) => {
			if (event.key === 'Escape') {
				closeImpactLiquidExperience();
			}
		};
		document.addEventListener('keydown', impactLiquidState.keydownHandler);
	}

	function detachImpactLiquidKeydown() {
		if (!impactLiquidState.keydownHandler) return;
		document.removeEventListener('keydown', impactLiquidState.keydownHandler);
		impactLiquidState.keydownHandler = null;
	}

	async function openImpactLiquidExperience() {
		if (impactLiquidState.isTransitioning || impactLiquidState.isOpen) return true;
		impactLiquidState.isTransitioning = true;

		if (mobileContactMenuState.isOpen) {
			closeMobileContactMenu();
		}

		const targets = getImpactLiquidTargets();
		impactLiquidState.mountTarget = targets.mountTarget;
		impactLiquidState.coveredTarget = targets.coveredTarget;
		impactLiquidState.activeTarget = targets.activeTarget;
		impactLiquidState.isEmbedded = targets.isEmbedded;

		clearImpactLiquidCovered(impactLiquidState.coveredTarget);
		setImpactLiquidActive(impactLiquidState.activeTarget, true);

		impactLiquidState.isOpen = true;
		setDesktopImpactToggleState(true);

		const overlay = await startImpactLiquidOverlay({
			stats: collectImpactLiquidStats(),
			closeAnchor: targets.isEmbedded ? null : getImpactLiquidCloseAnchor(),
			onRequestClose: () => {
				closeImpactLiquidExperience();
			},
			mountTarget: impactLiquidState.mountTarget,
			coveredTarget: impactLiquidState.coveredTarget,
			applyChromeTint: !targets.isEmbedded
		});

		if (!overlay) {
			impactLiquidState.isOpen = false;
			impactLiquidState.isTransitioning = false;
			setDesktopImpactToggleState(false);
			detachImpactLiquidKeydown();
			setImpactLiquidActive(impactLiquidState.activeTarget, false);
			clearImpactLiquidCovered(impactLiquidState.coveredTarget);
			impactLiquidState.mountTarget = null;
			impactLiquidState.coveredTarget = null;
			impactLiquidState.activeTarget = null;
			impactLiquidState.isEmbedded = false;
			return false;
		}

		attachImpactLiquidKeydown();
		impactLiquidState.isTransitioning = false;
		return true;
	}

	function closeImpactLiquidExperience() {
		if (!impactLiquidState.isOpen) return Promise.resolve(false);
		if (impactLiquidState.closePromise) return impactLiquidState.closePromise;

		impactLiquidState.isTransitioning = true;
		setDesktopImpactToggleState(false);
		const { activeTarget, coveredTarget } = impactLiquidState;
		impactLiquidState.closePromise = stopImpactLiquidOverlay()
			.then(() => {
				impactLiquidState.isOpen = false;
				setImpactLiquidActive(activeTarget, false);
				clearImpactLiquidCovered(coveredTarget);
			})
			.finally(() => {
				impactLiquidState.isTransitioning = false;
				impactLiquidState.closePromise = null;
				detachImpactLiquidKeydown();
				impactLiquidState.mountTarget = null;
				impactLiquidState.coveredTarget = null;
				impactLiquidState.activeTarget = null;
				impactLiquidState.isEmbedded = false;
			});

		return impactLiquidState.closePromise;
	}

	function openImpactModal(event) {
	    if (event) {
	        event.stopPropagation();
	    }

		if (mobileContactMenuState.isOpen) {
			closeMobileContactMenu();
		}
	    
	    // Play toggle sound when opening impact report
	    if (window.playToggleSound) {
	        window.playToggleSound();
	    }

		if (impactLiquidState.isOpen) {
			closeImpactLiquidExperience();
			return;
		}

		openImpactLiquidExperience();
	}

function closeImpactModal() {
    // Play the same sound as Posts only button (small click)
    if (window.playSmallClickSound) {
        window.playSmallClickSound();
    }

	if (impactLiquidState.isOpen) {
		closeImpactLiquidExperience();
		return;
	}
    
    // Stop the party if it's playing
    if (isPartyMode) {
        togglePartyMode();
    }
    
    if (closeMobileAction()) {
        return;
    }

    const modal = document.getElementById('impact-modal');
    if (modal) {
        stopImpactCharacter();
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleImpactModalKeydown);
    }
}

function handleImpactModalKeydown(event) {
    if (event.key === 'Escape') {
        closeImpactModal();
    }
}

// Party mode functionality
let isPartyMode = false;
let audioContext = null;
let audioAnalyser = null;
let audioSource = null;
let animationFrame = null;
let scrollInterval = null;

function togglePartyMode() {
    const audio = document.getElementById('impact-audio');
    const button = document.querySelector('.impact-modal-party-mode');
    const grid = document.querySelector('.impact-grid');
    
    if (!audio || !button) return;
    
    isPartyMode = !isPartyMode;
    
    if (isPartyMode) {
        // Start the party!
        // Set the audio to loop
        audio.loop = true;
        audio.play();
        button.classList.add('playing');
        
        // Initialize audio context for beat detection
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Resume context if suspended (required for some browsers)
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                audioAnalyser = audioContext.createAnalyser();
                audioSource = audioContext.createMediaElementSource(audio);
                audioSource.connect(audioAnalyser);
                audioAnalyser.connect(audioContext.destination);
                
                // Configure analyser for better beat detection
                audioAnalyser.fftSize = 2048; // Higher resolution for better frequency analysis
                audioAnalyser.smoothingTimeConstant = 0.8; // Some smoothing to reduce noise
                
            } catch (error) {
            }
        }
        
        // Start beat-synced animations
        startBeatAnimations();
        
        // Add party class to grid for CSS animations
        if (grid) {
            grid.classList.add('party-mode');
        }
        
        // Start auto-scroll with a small delay to ensure DOM is ready
        setTimeout(() => {
            startAutoScroll();
        }, 100);
    } else {
        // Party's over
        audio.pause();
        audio.currentTime = 0;
        button.classList.remove('playing');
        
        // Stop animations
        stopBeatAnimations();
        
        // Stop auto-scroll
        stopAutoScroll();
        
        // Remove party class
        if (grid) {
            grid.classList.remove('party-mode');
        }
    }
}

function startBeatAnimations() {
    if (!audioAnalyser) {
        return;
    }
    
    const bufferLength = audioAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let beatCount = 0;
    const beatInterval = 469; // ~128 BPM (60000/128)
    
    
    // Simple interval-based beat trigger synced to BPM
    const beatTimer = setInterval(() => {
        const tiles = document.querySelectorAll('.impact-tile');
        if (tiles.length === 0) return;
        
        beatCount++;
        
        // Randomly select tiles to pulse
        const tileCount = tiles.length;
        const selectedIndices = new Set();
        
        // Choose pattern type randomly
        const patternType = Math.random();
        
        if (patternType < 0.33) {
            // Pattern 1: Random scattered tiles (20-40% of tiles)
            const pulseTileCount = Math.floor(tileCount * (0.2 + Math.random() * 0.2));
            while (selectedIndices.size < pulseTileCount) {
                selectedIndices.add(Math.floor(Math.random() * tileCount));
            }
        } else if (patternType < 0.66) {
            // Pattern 2: Clustered tiles (pick a center and nearby tiles)
            const centerTile = Math.floor(Math.random() * tileCount);
            const clusterSize = 3 + Math.floor(Math.random() * 5); // 3-7 tiles
            selectedIndices.add(centerTile);
            
            // Add nearby tiles
            for (let i = 0; i < clusterSize && selectedIndices.size < tileCount; i++) {
                const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const nearbyIndex = Math.max(0, Math.min(tileCount - 1, centerTile + offset));
                selectedIndices.add(nearbyIndex);
            }
        } else {
            // Pattern 3: Every nth tile for a rhythmic pattern
            const step = 2 + Math.floor(Math.random() * 3); // step by 2, 3, or 4
            const startOffset = Math.floor(Math.random() * step);
            for (let i = startOffset; i < tileCount; i += step) {
                selectedIndices.add(i);
            }
        }
        
        
        // Apply beat-hover to selected tiles with slight random delays
        selectedIndices.forEach(index => {
            const tile = tiles[index];
            const randomDelay = Math.random() * 50; // 0-50ms random delay
            
            setTimeout(() => {
                tile.classList.add('beat-hover');
                setTimeout(() => tile.classList.remove('beat-hover'), 200);
            }, randomDelay);
        });
    }, beatInterval);
    
    // Store timer reference for cleanup
    window.beatTimer = beatTimer;
    
    // Also do continuous volume-based animation
    function animate() {
        animationFrame = requestAnimationFrame(animate);
        
        audioAnalyser.getByteFrequencyData(dataArray);
        
        // Get overall volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength / 255; // Normalize to 0-1
        
        // Apply subtle scaling based on volume
        const tiles = document.querySelectorAll('.impact-tile');
        tiles.forEach((tile, index) => {
            if (!tile.classList.contains('beat-hover')) {
                const offset = index * 0.05;
                const scale = 1 + (average * 0.08 * Math.sin(Date.now() * 0.001 + offset));
                tile.style.transform = `scale(${scale})`;
            }
        });
    }
    
    animate();
}

function stopBeatAnimations() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    
    // Clear beat timer
    if (window.beatTimer) {
        clearInterval(window.beatTimer);
        window.beatTimer = null;
    }
    
    // Reset all tile transforms
    const tiles = document.querySelectorAll('.impact-tile');
    tiles.forEach(tile => {
        tile.style.transform = '';
        tile.classList.remove('beat-hover');
    });
}

function startAutoScroll() {
    // First try to find the impact-grid element
    const impactGrid = document.querySelector('.impact-grid');
    if (!impactGrid) {
        return;
    }
    
    // Check if it's actually scrollable
    const isScrollable = impactGrid.scrollHeight > impactGrid.clientHeight;
    let scrollTarget = impactGrid;
    let minScroll = 0;
    let maxScroll = impactGrid.scrollHeight - impactGrid.clientHeight;

    if (!isScrollable) {
        const scrollElement = document.scrollingElement || document.documentElement;
        if (!scrollElement) {
            return;
        }
        const rect = impactGrid.getBoundingClientRect();
        const currentScroll = scrollElement.scrollTop;
        const gridTop = currentScroll + rect.top;
        const gridBottom = currentScroll + rect.bottom;
        const viewportHeight = window.innerHeight;
        minScroll = gridTop;
        maxScroll = Math.max(gridBottom - viewportHeight, gridTop);
        scrollTarget = scrollElement;
    }

    if (maxScroll <= minScroll) {
        return;
    }

    // Smooth scroll animation
    let scrollDirection = 1;
    let scrollSpeed = 1; // pixels per frame (increased from 0.5)
    
    function animateScroll() {
        if (!isPartyMode) {
            stopAutoScroll();
            return;
        }
        
        const currentScroll = scrollTarget.scrollTop;
        
        // Change direction at top or bottom
        if (currentScroll >= maxScroll - 5 && scrollDirection === 1) {
            scrollDirection = -1;
        } else if (currentScroll <= minScroll + 5 && scrollDirection === -1) {
            scrollDirection = 1;
        }
        
        // Apply scroll
        scrollTarget.scrollTop += scrollSpeed * scrollDirection;
        
        // Continue animation
        animationFrame = requestAnimationFrame(animateScroll);
    }
    
    // Start the animation
    animateScroll();
}

function stopAutoScroll() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

// Make functions globally accessible
window.openImpactModal = openImpactModal;
window.closeImpactModal = closeImpactModal;
window.togglePartyMode = togglePartyMode;

// Contact Modal functionality
function openContactModal(event) {
    if (event) {
        event.stopPropagation();
    }

	if (isMobileActionViewport()) {
		const wasOpen = mobileContactMenuState.isOpen;
		const toggled = toggleMobileContactMenu();
		if (toggled) {
			if (wasOpen && window.playSmallClickSound) {
				window.playSmallClickSound();
			} else if (!wasOpen && window.playToggleSound) {
				window.playToggleSound();
			}
			return;
		}
	}

    // Play toggle sound when opening contact modal (mobile "Get in touch")
    if (window.playToggleSound) {
        window.playToggleSound();
    }

    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add keyboard support
        document.addEventListener('keydown', handleContactModalKeydown);
        
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

function closeContactModal() {
    // Play the same sound as impact modal close (small click)
    if (window.playSmallClickSound) {
        window.playSmallClickSound();
    }

	if (isMobileActionViewport() && mobileContactMenuState.isOpen) {
		closeMobileContactMenu();
		return;
	}

    if (closeMobileAction()) {
        return;
    }

    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
        
        // Remove keyboard listener
        document.removeEventListener('keydown', handleContactModalKeydown);
    }
}

function handleContactModalKeydown(event) {
    if (event.key === 'Escape') {
        closeContactModal();
    }
}

// Make contact modal functions globally accessible
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

// Impact Grid Animations
function initImpactGridAnimations() {
    const tiles = document.querySelectorAll('.impact-tile');
    
    if (!tiles.length) return;
    
    // Intersection Observer for tile animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateTile(entry.target);
                }, index * 100); // Stagger animations
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    tiles.forEach(tile => observer.observe(tile));
}

function animateTile(tile) {
    const animationType = tile.dataset.animate;
    
    switch (animationType) {
        case 'counter':
            animateCounter(tile);
            break;
        case 'scale':
            animateScale(tile);
            break;
        case 'wave':
            animateWave(tile);
            break;
        case 'stack':
            animateStack(tile);
            break;
        case 'pulse':
            animatePulse(tile);
            break;
        case 'grow':
            animateGrow(tile);
            break;
        case 'extend':
            animateExtend(tile);
            break;
        case 'race':
            animateRace(tile);
            break;
        case 'spark':
            animateSpark(tile);
            break;
        case 'shine':
            animateShine(tile);
            break;
        case 'rotate':
            animateRotate(tile);
            break;
    }
    
    tile.classList.add('animated');
}

function animateCounter(tile) {
    const counter = tile.querySelector('.counter');
    if (!counter) return;
    
    const target = parseFloat(counter.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = progress * target;
        
        counter.textContent = current.toFixed(current < 10 ? 1 : 0);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateScale(tile) {
    const progressBar = tile.querySelector('.progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = progressBar.dataset.percent + '%';
        }, 300);
    }
}

function animateWave(tile) {
    const donutSegment = tile.querySelector('.donut-segment');
    if (donutSegment) {
        setTimeout(() => {
            donutSegment.style.strokeDasharray = donutSegment.getAttribute('stroke-dasharray');
        }, 300);
    }
}

function animateStack(tile) {
    const stackItems = tile.querySelectorAll('.stack-item');
    stackItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 300 + index * 150);
    });
}

function animatePulse(tile) {
    const rings = tile.querySelectorAll('.ring');
    rings.forEach((ring, index) => {
        setTimeout(() => {
            ring.style.opacity = ring.classList.contains('ring-1') ? '1' : 
                                ring.classList.contains('ring-2') ? '0.7' : '0.4';
            ring.style.animation = 'pulse 2s ease-in-out infinite';
            ring.style.animationDelay = index * 0.2 + 's';
        }, 300 + index * 200);
    });
}

function animateGrow(tile) {
    const stages = tile.querySelectorAll('.growth-stage');
    stages.forEach((stage, index) => {
        setTimeout(() => {
            stage.style.transform = 'scaleY(1)';
        }, 300 + index * 200);
    });
}

function animateExtend(tile) {
    const calendarBar = tile.querySelector('.calendar-bar');
    if (calendarBar) {
        setTimeout(() => {
            calendarBar.classList.add('is-filled');
        }, 300);
    }
}

function animateRace(tile) {
    const velocityBars = tile.querySelectorAll('.velocity-bar');
    velocityBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.classList.add('is-active');
        }, 300 + index * 300);
    });
}

function animateSpark(tile) {
    const items = tile.querySelectorAll('.innovation-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('is-active');
        }, 300 + index * 150);
    });
}

function animateShine(tile) {
    tile.style.animation = 'shine 3s ease-in-out infinite';
}

function animateRotate(tile) {
    const globe = tile.querySelector('.globe-dots');
    if (globe) {
        globe.style.animation = 'rotateGlobe 20s linear infinite';
    }
}

// Text fitting functionality for impact tiles
function fitTextInTiles() {
    const tiles = document.querySelectorAll('.impact-tile');
    const isMobile = window.innerWidth <= 768;
    
    tiles.forEach(tile => {
        const tileInner = tile.querySelector('.tile-inner');
        const mobileContent = tile.querySelector('.tile-mobile-content');
        const useMobileContainer = Boolean(
            isMobile &&
            mobileContent &&
            window.getComputedStyle(mobileContent).display !== 'contents' &&
            mobileContent.getBoundingClientRect().width > 0 &&
            mobileContent.getBoundingClientRect().height > 0
        );
        const containerElement = useMobileContainer ? mobileContent : tileInner;
        const valueRatio = useMobileContainer ? 0.5 : 0.6;
        const labelRatio = useMobileContainer ? 0.4 : 0.25;
        
        // Fit tile values
        const tileValue = tile.querySelector('.tile-value');
        if (tileValue && window.getComputedStyle(tileValue).display !== 'none') {
            fitTextToContainer(tileValue, containerElement || tile, valueRatio, {
                isMobile,
                compact: useMobileContainer
            });
        }
        
        // Fit tile labels
        const tileLabel = tile.querySelector('.tile-label');
        if (tileLabel && window.getComputedStyle(tileLabel).display !== 'none') {
            fitTextToContainer(tileLabel, containerElement || tile, labelRatio, {
                isMobile,
                compact: useMobileContainer
            });
        }
    
        // Special handling for chart numbers
        const chartNumber = tile.querySelector('.chart-number');
        if (chartNumber) {
            fitTextToContainer(chartNumber, tile.querySelector('.chart-container'), 0.5, {
                isMobile
            });
        }
    });
}

function fitTextToContainer(textElement, container, heightRatio = 0.8, options = {}) {
    if (!textElement || !container) return;
    const { isMobile = false, compact = false } = options;
    
    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const containerPadding = parseInt(window.getComputedStyle(container).paddingLeft) * 2;
    const availableWidth = containerRect.width - containerPadding;
    const availableHeight = containerRect.height * heightRatio;
    
    // Reset to measure natural size
    textElement.style.fontSize = '';
    
    // Get current font size
    let fontSize = parseFloat(window.getComputedStyle(textElement).fontSize);
    const minFontSize = 10; // Minimum readable size
    const maxFontSize = 72; // Maximum size for large tiles
    
    // Binary search for optimal font size
    let low = minFontSize;
    let high = Math.min(maxFontSize, fontSize * 3);
    let optimal = fontSize;
    
    while (high - low > 0.5) {
        const mid = (low + high) / 2;
        textElement.style.fontSize = mid + 'px';
        
        const textRect = textElement.getBoundingClientRect();
        const textWidth = textRect.width;
        const textHeight = textRect.height;
        
        if (textWidth <= availableWidth && textHeight <= availableHeight) {
            optimal = mid;
            low = mid;
        } else {
            high = mid;
        }
    }
    
    // Apply optimal size with slight reduction for safety
    textElement.style.fontSize = (optimal * 0.95) + 'px';
    
    // For compact mobile tiles, keep text readable without overfilling
    if (isMobile && compact) {
        const currentSize = parseFloat(textElement.style.fontSize);
        if (textElement.classList.contains('tile-value')) {
            // Cap mobile value font size at 14px
            if (currentSize > 14) {
                textElement.style.fontSize = '14px';
            } else if (currentSize < 12) {
                textElement.style.fontSize = '12px';
            }
        } else if (textElement.classList.contains('tile-label')) {
            // Cap mobile label font size at 9px
            if (currentSize > 9) {
                textElement.style.fontSize = '9px';
            } else if (currentSize < 8) {
                textElement.style.fontSize = '8px';
            }
        }
    }
}

// Refit text on window resize
let resizeTimeout;
const handleWindowResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (mobileActionState.active && !isMobileActionViewport()) {
            closeMobileAction();
            return;
        }

        const modal = document.getElementById('impact-modal');
        const isInlineImpact = mobileActionState.active && mobileActionState.currentType === 'impact';
        if (isInlineImpact || (modal && modal.style.display === 'flex')) {
            fitTextInTiles();
        }
    }, 250);
};
window.addEventListener('resize', handleWindowResize);

// Store handler for cleanup
window._impactModalResizeHandler = handleWindowResize;

// Impact modal inline view handles animations when opened.
