#!/usr/bin/env node

// Note: blessed-contrib removed due to security vulnerabilities
// This is now a simple text-based health check
const SelfHealingManager = require('./self-healing-manager');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

class HealthDashboard {
  constructor() {
    this.selfHealing = new SelfHealingManager();
    this.screen = null;
    this.grid = null;
    this.widgets = {};
    this.refreshInterval = null;
    this.metrics = {
      memory: [],
      cpu: [],
      buildTimes: [],
      errorCount: 0,
      warningCount: 0
    };
  }

  async start() {
    console.log(chalk.blue.bold('\n📊 Health Dashboard\n'));
    console.log(chalk.gray('Note: Interactive dashboard temporarily disabled due to security fixes'));
    console.log(chalk.gray('Use npm run doctor for health checks\n'));
    
    // Run health check instead
    const checkResult = await this.selfHealing.runHealthCheck();
    
    if (checkResult.healthy) {
      console.log(chalk.green('✅ System is healthy!'));
    } else {
      console.log(chalk.yellow('⚠️ Issues detected:'));
      checkResult.issues.forEach(issue => {
        console.log(chalk.yellow(`  - ${issue.message}`));
      });
    }
    
    process.exit(0);
    return;
    
    // Original blessed code disabled
    /*
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Thomas.design Health Dashboard'
    });

    // Create grid
    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    });

    // Create widgets
    this.createWidgets();

    // Start monitoring
    await this.updateDashboard();
    this.refreshInterval = setInterval(() => {
      this.updateDashboard();
    }, 5000);

    // Key bindings
    this.screen.key(['escape', 'q', 'C-c'], () => {
      this.cleanup();
      process.exit(0);
    });

    // Render
    this.screen.render();
  }

  createWidgets() {
    // Title
    this.widgets.title = this.grid.set(0, 0, 1, 12, blessed.text, {
      content: '{center}🏥 Thomas.design Health Dashboard{/center}',
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue'
      }
    });

    // System Status
    this.widgets.status = this.grid.set(1, 0, 2, 4, blessed.box, {
      label: '📊 System Status',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'cyan'
        }
      }
    });

    // Memory Usage Graph
    this.widgets.memory = this.grid.set(1, 4, 2, 4, contrib.line, {
      style: {
        line: 'yellow',
        text: 'green',
        baseline: 'white'
      },
      label: '💾 Memory Usage (MB)',
      maxY: 1000,
      showLegend: true
    });

    // Build Performance
    this.widgets.buildPerf = this.grid.set(1, 8, 2, 4, contrib.bar, {
      label: '⚡ Build Times (seconds)',
      barWidth: 6,
      barSpacing: 2,
      xOffset: 0,
      maxHeight: 30
    });

    // Active Issues
    this.widgets.issues = this.grid.set(3, 0, 3, 6, blessed.list, {
      label: '🔧 Active Issues',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'yellow'
        },
        selected: {
          bg: 'blue'
        }
      },
      mouse: true,
      keys: true,
      vi: true
    });

    // Recent Fixes
    this.widgets.fixes = this.grid.set(3, 6, 3, 6, blessed.list, {
      label: '✅ Recent Fixes',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'green'
        }
      }
    });

    // Server Status
    this.widgets.servers = this.grid.set(6, 0, 2, 4, blessed.table, {
      label: '🌐 Server Status',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        header: {
          fg: 'blue',
          bold: true
        },
        border: {
          fg: 'cyan'
        }
      },
      columnSpacing: 3,
      columnWidth: [15, 8, 10]
    });

    // File Watcher Status
    this.widgets.watchers = this.grid.set(6, 4, 2, 4, blessed.box, {
      label: '👀 File Watchers',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'magenta'
        }
      }
    });

    // Demo Status
    this.widgets.demos = self.grid.set(6, 8, 2, 4, blessed.box, {
      label: '🎮 Demo Status',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'cyan'
        }
      }
    });

    // Log Output
    this.widgets.log = this.grid.set(8, 0, 4, 12, blessed.log, {
      label: '📝 Activity Log',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'white'
        }
      },
      scrollable: true,
      alwaysScroll: true,
      mouse: true
    });

    // Quick Actions
    this.createQuickActions();
  }

  createQuickActions() {
    const actions = [
      { key: 'c', label: 'Clean', action: () => this.runAction('clean') },
      { key: 'b', label: 'Build', action: () => this.runAction('build') },
      { key: 'f', label: 'Fix Issues', action: () => this.runAction('fix') },
      { key: 'r', label: 'Restart', action: () => this.runAction('restart') },
      { key: 'd', label: 'Deploy', action: () => this.runAction('deploy') }
    ];

    actions.forEach((action, i) => {
      this.screen.key(action.key, action.action);
    });

    // Show action hints at bottom
    const hint = actions.map(a => `[${a.key}] ${a.label}`).join('  ');
    this.screen.append(blessed.text({
      bottom: 0,
      left: 'center',
      content: hint,
      style: {
        fg: 'white',
        bg: 'black'
      }
    }));
  }

  async updateDashboard() {
    try {
      // Run health checks
      await this.selfHealing.runHealthChecks();

      // Update system status
      this.updateSystemStatus();

      // Update memory graph
      this.updateMemoryGraph();

      // Update build performance
      this.updateBuildPerformance();

      // Update issues list
      this.updateIssuesList();

      // Update server status
      this.updateServerStatus();

      // Update demo status
      this.updateDemoStatus();

      // Update file watchers
      this.updateWatcherStatus();

      // Render changes
      this.screen.render();
    } catch (error) {
      this.log(`Error updating dashboard: ${error.message}`, 'error');
    }
  }

  updateSystemStatus() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    const uptimeStr = this.formatUptime(uptime);

    const status = [
      `{bold}Health:{/bold} ${this.getHealthStatus()}`,
      `{bold}Uptime:{/bold} ${uptimeStr}`,
      `{bold}Memory:{/bold} ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      `{bold}Node:{/bold} ${process.version}`,
      `{bold}Errors:{/bold} {red-fg}${this.metrics.errorCount}{/red-fg}`,
      `{bold}Warnings:{/bold} {yellow-fg}${this.metrics.warningCount}{/yellow-fg}`
    ];

    this.widgets.status.setContent(status.join('\n'));
  }

  updateMemoryGraph() {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);

    this.metrics.memory.push(heapUsedMB);
    if (this.metrics.memory.length > 50) {
      this.metrics.memory.shift();
    }

    const data = {
      title: 'Heap',
      x: Array.from({ length: this.metrics.memory.length }, (_, i) => i.toString()),
      y: this.metrics.memory,
      style: {
        line: heapUsedMB > 800 ? 'red' : heapUsedMB > 500 ? 'yellow' : 'green'
      }
    };

    this.widgets.memory.setData([data]);
  }

  updateBuildPerformance() {
    // Get recent build times from cache
    const cachePath = path.join(process.cwd(), '.build-cache/state.json');
    let buildTimes = {};

    if (fs.existsSync(cachePath)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        buildTimes = cache.buildTimes || {};
      } catch (error) {
        // Ignore
      }
    }

    const data = Object.entries(buildTimes)
      .slice(-5)
      .map(([name, time]) => ({
        name: name.substring(0, 10),
        value: Math.round(time / 1000)
      }));

    if (data.length > 0) {
      this.widgets.buildPerf.setData({
        titles: data.map(d => d.name),
        data: data.map(d => d.value)
      });
    }
  }

  updateIssuesList() {
    const issues = this.selfHealing.issuesDetected.map((issue, i) => {
      const icon = issue.autoFix ? '🔧' : '⚠️';
      const color = issue.autoFix ? '{yellow-fg}' : '{red-fg}';
      return `${icon} ${color}${issue.message}{/}`;
    });

    if (issues.length === 0) {
      issues.push('{green-fg}✅ No issues detected{/}');
    }

    this.widgets.issues.setItems(issues);
  }

  updateServerStatus() {
    const servers = [];

    // Check Hexo server
    try {
      execSync('lsof -i :4000', { stdio: 'pipe' });
      servers.push(['Hexo Server', '✅', 'Port 4000']);
    } catch (error) {
      servers.push(['Hexo Server', '❌', 'Stopped']);
    }

    // Check demo servers
    const demoConfig = this.getDemoConfig();
    Object.entries(demoConfig).forEach(([name, config]) => {
      if (config.devPort) {
        try {
          execSync(`lsof -i :${config.devPort}`, { stdio: 'pipe' });
          servers.push([name, '✅', `Port ${config.devPort}`]);
        } catch (error) {
          // Not running
        }
      }
    });

    this.widgets.servers.setData({
      headers: ['Service', 'Status', 'Port'],
      data: servers.length > 0 ? servers : [['No servers', '-', '-']]
    });
  }

  updateDemoStatus() {
    const demos = this.getDemos();
    const builtDemos = demos.filter(d => 
      fs.existsSync(path.join(process.cwd(), 'themes/san-diego/source/demos', d.name))
    );

    const status = [
      `{bold}Total Demos:{/bold} ${demos.length}`,
      `{bold}Built:{/bold} {green-fg}${builtDemos.length}{/}`,
      `{bold}Missing:{/bold} {yellow-fg}${demos.length - builtDemos.length}{/}`,
      '',
      `{bold}Last Build:{/bold} ${this.getLastBuildTime()}`
    ];

    this.widgets.demos.setContent(status.join('\n'));
  }

  updateWatcherStatus() {
    const watchPaths = [
      { path: 'source/**/*.md', label: 'Content' },
      { path: 'themes/**/*.ejs', label: 'Templates' },
      { path: 'demos/*/src/**', label: 'Demos' },
      { path: '**/*.scss', label: 'Styles' }
    ];

    const status = watchPaths.map(w => 
      `{green-fg}✓{/} Watching ${w.label}`
    ).join('\n');

    this.widgets.watchers.setContent(status);
  }

  async runAction(action) {
    this.log(`Running action: ${action}`, 'info');

    try {
      switch (action) {
        case 'clean':
          execSync('npx hexo clean', { stdio: 'inherit' });
          this.log('✅ Clean completed', 'success');
          break;

        case 'build':
          execSync('npm run build', { stdio: 'inherit' });
          this.log('✅ Build completed', 'success');
          break;

        case 'fix':
          await this.selfHealing.applyFixes();
          this.log('✅ Fixes applied', 'success');
          break;

        case 'restart':
          this.log('Restarting services...', 'info');
          execSync('npm run dev', { stdio: 'inherit' });
          break;

        case 'deploy':
          execSync('npm run deploy', { stdio: 'inherit' });
          this.log('✅ Deploy completed', 'success');
          break;
      }
    } catch (error) {
      this.log(`Action failed: ${error.message}`, 'error');
    }

    // Refresh dashboard
    await this.updateDashboard();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const typeColors = {
      info: '{white-fg}',
      success: '{green-fg}',
      warning: '{yellow-fg}',
      error: '{red-fg}'
    };

    const color = typeColors[type] || typeColors.info;
    const line = `[${timestamp}] ${color}${message}{/}`;

    this.widgets.log.log(line);

    // Update counters
    if (type === 'error') this.metrics.errorCount++;
    if (type === 'warning') this.metrics.warningCount++;
  }

  getHealthStatus() {
    const issues = this.selfHealing.issuesDetected.length;
    if (issues === 0) return '{green-fg}Healthy{/}';
    if (issues <= 2) return '{yellow-fg}Minor Issues{/}';
    return '{red-fg}Needs Attention{/}';
  }

  formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  getDemoConfig() {
    try {
      return require(path.join(process.cwd(), 'demos/demo-config.json'));
    } catch (error) {
      return {};
    }
  }

  getDemos() {
    const demosPath = path.join(process.cwd(), 'demos');
    if (!fs.existsSync(demosPath)) return [];

    return fs.readdirSync(demosPath)
      .filter(f => f.endsWith('-demo'))
      .map(name => ({ name }));
  }

  getLastBuildTime() {
    const buildPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(buildPath)) return 'Never';

    const stats = fs.statSync(buildPath);
    const time = new Date(stats.mtime);
    const now = new Date();
    const diff = now - time;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  }

  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const dashboard = new HealthDashboard();
  dashboard.start().catch(error => {
    console.error('Dashboard failed:', error);
    process.exit(1);
  });
    */
  }
}

module.exports = HealthDashboard;