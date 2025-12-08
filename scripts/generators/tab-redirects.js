/**
 * Hexo generator for creating redirect pages that preselect tabs on the homepage
 * /blog and /words -> Homepage with Words tab
 * /works, /portfolio, /projects -> Homepage with Works tab
 */

hexo.extend.generator.register('tab_redirects', function(locals) {
  const routes = [];

  // Helper function to create redirect HTML
  function createRedirectPage(tabType) {
    const sectionName = tabType === 'portfolio' ? 'works' : tabType === 'wares' ? 'wares' : 'words';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=/?tab=${tabType}">
  <link rel="canonical" href="/?tab=${tabType}">
  <title>Redirecting to ${sectionName}... | Thomas Walichiewicz</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, hsl(35deg 15% 94%) 0%, hsl(35deg 10% 98%) 100%);
      text-align: center;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background: linear-gradient(135deg, hsl(28deg 10% 14%) 0%, hsl(28deg 8% 10%) 100%);
        color: #fff;
      }
    }
    
    .redirect-container {
      max-width: 500px;
      padding: 2rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    
    @media (prefers-color-scheme: dark) {
      .spinner {
        border-color: #333;
        border-top-color: #fff;
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    @media (prefers-color-scheme: dark) {
      p {
        color: #ccc;
      }
    }
    
    .redirect-link {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    
    .redirect-link:hover {
      text-decoration: underline;
    }
    
    @media (prefers-color-scheme: dark) {
      .redirect-link {
        color: #66b3ff;
      }
    }
  </style>
  <script>
    // Immediate redirect as fallback
    window.location.href = '/?tab=${tabType}';
  </script>
</head>
<body>
  <div class="redirect-container">
    <div class="spinner"></div>
    <h1>Redirecting...</h1>
    <p>You're being redirected to the ${sectionName} section.</p>
    <p>If you're not redirected automatically, <a href="/?tab=${tabType}" class="redirect-link">click here</a>.</p>
  </div>
</body>
</html>`;
  }

  // Generate redirects for Words tab
  ['blog', 'words'].forEach(path => {
    routes.push({
      path: path + '/index.html',
      data: createRedirectPage('blog')
    });
  });

  // Generate redirects for Works tab
  ['works', 'portfolio', 'projects'].forEach(path => {
    routes.push({
      path: path + '/index.html',
      data: createRedirectPage('portfolio')
    });
  });

  // Generate redirects for Wares tab
  ['wares'].forEach(path => {
    routes.push({
      path: path + '/index.html',
      data: createRedirectPage('wares')
    });
  });

  return routes;
});
