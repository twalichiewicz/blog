#!/usr/bin/env node

/**
 * Build Utilities - Helper commands for the build system
 */

const BuildManager = require('./BuildManager');

class BuildUtils extends BuildManager {
  
  async clearCache() {
    this.log('Clearing build cache...', 'step');
    super.clearCache();
    this.log('Build cache cleared', 'success');
  }
  
  async status() {
    this.log('Build system status', 'step');
    
    // Check demos
    const demos = this.getDemos();
    this.log(`\nDemos: ${demos.length} found`, 'info');
    
    for (const demo of demos) {
      const hasDeps = require('fs').existsSync(demo.nodeModules);
      const hasBuilt = require('fs').existsSync(demo.dist);
      const status = hasDeps ? (hasBuilt ? '[ready]' : '[needs build]') : '[missing deps]';
      this.log(`  ${status} ${demo.name} (deps: ${hasDeps}, built: ${hasBuilt})`, 'info');
    }
    
    // Check cache
    const cacheExists = require('fs').existsSync(this.cacheDir);
    this.log(`\nCache: ${cacheExists ? 'Present' : 'Empty'}`, 'info');
    
    if (cacheExists) {
      const progress = this.loadProgress();
      this.log(`  Last build: ${progress.lastBuild ? new Date(progress.lastBuild).toLocaleString() : 'Never'}`, 'info');
      this.log(`  Failed: ${progress.failed ? 'Yes' : 'No'}`, 'info');
    }
    
    // Check main site
    const publicExists = require('fs').existsSync(require('path').join(this.root, 'public'));
    this.log(`\nMain site: ${publicExists ? 'Built' : 'Not built'}`, 'info');
  }
  
  async installDeps() {
    this.log('Installing all demo dependencies...', 'step');
    const result = await this.installDemoDependencies(true); // Force reinstall
    
    if (result) {
      this.log('All dependencies installed', 'success');
    } else {
      this.log('Some dependencies failed to install', 'error');
      process.exit(1);
    }
  }
  
  async buildAll() {
    this.log('Building everything...', 'step');
    const startTime = this.startTimer();
    
    try {
      // Install dependencies first
      await this.installDemoDependencies();
      
      // Build demos and main site in parallel
      const [demosResult, siteResult] = await Promise.all([
        this.buildAllDemos(),
        this.buildMainSite(true)
      ]);
      
      if (demosResult && siteResult) {
        this.endTimer(startTime, 'Complete build');
        this.log('Everything built successfully.', 'success');
      } else {
        throw new Error('Some builds failed');
      }
      
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const utils = new BuildUtils();
  
  switch (command) {
    case 'clear-cache':
      await utils.clearCache();
      break;
      
    case 'status':
      await utils.status();
      break;
      
    case 'install-deps':
      await utils.installDeps();
      break;
      
    case 'build-all':
      await utils.buildAll();
      break;
      
    case 'help':
    default:
      console.log(`
Build System Utilities

Usage: node build-system/build-utils.js <command>

Commands:
  status        Show build system status
  clear-cache   Clear build cache and start fresh
  install-deps  Install all demo dependencies
  build-all     Build everything from scratch
  help          Show this help

Examples:
  npm run build:status
  npm run build:clear-cache
  npm run build:install-deps
  npm run build:all
`);
      break;
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Command failed:', error.message);
    process.exit(1);
  });
}

module.exports = BuildUtils;
