/**
 * Lightweight safety checker for development mode
 * Provides real-time warnings about dangerous patterns
 */

const fs = require('fs');
const path = require('path');
const chalk = require('./chalk-wrapper');

class DevSafetyCheck {
  constructor() {
    // Subset of critical patterns to check in dev mode
    this.criticalPatterns = [
      {
        pattern: /history\.(replaceState|pushState)/g,
        message: 'history manipulation - may cause redirect loops',
        severity: 'high'
      },
      {
        pattern: /window\.location\s*=(?!=\s*=)/g,
        message: 'direct location assignment - may cause redirects',
        severity: 'high'
      },
      {
        pattern: /\bdebugger\b/g,
        message: 'debugger statement found',
        severity: 'medium'
      },
      {
        pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/g,
        message: 'potential infinite loop',
        severity: 'medium'
      }
    ];
  }

  /**
   * Check a single file for dangerous patterns
   * @param {string} filePath - Path to file to check
   * @returns {Array} Array of warnings
   */
  checkFile(filePath) {
    const warnings = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      for (const { pattern, message, severity } of this.criticalPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          warnings.push({
            file: relativePath,
            message: `${message} (found ${matches.length} instance${matches.length > 1 ? 's' : ''})`,
            severity,
            pattern: pattern.toString()
          });
        }
      }
    } catch (error) {
      // Ignore read errors in dev mode
    }
    
    return warnings;
  }

  /**
   * Format warnings for console output
   * @param {Array} warnings - Array of warning objects
   * @returns {Array} Formatted warning strings
   */
  formatWarnings(warnings) {
    return warnings.map(w => {
      const label = w.severity === 'high' ? '[HIGH]' : '[WARN]';
      const color = w.severity === 'high' ? chalk.red : chalk.yellow;
      return color(`${label} ${w.message}`);
    });
  }

  /**
   * Check if file should be scanned
   * @param {string} filePath - Path to check
   * @returns {boolean}
   */
  shouldCheckFile(filePath) {
    // Only check JS and EJS files
    const ext = path.extname(filePath).toLowerCase();
    return ['.js', '.ejs'].includes(ext) && 
           !filePath.includes('node_modules') &&
           !filePath.includes('.min.');
  }
}

module.exports = DevSafetyCheck;
