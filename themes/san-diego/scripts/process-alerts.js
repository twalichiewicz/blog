/* global hexo */
'use strict';

// Process alerts to move them to the top of posts
hexo.extend.filter.register('after_post_render', function(data) {
  // Only process posts and projects
  if (data.layout !== 'post' && data.layout !== 'project') {
    return data;
  }

  const alerts = [];
  let content = data.content;
  
  // First, let's identify all alert blocks including those that span multiple lines
  // This regex looks for the complete alert structure from opening to closing tag
  const alertBlockRegex = /<(a|div)([^>]*class="[^"]*alert-message[^"]*"[^>]*)>((?:[^<]|<(?!\/\1>))*?(?:<[^>]+>(?:[^<]|<(?!\/[^>]+>))*?<\/[^>]+>)*?)*?<\/\1>/gi;
  
  let match;
  const foundAlerts = [];
  
  // Find all matches first
  while ((match = alertBlockRegex.exec(content)) !== null) {
    foundAlerts.push({
      fullMatch: match[0],
      index: match.index
    });
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
  const alertsHtml = `<div class="post-alerts">${alerts.join('')}</div>`;
  
  // Add alerts to the beginning of content
  data.content = alertsHtml + content;
  
  return data;
});