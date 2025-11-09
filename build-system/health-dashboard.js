#!/usr/bin/env node

const SelfHealingManager = require('./self-healing-manager');
const chalk = require('chalk');

class HealthDashboard {
  constructor() {
    this.selfHealing = new SelfHealingManager();
  }

  async start() {
    console.log(chalk.blue.bold('\nHealth Dashboard\n'));
    console.log(chalk.gray('Interactive dashboard is disabled; running headless health checks instead.'));

    const isHealthy = await this.selfHealing.runHealthChecks();

    if (isHealthy) {
      console.log(chalk.green('\nSystem is healthy.\n'));
      process.exit(0);
    }

    console.log(chalk.yellow(`\n${this.selfHealing.issuesDetected.length} issue(s) detected:`));
    this.selfHealing.issuesDetected.forEach((issue, index) => {
      const prefix = `${index + 1}.`;
      console.log(chalk.yellow(`  ${prefix} ${issue.message}`));
    });

    if (this.selfHealing.issuesDetected.some(issue => issue.autoFix)) {
      console.log(chalk.gray('\nRun "npm run fix" to attempt automatic repairs.'));
    }

    console.log();
    process.exit(1);
  }
}

if (require.main === module) {
  new HealthDashboard().start().catch(error => {
    console.error('Dashboard failed:', error);
    process.exit(1);
  });
}

module.exports = HealthDashboard;
