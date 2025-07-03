const ora = require('ora');

const cliProgress = require('cli-progress');
const chalk = require('chalk');
const boxen = require('boxen');

class CLIUXManager {
  constructor() {
    this.spinners = new Map();
    this.progressBars = new Map();
    this.demoStatuses = new Map();
  }

  // Create a spinner with a unique ID
  createSpinner(id, text) {
    const spinner = ora({
      text,
      spinner: 'dots',
      color: 'cyan'
    });
    this.spinners.set(id, spinner);
    return spinner;
  }

  // Update spinner text
  updateSpinner(id, text, color = 'cyan') {
    const spinner = this.spinners.get(id);
    if (spinner) {
      spinner.color = color;
      spinner.text = text;
    }
  }

  // Success spinner
  succeedSpinner(id, text) {
    const spinner = this.spinners.get(id);
    if (spinner) {
      spinner.succeed(chalk.green(text));
      this.spinners.delete(id);
    }
  }

  // Fail spinner
  failSpinner(id, text) {
    const spinner = this.spinners.get(id);
    if (spinner) {
      spinner.fail(chalk.red(text));
      this.spinners.delete(id);
    }
  }

  // Create progress bar
  createProgressBar(id, total, title = '') {
    const bar = new cliProgress.SingleBar({
      format: `${title} |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} | ETA: {eta}s`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    }, cliProgress.Presets.shades_classic);
    
    bar.start(total, 0);
    this.progressBars.set(id, { bar, total });
    return bar;
  }

  // Update progress bar
  updateProgress(id, current) {
    const progress = this.progressBars.get(id);
    if (progress) {
      progress.bar.update(current);
    }
  }

  // Complete progress bar
  completeProgress(id) {
    const progress = this.progressBars.get(id);
    if (progress) {
      progress.bar.stop();
      this.progressBars.delete(id);
    }
  }

  // Show status dashboard
  showDashboard(demos) {
    console.clear();
    
    const status = demos.map(demo => {
      const status = this.demoStatuses.get(demo.name) || { status: 'pending', message: 'Waiting...' };
      const icon = status.status === 'building' ? '🔄' : 
                   status.status === 'complete' ? '✅' : 
                   status.status === 'error' ? '❌' : '⏳';
      
      return `${icon} ${demo.name.padEnd(30)} ${status.message}`;
    }).join('\n');

    const box = boxen(status, {
      title: '📊 Demo Build Status',
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    });

    console.log(box);
  }

  // Update demo status
  updateDemoStatus(demoName, status, message) {
    this.demoStatuses.set(demoName, { status, message });
  }

  // Show change detection info
  showChangeDetection(type, details) {
    const icons = {
      'source': '📝',
      'dist': '📦',
      'external': '🌐',
      'content': '📄'
    };

    const colors = {
      'source': 'yellow',
      'dist': 'magenta',
      'external': 'blue',
      'content': 'green'
    };

    const icon = icons[type] || '🔍';
    const color = colors[type] || 'white';

    console.log(chalk[color](`\n${icon} Change detected: ${type}`));
    console.log(chalk.gray(`   Path: ${details.path}`));
    console.log(chalk.gray(`   Time: ${new Date().toLocaleTimeString()}`));
    
    if (details.size) {
      console.log(chalk.gray(`   Size: ${(details.size / 1024).toFixed(2)} KB`));
    }
    
    if (details.hash) {
      console.log(chalk.gray(`   Hash: ${details.hash.substring(0, 8)}...`));
    }
  }

  // Show build pipeline status
  showPipelineStatus(steps) {
    const pipeline = steps.map((step, index) => {
      const icon = step.status === 'active' ? '▶' :
                   step.status === 'complete' ? '✓' :
                   step.status === 'error' ? '✗' : '○';
      
      const color = step.status === 'active' ? 'yellow' :
                    step.status === 'complete' ? 'green' :
                    step.status === 'error' ? 'red' : 'gray';
      
      return chalk[color](`${icon} ${step.name}`);
    }).join(' → ');

    console.log(`\n${chalk.bold('Pipeline:')} ${pipeline}\n`);
  }

  // Show action summary
  showActionSummary(action, details) {
    const timestamp = new Date().toLocaleTimeString();
    const message = `[${chalk.gray(timestamp)}] ${chalk.bold(action)}: ${details}`;
    console.log(message);
  }

  // Clear all active spinners and progress bars
  cleanup() {
    this.spinners.forEach(spinner => spinner.stop());
    this.progressBars.forEach(({ bar }) => bar.stop());
    this.spinners.clear();
    this.progressBars.clear();
  }
}

module.exports = CLIUXManager;