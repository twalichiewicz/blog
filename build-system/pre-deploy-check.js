#!/usr/bin/env node

/**
 * Pre-deployment Safety Check Script
 * Scans for potentially dangerous patterns before deployment
 * Updated: Using ANSI colors instead of chalk for Netlify compatibility
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Simple color functions to replace chalk
const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  bold: {
    red: (text) => `\x1b[1m\x1b[31m${text}\x1b[0m`,
    yellow: (text) => `\x1b[1m\x1b[33m${text}\x1b[0m`,
    green: (text) => `\x1b[1m\x1b[32m${text}\x1b[0m`,
    blue: (text) => `\x1b[1m\x1b[34m${text}\x1b[0m`,
  }
};

// Configuration
const config = {
  jsFilePattern: 'themes/san-diego/source/js/**/*.js',
  ejsFilePattern: 'themes/san-diego/layout/**/*.ejs',
  scssFilePattern: 'themes/san-diego/source/styles/**/*.scss',
  
  dangerousPatterns: [
    {
      name: 'history.replaceState',
      pattern: /history\.(replaceState|pushState)/g,
      severity: 'error',
      message: 'Found history manipulation that can cause redirect loops'
    },
    {
      name: 'window.location assignment',
      pattern: /window\.location\s*=(?!=\s*=)/g,
      severity: 'error',
      message: 'Direct location assignment can cause redirects'
    },
    {
      name: 'console.log',
      pattern: /console\.(log|debug|info)/g,
      severity: 'warning',
      message: 'Console logging should be removed for production'
    },
    {
      name: 'debugger statement',
      pattern: /\bdebugger\b/g,
      severity: 'error',
      message: 'Debugger statements must be removed'
    },
    {
      name: 'alert/confirm/prompt',
      pattern: /\b(alert|confirm|prompt)\s*\(/g,
      severity: 'error',
      message: 'Browser dialogs should not be used in production'
    },
    {
      name: 'TODO/FIXME comments',
      pattern: /\/\/\s*(TODO|FIXME|HACK|XXX|BUG)/gi,
      severity: 'warning',
      message: 'Unresolved TODO/FIXME comments found'
    },
    {
      name: 'localhost references',
      pattern: /localhost:\d+|127\.0\.0\.1/g,
      severity: 'error',
      message: 'Localhost references found - use relative URLs'
    },
    {
      name: 'infinite loops',
      pattern: /while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/g,
      severity: 'warning',
      message: 'Potential infinite loop detected'
    },
    {
      name: 'eval usage',
      pattern: /\beval\s*\(/g,
      severity: 'error',
      message: 'eval() is dangerous and should not be used'
    },
    {
      name: 'innerHTML usage',
      pattern: /\.innerHTML\s*=/g,
      severity: 'warning',
      message: 'innerHTML can be dangerous - consider using textContent or sanitization'
    }
  ],
  
  fileChecks: [
    {
      name: 'Large files',
      check: (filePath, content) => {
        const sizeInKB = Buffer.byteLength(content, 'utf8') / 1024;
        if (sizeInKB > 100) {
          return {
            severity: 'warning',
            message: `File is ${sizeInKB.toFixed(2)}KB - consider minification`
          };
        }
        return null;
      }
    },
    {
      name: 'Unminified code',
      check: (filePath, content) => {
        if (filePath.endsWith('.js') && !filePath.includes('.min.') && content.includes('    ')) {
          return {
            severity: 'info',
            message: 'File appears to be unminified'
          };
        }
        return null;
      }
    }
  ]
};

// Results tracking
const results = {
  errors: [],
  warnings: [],
  info: []
};

// Check a single file
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check for dangerous patterns
  config.dangerousPatterns.forEach(({ name, pattern, severity, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      const lines = content.split('\n');
      matches.forEach(match => {
        const lineNumber = lines.findIndex(line => line.includes(match)) + 1;
        const result = {
          file: relativePath,
          line: lineNumber,
          pattern: name,
          message,
          match: match.trim()
        };
        
        if (severity === 'error') {
          results.errors.push(result);
        } else if (severity === 'warning') {
          results.warnings.push(result);
        } else {
          results.info.push(result);
        }
      });
    }
  });
  
  // Run file-level checks
  config.fileChecks.forEach(({ name, check }) => {
    const result = check(filePath, content);
    if (result) {
      const fileResult = {
        file: relativePath,
        pattern: name,
        message: result.message
      };
      
      if (result.severity === 'error') {
        results.errors.push(fileResult);
      } else if (result.severity === 'warning') {
        results.warnings.push(fileResult);
      } else {
        results.info.push(fileResult);
      }
    }
  });
}

// Main execution
function main() {
  console.log('Pre-deploy check v2.0 - Using ANSI colors');
  console.log(colors.blue('\n🔍 Running pre-deployment safety checks...\n'));
  
  // Get all files to check
  const jsFiles = glob.sync(config.jsFilePattern);
  const ejsFiles = glob.sync(config.ejsFilePattern);
  const scssFiles = glob.sync(config.scssFilePattern);
  
  const allFiles = [...jsFiles, ...ejsFiles, ...scssFiles];
  
  console.log(colors.gray(`Checking ${allFiles.length} files...\n`));
  
  // Check each file
  allFiles.forEach(checkFile);
  
  // Display results
  if (results.errors.length > 0) {
    console.log(colors.bold.red(`\n❌ ERRORS (${results.errors.length}):`));
    results.errors.forEach(({ file, line, pattern, message, match }) => {
      console.log(colors.red(`  ${file}${line ? `:${line}` : ''}`));
      console.log(colors.red(`    ${pattern}: ${message}`));
      if (match) {
        console.log(colors.gray(`    Found: "${match}"`));
      }
    });
  }
  
  if (results.warnings.length > 0) {
    console.log(colors.bold.yellow(`\n⚠️  WARNINGS (${results.warnings.length}):`));
    results.warnings.forEach(({ file, line, pattern, message, match }) => {
      console.log(colors.yellow(`  ${file}${line ? `:${line}` : ''}`));
      console.log(colors.yellow(`    ${pattern}: ${message}`));
      if (match) {
        console.log(colors.gray(`    Found: "${match}"`));
      }
    });
  }
  
  if (results.info.length > 0 && process.env.VERBOSE) {
    console.log(colors.bold.blue(`\nℹ️  INFO (${results.info.length}):`));
    results.info.forEach(({ file, pattern, message }) => {
      console.log(colors.blue(`  ${file}`));
      console.log(colors.blue(`    ${pattern}: ${message}`));
    });
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`  Errors: ${results.errors.length}`);
  console.log(`  Warnings: ${results.warnings.length}`);
  console.log(`  Info: ${results.info.length}`);
  
  // Exit with error if errors found
  if (results.errors.length > 0) {
    console.log(colors.bold.red('\n❌ Deployment blocked due to errors. Please fix them before deploying.\n'));
    process.exit(1);
  } else if (results.warnings.length > 0) {
    console.log(colors.bold.yellow('\n⚠️  Warnings found. Consider fixing them before deployment.\n'));
    console.log(colors.gray('Run with --force to deploy anyway.\n'));
    if (!process.argv.includes('--force')) {
      process.exit(1);
    }
  } else {
    console.log(colors.bold.green('\n✅ All checks passed! Safe to deploy.\n'));
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkFile, config };