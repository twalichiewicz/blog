/* global hexo */
'use strict';

// Add 404 handling for development server
hexo.extend.filter.register('server_middleware', function(app) {
  const fs = require('fs');
  const path = require('path');
  
  // Add this as the last middleware to catch all 404s
  app.use(function(req, res, next) {
    // Check if we're already handling an error or if it's a valid file
    if (res.headersSent) {
      return next();
    }
    
    // Try to serve the 404 page
    const notFoundPath = path.join(hexo.public_dir, '404.html');
    
    fs.readFile(notFoundPath, 'utf8', function(err, data) {
      if (err) {
        // Fallback to default 404 if our custom page doesn't exist
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('Cannot GET ' + req.url);
      } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  });
});