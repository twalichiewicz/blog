/**
 * WebSocket Server for Dev Debug Panel
 * Handles real-time communication with the browser debug panel
 */

const WebSocket = require('ws');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('./chalk-wrapper');

class DevWebSocketServer {
  constructor(devCommand) {
    this.devCommand = devCommand;
    this.wss = null;
    this.clients = new Set();
    this.port = 4001;
    this.currentProcess = null;
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log(chalk.blue(`Debug panel connected (${this.clients.size} clients)`));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          this.sendToClient(ws, {
            type: 'error',
            message: 'Invalid message format'
          });
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(chalk.gray(`Debug panel disconnected (${this.clients.size} clients)`));
      });

      ws.on('error', (error) => {
        console.error(chalk.red('WebSocket error:'), error.message);
      });

      // Send initial connection confirmation
      this.sendToClient(ws, {
        type: 'log',
        message: 'Connected to dev server',
        level: 'success'
      });
    });

    console.log(chalk.green(`WebSocket server listening on port ${this.port}`));
  }

  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'get-info':
        this.sendServerInfo(ws);
        break;

      case 'get-worktrees':
        this.sendWorktrees(ws);
        break;

      case 'command':
        this.executeCommand(ws, data.action);
        break;

      case 'switch-branch':
        this.switchBranch(ws, data.path);
        break;

      default:
        this.sendToClient(ws, {
          type: 'error',
          message: `Unknown message type: ${data.type}`
        });
    }
  }

  sendServerInfo(ws) {
    const info = {
      branch: this.getCurrentBranch(),
      port: 4000,
      memory: process.memoryUsage().heapUsed,
      uptime: process.uptime()
    };

    this.sendToClient(ws, {
      type: 'info',
      payload: info
    });
  }

  getCurrentBranch() {
    try {
      return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch (e) {
      return 'unknown';
    }
  }

  sendWorktrees(ws) {
    try {
      const output = execSync('git worktree list', { encoding: 'utf8' });
      const currentPath = process.cwd();
      
      const worktrees = output.trim().split('\n').map(line => {
        const [path, commit, branch] = line.split(/\s+/);
        const branchName = branch ? branch.replace(/[\[\]]/g, '') : 'detached';
        return {
          path,
          branch: branchName,
          current: path === currentPath
        };
      });

      this.sendToClient(ws, {
        type: 'worktrees',
        worktrees
      });
    } catch (error) {
      this.sendToClient(ws, {
        type: 'error',
        message: 'Failed to get worktrees'
      });
    }
  }

  async executeCommand(ws, action) {
    this.broadcast({
      type: 'log',
      message: `Executing command: ${action}`,
      level: 'info'
    });

    try {
      switch (action) {
        case 'rebuild':
          await this.rebuild(ws);
          break;

        case 'clean-rebuild':
          await this.cleanRebuild(ws);
          break;

        case 'restart-server':
          await this.restartServer(ws);
          break;

        case 'clear-cache':
          await this.clearCache(ws);
          break;

        case 'run-tests':
          await this.runTests(ws);
          break;

        case 'open-editor':
          await this.openEditor(ws);
          break;

        default:
          throw new Error(`Unknown command: ${action}`);
      }

      this.sendToClient(ws, {
        type: 'command-result',
        action,
        success: true
      });
    } catch (error) {
      this.sendToClient(ws, {
        type: 'command-result',
        action,
        success: false,
        error: error.message
      });

      this.broadcast({
        type: 'log',
        message: `Command failed: ${error.message}`,
        level: 'error'
      });
    }
  }

  async rebuild(ws) {
    this.broadcast({ type: 'log', message: 'Starting rebuild...', level: 'info' });
    
    return new Promise((resolve, reject) => {
      const rebuild = spawn('npx', ['hexo', 'generate'], {
        cwd: process.cwd()
      });

      rebuild.stdout.on('data', (data) => {
        this.broadcast({
          type: 'log',
          message: data.toString().trim(),
          level: 'info'
        });
      });

      rebuild.stderr.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg && !msg.includes('deprecated')) {
          this.broadcast({
            type: 'log',
            message: msg,
            level: 'warning'
          });
        }
      });

      rebuild.on('close', (code) => {
        if (code === 0) {
          this.broadcast({
            type: 'log',
            message: 'Rebuild completed successfully',
            level: 'success'
          });
          resolve();
        } else {
          reject(new Error(`Rebuild failed with code ${code}`));
        }
      });
    });
  }

  async cleanRebuild(ws) {
    this.broadcast({ type: 'log', message: 'Cleaning...', level: 'info' });
    
    await new Promise((resolve, reject) => {
      const clean = spawn('npx', ['hexo', 'clean'], {
        cwd: process.cwd()
      });

      clean.on('close', (code) => {
        if (code === 0) {
          this.broadcast({
            type: 'log',
            message: 'Clean completed',
            level: 'success'
          });
          resolve();
        } else {
          reject(new Error(`Clean failed with code ${code}`));
        }
      });
    });

    // Now rebuild
    await this.rebuild(ws);
  }

  async restartServer(ws) {
    this.broadcast({
      type: 'log',
      message: 'Restarting server...',
      level: 'info'
    });

    // Signal the dev command to restart
    if (this.devCommand && this.devCommand.restartServerWithCleanDB) {
      await this.devCommand.restartServerWithCleanDB();
      this.broadcast({
        type: 'log',
        message: 'Server restarted',
        level: 'success'
      });
    } else {
      throw new Error('Server restart not available');
    }
  }

  async clearCache(ws) {
    this.broadcast({
      type: 'log',
      message: 'Clearing cache...',
      level: 'info'
    });

    const dbFile = path.join(process.cwd(), 'db.json');
    const publicDir = path.join(process.cwd(), 'public');

    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
      this.broadcast({
        type: 'log',
        message: 'Database cache cleared',
        level: 'success'
      });
    }

    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
      this.broadcast({
        type: 'log',
        message: 'Public directory cleared',
        level: 'success'
      });
    }
  }

  async runTests(ws) {
    this.broadcast({
      type: 'log',
      message: 'Running tests...',
      level: 'info'
    });

    return new Promise((resolve, reject) => {
      const tests = spawn('npm', ['run', 'test'], {
        cwd: process.cwd()
      });

      tests.stdout.on('data', (data) => {
        this.broadcast({
          type: 'log',
          message: data.toString().trim(),
          level: 'info'
        });
      });

      tests.stderr.on('data', (data) => {
        this.broadcast({
          type: 'log',
          message: data.toString().trim(),
          level: 'warning'
        });
      });

      tests.on('close', (code) => {
        if (code === 0) {
          this.broadcast({
            type: 'log',
            message: 'Tests passed!',
            level: 'success'
          });
          resolve();
        } else {
          reject(new Error(`Tests failed with code ${code}`));
        }
      });
    });
  }

  async openEditor(ws) {
    try {
      // Try VS Code first
      execSync('code .', { cwd: process.cwd() });
      this.broadcast({
        type: 'log',
        message: 'Opened in VS Code',
        level: 'success'
      });
    } catch (e) {
      // Fallback to default editor
      try {
        execSync('open .', { cwd: process.cwd() });
        this.broadcast({
          type: 'log',
          message: 'Opened in default editor',
          level: 'success'
        });
      } catch (e2) {
        throw new Error('Could not open editor');
      }
    }
  }

  async switchBranch(ws, worktreePath) {
    this.broadcast({
      type: 'log',
      message: `Switching to worktree: ${worktreePath}`,
      level: 'info'
    });

    // This would need to coordinate with the main dev process
    // For now, just log the request
    this.broadcast({
      type: 'log',
      message: 'Branch switching requires manual restart for now',
      level: 'warning'
    });
  }

  sendToClient(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  broadcast(data) {
    const message = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  stop() {
    if (this.wss) {
      this.wss.close();
      console.log(chalk.gray('WebSocket server stopped'));
    }
  }
}

module.exports = DevWebSocketServer;