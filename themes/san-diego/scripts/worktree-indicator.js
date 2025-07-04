/**
 * Worktree Indicator - Shows current git worktree/branch in development
 * 
 * This script injects a visual indicator showing which worktree/branch
 * is being served during development, making it easy to identify which
 * version you're looking at when running multiple servers.
 */

hexo.extend.filter.register('after_render:html', function(str, data) {
  // Only inject in development mode
  if (process.env.NODE_ENV === 'production') {
    return str;
  }

  // Get worktree info from environment variable (set by worktree server manager)
  const worktreeBranch = process.env.HEXO_WORKTREE_BRANCH || '';
  const worktreePort = process.env.HEXO_WORKTREE_PORT || '';
  
  // If no worktree info, check if we're running in standard dev mode
  if (!worktreeBranch) {
    // Try to get current branch using git
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      
      if (branch) {
        // Inject for standard dev mode too
        const indicatorCSS = `
<style>
  /* Worktree/Branch Indicator */
  body::before {
    content: "📍 ${branch} • localhost:4000";
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
    font-size: 12px;
    font-weight: 500;
    z-index: 99999;
    pointer-events: none;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  
  body:hover::before {
    opacity: 1;
  }
  
  /* Different colors for different branch types */
  ${branch === 'main' ? `
  body::before {
    background: rgba(0, 122, 255, 0.9);
  }` : ''}
  
  ${branch.startsWith('feature/') ? `
  body::before {
    background: rgba(52, 199, 89, 0.9);
  }` : ''}
  
  ${branch.startsWith('fix/') ? `
  body::before {
    background: rgba(255, 149, 0, 0.9);
  }` : ''}
  
  ${branch.startsWith('hotfix/') ? `
  body::before {
    background: rgba(255, 59, 48, 0.9);
  }` : ''}
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    body::before {
      background: rgba(30, 30, 30, 0.95);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    ${branch === 'main' ? `
    body::before {
      background: rgba(0, 122, 255, 0.3);
      border-color: rgba(0, 122, 255, 0.5);
    }` : ''}
    
    ${branch.startsWith('feature/') ? `
    body::before {
      background: rgba(52, 199, 89, 0.3);
      border-color: rgba(52, 199, 89, 0.5);
    }` : ''}
    
    ${branch.startsWith('fix/') ? `
    body::before {
      background: rgba(255, 149, 0, 0.3);
      border-color: rgba(255, 149, 0, 0.5);
    }` : ''}
    
    ${branch.startsWith('hotfix/') ? `
    body::before {
      background: rgba(255, 59, 48, 0.3);
      border-color: rgba(255, 59, 48, 0.5);
    }` : ''}
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    body::before {
      bottom: 10px;
      right: 10px;
      padding: 6px 12px;
      font-size: 11px;
    }
  }
</style>
`;
        
        // Inject before closing head tag
        return str.replace('</head>', indicatorCSS + '</head>');
      }
    } catch (e) {
      // If git command fails, just return original
    }
    
    return str;
  }
  
  // Create indicator CSS with worktree info
  const indicatorCSS = `
<style>
  /* Worktree/Branch Indicator */
  body::before {
    content: "🌳 ${worktreeBranch} • Port ${worktreePort}";
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
    font-size: 12px;
    font-weight: 500;
    z-index: 99999;
    pointer-events: none;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  
  body:hover::before {
    opacity: 1;
  }
  
  /* Different colors for different branch types */
  ${worktreeBranch === 'main' ? `
  body::before {
    background: rgba(0, 122, 255, 0.9);
  }` : ''}
  
  ${worktreeBranch.startsWith('feature/') ? `
  body::before {
    background: rgba(52, 199, 89, 0.9);
  }` : ''}
  
  ${worktreeBranch.startsWith('fix/') ? `
  body::before {
    background: rgba(255, 149, 0, 0.9);
  }` : ''}
  
  ${worktreeBranch.startsWith('hotfix/') ? `
  body::before {
    background: rgba(255, 59, 48, 0.9);
  }` : ''}
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    body::before {
      background: rgba(30, 30, 30, 0.95);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    ${worktreeBranch === 'main' ? `
    body::before {
      background: rgba(0, 122, 255, 0.3);
      border-color: rgba(0, 122, 255, 0.5);
    }` : ''}
    
    ${worktreeBranch.startsWith('feature/') ? `
    body::before {
      background: rgba(52, 199, 89, 0.3);
      border-color: rgba(52, 199, 89, 0.5);
    }` : ''}
    
    ${worktreeBranch.startsWith('fix/') ? `
    body::before {
      background: rgba(255, 149, 0, 0.3);
      border-color: rgba(255, 149, 0, 0.5);
    }` : ''}
    
    ${worktreeBranch.startsWith('hotfix/') ? `
    body::before {
      background: rgba(255, 59, 48, 0.3);
      border-color: rgba(255, 59, 48, 0.5);
    }` : ''}
  }
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    body::before {
      bottom: 10px;
      right: 10px;
      padding: 6px 12px;
      font-size: 11px;
    }
  }
</style>
`;
  
  // Inject before closing head tag
  return str.replace('</head>', indicatorCSS + '</head>');
});