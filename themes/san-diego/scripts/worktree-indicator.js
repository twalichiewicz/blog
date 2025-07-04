/**
 * Worktree Indicator - DISABLED
 * 
 * This script was causing production issues and has been disabled.
 * The indicator is not worth the deployment complexity.
 */

// Disabled - just return the original HTML unchanged
hexo.extend.filter.register('after_render:html', function(str, data) {
  return str;
});