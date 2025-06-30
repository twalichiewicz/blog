#!/usr/bin/env node

const SelfHealingManager = require('./self-healing-manager');
const Table = require('cli-table3');
let chalk, ora;

try {
  chalk = require('chalk');
} catch (error) {
  chalk = {
    blue: { bold: (str) => str },
    green: { bold: (str) => str },
    yellow: { bold: (str) => str },
    red: { bold: (str) => str },
    cyan: (str) => str,
    gray: (str) => str,
    bold: (str) => str
  };
  Object.keys(chalk).forEach(key => {
    if (typeof chalk[key] !== 'function') {
      chalk[key] = chalk[key] || ((str) => str);
      chalk[key].bold = chalk[key].bold || ((str) => str);
    }
  });
}

try {
  ora = require('ora');
} catch (error) {
  // Simple ora replacement
  ora = (text) => ({
    start: () => {
      console.log(text);
      return { stop: () => {}, fail: (msg) => console.log('Error: ' + msg) };
    }
  });
}

// Ensure this runs as the main command
if (require.main === module) {
  const command = process.argv[2];
  const selfHealing = new SelfHealingManager();

  async function runCommand() {
    switch (command) {
      case '--check':
      case 'check':
        await checkHealth();
        break;
      
      case '--fix':
      case 'fix':
        await fixIssues();
        break;
      
      case '--report':
      case 'report':
        await generateReport();
        break;
      
      case '--monitor':
      case 'monitor':
        await monitorContinuously();
        break;
      
      default:
        showHelp();
    }
  }

  async function checkHealth() {
    console.log(chalk.blue.bold('\n🏥 Thomas.design Health Check\n'));
    
    const spinner = ora('Running health checks...').start();
    
    try {
      const isHealthy = await selfHealing.runHealthChecks();
      spinner.stop();
      
      if (isHealthy) {
        console.log(chalk.green.bold('✅ All systems healthy!\n'));
      } else {
        console.log(chalk.yellow.bold(`⚠️  Found ${selfHealing.issuesDetected.length} issues:\n`));
        
        // Display issues in a table
        const table = new Table({
          head: ['Type', 'Issue', 'Auto-Fix Available'],
          colWidths: [20, 50, 20],
          style: {
            head: ['cyan']
          }
        });
        
        selfHealing.issuesDetected.forEach(issue => {
          table.push([
            issue.type,
            issue.message,
            issue.autoFix ? chalk.green('Yes') : chalk.red('No')
          ]);
        });
        
        console.log(table.toString());
        console.log('\nRun ' + chalk.cyan('npm run fix') + ' to apply automatic fixes\n');
      }
    } catch (error) {
      spinner.fail('Health check failed');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  async function fixIssues() {
    console.log(chalk.blue.bold('\n🔧 Thomas.design Auto-Fix\n'));
    
    const checkSpinner = ora('Running health checks...').start();
    const isHealthy = await selfHealing.runHealthChecks();
    checkSpinner.stop();
    
    if (isHealthy) {
      console.log(chalk.green('✅ No issues found - system is healthy!\n'));
      return;
    }
    
    console.log(chalk.yellow(`Found ${selfHealing.issuesDetected.length} issues\n`));
    
    const fixSpinner = ora('Applying fixes...').start();
    const fixedAny = await selfHealing.applyFixes();
    fixSpinner.stop();
    
    if (fixedAny) {
      console.log(chalk.green(`\n✅ Applied ${selfHealing.fixesApplied.length} fixes successfully!\n`));
      
      // Show what was fixed
      const table = new Table({
        head: ['Fixed Issue', 'Action Taken'],
        colWidths: [40, 40],
        style: {
          head: ['green']
        }
      });
      
      selfHealing.fixesApplied.forEach(fix => {
        table.push([fix.message, getFixDescription(fix.type)]);
      });
      
      console.log(table.toString());
    }
    
    // Check for remaining issues
    const remainingIssues = selfHealing.issuesDetected.filter(i => !i.autoFix);
    if (remainingIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  ${remainingIssues.length} issues require manual intervention:\n`));
      
      remainingIssues.forEach((issue, i) => {
        console.log(chalk.yellow(`${i + 1}. ${issue.message}`));
      });
    }
    
    console.log();
  }

  async function generateReport() {
    console.log(chalk.blue.bold('\n📊 Generating Health Report\n'));
    
    const spinner = ora('Analyzing system...').start();
    await selfHealing.runHealthChecks();
    const report = selfHealing.generateHealthReport();
    spinner.stop();
    
    // Display report summary
    console.log(chalk.bold('System Status: ') + getStatusColor(report.systemStatus));
    console.log(chalk.bold('Issues Found: ') + report.issuesFound);
    console.log(chalk.bold('Report saved to: ') + chalk.cyan(`.health-reports/health-report-${new Date().toISOString().split('T')[0]}.json`));
    
    // Show issues breakdown
    if (report.issuesFound > 0) {
      console.log('\n' + chalk.bold('Issues Breakdown:'));
      
      const issueTypes = {};
      report.details.issues.forEach(issue => {
        issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
      });
      
      Object.entries(issueTypes).forEach(([type, count]) => {
        console.log(`  • ${type}: ${count}`);
      });
    }
    
    console.log();
  }

  async function monitorContinuously() {
    console.log(chalk.blue.bold('\n👀 Continuous Health Monitoring\n'));
    console.log(chalk.gray('Press Ctrl+C to stop\n'));
    
    let iteration = 0;
    
    const monitor = async () => {
      iteration++;
      const time = new Date().toLocaleTimeString();
      
      process.stdout.write(chalk.gray(`[${time}] Check #${iteration}: `));
      
      await selfHealing.runHealthChecks();
      
      if (selfHealing.issuesDetected.length === 0) {
        console.log(chalk.green('✅ Healthy'));
      } else {
        console.log(chalk.yellow(`⚠️  ${selfHealing.issuesDetected.length} issues`));
        
        // Auto-fix if possible
        const autoFixable = selfHealing.issuesDetected.filter(i => i.autoFix).length;
        if (autoFixable > 0) {
          process.stdout.write(chalk.blue(`  → Auto-fixing ${autoFixable} issues... `));
          await selfHealing.applyFixes();
          console.log(chalk.green('Done'));
        }
      }
    };
    
    // Initial check
    await monitor();
    
    // Continue monitoring
    setInterval(monitor, 30000); // Every 30 seconds
    
    // Keep process alive
    process.stdin.resume();
  }

  function showHelp() {
    console.log(chalk.blue.bold('\n🏥 Thomas.design Self-Healing System\n'));
    
    console.log('Usage: npm run <command>\n');
    
    console.log('Commands:');
    console.log('  ' + chalk.cyan('npm run doctor') + '    - Check system health');
    console.log('  ' + chalk.cyan('npm run fix') + '       - Apply automatic fixes');
    console.log('  ' + chalk.cyan('npm run health') + '    - Open health dashboard');
    
    console.log('\nAdvanced Commands:');
    console.log('  ' + chalk.gray('node build-system/self-healing-cli.js report') + '   - Generate health report');
    console.log('  ' + chalk.gray('node build-system/self-healing-cli.js monitor') + '  - Continuous monitoring');
    
    console.log('\nExamples:');
    console.log('  ' + chalk.gray('# Check for issues'));
    console.log('  ' + chalk.green('npm run doctor'));
    console.log();
    console.log('  ' + chalk.gray('# Fix issues automatically'));
    console.log('  ' + chalk.green('npm run fix'));
    console.log();
    console.log('  ' + chalk.gray('# Open interactive dashboard'));
    console.log('  ' + chalk.green('npm run health'));
    console.log();
  }

  function getFixDescription(type) {
    const descriptions = {
      'hexo-warehouse': 'Cleaned Hexo database',
      'port-blocked': 'Killed process on port 4000',
      'missing-demo-builds': 'Built all demos',
      'high-memory': 'Triggered garbage collection',
      'missing-dependencies': 'Installed dependencies',
      'stale-cache': 'Cleared build cache',
      'corrupted-cache': 'Rebuilt cache',
      'dark-mode-grid': 'Updated CSS styles'
    };
    
    return descriptions[type] || 'Applied fix';
  }

  function getStatusColor(status) {
    const colors = {
      'healthy': chalk.green('Healthy'),
      'issues-detected': chalk.yellow('Issues Detected'),
      'critical': chalk.red('Critical')
    };
    
    return colors[status] || status;
  }

  // Run the command
  runCommand().catch(error => {
    console.error(chalk.red('\nError: ' + error.message));
    process.exit(1);
  });
}

module.exports = SelfHealingManager;