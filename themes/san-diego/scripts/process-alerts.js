/* global hexo */
'use strict';

// Walk the HTML string to find the matching closing tag while handling nesting.
function findClosingTagEndIndex(html, startIndex, tagName) {
  const lowerTagName = tagName.toLowerCase();
  let depth = 1;
  let cursor = startIndex;

  while (cursor < html.length) {
    const nextLt = html.indexOf('<', cursor);
    if (nextLt === -1) {
      return -1;
    }

    const nextGt = html.indexOf('>', nextLt + 1);
    if (nextGt === -1) {
      return -1;
    }

    const rawTagContent = html.slice(nextLt + 1, nextGt).trim();
    if (!rawTagContent) {
      cursor = nextGt + 1;
      continue;
    }

    if (rawTagContent[0] === '!') {
      cursor = nextGt + 1;
      continue;
    }

    const isClosing = rawTagContent[0] === '/';
    const normalizedTag = (isClosing ? rawTagContent.slice(1) : rawTagContent)
      .split(/[\s/>]/)[0]
      .toLowerCase();
    const isSelfClosing = !isClosing && /\/\s*$/.test(rawTagContent);

    if (normalizedTag === lowerTagName) {
      if (isClosing) {
        depth -= 1;
        if (depth === 0) {
          return nextGt + 1;
        }
      } else if (!isSelfClosing) {
        depth += 1;
      }
    }

    cursor = nextGt + 1;
  }

  return -1;
}

// Process alerts to move them to the top of posts
hexo.extend.filter.register('after_post_render', function(data) {
  // Only process posts and projects
  if (data.layout !== 'post' && data.layout !== 'project') {
    return data;
  }

  const originalContent = data.content;
  const alerts = [];
  let content = originalContent;

  // Identify alert blocks by finding their opening tag and walking to the closing tag.
  const alertStartRegex = /<(a|div)([^>]*class="[^"]*alert-message[^"]*"[^>]*)>/gi;

  let match;
  const foundAlerts = [];

  while ((match = alertStartRegex.exec(originalContent)) !== null) {
    const closingIndex = findClosingTagEndIndex(
      originalContent,
      match.index + match[0].length,
      match[1]
    );

    if (closingIndex === -1) {
      continue;
    }

    foundAlerts.push({
      fullMatch: originalContent.slice(match.index, closingIndex),
      index: match.index
    });
    alertStartRegex.lastIndex = closingIndex;
  }
  
  // If no alerts found, return unchanged
  if (foundAlerts.length === 0) {
    return data;
  }
  
  // Sort by index in reverse order to remove from end to beginning
  foundAlerts.sort((a, b) => b.index - a.index);
  
  // Extract alerts and remove from content
  foundAlerts.forEach(alert => {
    alerts.unshift(alert.fullMatch); // Add to beginning since we're going in reverse
    content = content.substring(0, alert.index) + content.substring(alert.index + alert.fullMatch.length);
  });
  
  // Clean up any empty <hr> tags that might have been left behind
  content = content.replace(/<hr\s*\/?>\s*$/gi, '').trim();
  
  // Create alerts container at the top
  const alertsHtml = `<div class="post-alerts no-external-indicators">${alerts.join('')}</div>`;
  
  // Add alerts to the beginning of content
  data.content = alertsHtml + content;
  
  return data;
});
