/**
 * Iframe Detection Utilities
 * 
 * Detects if the demo is running in an iframe (inline mode) vs fullscreen modal.
 * Used to conditionally show onboarding content only in fullscreen mode.
 */

/**
 * Check if the current window is running inside an iframe
 * @returns {boolean} True if running in iframe
 */
export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to cross-origin restrictions,
    // we're definitely in an iframe
    return true;
  }
}

/**
 * Check if we're in fullscreen demo mode (modal)
 * @returns {boolean} True if in fullscreen mode
 */
export function isFullscreenMode() {
  return !isInIframe();
}

/**
 * Get the demo context - useful for conditional rendering
 * @returns {'iframe'|'fullscreen'} The current context
 */
export function getDemoContext() {
  return isInIframe() ? 'iframe' : 'fullscreen';
}

/**
 * Hook for React components to detect iframe context
 * @returns {object} Context information
 */
export function useDemoContext() {
  const inIframe = isInIframe();
  
  return {
    isIframe: inIframe,
    isFullscreen: !inIframe,
    context: inIframe ? 'iframe' : 'fullscreen',
    shouldShowOnboarding: !inIframe
  };
}