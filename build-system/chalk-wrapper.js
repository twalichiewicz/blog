/**
 * Chalk wrapper to handle ESM vs CommonJS compatibility
 */

let chalk;

try {
  const chalkModule = require('chalk');
  // Handle both ESM default export and CommonJS
  chalk = chalkModule.default || chalkModule;
  
  // Test if it works
  if (typeof chalk.blue !== 'function') {
    throw new Error('Chalk methods not found');
  }
} catch (error) {
  console.warn('Warning: Chalk not available or incompatible, using fallback colors');
  
  // Fallback implementation using ANSI codes
  const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    
    // Colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    grey: '\x1b[90m'
  };
  
  // Create a simple chalk-like API
  chalk = {};
  
  Object.keys(colors).forEach(color => {
    chalk[color] = (str) => `${colors[color]}${str}${colors.reset}`;
    
    // Support chaining like chalk.blue.bold
    chalk[color].bold = (str) => `${colors.bold}${colors[color]}${str}${colors.reset}`;
  });
  
  // Add bold as a top-level method too
  chalk.bold = (str) => `${colors.bold}${str}${colors.reset}`;
}

module.exports = chalk;