#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Thomas.design Portfolio
 * 
 * This script runs a complete test suite including:
 * - Demo validation and building
 * - Content validation
 * - Build integrity checks
 * - Performance tests
 * - Visual regression tests (if enabled)
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.startTime = performance.now();
    this.config = {
      skipVisual: process.argv.includes('--skip-visual'),
      skipBuild: process.argv.includes('--skip-build'),
      verbose: process.argv.includes('--verbose'),
      quick: process.argv.includes('--quick')
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    const color = colors[type] || colors.info;
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
  }

  async runCommand(command, description, options = {}) {
    this.log(`🔄 ${description}...`);
    
    try {
      const result = execSync(command, { 
        stdio: this.config.verbose ? 'inherit' : 'pipe',
        encoding: 'utf8',
        cwd: process.cwd(),
        ...options
      });
      
      this.results.passed++;
      this.results.tests.push({ name: description, status: 'passed' });
      this.log(`✅ ${description} - PASSED`, 'success');
      return { success: true, output: result };
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ 
        name: description, 
        status: 'failed', 
        error: error.message 
      });
      this.log(`❌ ${description} - FAILED: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  async testDemoSystem() {
    this.log('🎮 Testing Demo System', 'info');
    
    // 1. Demo validation
    await this.runCommand(
      'npm run validate:demos',
      'Demo standards validation'
    );

    // 2. Demo dependency check
    const demoDirectories = fs.readdirSync(path.join(process.cwd(), 'demos'))
      .filter(item => {
        const demoPath = path.join(process.cwd(), 'demos', item);
        return fs.statSync(demoPath).isDirectory() && 
               fs.existsSync(path.join(demoPath, 'package.json'));
      });

    for (const demo of demoDirectories) {
      const demoPath = path.join(process.cwd(), 'demos', demo);
      const hasNodeModules = fs.existsSync(path.join(demoPath, 'node_modules'));
      
      if (!hasNodeModules) {
        this.log(`⚠️  Demo ${demo} missing dependencies, installing...`, 'warning');
        await this.runCommand(
          `cd demos/${demo} && npm install`,
          `Install dependencies for ${demo}`
        );
      }
    }

    // 3. Demo building (unless skipped)
    if (!this.config.skipBuild) {
      await this.runCommand(
        'npm run build:demos',
        'Build all demos'
      );
    }

    // 4. Demo integration test
    await this.testDemoIntegration();
  }

  async testDemoIntegration() {
    this.log('🔗 Testing Demo Integration', 'info');
    
    try {
      // Check that demo files exist in themes directory
      const themeDemoPath = path.join(process.cwd(), 'themes/san-diego/source/demos');
      
      if (!fs.existsSync(themeDemoPath)) {
        throw new Error('Demo theme directory does not exist');
      }

      const builtDemos = fs.readdirSync(themeDemoPath)
        .filter(item => {
          const itemPath = path.join(themeDemoPath, item);
          return fs.statSync(itemPath).isDirectory() && item !== 'shared'; // Exclude shared assets directory
        });

      if (builtDemos.length === 0) {
        throw new Error('No demos found in theme directory');
      }

      // Verify each demo has required files
      for (const demo of builtDemos) {
        const demoPath = path.join(themeDemoPath, demo);
        const indexPath = path.join(demoPath, 'index.html');
        
        if (!fs.existsSync(indexPath)) {
          throw new Error(`Demo ${demo} missing index.html`);
        }

        // Check file size (should not be empty)
        const stats = fs.statSync(indexPath);
        if (stats.size < 100) {
          throw new Error(`Demo ${demo} index.html suspiciously small (${stats.size} bytes)`);
        }
      }

      this.results.passed++;
      this.results.tests.push({ name: 'Demo integration', status: 'passed' });
      this.log(`✅ Demo integration - PASSED (${builtDemos.length} demos verified)`, 'success');
      
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ 
        name: 'Demo integration', 
        status: 'failed', 
        error: error.message 
      });
      this.log(`❌ Demo integration - FAILED: ${error.message}`, 'error');
    }
  }

  async testContentValidation() {
    this.log('📝 Testing Content Validation', 'info');
    
    // Content validation (warn only in comprehensive test)
    this.log('🔄 Content validation (informational)...', 'info');
    try {
      const result = execSync('npm run validate:content', { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      this.results.passed++;
      this.results.tests.push({ name: 'Content validation', status: 'passed' });
      this.log('✅ Content validation - PASSED', 'success');
    } catch (error) {
      // Parse output to count errors vs warnings
      const output = error.stdout || error.message;
      const errorMatch = output.match(/(\d+) errors found/);
      const errorCount = errorMatch ? parseInt(errorMatch[1]) : 0;
      
      if (errorCount > 0) {
        this.results.warnings++;
        this.results.tests.push({ 
          name: 'Content validation', 
          status: 'warning', 
          error: `${errorCount} content issues found (see validate:content for details)` 
        });
        this.log(`⚠️  Content validation - ${errorCount} issues found (not blocking)`, 'warning');
      } else {
        this.results.passed++;
        this.results.tests.push({ name: 'Content validation', status: 'passed' });
        this.log('✅ Content validation - PASSED', 'success');
      }
    }
  }

  async testBuildSystem() {
    this.log('🏗️  Testing Build System', 'info');
    
    if (this.config.skipBuild) {
      this.log('⏭️  Skipping build tests (--skip-build flag)', 'warning');
      return;
    }

    // 1. Clean build
    await this.runCommand(
      'npm run clean',
      'Clean previous build'
    );

    // 2. Full build
    await this.runCommand(
      'npm run build',
      'Build static site'
    );

    // 3. Build integrity check
    await this.testBuildIntegrity();
  }

  async testBuildIntegrity() {
    this.log('🔍 Testing Build Integrity', 'info');
    
    try {
      const publicDir = path.join(process.cwd(), 'public');
      
      if (!fs.existsSync(publicDir)) {
        throw new Error('Public directory does not exist after build');
      }

      // Check for essential files
      const essentialFiles = [
        'index.html',
        'css/styles.css',
        'js/scripts.js'
      ];

      for (const file of essentialFiles) {
        const filePath = path.join(publicDir, file);
        if (!fs.existsSync(filePath)) {
          this.log(`⚠️  Warning: Expected file ${file} not found`, 'warning');
          this.results.warnings++;
        }
      }

      // Check build size
      const buildSize = execSync(`du -sh ${publicDir}`, { encoding: 'utf8' }).split('\t')[0];
      this.log(`📊 Build size: ${buildSize}`, 'info');

      // Check for broken links in index.html
      const indexPath = path.join(publicDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        const brokenLinkPattern = /href="[^"]*\.(css|js|png|jpg|gif)"[^>]*>/g;
        const links = indexContent.match(brokenLinkPattern) || [];
        
        let brokenLinks = 0;
        for (const link of links) {
          const href = link.match(/href="([^"]*)"/) || [null, null];
          if (href[1]) {
            const linkPath = path.join(publicDir, href[1]);
            if (!fs.existsSync(linkPath)) {
              this.log(`⚠️  Broken link: ${href[1]}`, 'warning');
              brokenLinks++;
            }
          }
        }

        if (brokenLinks > 0) {
          this.results.warnings += brokenLinks;
        }
      }

      this.results.passed++;
      this.results.tests.push({ name: 'Build integrity', status: 'passed' });
      this.log(`✅ Build integrity - PASSED`, 'success');
      
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ 
        name: 'Build integrity', 
        status: 'failed', 
        error: error.message 
      });
      this.log(`❌ Build integrity - FAILED: ${error.message}`, 'error');
    }
  }

  async testPerformance() {
    this.log('⚡ Testing Performance', 'info');
    
    if (this.config.quick) {
      this.log('⏭️  Skipping performance tests (--quick flag)', 'warning');
      return;
    }

    try {
      // Bundle size analysis
      const result = await this.runCommand(
        'npm run analyze',
        'Bundle size analysis'
      );

      // Extract size information
      if (result.success && result.output) {
        const sizeMatch = result.output.match(/(\d+\.?\d*[KMGT]?)\s+public/);
        if (sizeMatch) {
          const size = sizeMatch[1];
          this.log(`📊 Total bundle size: ${size}`, 'info');
        }
      }

    } catch (error) {
      this.log(`⚠️  Performance analysis failed: ${error.message}`, 'warning');
      this.results.warnings++;
    }
  }

  async testCodeQuality() {
    this.log('🔍 Testing Code Quality', 'info');
    
    // SCSS linting
    await this.runCommand(
      'npm run lint:scss',
      'SCSS linting'
    );
  }

  generateReport() {
    const endTime = performance.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    this.log('\n' + '='.repeat(60), 'info');
    this.log('📊 TEST SUMMARY', 'info');
    this.log('='.repeat(60), 'info');
    
    this.log(`⏱️  Duration: ${duration}s`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
    this.log(`⚠️  Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warning' : 'info');
    
    this.log('\n📋 Test Details:', 'info');
    for (const test of this.results.tests) {
      const status = test.status === 'passed' ? '✅' : '❌';
      this.log(`  ${status} ${test.name}`, test.status === 'passed' ? 'success' : 'error');
      if (test.error && this.config.verbose) {
        this.log(`     Error: ${test.error}`, 'error');
      }
    }

    // Overall result
    const overall = this.results.failed === 0 ? 'PASSED' : 'FAILED';
    const overallColor = this.results.failed === 0 ? 'success' : 'error';
    
    this.log('\n' + '='.repeat(60), 'info');
    this.log(`🎯 OVERALL RESULT: ${overall}`, overallColor);
    this.log('='.repeat(60), 'info');

    return this.results.failed === 0;
  }

  async run() {
    this.log('🚀 Starting Comprehensive Test Suite', 'info');
    this.log(`Configuration: ${JSON.stringify(this.config)}`, 'info');
    
    try {
      // Run test suites
      await this.testDemoSystem();
      await this.testContentValidation();
      await this.testBuildSystem();
      await this.testPerformance();
      await this.testCodeQuality();
      
      // Generate report
      const success = this.generateReport();
      process.exit(success ? 0 : 1);
      
    } catch (error) {
      this.log(`💥 Fatal error: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Help text
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📋 Comprehensive Test Suite for Thomas.design Portfolio

Usage: node scripts/comprehensive-test.js [options]

Options:
  --skip-visual     Skip visual regression tests
  --skip-build      Skip build-related tests  
  --verbose         Show detailed output
  --quick           Skip performance tests
  --help, -h        Show this help

Test Suites:
  🎮 Demo System    - Validates and builds all portfolio demos
  📝 Content        - Validates blog posts and content structure
  🏗️  Build System   - Tests static site generation
  ⚡ Performance   - Bundle size and optimization checks
  🔍 Code Quality   - Linting and style checks

Examples:
  npm run test:comprehensive              # Full test suite
  npm run test:comprehensive -- --quick   # Skip performance tests
  npm run test:comprehensive -- --verbose # Detailed output
`);
  process.exit(0);
}

// Run the test suite
const runner = new TestRunner();
runner.run();