#!/usr/bin/env node

/**
 * Quick Test Suite for Development
 * 
 * Fast tests for development cycles:
 * - Demo validation only
 * - Build integrity check
 * - Skip heavy operations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class QuickTestRunner {
  constructor() {
    this.results = { passed: 0, failed: 0, tests: [] };
    this.startTime = performance.now();
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    const color = colors[type] || colors.info;
    console.log(`${color}${message}${colors.reset}`);
  }

  async runTest(command, description) {
    process.stdout.write(`🔄 ${description}... `);
    
    try {
      execSync(command, { stdio: 'pipe', encoding: 'utf8' });
      this.results.passed++;
      this.results.tests.push({ name: description, status: 'passed' });
      console.log('✅');
      return true;
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: description, status: 'failed', error: error.message });
      console.log('❌');
      if (process.argv.includes('--verbose')) {
        this.log(`   Error: ${error.message}`, 'error');
      }
      return false;
    }
  }

  async checkDemoDependencies() {
    this.log('📦 Checking demo dependencies...');
    
    const demoDirectories = fs.readdirSync(path.join(process.cwd(), 'demos'))
      .filter(item => {
        const demoPath = path.join(process.cwd(), 'demos', item);
        return fs.statSync(demoPath).isDirectory() && 
               fs.existsSync(path.join(demoPath, 'package.json'));
      });

    let missingDeps = 0;
    for (const demo of demoDirectories) {
      const demoPath = path.join(process.cwd(), 'demos', demo);
      const hasNodeModules = fs.existsSync(path.join(demoPath, 'node_modules'));
      
      if (!hasNodeModules) {
        this.log(`⚠️  ${demo} missing dependencies`, 'error');
        missingDeps++;
      }
    }

    if (missingDeps > 0) {
      this.log(`❌ ${missingDeps} demos missing dependencies. Run 'npm run install:demos' to fix.`, 'error');
      return false;
    } else {
      this.log('✅ All demo dependencies present');
      return true;
    }
  }

  async run() {
    this.log('⚡ Quick Test Suite Starting...\n');
    
    // Essential tests only
    await this.checkDemoDependencies();
    await this.runTest('npm run validate:demos', 'Demo validation');
    
    // Content validation (warn only - don't fail on content issues)
    this.log('📝 Checking content validation (informational)...');
    try {
      execSync('npm run validate:content', { stdio: 'pipe' });
      this.log('✅ Content validation passed');
    } catch (error) {
      this.log('⚠️  Content validation has warnings (see full test for details)');
      // Don't fail the quick test for content issues
    }
    
    // Quick build check (just Hexo, no demos)
    if (!process.argv.includes('--no-build')) {
      await this.runTest('hexo clean && hexo generate', 'Quick build test');
    }

    // Summary
    const duration = ((performance.now() - this.startTime) / 1000).toFixed(1);
    this.log(`\n📊 Quick Test Results (${duration}s):`);
    this.log(`✅ Passed: ${this.results.passed}`);
    this.log(`❌ Failed: ${this.results.failed}`);
    
    if (this.results.failed === 0) {
      this.log('🎉 All quick tests passed!', 'success');
      process.exit(0);
    } else {
      this.log('💥 Some tests failed. Run full test suite for details.', 'error');
      process.exit(1);
    }
  }
}

// Help
if (process.argv.includes('--help')) {
  console.log(`
⚡ Quick Test Suite - Fast development testing

Usage: node scripts/quick-test.js [options]

Options:
  --no-build    Skip build test
  --verbose     Show error details
  --help        Show this help

This runs essential tests quickly:
- Demo dependencies check
- Demo validation
- Content validation  
- Quick build test

For comprehensive testing, use: npm run test:comprehensive
`);
  process.exit(0);
}

const runner = new QuickTestRunner();
runner.run();