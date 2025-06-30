#!/usr/bin/env node

/**
 * Build Manager - The "Head Chef" for the Blog Build System
 * 
 * This orchestrates all build tasks with:
 * - Smart caching (only rebuild what changed)
 * - Parallel execution (multiple tasks at once)
 * - Progress tracking (resume from failures)
 * - Clear feedback (know what's happening)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { performance } = require('perf_hooks');
const crypto = require('crypto');

class BuildManager {
  constructor() {
    this.root = path.join(__dirname, '..');
    this.cacheDir = path.join(this.root, '.build-cache');
    this.progressFile = path.join(this.cacheDir, 'progress.json');
    this.hashFile = path.join(this.cacheDir, 'file-hashes.json');
    
    this.progress = this.loadProgress();
    this.fileHashes = this.loadFileHashes();
    this.runningTasks = new Map();
    
    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  // ============================================
  // PROGRESS & CACHING SYSTEM
  // ============================================
  
  loadProgress() {
    if (fs.existsSync(this.progressFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.progressFile, 'utf-8'));
      } catch (error) {
        this.log('Warning: Could not load progress file, starting fresh', 'warning');
      }
    }
    return {
      lastBuild: null,
      completedSteps: [],
      failed: false,
      timestamp: Date.now()
    };
  }
  
  saveProgress(step = null) {
    if (step) {
      this.progress.completedSteps.push({
        step,
        timestamp: Date.now()
      });
    }
    this.progress.lastBuild = Date.now();
    this.progress.failed = false;
    
    fs.writeFileSync(this.progressFile, JSON.stringify(this.progress, null, 2));
  }
  
  loadFileHashes() {
    if (fs.existsSync(this.hashFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.hashFile, 'utf-8'));
      } catch (error) {
        this.log('Warning: Could not load hash file, will rebuild everything', 'warning');
      }
    }
    return {};
  }
  
  saveFileHashes() {
    fs.writeFileSync(this.hashFile, JSON.stringify(this.fileHashes, null, 2));
  }
  
  getFileHash(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  }
  
  hasFileChanged(filePath, relativePath = null) {
    const key = relativePath || path.relative(this.root, filePath);
    const currentHash = this.getFileHash(filePath);
    const previousHash = this.fileHashes[key];
    
    if (currentHash !== previousHash) {
      this.fileHashes[key] = currentHash;
      return true;
    }
    return false;
  }

  // ============================================
  // LOGGING & FEEDBACK
  // ============================================
  
  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',     // cyan
      success: '\x1b[32m',  // green  
      warning: '\x1b[33m',  // yellow
      error: '\x1b[31m',    // red
      step: '\x1b[35m',     // magenta
      reset: '\x1b[0m'
    };
    
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      step: '🔄'
    };
    
    const color = colors[type] || colors.info;
    const icon = icons[type] || '';
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`${color}[${timestamp}] ${icon} ${message}${colors.reset}`);
  }
  
  startTimer(label) {
    return performance.now();
  }
  
  endTimer(startTime, label) {
    const duration = ((performance.now() - startTime) / 1000).toFixed(1);
    this.log(`${label} completed in ${duration}s`, 'success');
    return parseFloat(duration);
  }

  // ============================================
  // TASK EXECUTION
  // ============================================
  
  async runCommand(command, options = {}) {
    const { cwd = this.root, description = command } = options;
    
    this.log(`Running: ${description}`, 'step');
    
    try {
      const result = execSync(command, { 
        cwd,
        stdio: 'pipe',
        encoding: 'utf8'
      });
      return { success: true, output: result };
    } catch (error) {
      this.log(`Command failed: ${description}`, 'error');
      if (options.verbose) {
        console.log(error.stdout);
        console.log(error.stderr);
      }
      return { success: false, error: error.message };
    }
  }
  
  async runParallel(tasks) {
    this.log(`Running ${tasks.length} tasks in parallel...`, 'step');
    const startTime = this.startTimer();
    
    const results = await Promise.allSettled(tasks);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    this.endTimer(startTime, `Parallel execution (${successful} succeeded, ${failed} failed)`);
    
    return results;
  }

  // ============================================
  // DEMO MANAGEMENT
  // ============================================
  
  getDemos() {
    const demosDir = path.join(this.root, 'demos');
    if (!fs.existsSync(demosDir)) return [];
    
    return fs.readdirSync(demosDir)
      .filter(item => {
        const demoPath = path.join(demosDir, item);
        // Skip non-directories, shared components, and folders without package.json
        if (!fs.statSync(demoPath).isDirectory()) return false;
        if (item === 'shared' || item === 'build-scripts' || item === 'examples') return false;
        return fs.existsSync(path.join(demoPath, 'package.json'));
      })
      .map(name => ({
        name,
        path: path.join(demosDir, name),
        packageJson: path.join(demosDir, name, 'package.json'),
        nodeModules: path.join(demosDir, name, 'node_modules'),
        dist: path.join(demosDir, name, 'dist')
      }));
  }
  
  async checkDemoDependencies() {
    const demos = this.getDemos();
    const missingDeps = demos.filter(demo => !fs.existsSync(demo.nodeModules));
    
    if (missingDeps.length === 0) {
      this.log(`All ${demos.length} demos have dependencies installed`, 'success');
      return true;
    }
    
    this.log(`${missingDeps.length} demos need dependency installation`, 'warning');
    return false;
  }
  
  async installDemoDependencies(forceReinstall = false) {
    const demos = this.getDemos();
    const demosToInstall = forceReinstall ? 
      demos : 
      demos.filter(demo => !fs.existsSync(demo.nodeModules));
    
    if (demosToInstall.length === 0) {
      this.log('All demo dependencies already installed', 'success');
      return true;
    }
    
    this.log(`Installing dependencies for ${demosToInstall.length} demos...`, 'step');
    
    // Install in parallel for speed
    const installTasks = demosToInstall.map(demo => 
      this.runCommand('npm install', {
        cwd: demo.path,
        description: `Installing ${demo.name} dependencies`
      })
    );
    
    const results = await this.runParallel(installTasks);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    
    this.log(`Installed dependencies for ${successful}/${demosToInstall.length} demos`, 'success');
    return successful === demosToInstall.length;
  }
  
  async buildDemo(demo) {
    // Check if demo needs rebuilding
    const packageJsonChanged = this.hasFileChanged(demo.packageJson);
    const srcFiles = this.getFilesInDirectory(path.join(demo.path, 'src'));
    const srcChanged = srcFiles.some(file => this.hasFileChanged(file));
    
    if (!packageJsonChanged && !srcChanged && fs.existsSync(demo.dist)) {
      this.log(`${demo.name} already built and up-to-date`, 'success');
      return true;
    }
    
    this.log(`Building ${demo.name}...`, 'step');
    const result = await this.runCommand('npm run build', {
      cwd: demo.path,
      description: `Building ${demo.name}`
    });
    
    return result.success;
  }
  
  async buildAllDemos() {
    const demos = this.getDemos();
    
    if (demos.length === 0) {
      this.log('No demos found to build', 'info');
      return true;
    }
    
    // Build demos in parallel
    const buildTasks = demos.map(demo => this.buildDemo(demo));
    const results = await this.runParallel(buildTasks);
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    this.log(`Built ${successful}/${demos.length} demos successfully`, 'success');
    
    return successful === demos.length;
  }

  // ============================================
  // MAIN SITE BUILDING
  // ============================================
  
  async buildMainSite(clean = false) {
    this.log('Building main site...', 'step');
    
    if (clean) {
      await this.runCommand('npx hexo clean', {
        description: 'Cleaning Hexo cache'
      });
    }
    
    const result = await this.runCommand('npx hexo generate', {
      description: 'Generating main site'
    });
    
    return result.success;
  }

  // ============================================
  // VALIDATION
  // ============================================
  
  async validateDemos() {
    this.log('Validating demos...', 'step');
    const result = await this.runCommand('npm run validate:demos', {
      description: 'Demo validation'
    });
    return result.success;
  }
  
  async validateContent() {
    this.log('Validating content...', 'step');
    const result = await this.runCommand('npm run validate:content', {
      description: 'Content validation'
    });
    return result.success;
  }

  // ============================================
  // UTILITIES
  // ============================================
  
  getFilesInDirectory(dir) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.getFilesInDirectory(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  async cleanup() {
    this.saveFileHashes();
    this.saveProgress();
  }
  
  clearCache() {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true, force: true });
      this.log('Build cache cleared', 'success');
    }
  }
}

module.exports = BuildManager;