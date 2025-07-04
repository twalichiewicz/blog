#!/usr/bin/env node

/**
 * Development Command - Fast, Smart Development Mode
 * 
 * This is your daily driver for development:
 * - Starts servers for ALL git worktrees
 * - Only rebuilds what changed
 * - Starts servers quickly  
 * - Watches for changes
 * - Minimal validation (speed over safety)
 */

const BuildManager = require('./BuildManager');
const SelfHealingManager = require('./self-healing-manager');
const DevSafetyCheck = require('./dev-safety-check');
const DevWebSocketServer = require('./dev-websocket-server');
const WorktreeServerManager = require('./worktree-server-manager');
const { spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

class DevCommand extends BuildManager {
  constructor() {
    super();
    this.watchers = [];
    this.servers = new Map();
    this.selfHealing = new SelfHealingManager();
    this.safetyCheck = new DevSafetyCheck();
    this.warningsShown = new Set(); // Track shown warnings to avoid spam
    this.wsServer = new DevWebSocketServer(this);
  }

  async run() {
    // Get current branch name
    const { execSync } = require('child_process');
    let branchName = 'unknown';
    try {
      branchName = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch (e) {
      // Fallback if not in git repo
    }
    
    this.branchName = branchName;
    this.log(`🚀 Starting development mode for all worktrees...`, 'step');
    const startTime = this.startTimer();

    try {
      // Phase 0: Self-healing health checks
      const isHealthy = await this.selfHealing.runHealthChecks();
      if (!isHealthy) {
        await this.selfHealing.applyFixes();
      }
      
      // Phase 1: Quick checks (parallel)
      await this.quickSetup();
      
      // Phase 2: Start servers for ALL worktrees
      this.worktreeManager = new WorktreeServerManager();
      await this.worktreeManager.startAllServers();
      
      // Phase 3: Start WebSocket server for debug panel
      this.wsServer.start();
      
      // Phase 4: Setup file watching (for all worktrees)
      this.setupWatchersForAllWorktrees();
      
      // Phase 5: Initial safety scan
      await this.runInitialSafetyCheck();
      
      this.endTimer(startTime, 'Development mode ready');
      this.log(`🎉 Ready for development! All worktree servers started`, 'success');
      
      // Keep process alive
      this.keepAlive();
      
    } catch (error) {
      this.log(`Development startup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  async runInitialSafetyCheck() {
    this.log('🔍 Running initial safety check...', 'step');
    
    const glob = require('glob');
    const jsFiles = glob.sync('themes/san-diego/source/js/**/*.js', { cwd: this.root });
    const ejsFiles = glob.sync('themes/san-diego/layout/**/*.ejs', { cwd: this.root });
    
    let totalWarnings = 0;
    const fileWarnings = [];
    
    [...jsFiles, ...ejsFiles].forEach(file => {
      if (this.safetyCheck.shouldCheckFile(file)) {
        const warnings = this.safetyCheck.checkFile(path.join(this.root, file));
        if (warnings.length > 0) {
          totalWarnings += warnings.length;
          fileWarnings.push({ file, warnings });
        }
      }
    });
    
    if (totalWarnings > 0) {
      this.log(`⚠️  Found ${totalWarnings} safety warning${totalWarnings > 1 ? 's' : ''} in ${fileWarnings.length} file${fileWarnings.length > 1 ? 's' : ''}:`, 'warning');
      
      // Show first 5 files with warnings
      fileWarnings.slice(0, 5).forEach(({ file, warnings }) => {
        this.log(`   ${file}:`, 'plain');
        const formatted = this.safetyCheck.formatWarnings(warnings);
        formatted.forEach(w => this.log(`     ${w}`, 'plain'));
      });
      
      if (fileWarnings.length > 5) {
        this.log(`   ... and ${fileWarnings.length - 5} more files`, 'plain');
      }
      
      this.log('💡 Run "npm run pre-deploy" for a full safety report', 'info');
    } else {
      this.log('✅ No critical safety issues found', 'success');
    }
  }

  async quickSetup() {
    this.log('⚡ Quick setup checks...', 'step');
    
    // Check demo dependencies (but don't install unless missing)
    const needsDeps = !(await this.checkDemoDependencies());
    
    if (needsDeps) {
      this.log('Installing missing demo dependencies...', 'step');
      await this.installDemoDependencies();
    }
    
    // Quick demo validation (warn only, don't fail)
    try {
      await this.validateDemos();
    } catch (error) {
      this.log('Demo validation warnings (continuing anyway)', 'warning');
    }
    
    // Build all demos to ensure they're copied to theme directory
    this.log('🔨 Building demos...', 'step');
    try {
      await this.buildAllDemos();
      this.log('✅ Demos built successfully', 'success');
    } catch (error) {
      this.log(`Demo build warning: ${error.message}`, 'warning');
      // Continue anyway in dev mode
    }
    
    this.log('✅ Quick setup complete', 'success');
  }

  async startMainServer() {
    this.log('🌐 Starting Hexo server...', 'step');
    
    // Don't clean in dev mode - preserve what we can
    const needsRebuild = this.checkIfMainSiteNeedsRebuild();
    
    if (needsRebuild) {
      this.log('Changes detected, rebuilding main site...', 'step');
      await this.buildMainSite(false); // Don't clean in dev mode
    } else {
      this.log('Main site up-to-date', 'success');
    }
    
    // Start Hexo server with dev config
    const hexoServer = spawn('npx', ['hexo', 'server', '--config', '_config.yml,_config.dev.yml'], {
      cwd: this.root,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    this.servers.set('hexo', hexoServer);
    
    // Handle server output
    hexoServer.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output.includes('Hexo is running')) {
        this.log(`✅ Hexo server started successfully [DEV - ${this.branchName}]`, 'success');
      }
    });
    
    hexoServer.stderr.on('data', (data) => {
      const error = data.toString().trim();
      if (error && !error.includes('deprecated')) {
        this.log(`Hexo: ${error}`, 'warning');
        
        // Check for warehouse errors
        if (error.includes('WarehouseError') && error.includes('has been used')) {
          this.log('🔧 Detected warehouse error, auto-fixing...', 'warning');
          this.restartServerWithCleanDB();
        }
      }
    });
    
    // Start health monitoring
    this.selfHealing.startHealthMonitoring(hexoServer);
    this.selfHealing.onRestart = () => this.restartServerWithCleanDB();
    
    // Give server time to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  checkIfMainSiteNeedsRebuild() {
    // Check if key files changed
    const keyFiles = [
      path.join(this.root, '_config.yml'),
      path.join(this.root, 'source'),
      path.join(this.root, 'themes/san-diego')
    ];
    
    let needsRebuild = false;
    
    for (const file of keyFiles) {
      if (this.hasPathChanged(file)) {
        needsRebuild = true;
        break;
      }
    }
    
    return needsRebuild;
  }
  
  hasPathChanged(targetPath) {
    if (!require('fs').existsSync(targetPath)) return false;
    
    const stats = require('fs').statSync(targetPath);
    if (stats.isFile()) {
      return this.hasFileChanged(targetPath);
    }
    
    // For directories, check a sample of files
    const files = this.getFilesInDirectory(targetPath).slice(0, 20); // Sample first 20
    return files.some(file => this.hasFileChanged(file));
  }

  setupWatchersForAllWorktrees() {
    this.log('👀 Setting up file watchers for all worktrees...', 'step');
    
    const worktrees = this.worktreeManager.getWorktrees();
    
    worktrees.forEach(worktree => {
      const worktreePath = worktree.path;
      const branchName = worktree.branchName;
      
      // Watch main content for each worktree
      const contentWatcher = chokidar.watch([
        'source/**/*.md',
        'source/**/*.ejs', 
        'themes/san-diego/**/*.ejs',
        'themes/san-diego/**/*.scss',
        'themes/san-diego/**/*.js'
      ], {
        cwd: worktreePath,
        ignored: ['node_modules', '.git', 'public']
      });
      
      contentWatcher.on('change', (filePath) => {
        this.log(`📝 [${branchName}] File changed: ${filePath}`, 'info');
        this.handleContentChangeForWorktree(filePath, worktree);
      });
      
      // Watch demo source files
      const demoWatcher = chokidar.watch('demos/*/src/**/*', {
        cwd: worktreePath,
        ignored: ['node_modules', 'dist']
      });
      
      demoWatcher.on('change', (filePath) => {
        this.log(`🔧 [${branchName}] Demo file changed: ${filePath}`, 'info');
        this.handleDemoChangeForWorktree(filePath, worktree);
      });
      
      this.watchers.push(contentWatcher, demoWatcher);
    });
    
    this.log(`✅ File watchers active for ${worktrees.length} worktree(s)`, 'success');
  }
  
  async handleContentChangeForWorktree(filePath, worktree) {
    // TODO: Implement worktree-specific content change handling
    this.log(`🔄 [${worktree.branchName}] Would rebuild content...`, 'info');
  }
  
  async handleDemoChangeForWorktree(filePath, worktree) {
    // TODO: Implement worktree-specific demo change handling
    this.log(`🔄 [${worktree.branchName}] Would rebuild demo...`, 'info');
  }
  
  async handleContentChange(filePath) {
    // Run safety check if applicable
    if (this.safetyCheck.shouldCheckFile(filePath)) {
      const warnings = this.safetyCheck.checkFile(path.join(this.root, filePath));
      if (warnings.length > 0) {
        const warningKey = `${filePath}:${warnings.map(w => w.message).join(',')}`;
        
        // Only show each unique warning once per file
        if (!this.warningsShown.has(warningKey)) {
          this.warningsShown.add(warningKey);
          this.log(`⚠️  Safety warnings in ${filePath}:`, 'warning');
          const formatted = this.safetyCheck.formatWarnings(warnings);
          formatted.forEach(w => this.log(`   ${w}`, 'plain'));
        }
      }
    }
    
    // Debounce rapid changes
    clearTimeout(this.contentChangeTimeout);
    this.contentChangeTimeout = setTimeout(async () => {
      try {
        this.log('🔄 Rebuilding main site...', 'step');
        await this.buildMainSite(false);
        this.log('✅ Main site rebuilt', 'success');
      } catch (error) {
        this.log(`Rebuild failed: ${error.message}`, 'error');
      }
    }, 500);
  }
  
  async handleDemoChange(filePath) {
    // Extract demo name from path
    const demoName = filePath.split('/')[1];
    
    clearTimeout(this.demoChangeTimeouts?.[demoName]);
    this.demoChangeTimeouts = this.demoChangeTimeouts || {};
    
    this.demoChangeTimeouts[demoName] = setTimeout(async () => {
      try {
        this.log(`🔄 Rebuilding ${demoName} demo...`, 'step');
        const demos = this.getDemos();
        const demo = demos.find(d => d.name === demoName);
        
        if (demo) {
          await this.buildDemo(demo);
          this.log(`✅ ${demoName} demo rebuilt`, 'success');
          // The dist watcher will handle copying to public
        }
      } catch (error) {
        this.log(`Demo rebuild failed: ${error.message}`, 'error');
      }
    }, 1000);
  }
  
  async handleDemoDistChange(filePath) {
    // Extract demo name from path
    const demoName = filePath.split('/')[1];
    
    clearTimeout(this.demoDistChangeTimeouts?.[demoName]);
    this.demoDistChangeTimeouts = this.demoDistChangeTimeouts || {};
    
    this.demoDistChangeTimeouts[demoName] = setTimeout(async () => {
      try {
        // CRITICAL FIX: Copy updated dist files to theme directory first
        this.log(`📋 Copying ${demoName} from dist to theme directory...`, 'step');
        await this.copyDemoToTheme(demoName);
        
        // Check if this is a new asset hash (indicates rebuild)
        const isNewAsset = filePath.includes('index-') && (filePath.includes('.css') || filePath.includes('.js'));
        
        if (isNewAsset) {
          // Proactively clean to prevent warehouse errors
          this.log(`🔄 Demo ${demoName} has new assets, cleaning database...`, 'step');
          const fs = require('fs');
          const path = require('path');
          const dbFile = path.join(this.root, 'db.json');
          
          if (fs.existsSync(dbFile)) {
            fs.unlinkSync(dbFile);
            this.log('✅ Database cleaned proactively', 'success');
          }
        }
        
        // Regenerate Hexo to copy the new dist files
        this.log(`🔄 Copying updated ${demoName} demo to public...`, 'step');
        await this.buildMainSite(false);
        this.log(`✅ Demo updates now live at http://localhost:4000 [DEV - ${this.branchName}]`, 'success');
      } catch (error) {
        this.log(`Failed to update public directory: ${error.message}`, 'error');
      }
    }, 500);
  }
  
  async copyDemoToTheme(demoName) {
    const fs = require('fs');
    const path = require('path');
    
    const distPath = path.join(this.root, 'demos', demoName, 'dist');
    const themePath = path.join(this.root, 'themes/san-diego/source/demos', demoName);
    
    if (!fs.existsSync(distPath)) {
      this.log(`⚠️  No dist directory found for ${demoName}`, 'warning');
      return false;
    }
    
    // Remove existing files
    if (fs.existsSync(themePath)) {
      fs.rmSync(themePath, { recursive: true, force: true });
    }
    
    // Ensure parent directory exists
    const parentDir = path.dirname(themePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    
    // Copy dist to theme
    await this.copyDirectory(distPath, themePath);
    this.log(`✅ ${demoName} copied to theme directory`, 'success');
    return true;
  }
  
  copyDirectory(src, dest) {
    const fs = require('fs');
    const path = require('path');
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  keepAlive() {
    // Graceful shutdown handling
    process.on('SIGINT', () => {
      this.log('🛑 Shutting down development mode...', 'step');
      this.cleanup();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      this.cleanup();
      process.exit(0);
    });
  }
  
  async cleanup() {
    this.log('🧹 Cleaning up...', 'step');
    
    // Stop WebSocket server
    this.wsServer.stop();
    
    // Stop watchers
    this.watchers.forEach(watcher => watcher.close());
    
    // Stop all worktree servers
    if (this.worktreeManager) {
      this.log('Stopping all worktree servers...', 'step');
      this.worktreeManager.cleanup();
    }
    
    // Stop any other servers
    this.servers.forEach((server, name) => {
      this.log(`Stopping ${name} server...`, 'step');
      server.kill();
    });
    
    // Generate health report
    const report = this.selfHealing.generateHealthReport();
    if (report.issuesFound > 0) {
      this.log(`📊 Health report: ${report.fixesApplied.length}/${report.issuesFound} issues fixed`, 'info');
    }
    
    // Save progress
    await super.cleanup();
    
    this.log('✅ Cleanup complete', 'success');
  }
  
  async restartServerWithCleanDB() {
    // Prevent restart loops
    const now = Date.now();
    if (this.lastRestartTime && (now - this.lastRestartTime) < 5000) {
      this.log('⚠️  Restart attempted too soon, skipping to prevent loop', 'warning');
      return;
    }
    this.lastRestartTime = now;
    
    this.log('🔄 Restarting server with clean database...', 'warning');
    
    // Kill current server
    const hexoServer = this.servers.get('hexo');
    if (hexoServer) {
      hexoServer.kill();
      this.servers.delete('hexo');
    }
    
    // Wait a bit for process to fully terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clean Hexo DB with error handling
    try {
      await new Promise((resolve, reject) => {
        const clean = spawn('npx', ['hexo', 'clean'], {
          cwd: this.root,
          stdio: 'inherit'
        });
        clean.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            // Try manual cleanup instead of rejecting
            this.log('⚠️  Hexo clean failed, attempting manual cleanup...', 'warning');
            const fs = require('fs');
            const path = require('path');
            try {
              const publicDir = path.join(this.root, 'public');
              const dbFile = path.join(this.root, 'db.json');
              
              if (fs.existsSync(publicDir)) {
                fs.rmSync(publicDir, { recursive: true, force: true });
              }
              if (fs.existsSync(dbFile)) {
                fs.unlinkSync(dbFile);
              }
              this.log('✅ Manual cleanup successful', 'success');
              resolve();
            } catch (err) {
              reject(new Error(`Cleanup failed: ${err.message}`));
            }
          }
        });
      });
    } catch (error) {
      this.log(`❌ Cleanup failed: ${error.message}`, 'error');
      // Continue anyway - sometimes it's better to try
    }
    
    // Restart server
    try {
      await this.startMainServer();
      this.log('✅ Server restarted successfully', 'success');
    } catch (error) {
      this.log(`❌ Server restart failed: ${error.message}`, 'error');
    }
  }
}

// Help text
if (process.argv.includes('--help')) {
  console.log(`
🚀 Development Mode - Fast development with file watching for ALL worktrees

Usage: npm run dev [options]

Options:
  --help        Show this help
  --verbose     Show detailed output
  --no-watch    Skip file watching

This command:
✓ Starts servers for ALL git worktrees
✓ Assigns unique ports (4000, 4001, 4002...)
✓ Quickly checks dependencies  
✓ Watches files for changes in all worktrees
✓ Rebuilds only what changed
✓ Optimized for speed over safety

Port Allocation:
- Main branch: port 4000
- Feature branches: ports 4001, 4002, etc.

For full validation, use: npm run test
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  const dev = new DevCommand();
  dev.run();
}

module.exports = DevCommand;