/* global hexo */
'use strict';

const fs = require('fs');
const path = require('path');

// Copy _headers file to public directory after generation
hexo.extend.filter.register('after_generate', function() {
  const sourcePath = path.join(hexo.source_dir, '_headers');
  const destPath = path.join(hexo.public_dir, '_headers');
  
  if (fs.existsSync(sourcePath)) {
    try {
      // Ensure the public directory exists
      if (!fs.existsSync(hexo.public_dir)) {
        fs.mkdirSync(hexo.public_dir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, destPath);
      hexo.log.info('Copied _headers file to public directory');
    } catch (err) {
      hexo.log.error('Failed to copy _headers file:', err);
    }
  }
});