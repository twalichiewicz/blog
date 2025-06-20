#!/usr/bin/env node

/**
 * Screenshot Automation Tool
 * Takes screenshots at different viewport sizes for visual regression testing
 */

const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:4000',
  outputDir: 'screenshots',
  viewports: {
    mobile: { width: 375, height: 812, deviceScaleFactor: 2 },
    tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
    desktop: { width: 1440, height: 900, deviceScaleFactor: 1 }
  },
  routes: [
    { path: '/', name: 'homepage' },
    { path: '/blog/', name: 'blog' },
    { path: '/projects/', name: 'projects' },
    { path: '/components/', name: 'components' }
  ],
  colorSchemes: ['light', 'dark']
};

// Ensure output directory exists
async function ensureOutputDir() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputPath = path.join(CONFIG.outputDir, timestamp);
  await fs.ensureDir(outputPath);
  return outputPath;
}

// Take screenshot function
async function takeScreenshot(page, viewport, route, colorScheme, outputPath) {
  const filename = `${route.name}-${viewport}-${colorScheme}.png`;
  const filepath = path.join(outputPath, filename);
  
  // Set viewport
  await page.setViewport(CONFIG.viewports[viewport]);
  
  // Set color scheme
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: colorScheme }
  ]);
  
  // Navigate to route
  await page.goto(`${CONFIG.baseUrl}${route.path}`, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  // Wait for any animations to complete
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({
    path: filepath,
    fullPage: true
  });
  
  return filename;
}

// Main function
async function main() {
  console.log(chalk.blue('🚀 Starting screenshot automation...'));
  
  // Check if server is running
  try {
    const response = await fetch(CONFIG.baseUrl);
    if (!response.ok) {
      throw new Error('Server not responding');
    }
  } catch (error) {
    console.error(chalk.red('❌ Error: Local server is not running at ' + CONFIG.baseUrl));
    console.log(chalk.yellow('Please run "npm run server" in another terminal'));
    process.exit(1);
  }
  
  const outputPath = await ensureOutputDir();
  console.log(chalk.green(`📁 Output directory: ${outputPath}`));
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Disable cache
  await page.setCacheEnabled(false);
  
  const totalScreenshots = Object.keys(CONFIG.viewports).length * 
                          CONFIG.routes.length * 
                          CONFIG.colorSchemes.length;
  let completed = 0;
  
  console.log(chalk.blue(`📸 Taking ${totalScreenshots} screenshots...`));
  
  // Take screenshots
  for (const route of CONFIG.routes) {
    for (const [viewportName, viewport] of Object.entries(CONFIG.viewports)) {
      for (const colorScheme of CONFIG.colorSchemes) {
        try {
          const filename = await takeScreenshot(
            page, 
            viewportName, 
            route, 
            colorScheme, 
            outputPath
          );
          completed++;
          console.log(chalk.green(
            `✓ [${completed}/${totalScreenshots}] ${filename}`
          ));
        } catch (error) {
          console.error(chalk.red(
            `✗ Failed: ${route.name}-${viewportName}-${colorScheme} - ${error.message}`
          ));
        }
      }
    }
  }
  
  await browser.close();
  
  // Create comparison HTML
  await createComparisonHTML(outputPath);
  
  console.log(chalk.green(`\n✅ Screenshots saved to: ${outputPath}`));
  console.log(chalk.blue(`🔍 View comparison at: ${outputPath}/comparison.html`));
}

// Create HTML for easy comparison
async function createComparisonHTML(outputPath) {
  const files = await fs.readdir(outputPath);
  const screenshots = files.filter(f => f.endsWith('.png'));
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Comparison</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    .controls {
      margin-bottom: 20px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .controls label {
      margin-right: 15px;
      font-weight: 500;
    }
    .controls select {
      margin-right: 20px;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .screenshot-item {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .screenshot-item h3 {
      margin: 0;
      padding: 15px;
      background: #f8f8f8;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      font-weight: 500;
    }
    .screenshot-item img {
      width: 100%;
      display: block;
    }
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <h1>Screenshot Comparison - ${new Date().toLocaleString()}</h1>
  
  <div class="controls">
    <label>Route:</label>
    <select id="routeFilter" onchange="filterScreenshots()">
      <option value="">All Routes</option>
      ${CONFIG.routes.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
    </select>
    
    <label>Viewport:</label>
    <select id="viewportFilter" onchange="filterScreenshots()">
      <option value="">All Viewports</option>
      <option value="mobile">Mobile (375px)</option>
      <option value="tablet">Tablet (768px)</option>
      <option value="desktop">Desktop (1440px)</option>
    </select>
    
    <label>Color Scheme:</label>
    <select id="colorFilter" onchange="filterScreenshots()">
      <option value="">All Schemes</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>
  
  <div class="screenshot-grid">
    ${screenshots.map(filename => {
      const [route, viewport, colorScheme] = filename.replace('.png', '').split('-');
      return `
        <div class="screenshot-item" data-route="${route}" data-viewport="${viewport}" data-color="${colorScheme}">
          <h3>${route} - ${viewport} - ${colorScheme}</h3>
          <img src="${filename}" alt="${filename}" loading="lazy">
        </div>
      `;
    }).join('')}
  </div>
  
  <script>
    function filterScreenshots() {
      const route = document.getElementById('routeFilter').value;
      const viewport = document.getElementById('viewportFilter').value;
      const color = document.getElementById('colorFilter').value;
      
      document.querySelectorAll('.screenshot-item').forEach(item => {
        const show = 
          (!route || item.dataset.route === route) &&
          (!viewport || item.dataset.viewport === viewport) &&
          (!color || item.dataset.color === color);
        
        item.classList.toggle('hidden', !show);
      });
    }
  </script>
</body>
</html>
  `;
  
  await fs.writeFile(path.join(outputPath, 'comparison.html'), html);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--viewport' && args[i + 1]) {
      options.viewport = args[i + 1];
      i++;
    }
  }
  
  return options;
}

// Modified main for viewport-specific screenshots
async function mainWithArgs() {
  const options = parseArgs();
  
  if (options.viewport) {
    // Filter to specific viewport
    const viewport = CONFIG.viewports[options.viewport];
    if (!viewport) {
      console.error(chalk.red(`❌ Unknown viewport: ${options.viewport}`));
      console.log(chalk.yellow('Available viewports: mobile, tablet, desktop'));
      process.exit(1);
    }
    
    // Override config to only use specified viewport
    CONFIG.viewports = { [options.viewport]: viewport };
  }
  
  await main();
}

// Run if called directly
if (require.main === module) {
  mainWithArgs();
}

module.exports = { takeScreenshot, CONFIG };