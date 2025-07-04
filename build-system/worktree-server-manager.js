#!/usr/bin/env node

/**
 * Worktree Server Manager
 * 
 * Manages multiple development servers for git worktrees
 * - Auto-detects all worktrees
 * - Assigns unique ports (4000, 4001, 4002...)
 * - Shows branch names in output
 * - Can switch branches or run multiple servers
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('./chalk-wrapper');
const readline = require('readline');

class WorktreeServerManager {
  constructor() {
    this.servers = new Map();
    this.basePort = 4000;
    this.currentWorktree = process.cwd();
  }

  /**
   * Get all git worktrees
   */
  getWorktrees() {
    try {
      const output = execSync('git worktree list', { encoding: 'utf8' });
      const worktrees = output.trim().split('\n').map(line => {
        const [path, commit, branch] = line.split(/\s+/);
        const branchName = branch ? branch.replace(/[\[\]]/g, '') : 'detached';
        return { path, branchName, commit };
      });
      return worktrees;
    } catch (e) {
      console.error(chalk.red('Failed to get worktrees. Are you in a git repository?'));
      return [];
    }
  }

  /**
   * Get the branch name for a specific worktree path
   */
  getBranchForPath(worktreePath) {
    try {
      const output = execSync('git branch --show-current', { 
        cwd: worktreePath, 
        encoding: 'utf8' 
      }).trim();
      return output || 'detached';
    } catch (e) {
      return 'unknown';
    }
  }

  /**
   * Check if a port is available
   */
  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = require('net').createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }

  /**
   * Find next available port starting from base
   */
  async findAvailablePort(startPort) {
    let port = startPort;
    while (!(await this.isPortAvailable(port))) {
      port++;
    }
    return port;
  }

  /**
   * Start a server for a specific worktree
   */
  async startServerForWorktree(worktree, port) {
    const { path: worktreePath, branchName } = worktree;
    
    console.log(chalk.cyan(`\n🚀 Starting server for [${branchName}] on port ${port}...`));
    
    // Check if worktree has the necessary files
    if (!fs.existsSync(path.join(worktreePath, 'package.json'))) {
      console.log(chalk.yellow(`⚠️  Skipping ${branchName} - no package.json found`));
      return false;
    }

    // First, build demos for this worktree
    console.log(chalk.gray(`Building demos for ${branchName}...`));
    try {
      execSync('npm run build:demos', { 
        cwd: worktreePath, 
        stdio: 'pipe' 
      });
    } catch (e) {
      console.log(chalk.yellow(`⚠️  Demo build failed for ${branchName}, continuing anyway`));
    }

    // Create custom config for this port
    // Sanitize branch name for use as filename (replace / with -)
    const sanitizedBranchName = branchName.replace(/\//g, '-');
    const configContent = `
# Dev config for ${branchName}
server:
  port: ${port}
`;
    const configPath = path.join(worktreePath, `_config.${sanitizedBranchName}.yml`);
    fs.writeFileSync(configPath, configContent);

    // Start the server
    const serverProcess = spawn('npx', [
      'hexo', 'server', 
      '--config', `_config.yml,${path.basename(configPath)}`
    ], {
      cwd: worktreePath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Handle output
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Hexo is running')) {
        console.log(chalk.green(`✅ [${branchName}] Server running at http://localhost:${port}`));
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString().trim();
      if (error && !error.includes('deprecated')) {
        console.log(chalk.yellow(`[${branchName}] ${error}`));
      }
    });

    serverProcess.on('close', (code) => {
      console.log(chalk.gray(`[${branchName}] Server stopped (code ${code})`));
      this.servers.delete(worktreePath);
      // Clean up config file
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
    });

    this.servers.set(worktreePath, {
      process: serverProcess,
      port,
      branchName,
      configPath
    });

    return true;
  }

  /**
   * Start servers for all worktrees
   */
  async startAllServers() {
    const worktrees = this.getWorktrees();
    
    if (worktrees.length === 0) {
      console.log(chalk.red('No worktrees found'));
      return;
    }

    console.log(chalk.blue(`\n📁 Found ${worktrees.length} worktree(s):`));
    worktrees.forEach((wt, i) => {
      console.log(`   ${i + 1}. ${wt.branchName} - ${wt.path}`);
    });

    let currentPort = this.basePort;
    
    for (const worktree of worktrees) {
      const port = await this.findAvailablePort(currentPort);
      await this.startServerForWorktree(worktree, port);
      currentPort = port + 1;
    }

    console.log(chalk.green(`\n✨ All servers started!`));
    console.log(chalk.gray('Press Ctrl+C to stop all servers\n'));
  }

  /**
   * Interactive mode - switch between worktrees
   */
  async interactiveMode() {
    const worktrees = this.getWorktrees();
    
    if (worktrees.length === 0) {
      console.log(chalk.red('No worktrees found'));
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(chalk.blue('\n🔄 Worktree Server Switcher\n'));
    
    const showMenu = () => {
      console.log(chalk.cyan('Available worktrees:'));
      worktrees.forEach((wt, i) => {
        const current = wt.path === this.currentWorktree ? ' (current)' : '';
        console.log(`   ${i + 1}. ${wt.branchName}${current} - ${wt.path}`);
      });
      console.log(`   q. Quit`);
      console.log('');
    };

    const switchToWorktree = async (worktree) => {
      // Stop current server
      if (this.servers.size > 0) {
        console.log(chalk.yellow('Stopping current server...'));
        for (const [path, server] of this.servers) {
          server.process.kill();
          if (fs.existsSync(server.configPath)) {
            fs.unlinkSync(server.configPath);
          }
        }
        this.servers.clear();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Start new server
      const port = await this.findAvailablePort(this.basePort);
      await this.startServerForWorktree(worktree, port);
      this.currentWorktree = worktree.path;
    };

    showMenu();

    rl.on('line', async (input) => {
      const choice = input.trim().toLowerCase();
      
      if (choice === 'q') {
        console.log(chalk.gray('\nShutting down...'));
        this.cleanup();
        rl.close();
        process.exit(0);
      }

      const index = parseInt(choice) - 1;
      if (index >= 0 && index < worktrees.length) {
        await switchToWorktree(worktrees[index]);
        console.log('');
        showMenu();
      } else {
        console.log(chalk.red('Invalid choice\n'));
        showMenu();
      }
    });

    rl.prompt();
  }

  /**
   * Clean up all servers
   */
  cleanup() {
    for (const [path, server] of this.servers) {
      server.process.kill();
      if (fs.existsSync(server.configPath)) {
        fs.unlinkSync(server.configPath);
      }
    }
    this.servers.clear();
  }

  /**
   * Main entry point
   */
  async run() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'all';

    // Handle signals
    process.on('SIGINT', () => {
      console.log(chalk.gray('\n\nShutting down all servers...'));
      this.cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      this.cleanup();
      process.exit(0);
    });

    switch (mode) {
      case 'all':
        await this.startAllServers();
        break;
      
      case 'switch':
      case 'interactive':
        await this.interactiveMode();
        break;
      
      case 'current':
        // Just start server for current worktree
        const currentBranch = this.getBranchForPath(this.currentWorktree);
        const port = await this.findAvailablePort(this.basePort);
        await this.startServerForWorktree({
          path: this.currentWorktree,
          branchName: currentBranch
        }, port);
        break;
      
      case '--help':
      case '-h':
        this.showHelp();
        break;
      
      default:
        console.log(chalk.red(`Unknown mode: ${mode}`));
        this.showHelp();
        process.exit(1);
    }

    // Keep process alive
    if (mode !== '--help' && mode !== '-h') {
      process.stdin.resume();
    }
  }

  showHelp() {
    console.log(`
${chalk.blue('Worktree Server Manager')}

${chalk.cyan('Usage:')} node worktree-server-manager.js [mode]

${chalk.cyan('Modes:')}
  all         Start servers for all worktrees on different ports (default)
  switch      Interactive mode - switch between worktrees on port 4000
  current     Start server only for current worktree
  --help      Show this help

${chalk.cyan('Examples:')}
  npm run dev:worktrees        # Start all worktree servers
  npm run dev:switch           # Switch between worktrees interactively
  
${chalk.cyan('Port Allocation:')}
  Servers start at port 4000 and increment for each worktree.
  The manager will find the next available port if one is in use.
`);
  }
}

// Run if called directly
if (require.main === module) {
  const manager = new WorktreeServerManager();
  manager.run();
}

module.exports = WorktreeServerManager;