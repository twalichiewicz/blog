#!/usr/bin/env node

/**
 * Install Demo Dependencies
 * 
 * Installs npm dependencies for all demos that need them
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DemoInstaller {
  constructor() {
    this.verbose = process.argv.includes('--verbose');
    this.force = process.argv.includes('--force');
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  async installDemo(demoName) {
    const demoPath = path.join(process.cwd(), 'demos', demoName);
    const hasNodeModules = fs.existsSync(path.join(demoPath, 'node_modules'));
    
    if (!hasNodeModules || this.force) {
      this.log(`📦 Installing dependencies for ${demoName}...`);
      
      try {
        execSync('npm install', { 
          cwd: demoPath,
          stdio: this.verbose ? 'inherit' : 'pipe'
        });
        this.log(`✅ Successfully installed dependencies for ${demoName}`);
        return true;
      } catch (error) {
        this.log(`❌ Failed to install dependencies for ${demoName}: ${error.message}`);
        return false;
      }
    } else {
      this.log(`⏭️  ${demoName} dependencies already installed`);
      return true;
    }
  }

  async run() {
    this.log('🚀 Installing demo dependencies...');
    
    const demosDir = path.join(process.cwd(), 'demos');
    if (!fs.existsSync(demosDir)) {
      this.log('❌ Demos directory not found');
      process.exit(1);
    }

    const demoDirectories = fs.readdirSync(demosDir)
      .filter(item => {
        const demoPath = path.join(demosDir, item);
        return fs.statSync(demoPath).isDirectory() && 
               fs.existsSync(path.join(demoPath, 'package.json'));
      });

    if (demoDirectories.length === 0) {
      this.log('📝 No demos with package.json found');
      return;
    }

    this.log(`📋 Found ${demoDirectories.length} demo(s): ${demoDirectories.join(', ')}`);
    
    let successful = 0;
    let failed = 0;

    for (const demo of demoDirectories) {
      const success = await this.installDemo(demo);
      if (success) {
        successful++;
      } else {
        failed++;
      }
    }

    this.log('\n📊 Installation Summary:');
    this.log(`✅ Successful: ${successful}`);
    this.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
      this.log('⚠️  Some installations failed. Check logs above.');
      process.exit(1);
    } else {
      this.log('🎉 All demo dependencies installed successfully!');
    }
  }
}

// Help
if (process.argv.includes('--help')) {
  console.log(`
📦 Demo Dependencies Installer

Usage: node scripts/install-demo-deps.js [options]

Options:
  --force       Reinstall even if node_modules exists
  --verbose     Show detailed npm output
  --help        Show this help

This script finds all demos with package.json files and ensures
their dependencies are installed.
`);
  process.exit(0);
}

const installer = new DemoInstaller();
installer.run();