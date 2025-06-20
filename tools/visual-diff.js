#!/usr/bin/env node

/**
 * Visual Diff Tool
 * Compares screenshots between two sets for visual regression testing
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

// Configuration
const CONFIG = {
  threshold: 0.1, // Difference threshold (0-1)
  outputDir: 'screenshots/diff',
  diffColor: [255, 0, 0], // Red for differences
  alpha: 0.5 // Transparency for diff overlay
};

// Compare two images
async function compareImages(img1Path, img2Path, outputPath) {
  return new Promise((resolve, reject) => {
    const img1 = fs.createReadStream(img1Path).pipe(new PNG());
    const img2 = fs.createReadStream(img2Path).pipe(new PNG());
    
    let filesRead = 0;
    let img1Data, img2Data;
    
    img1.on('parsed', function() {
      img1Data = this;
      filesRead++;
      if (filesRead === 2) compare();
    });
    
    img2.on('parsed', function() {
      img2Data = this;
      filesRead++;
      if (filesRead === 2) compare();
    });
    
    function compare() {
      const { width, height } = img1Data;
      
      // Check dimensions match
      if (width !== img2Data.width || height !== img2Data.height) {
        reject(new Error(`Image dimensions don't match: ${width}x${height} vs ${img2Data.width}x${img2Data.height}`));
        return;
      }
      
      // Create diff image
      const diff = new PNG({ width, height });
      
      // Compare pixels
      const numDiffPixels = pixelmatch(
        img1Data.data,
        img2Data.data,
        diff.data,
        width,
        height,
        {
          threshold: CONFIG.threshold,
          alpha: CONFIG.alpha,
          diffColor: CONFIG.diffColor
        }
      );
      
      // Calculate difference percentage
      const totalPixels = width * height;
      const diffPercentage = (numDiffPixels / totalPixels) * 100;
      
      // Save diff image if there are differences
      if (numDiffPixels > 0) {
        diff.pack().pipe(fs.createWriteStream(outputPath))
          .on('finish', () => {
            resolve({
              different: true,
              pixels: numDiffPixels,
              percentage: diffPercentage,
              dimensions: { width, height }
            });
          })
          .on('error', reject);
      } else {
        resolve({
          different: false,
          pixels: 0,
          percentage: 0,
          dimensions: { width, height }
        });
      }
    }
  });
}

// Compare two screenshot directories
async function compareDirectories(dir1, dir2) {
  console.log(chalk.blue('🔍 Visual Regression Test'));
  console.log(chalk.gray(`Comparing: ${dir1} vs ${dir2}\n`));
  
  // Get file lists
  const files1 = await fs.readdir(dir1);
  const files2 = await fs.readdir(dir2);
  
  const screenshots1 = files1.filter(f => f.endsWith('.png'));
  const screenshots2 = files2.filter(f => f.endsWith('.png'));
  
  // Find common files
  const commonFiles = screenshots1.filter(f => screenshots2.includes(f));
  const onlyIn1 = screenshots1.filter(f => !screenshots2.includes(f));
  const onlyIn2 = screenshots2.filter(f => !screenshots1.includes(f));
  
  if (onlyIn1.length > 0) {
    console.log(chalk.yellow('⚠️  Only in first set:'));
    onlyIn1.forEach(f => console.log(chalk.yellow(`   - ${f}`)));
  }
  
  if (onlyIn2.length > 0) {
    console.log(chalk.yellow('⚠️  Only in second set:'));
    onlyIn2.forEach(f => console.log(chalk.yellow(`   - ${f}`)));
  }
  
  if (commonFiles.length === 0) {
    console.log(chalk.red('❌ No common files to compare!'));
    return;
  }
  
  // Create output directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(CONFIG.outputDir, timestamp);
  await fs.ensureDir(outputDir);
  
  console.log(chalk.blue(`\n📊 Comparing ${commonFiles.length} screenshots...\n`));
  
  const results = [];
  let changedCount = 0;
  
  // Compare each file
  for (const filename of commonFiles) {
    const img1Path = path.join(dir1, filename);
    const img2Path = path.join(dir2, filename);
    const diffPath = path.join(outputDir, `diff-${filename}`);
    
    try {
      const result = await compareImages(img1Path, img2Path, diffPath);
      results.push({ filename, ...result });
      
      if (result.different) {
        changedCount++;
        console.log(chalk.red(`✗ ${filename} - ${result.percentage.toFixed(2)}% different (${result.pixels} pixels)`));
      } else {
        console.log(chalk.green(`✓ ${filename} - No changes`));
      }
    } catch (error) {
      console.log(chalk.red(`✗ ${filename} - Error: ${error.message}`));
      results.push({ filename, error: error.message });
    }
  }
  
  // Create comparison report
  await createDiffReport(outputDir, dir1, dir2, results);
  
  // Summary
  console.log(chalk.blue('\n📈 Summary:'));
  console.log(`   Total compared: ${commonFiles.length}`);
  console.log(`   Changed: ${changedCount}`);
  console.log(`   Unchanged: ${commonFiles.length - changedCount}`);
  
  if (changedCount > 0) {
    console.log(chalk.yellow(`\n🔍 View detailed report: ${outputDir}/report.html`));
  }
  
  return {
    changed: changedCount > 0,
    changedCount,
    totalCount: commonFiles.length,
    reportPath: path.join(outputDir, 'report.html')
  };
}

// Create HTML diff report
async function createDiffReport(outputDir, dir1, dir2, results) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Regression Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    .info {
      color: #666;
      margin-bottom: 30px;
    }
    .summary {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    .summary-card h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }
    .summary-card .number {
      font-size: 32px;
      font-weight: bold;
    }
    .summary-card.changed .number { color: #e74c3c; }
    .summary-card.unchanged .number { color: #27ae60; }
    .summary-card.total .number { color: #3498db; }
    
    .filter-controls {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .filter-controls label {
      margin-right: 10px;
      font-weight: 500;
    }
    
    .comparison {
      background: white;
      border-radius: 8px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .comparison.no-change {
      display: none;
    }
    .comparison.has-change .header {
      background: #fee;
      border-left: 4px solid #e74c3c;
    }
    .comparison.no-change .header {
      background: #efe;
      border-left: 4px solid #27ae60;
    }
    .header {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h3 {
      margin: 0;
      font-size: 16px;
    }
    .diff-badge {
      background: #e74c3c;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .images {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    .image-container {
      position: relative;
      border-right: 1px solid #eee;
    }
    .image-container:last-child {
      border-right: none;
    }
    .image-container h4 {
      margin: 0;
      padding: 10px 15px;
      background: #f8f8f8;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
    .image-container img {
      width: 100%;
      display: block;
    }
    .show-all #show-unchanged:checked ~ .comparison.no-change {
      display: block;
    }
  </style>
</head>
<body class="show-all">
  <h1>Visual Regression Report</h1>
  <div class="info">
    <strong>Baseline:</strong> ${path.basename(dir1)}<br>
    <strong>Current:</strong> ${path.basename(dir2)}<br>
    <strong>Generated:</strong> ${new Date().toLocaleString()}
  </div>
  
  <div class="summary">
    <div class="summary-card total">
      <h3>Total Compared</h3>
      <div class="number">${results.length}</div>
    </div>
    <div class="summary-card changed">
      <h3>Changed</h3>
      <div class="number">${results.filter(r => r.different).length}</div>
    </div>
    <div class="summary-card unchanged">
      <h3>Unchanged</h3>
      <div class="number">${results.filter(r => !r.different && !r.error).length}</div>
    </div>
  </div>
  
  <div class="filter-controls">
    <label>
      <input type="checkbox" id="show-unchanged" onchange="document.body.classList.toggle('show-all')">
      Show unchanged screenshots
    </label>
  </div>
  
  ${results.map(result => `
    <div class="comparison ${result.different ? 'has-change' : 'no-change'}">
      <div class="header">
        <h3>${result.filename}</h3>
        ${result.different ? `
          <span class="diff-badge">${result.percentage.toFixed(2)}% different</span>
        ` : ''}
      </div>
      ${result.different ? `
        <div class="images">
          <div class="image-container">
            <h4>Before</h4>
            <img src="${path.join('..', '..', '..', dir1, result.filename)}" alt="Before">
          </div>
          <div class="image-container">
            <h4>After</h4>
            <img src="${path.join('..', '..', '..', dir2, result.filename)}" alt="After">
          </div>
          <div class="image-container">
            <h4>Difference</h4>
            <img src="diff-${result.filename}" alt="Difference">
          </div>
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;
  
  await fs.writeFile(path.join(outputDir, 'report.html'), html);
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log(chalk.yellow('Usage: node visual-diff.js <baseline-dir> <current-dir>'));
    console.log(chalk.gray('Example: node visual-diff.js screenshots/2024-01-01 screenshots/2024-01-02'));
    process.exit(1);
  }
  
  const [dir1, dir2] = args;
  
  // Check directories exist
  if (!await fs.pathExists(dir1)) {
    console.error(chalk.red(`❌ Directory not found: ${dir1}`));
    process.exit(1);
  }
  
  if (!await fs.pathExists(dir2)) {
    console.error(chalk.red(`❌ Directory not found: ${dir2}`));
    process.exit(1);
  }
  
  await compareDirectories(dir1, dir2);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { compareImages, compareDirectories };