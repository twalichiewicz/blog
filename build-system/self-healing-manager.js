#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync, spawn } = require('child_process');
let chalk;
try {
  chalk = require('chalk');
} catch (error) {
  // Fallback if chalk isn't available
  chalk = {
    blue: (str) => str,
    gray: (str) => str,
    green: (str) => str,
    yellow: (str) => str,
    red: (str) => str
  };
}

class SelfHealingManager {
  constructor() {
    this.issuesDetected = [];
    this.fixesApplied = [];
    this.healthChecks = [];
    this.serverProcess = null;
  }

  // Main health check system
  async runHealthChecks() {
    console.log(chalk.blue('🏥 Running system health checks...'));
    
    const checks = [
      this.checkHexoWarehouse.bind(this),
      this.checkPortAvailability.bind(this),
      this.checkDemoAssets.bind(this),
      this.checkNodeMemory.bind(this),
      this.checkDependencies.bind(this),
      this.checkBuildCache.bind(this),
      this.checkDarkModeStyles.bind(this),
      this.checkImagePaths.bind(this)
    ];

    for (const check of checks) {
      try {
        await check();
      } catch (error) {
        this.logError(`Health check failed: ${error.message}`);
      }
    }

    return this.issuesDetected.length === 0;
  }

  // Check for Hexo warehouse issues
  async checkHexoWarehouse() {
    console.log(chalk.gray('  Checking Hexo warehouse...'));
    
    // Check if db.json exists and has duplicate entries
    const dbPath = path.join(process.cwd(), 'db.json');
    if (fs.existsSync(dbPath)) {
      try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const assetIds = new Set();
        let hasDuplicates = false;
        
        if (db.models && db.models.Asset && db.models.Asset.data) {
          for (const asset of Object.values(db.models.Asset.data)) {
            if (assetIds.has(asset._id)) {
              hasDuplicates = true;
              break;
            }
            assetIds.add(asset._id);
          }
        }
        
        if (hasDuplicates) {
          this.issuesDetected.push({
            type: 'hexo-warehouse',
            message: 'Duplicate asset IDs detected in Hexo database',
            autoFix: true
          });
        }
      } catch (error) {
        // Database might be corrupted
        this.issuesDetected.push({
          type: 'hexo-warehouse',
          message: 'Hexo database appears corrupted',
          autoFix: true
        });
      }
    }
  }

  // Check port availability
  async checkPortAvailability() {
    console.log(chalk.gray('  Checking port availability...'));
    
    try {
      execSync('lsof -i :4000', { stdio: 'pipe' });
      // If command succeeds, port is in use
      this.issuesDetected.push({
        type: 'port-blocked',
        message: 'Port 4000 is already in use',
        autoFix: true
      });
    } catch (error) {
      // Port is free (command failed)
    }
  }

  // Check demo assets
  async checkDemoAssets() {
    console.log(chalk.gray('  Checking demo assets...'));
    
    const demosPath = path.join(process.cwd(), 'themes/san-diego/source/demos');
    const sourceDemosPath = path.join(process.cwd(), 'demos');
    
    if (!fs.existsSync(demosPath) && fs.existsSync(sourceDemosPath)) {
      this.issuesDetected.push({
        type: 'missing-demo-builds',
        message: 'Demo builds not found in theme directory',
        autoFix: true
      });
    }
  }

  // Check Node memory usage
  async checkNodeMemory() {
    console.log(chalk.gray('  Checking memory usage...'));
    
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    
    if (heapUsedMB > 500) {
      this.issuesDetected.push({
        type: 'high-memory',
        message: `High memory usage detected: ${Math.round(heapUsedMB)}MB`,
        autoFix: true
      });
    }
  }

  // Check dependencies
  async checkDependencies() {
    console.log(chalk.gray('  Checking dependencies...'));
    
    // Check if node_modules exists
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      this.issuesDetected.push({
        type: 'missing-dependencies',
        message: 'Node modules not installed',
        autoFix: true
      });
      return;
    }

    // Check for outdated packages that might cause issues
    try {
      const result = execSync('npm outdated --json', { stdio: 'pipe' }).toString();
      const outdated = JSON.parse(result || '{}');
      
      // Check for critical packages
      const criticalPackages = ['hexo', 'hexo-server', 'sharp'];
      for (const pkg of criticalPackages) {
        if (outdated[pkg] && outdated[pkg].wanted !== outdated[pkg].current) {
          this.issuesDetected.push({
            type: 'outdated-dependency',
            message: `Critical package ${pkg} is outdated`,
            package: pkg,
            autoFix: false // Don't auto-update, just warn
          });
        }
      }
    } catch (error) {
      // npm outdated returns non-zero exit code when packages are outdated
    }
  }

  // Check build cache integrity
  async checkBuildCache() {
    console.log(chalk.gray('  Checking build cache...'));
    
    const cachePath = path.join(process.cwd(), '.build-cache');
    if (fs.existsSync(cachePath)) {
      try {
        const cacheState = JSON.parse(
          fs.readFileSync(path.join(cachePath, 'state.json'), 'utf8')
        );
        
        // Check for stale cache (older than 7 days)
        const cacheAge = Date.now() - new Date(cacheState.lastUpdated).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (cacheAge > sevenDays) {
          this.issuesDetected.push({
            type: 'stale-cache',
            message: 'Build cache is older than 7 days',
            autoFix: true
          });
        }
      } catch (error) {
        this.issuesDetected.push({
          type: 'corrupted-cache',
          message: 'Build cache appears corrupted',
          autoFix: true
        });
      }
    }
  }

  // Check dark mode styles
  async checkDarkModeStyles() {
    console.log(chalk.gray('  Checking dark mode styles...'));
    
    const cssPath = path.join(process.cwd(), 'demos/shared/components/demo-wrapper.css');
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, 'utf8');
      
      // Check for dark mode grid visibility
      if (!content.includes('rgba(255, 255, 255, 0.15)')) {
        this.issuesDetected.push({
          type: 'dark-mode-grid',
          message: 'Dark mode grid might not be visible',
          autoFix: true
        });
      }
    }
  }

  // Check for broken image paths
  async checkImagePaths() {
    console.log(chalk.gray('  Checking image paths...'));
    
    const postsPath = path.join(process.cwd(), 'source/_posts');
    const brokenImages = [];
    
    // Quick scan of recent posts
    try {
      const posts = fs.readdirSync(postsPath)
        .filter(f => f.endsWith('.md'))
        .slice(0, 10); // Check only recent posts for performance
      
      for (const post of posts) {
        const content = fs.readFileSync(path.join(postsPath, post), 'utf8');
        const imageMatches = content.match(/!\[.*?\]\((.*?)\)/g) || [];
        
        for (const match of imageMatches) {
          const imagePath = match.match(/\((.*?)\)/)[1];
          if (imagePath.includes('/20') && !imagePath.startsWith('./')) {
            brokenImages.push({ post, imagePath });
          }
        }
      }
      
      if (brokenImages.length > 0) {
        this.issuesDetected.push({
          type: 'broken-images',
          message: `Found ${brokenImages.length} potentially broken image paths`,
          images: brokenImages,
          autoFix: false // Too risky to auto-fix
        });
      }
    } catch (error) {
      // Ignore scan errors
    }
  }

  // Apply automatic fixes
  async applyFixes() {
    if (this.issuesDetected.length === 0) {
      console.log(chalk.green('✅ All systems healthy!'));
      return true;
    }

    console.log(chalk.yellow(`\n🔧 Found ${this.issuesDetected.length} issues. Attempting auto-fixes...`));

    for (const issue of this.issuesDetected) {
      if (issue.autoFix) {
        try {
          await this.fixIssue(issue);
          this.fixesApplied.push(issue);
        } catch (error) {
          console.log(chalk.red(`  ❌ Failed to fix ${issue.type}: ${error.message}`));
        }
      } else {
        console.log(chalk.yellow(`  ⚠️  ${issue.message} (manual fix required)`));
      }
    }

    return this.fixesApplied.length > 0;
  }

  // Fix specific issue types
  async fixIssue(issue) {
    switch (issue.type) {
      case 'hexo-warehouse':
        console.log(chalk.blue('  🔧 Cleaning Hexo database...'));
        execSync('npx hexo clean', { stdio: 'inherit' });
        break;

      case 'port-blocked':
        console.log(chalk.blue('  🔧 Killing process on port 4000...'));
        try {
          execSync('kill -9 $(lsof -t -i:4000)', { shell: true });
        } catch (error) {
          // Process might have already ended
        }
        break;

      case 'missing-demo-builds':
        console.log(chalk.blue('  🔧 Building demos...'));
        execSync('npm run build:demos', { stdio: 'inherit' });
        break;

      case 'high-memory':
        console.log(chalk.blue('  🔧 Running garbage collection...'));
        if (global.gc) {
          global.gc();
        }
        break;

      case 'missing-dependencies':
        console.log(chalk.blue('  🔧 Installing dependencies...'));
        execSync('npm install', { stdio: 'inherit' });
        break;

      case 'stale-cache':
      case 'corrupted-cache':
        console.log(chalk.blue('  🔧 Clearing build cache...'));
        fs.removeSync(path.join(process.cwd(), '.build-cache'));
        break;

      case 'dark-mode-grid':
        console.log(chalk.blue('  🔧 Updating dark mode styles...'));
        const cssPath = path.join(process.cwd(), 'demos/shared/components/demo-wrapper.css');
        let content = fs.readFileSync(cssPath, 'utf8');
        content = content.replace(
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0.15)'
        );
        fs.writeFileSync(cssPath, content);
        break;
    }
  }

  // Monitor server health in real-time
  async startHealthMonitoring(serverProcess) {
    this.serverProcess = serverProcess;
    
    // Monitor server output for errors
    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      
      // Detect warehouse errors
      if (error.includes('WarehouseError') && error.includes('has been used')) {
        console.log(chalk.red('\n⚠️  Detected Hexo warehouse error!'));
        this.handleRuntimeError('warehouse-error');
      }
      
      // Detect memory errors
      if (error.includes('JavaScript heap out of memory')) {
        console.log(chalk.red('\n⚠️  Memory limit exceeded!'));
        this.handleRuntimeError('memory-error');
      }
    });

    // Periodic health checks
    setInterval(() => {
      this.performRuntimeHealthCheck();
    }, 30000); // Every 30 seconds
  }

  // Handle runtime errors
  async handleRuntimeError(errorType) {
    // Prevent error handling loops
    const now = Date.now();
    const lastHandled = this.lastErrorHandled?.[errorType] || 0;
    
    if (now - lastHandled < 10000) { // 10 second cooldown
      console.log(chalk.yellow('⚠️  Same error detected too soon, skipping auto-fix to prevent loop'));
      return;
    }
    
    this.lastErrorHandled = this.lastErrorHandled || {};
    this.lastErrorHandled[errorType] = now;
    
    switch (errorType) {
      case 'warehouse-error':
        console.log(chalk.yellow('🔧 Auto-fixing: Restarting with clean database...'));
        
        // Kill current server
        if (this.serverProcess) {
          this.serverProcess.kill();
        }
        
        // Clean and restart with error handling
        try {
          execSync('npx hexo clean', { stdio: 'inherit' });
        } catch (cleanError) {
          // If clean fails, try manual cleanup
          console.log(chalk.yellow('⚠️  Standard clean failed, attempting manual cleanup...'));
          try {
            const fs = require('fs');
            const path = require('path');
            const publicDir = path.join(process.cwd(), 'public');
            const dbFile = path.join(process.cwd(), 'db.json');
            
            // Remove public directory if it exists
            if (fs.existsSync(publicDir)) {
              fs.rmSync(publicDir, { recursive: true, force: true });
            }
            
            // Remove database file if it exists
            if (fs.existsSync(dbFile)) {
              fs.unlinkSync(dbFile);
            }
            
            console.log(chalk.green('✅ Manual cleanup successful'));
          } catch (manualError) {
            console.log(chalk.red('❌ Manual cleanup also failed:', manualError.message));
          }
        }
        this.emit('restart-needed');
        break;

      case 'memory-error':
        console.log(chalk.yellow('🔧 Auto-fixing: Restarting with increased memory...'));
        
        if (this.serverProcess) {
          this.serverProcess.kill();
        }
        
        // Set higher memory limit
        process.env.NODE_OPTIONS = '--max-old-space-size=4096';
        this.emit('restart-needed');
        break;
    }
  }

  // Perform runtime health checks
  async performRuntimeHealthCheck() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    
    // Warn if memory is getting high
    if (heapUsedMB > 800) {
      console.log(chalk.yellow(`\n⚠️  High memory usage: ${Math.round(heapUsedMB)}MB`));
      
      // Trigger garbage collection if available
      if (global.gc) {
        console.log(chalk.blue('  🔧 Running garbage collection...'));
        global.gc();
      }
    }
  }

  // Generate health report
  generateHealthReport() {
    const report = {
      timestamp: new Date().toISOString(),
      issuesFound: this.issuesDetected.length,
      fixesApplied: this.fixesApplied.length,
      systemStatus: this.issuesDetected.length === 0 ? 'healthy' : 'issues-detected',
      details: {
        issues: this.issuesDetected,
        fixes: this.fixesApplied
      }
    };

    // Save report
    const reportsDir = path.join(process.cwd(), '.health-reports');
    fs.ensureDirSync(reportsDir);
    
    const reportPath = path.join(
      reportsDir,
      `health-report-${new Date().toISOString().split('T')[0]}.json`
    );
    
    fs.writeJsonSync(reportPath, report, { spaces: 2 });
    
    return report;
  }

  // Event emitter functionality
  emit(event) {
    if (this.onRestart && event === 'restart-needed') {
      this.onRestart();
    }
  }

  // Log helpers
  logError(message) {
    console.log(chalk.red(`  ❌ ${message}`));
  }

  logSuccess(message) {
    console.log(chalk.green(`  ✅ ${message}`));
  }
}

// CLI interface when run directly
if (require.main === module) {
  require('./self-healing-cli');
}

module.exports = SelfHealingManager;