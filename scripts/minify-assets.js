/**
 * Safe asset minification script
 * Runs after Hexo generates files to minify HTML, CSS, and JS
 * without using vulnerable dependencies
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
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
    level: {
      1: {
        all: true,
        normalizeUrls: false
      },
      2: {
        restructureRules: false, // Prevent breaking media query rules
        mergeSemantically: false, // Prevent semantic merging that can lose colors
        overrideProperties: false, // Don't override properties
        removeUnusedAtRules: false // Keep all at-rules
      }
    },
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

async function revStylesheet() {
  try {
    const cssPath = path.join('public', 'styles', 'styles.css');
    const cssContent = await fs.readFile(cssPath);
    const hash = crypto.createHash('md5').update(cssContent).digest('hex').slice(0, 8);
    const hashedName = `styles.${hash}.css`;
    const hashedPath = path.join('public', 'styles', hashedName);

    await fs.writeFile(hashedPath, cssContent);

    const htmlFiles = await glob('public/**/*.html');
    const cssPattern = /styles\/styles\.css(?:\?v=[^"']+)?/g;
    for (const file of htmlFiles) {
      const content = await fs.readFile(file, 'utf8');
      if (!cssPattern.test(content)) continue;
      const updated = content.replace(cssPattern, `styles/${hashedName}`);
      await fs.writeFile(file, updated);
    }

    console.log(`✓ Stylesheet revisioned as ${hashedName}`);
  } catch (error) {
    console.error('Error revisioning stylesheet:', error);
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
  await revStylesheet();
  await minifyJSFiles();
  
  console.log('✅ Asset minification complete!');
}

// Export for use in build scripts
module.exports = { minifyAssets, config };

// Run if called directly
if (require.main === module) {
  minifyAssets().catch(console.error);
}
