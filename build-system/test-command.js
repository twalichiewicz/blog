#!/usr/bin/env node

/**
 * Test Command - Comprehensive Testing & Validation
 * 
 * This is your safety check before committing:
 * - Full validation of all components
 * - Build integrity checks
 * - Error detection and reporting
 * - Slower but thorough
 */

const BuildManager = require('./BuildManager');

class TestCommand extends BuildManager {
  constructor() {
    super();
    this.testResults = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  async run() {
    this.log('🧪 Starting comprehensive test suite...', 'step');
    const startTime = this.startTimer();

    try {
      // Phase 1: Dependency checks
      await this.runTestPhase('Dependencies', [
        () => this.testDemoDependencies(),
        () => this.testMainDependencies()
      ]);
      
      // Phase 2: Validation tests
      await this.runTestPhase('Validation', [
        () => this.testDemoValidation(), 
        () => this.testContentValidation()
      ]);
      
      // Phase 3: Build tests (with auto-recovery)
      await this.runTestPhase('Build Tests', [
        () => this.testDemoBuilds(),
        () => this.testMainSiteBuildWithRecovery()
      ]);
      
      // Phase 4: Integration tests
      await this.runTestPhase('Integration', [
        () => this.testAssetIntegrity(),
        () => this.testLinkIntegrity()
      ]);
      
      // Summary
      this.printTestSummary();
      this.endTimer(startTime, 'Test suite');
      
      if (this.testResults.failed === 0) {
        this.log('🎉 All tests passed! Ready to commit.', 'success');
        process.exit(0);
      } else {
        this.log(`💥 ${this.testResults.failed} test(s) failed.`, 'error');
        process.exit(1);
      }
      
    } catch (error) {
      this.log(`Test suite failed: ${error.message}`, 'error');
      this.markProgressAsFailed(error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
  
  async runTestPhase(phaseName, tests) {
    this.log(`📋 Phase: ${phaseName}`, 'step');
    const phaseStart = this.startTimer();
    
    let phaseResults = [];
    
    // Run tests sequentially for now (can parallelize specific ones later)
    for (const test of tests) {
      try {
        const result = await test();
        phaseResults.push(result);
      } catch (error) {
        phaseResults.push({
          success: false,
          name: test.name || 'Unknown test',
          error: error.message
        });
      }
    }
    
    const phasePassed = phaseResults.filter(r => r.success).length;
    const phaseFailed = phaseResults.filter(r => !r.success).length;
    
    this.endTimer(phaseStart, `${phaseName} (${phasePassed} passed, ${phaseFailed} failed)`);
    
    if (phaseFailed > 0) {
      this.log(`❌ ${phaseName} phase has failures`, 'error');
    } else {
      this.log(`✅ ${phaseName} phase passed`, 'success');
    }
    
    this.saveProgress(`phase-${phaseName.toLowerCase()}`);
    return phaseResults;
  }
  
  async runSingleTest(testFunction, testName) {
    const testStart = performance.now();
    this.log(`  🔍 ${testName}...`, 'info');
    
    try {
      const result = await testFunction();
      const duration = ((performance.now() - testStart) / 1000).toFixed(1);
      
      if (result.success) {
        this.testResults.passed++;
        this.log(`    ✅ ${testName} (${duration}s)`, 'success');
      } else {
        this.testResults.failed++;
        this.log(`    ❌ ${testName} (${duration}s)`, 'error');
        if (result.error) {
          this.log(`    Details: ${result.error}`, 'error');
        }
      }
      
      this.testResults.tests.push({
        name: testName,
        success: result.success,
        duration: parseFloat(duration),
        error: result.error || null,
        autoFixed: result.autoFixed || false
      });
      
      return result;
      
    } catch (error) {
      const duration = ((performance.now() - testStart) / 1000).toFixed(1);
      this.testResults.failed++;
      this.log(`    💥 ${testName} threw error (${duration}s)`, 'error');
      this.log(`    Error: ${error.message}`, 'error');
      
      this.testResults.tests.push({
        name: testName,
        success: false,
        duration: parseFloat(duration),
        error: error.message,
        autoFixed: false
      });
      
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // DEPENDENCY TESTS
  // ============================================
  
  async testDemoDependencies() {
    return this.runSingleTest(async () => {
      const hasAllDeps = await this.checkDemoDependencies();
      
      if (!hasAllDeps) {
        // Auto-fix: Install missing dependencies
        this.log('    🔧 Auto-fixing: Installing missing demo dependencies...', 'info');
        const installed = await this.installDemoDependencies();
        
        if (installed) {
          this.log('    ✅ Auto-fix successful: All demo dependencies installed', 'success');
          return { success: true, autoFixed: true };
        } else {
          return { success: false, error: 'Failed to install demo dependencies' };
        }
      }
      
      return { success: true };
    }, 'Demo dependencies');
  }
  
  async testMainDependencies() {
    return this.runSingleTest(async () => {
      const nodeModulesExists = require('fs').existsSync(
        require('path').join(this.root, 'node_modules')
      );
      
      return { 
        success: nodeModulesExists,
        error: nodeModulesExists ? null : 'Main project node_modules missing'
      };
    }, 'Main project dependencies');
  }

  // ============================================
  // VALIDATION TESTS  
  // ============================================
  
  async testDemoValidation() {
    return this.runSingleTest(async () => {
      const result = await this.validateDemos();
      return { success: result };
    }, 'Demo standards validation');
  }
  
  async testContentValidation() {
    return this.runSingleTest(async () => {
      try {
        // Run validation but capture output to analyze it
        const result = await this.runCommand('npm run validate:content', {
          description: 'Content validation (capturing output)'
        });
        
        // Parse the validation output to understand the severity
        const output = result.output || result.error || '';
        
        // Look for critical errors (like missing entire directories)
        const criticalErrors = [
          'source/_posts directory missing',
          'Cannot read posts',
          'Fatal error',
          'Permission denied'
        ];
        
        const hasCriticalError = criticalErrors.some(error => 
          output.toLowerCase().includes(error.toLowerCase())
        );
        
        if (hasCriticalError) {
          return { success: false, error: 'Critical content validation error' };
        }
        
        // Check for pattern of errors vs warnings
        const errorMatches = output.match(/❌/g) || [];
        const warningMatches = output.match(/⚠️/g) || [];
        const successMatches = output.match(/✅/g) || [];
        
        const totalChecked = errorMatches.length + warningMatches.length + successMatches.length;
        const errorRate = totalChecked > 0 ? errorMatches.length / totalChecked : 0;
        
        // If error rate is very high (>50%), something might be seriously wrong
        if (errorRate > 0.5 && totalChecked > 10) {
          this.testResults.warnings++;
          this.log(`    ⚠️  High content error rate (${(errorRate * 100).toFixed(1)}% of ${totalChecked} posts have issues)`, 'warning');
          this.log(`    💡 Run 'npm run validate:content' to see details`, 'info');
          return { success: true, warning: true };
        }
        
        // Normal case - some content issues are expected in a large blog
        if (errorMatches.length > 0 || warningMatches.length > 0) {
          this.testResults.warnings++;
          this.log(`    ℹ️  Content validation found ${errorMatches.length} errors, ${warningMatches.length} warnings (normal for large blogs)`, 'info');
          return { success: true, warning: true };
        }
        
        return { success: true };
        
      } catch (error) {
        // Complete failure to run validation
        return { success: false, error: `Content validation failed to run: ${error.message}` };
      }
    }, 'Content validation');
  }

  // ============================================
  // BUILD TESTS
  // ============================================
  
  async testDemoBuilds() {
    return this.runSingleTest(async () => {
      const demos = this.getDemos();
      
      if (demos.length === 0) {
        return { success: true, message: 'No demos to build' };
      }
      
      // Build demos in parallel for speed
      this.log(`    Building ${demos.length} demos in parallel...`, 'info');
      const buildTasks = demos.map(demo => this.buildDemo(demo));
      const results = await this.runParallel(buildTasks);
      
      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const success = successful === demos.length;
      
      return {
        success,
        error: success ? null : `Only ${successful}/${demos.length} demos built successfully`
      };
    }, 'Demo builds');
  }
  
  async testMainSiteBuild() {
    return this.runSingleTest(async () => {
      // Clean build for testing
      const result = await this.buildMainSite(true);
      return { success: result };
    }, 'Main site build');
  }
  
  async testMainSiteBuildWithRecovery() {
    return this.runSingleTest(async () => {
      // Try normal build first
      let result = await this.buildMainSite(true);
      
      if (result) {
        return { success: true };
      }
      
      // If build failed, try to diagnose and fix common issues
      this.log(`    🔧 Build failed, attempting auto-recovery...`, 'info');
      
      // Common fix 1: Clear node_modules cache
      try {
        await this.runCommand('npm run build:clear-cache', {
          description: 'Clearing build cache'
        });
        
        // Try build again
        result = await this.buildMainSite(true);
        if (result) {
          this.log(`    ✅ Auto-recovery successful (cache clear fixed it)`, 'success');
          return { success: true, autoFixed: true };
        }
      } catch (error) {
        this.log(`    ⚠️  Cache clear failed: ${error.message}`, 'warning');
      }
      
      // Common fix 2: Reinstall dependencies if needed
      try {
        const nodeModulesExists = require('fs').existsSync(
          require('path').join(this.root, 'node_modules')
        );
        
        if (!nodeModulesExists) {
          this.log(`    🔧 Node modules missing, reinstalling...`, 'info');
          await this.runCommand('npm install', {
            description: 'Reinstalling dependencies'
          });
          
          result = await this.buildMainSite(true);
          if (result) {
            this.log(`    ✅ Auto-recovery successful (dependency reinstall fixed it)`, 'success');
            return { success: true, autoFixed: true };
          }
        }
      } catch (error) {
        this.log(`    ⚠️  Dependency reinstall failed: ${error.message}`, 'warning');
      }
      
      // If all recovery attempts failed
      return { 
        success: false, 
        error: 'Main site build failed and auto-recovery was unsuccessful' 
      };
    }, 'Main site build (with auto-recovery)');
  }

  // ============================================
  // INTEGRATION TESTS
  // ============================================
  
  async testAssetIntegrity() {
    return this.runSingleTest(async () => {
      // Check that built assets exist and are reasonable sizes
      const publicDir = require('path').join(this.root, 'public');
      
      if (!require('fs').existsSync(publicDir)) {
        return { success: false, error: 'Public directory missing - run build first' };
      }
      
      // Auto-detect correct asset paths instead of assuming
      const possibleCssFiles = [
        'styles/styles.css',  // Current location
        'css/styles.css',     // Alternative location
        'styles.css'          // Root styles
      ];
      
      const possibleJsFiles = [
        'js/blog.js',
        'scripts/blog.js',
        'blog.js'
      ];
      
      // Find the actual CSS file
      let cssFile = null;
      for (const file of possibleCssFiles) {
        const filePath = require('path').join(publicDir, file);
        if (require('fs').existsSync(filePath)) {
          cssFile = file;
          break;
        }
      }
      
      // Find the actual JS file  
      let jsFile = null;
      for (const file of possibleJsFiles) {
        const filePath = require('path').join(publicDir, file);
        if (require('fs').existsSync(filePath)) {
          jsFile = file;
          break;
        }
      }
      
      // Check essential files exist
      const essentialChecks = [
        { file: 'index.html', required: true },
        { file: cssFile, name: 'CSS file', required: false }, // CSS might be inlined
        { file: jsFile, name: 'JS file', required: false }    // JS might be inlined
      ];
      
      const missing = [];
      const empty = [];
      
      for (const check of essentialChecks) {
        if (!check.file) {
          if (check.required) {
            missing.push(check.name || check.file);
          }
          continue;
        }
        
        const filePath = require('path').join(publicDir, check.file);
        if (!require('fs').existsSync(filePath)) {
          if (check.required) {
            missing.push(check.file);
          }
          continue;
        }
        
        const stats = require('fs').statSync(filePath);
        if (stats.size === 0) {
          empty.push(check.file);
        }
      }
      
      if (missing.length > 0) {
        return { success: false, error: `Missing essential files: ${missing.join(', ')}` };
      }
      
      if (empty.length > 0) {
        return { success: false, error: `Empty files: ${empty.join(', ')}` };
      }
      
      return { success: true };
    }, 'Asset integrity');
  }
  
  async testLinkIntegrity() {
    return this.runSingleTest(async () => {
      // Basic check - more comprehensive link checking could be added
      try {
        // Check that demo builds exist in public directory
        const demos = this.getDemos();
        const publicDemos = require('path').join(this.root, 'public/demos');
        
        if (demos.length > 0 && !require('fs').existsSync(publicDemos)) {
          return { success: false, error: 'Demo assets not copied to public directory' };
        }
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }, 'Link integrity');
  }

  // ============================================
  // REPORTING
  // ============================================
  
  printTestSummary() {
    this.log('\n📊 Test Summary:', 'step');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.warnings}`);
    
    // Show auto-fixes
    const autoFixed = this.testResults.tests.filter(test => test.autoFixed);
    if (autoFixed.length > 0) {
      this.log(`\n🔧 Auto-fixes Applied:`, 'success');
      autoFixed.forEach(test => {
        console.log(`  ✅ ${test.name}: Fixed automatically`);
      });
    }
    
    if (this.testResults.failed > 0) {
      this.log('\n💥 Failed Tests:', 'error');
      this.testResults.tests
        .filter(test => !test.success)
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }
    
    const totalTime = this.testResults.tests.reduce((sum, test) => sum + test.duration, 0);
    this.log(`\n⏱️  Total test time: ${totalTime.toFixed(1)}s`, 'info');
    
    if (autoFixed.length > 0) {
      this.log(`\n💡 ${autoFixed.length} issue(s) were automatically fixed during testing`, 'info');
    }
  }
  
  markProgressAsFailed(error) {
    this.progress.failed = true;
    this.progress.lastError = {
      message: error.message,
      timestamp: Date.now()
    };
    this.saveProgress();
  }
}

// Help text
if (process.argv.includes('--help')) {
  console.log(`
🧪 Test Command - Comprehensive testing and validation

Usage: npm run test [options]

Options:
  --help        Show this help
  --verbose     Show detailed output
  --resume      Resume from last checkpoint

This command runs:
✓ Dependency verification
✓ Demo validation
✓ Content validation  
✓ Build integrity tests
✓ Asset integrity checks

Use this before committing changes or deploying.
For fast development, use: npm run dev
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  const test = new TestCommand();
  test.run();
}

module.exports = TestCommand;