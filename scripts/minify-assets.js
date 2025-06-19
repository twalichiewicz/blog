/**
 * Safe asset minification script
 * Runs after Hexo generates files to minify HTML, CSS, and JS
 * without using vulnerable dependencies
 */

const fs = require('fs').promises;
const path = require('path');
const { minify: minifyHTML } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');
const glob = require('glob').glob;

// Configuration
const config = {
  html: {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: false, // Keep for safety
    removeEmptyAttributes: true,
    removeRedundantAttributes: true
  },
  css: {
    level: 2,
    compatibility: 'ie11'
  },
  js: {
    compress: {
      drop_console: false, // Keep console logs for debugging
      passes: 2
    },
    mangle: true,
    format: {
      comments: false
    }
  }
};

// Minify HTML files
async function minifyHTMLFiles() {
  try {
    const files = await glob('public/**/*.html');
    console.log(`Found ${files.length} HTML files to minify`);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const minified = await minifyHTML(content, config.html);
      await fs.writeFile(file, minified);
    }
    
    console.log('✓ HTML minification complete');
  } catch (error) {
    console.error('Error minifying HTML:', error);
  }
}

// Minify CSS files
async function minifyCSSFiles() {
  try {
    const files = await glob('public/**/*.css', {
      ignore: ['**/*.min.css']
    });
    console.log(`Found ${files.length} CSS files to minify`);
    
    const cleancss = new CleanCSS(config.css);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const result = cleancss.minify(content);
      
      if (result.errors.length === 0) {
        await fs.writeFile(file, result.styles);
      } else {
        console.error(`Error minifying ${file}:`, result.errors);
      }
    }
    
    console.log('✓ CSS minification complete');
  } catch (error) {
    console.error('Error minifying CSS:', error);
  }
}

// Minify JS files
async function minifyJSFiles() {
  try {
    const files = await glob('public/**/*.js', {
      ignore: ['**/*.min.js']
    });
    console.log(`Found ${files.length} JS files to minify`);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const result = await minifyJS(content, config.js);
      
      if (result.code) {
        await fs.writeFile(file, result.code);
      } else {
        console.error(`Error minifying ${file}`);
      }
    }
    
    console.log('✓ JavaScript minification complete');
  } catch (error) {
    console.error('Error minifying JS:', error);
  }
}

// Main function
async function minifyAssets() {
  console.log('Starting asset minification...');
  
  await minifyHTMLFiles();
  await minifyCSSFiles();
  await minifyJSFiles();
  
  console.log('✅ Asset minification complete!');
}

// Export for use in build scripts
module.exports = { minifyAssets };

// Run if called directly
if (require.main === module) {
  minifyAssets().catch(console.error);
}