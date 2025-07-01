#!/usr/bin/env node

/**
 * Test runner with Claude auto-fix integration
 * Run tests and automatically fix failures using Claude
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Configuration for different test types
 */
const TEST_CONFIGS = {
  'demo-standards': {
    command: 'node',
    args: ['demos/build-scripts/auto-fix-with-claude.js'],
    name: 'Demo Standards Validation',
    autoFixEnabled: true
  },
  'build': {
    command: 'npm',
    args: ['run', 'build:demos'],
    name: 'Demo Build Test',
    autoFixEnabled: false // Build errors are more complex
  },
  'lint': {
    command: 'npm',
    args: ['run', 'lint:scss'],
    name: 'SCSS Linting',
    autoFixEnabled: false // Use lint:scss:fix instead
  },
  'hexo': {
    command: 'npm',
    args: ['run', 'build'],
    name: 'Hexo Build Test',
    autoFixEnabled: false
  }
};

/**
 * Run a single test
 */
function runTest(testType) {
  return new Promise((resolve, reject) => {
    const config = TEST_CONFIGS[testType];
    if (!config) {
      reject(new Error(`Unknown test type: ${testType}`));
      return;
    }

    console.log(`\n${colors.blue}${colors.bright}Running ${config.name}...${colors.reset}`);
    
    const proc = spawn(config.command, config.args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        CLAUDE_AUTO_FIX: config.autoFixEnabled ? 'true' : 'false'
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}✅ ${config.name} passed${colors.reset}`);
        resolve();
      } else {
        console.log(`${colors.red}❌ ${config.name} failed with code ${code}${colors.reset}`);
        reject(new Error(`${config.name} failed`));
      }
    });

    proc.on('error', (err) => {
      console.error(`${colors.red}Error running ${config.name}: ${err.message}${colors.reset}`);
      reject(err);
    });
  });
}

/**
 * Run all tests
 */
async function runAllTests(testsToRun = Object.keys(TEST_CONFIGS)) {
  console.log(`${colors.bright}${colors.magenta}🧪 Running Test Suite with Claude Auto-Fix${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  const hasApiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!hasApiKey) {
    console.log(`${colors.yellow}⚠️  No Claude API key found. Auto-fix will be disabled.${colors.reset}`);
    console.log(`${colors.yellow}   Set CLAUDE_API_KEY or ANTHROPIC_API_KEY to enable auto-fixing.${colors.reset}\n`);
  }

  const results = {
    passed: [],
    failed: []
  };

  for (const testType of testsToRun) {
    try {
      await runTest(testType);
      results.passed.push(testType);
    } catch (error) {
      results.failed.push(testType);
      
      // Continue with other tests even if one fails
      if (testsToRun.length > 1) {
        console.log(`${colors.yellow}Continuing with remaining tests...${colors.reset}`);
      }
    }
  }

  // Summary
  console.log(`\n${colors.bright}${colors.cyan}📊 Test Summary${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  if (results.passed.length > 0) {
    console.log(`${colors.green}✅ Passed (${results.passed.length}):${colors.reset}`);
    results.passed.forEach(test => {
      console.log(`   - ${TEST_CONFIGS[test].name}`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log(`${colors.red}❌ Failed (${results.failed.length}):${colors.reset}`);
    results.failed.forEach(test => {
      console.log(`   - ${TEST_CONFIGS[test].name}`);
    });
  }

  const allPassed = results.failed.length === 0;
  
  if (allPassed) {
    console.log(`\n${colors.green}${colors.bright}🎉 All tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}❌ Some tests failed.${colors.reset}`);
    
    if (hasApiKey) {
      console.log(`${colors.yellow}Claude attempted to fix issues where possible.${colors.reset}`);
      console.log(`${colors.yellow}Review the changes and run tests again.${colors.reset}`);
    }
  }

  return allPassed ? 0 : 1;
}

/**
 * CLI interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  let testsToRun = [];
  let showHelp = false;
  
  args.forEach(arg => {
    if (arg === '--help' || arg === '-h') {
      showHelp = true;
    } else if (TEST_CONFIGS[arg]) {
      testsToRun.push(arg);
    } else if (arg.startsWith('--')) {
      console.log(`${colors.yellow}Unknown option: ${arg}${colors.reset}`);
    } else {
      console.log(`${colors.yellow}Unknown test: ${arg}${colors.reset}`);
    }
  });
  
  if (showHelp) {
    console.log(`
${colors.bright}Test Runner with Claude Auto-Fix${colors.reset}

Usage: node test-with-autofix.js [tests...] [options]

Available tests:
  ${Object.entries(TEST_CONFIGS).map(([key, config]) => 
    `${key.padEnd(15)} - ${config.name}`
  ).join('\n  ')}

Options:
  --help, -h     Show this help message

Environment variables:
  CLAUDE_API_KEY    Claude/Anthropic API key for auto-fixing
  DRY_RUN          Set to 'true' to show fixes without applying

Examples:
  # Run all tests
  node test-with-autofix.js
  
  # Run specific tests
  node test-with-autofix.js demo-standards build
  
  # Run with auto-fix
  CLAUDE_API_KEY=your-key node test-with-autofix.js
  
  # Dry run to see what would be fixed
  CLAUDE_API_KEY=your-key DRY_RUN=true node test-with-autofix.js
`);
    process.exit(0);
  }
  
  // If no specific tests specified, run all
  if (testsToRun.length === 0) {
    testsToRun = Object.keys(TEST_CONFIGS);
  }
  
  // Run the tests
  runAllTests(testsToRun)
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = { runTest, runAllTests };