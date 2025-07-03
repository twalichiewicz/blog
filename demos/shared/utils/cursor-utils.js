/**
 * Cursor utilities for demo components
 * Handles both standard CSS cursors and custom SVG cursors
 */

// Map of demo types to cursor styles - using global CSS variables
export const DEMO_CURSORS = {
  enterprise: 'var(--cursor-interactive, pointer)',
  'design-system': 'var(--cursor-interactive, help)',
  consumer: 'var(--cursor-interactive, pointer)',
  interactive: 'var(--cursor-grab, grab)',
  template: 'var(--cursor-default, default)'
};

// Standard CSS cursors with custom cursor variable fallbacks
export const CSS_CURSORS = {
  pointer: 'var(--cursor-pointer, pointer)',
  crosshair: 'crosshair', 
  help: 'help',
  grab: 'var(--cursor-grab, grab)',
  grabbing: 'var(--cursor-grabbing, grabbing)',
  'zoom-in': 'zoom-in',
  move: 'move',
  text: 'var(--cursor-text, text)',
  wait: 'var(--cursor-loading, wait)',
  default: 'var(--cursor-default, default)',
  active: 'var(--cursor-active, pointer)'
};

/**
 * Get cursor CSS value with proper fallbacks
 * @param {string} cursor - Cursor type or custom URL
 * @param {string} demoType - Demo type for automatic cursor selection
 * @returns {string} CSS cursor value
 */
export function getCursorStyle(cursor, demoType = null) {
  // If cursor is explicitly provided
  if (cursor) {
    // Check if it's a custom URL
    if (cursor.startsWith('url(') || cursor.includes('.svg') || cursor.includes('.cur') || cursor.includes('.png')) {
      return cursor.includes('url(') ? cursor : `url(${cursor}) 4 4, auto`;
    }
    
    // Check if it's a standard CSS cursor
    if (CSS_CURSORS[cursor]) {
      return CSS_CURSORS[cursor];
    }
    
    // Return as-is if it's a valid CSS cursor value
    return cursor;
  }
  
  // Fall back to demo type cursor
  if (demoType && DEMO_CURSORS[demoType]) {
    return DEMO_CURSORS[demoType];
  }
  
  // Default fallback
  return 'default';
}

/**
 * Convert SVG cursor to data URL for better compatibility
 * @param {string} svgPath - Path to SVG file
 * @returns {Promise<string>} Data URL cursor string
 */
export async function svgToDataUrl(svgPath) {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    const base64 = btoa(svgText);
    return `url(data:image/svg+xml;base64,${base64}) 4 4, auto`;
  } catch (error) {
    console.warn('Failed to load SVG cursor:', error);
    return 'default';
  }
}