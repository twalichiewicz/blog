/**
 * Hexo generator for creating redirect pages that preselect tabs on the homepage
 * /blog and /words -> Homepage with Words tab
 * /works, /portfolio, /projects -> Homepage with Works tab
 */

hexo.extend.generator.register('tab_redirects', function(locals) {
  const routes = [];

  // Helper function to create redirect HTML
  function createRedirectPage(tabType) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=/?tab=${tabType}">
  <script>
    // Immediate redirect with tab parameter
    window.location.href = '/?tab=${tabType}';
  </script>
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to homepage...</p>
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

  return routes;
});