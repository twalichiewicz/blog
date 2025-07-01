#!/usr/bin/env node

/**
 * Claude Code Onboarding Script
 * Quickly orients new Claude instances to the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function printSection(title) {
  console.log('\n' + '='.repeat(50));
  log(title, colors.bright + colors.blue);
  console.log('='.repeat(50));
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function getGitInfo() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const changedFiles = status.split('\n').filter(line => line.trim()).length;
    return { branch, changedFiles };
  } catch {
    return { branch: 'unknown', changedFiles: 0 };
  }
}

function main() {
  log('\n🤖 CLAUDE CODE ONBOARDING', colors.bright + colors.cyan);
  log('Quickly orienting to the thomas.design portfolio codebase\n', colors.dim);

  // 1. Environment Check
  printSection('📍 ENVIRONMENT CHECK');
  const gitInfo = getGitInfo();
  log(`Current branch: ${gitInfo.branch}`, colors.green);
  log(`Changed files: ${gitInfo.changedFiles}`, gitInfo.changedFiles > 0 ? colors.yellow : colors.green);
  log(`Working directory: ${process.cwd()}`, colors.green);

  // 2. Essential Files
  printSection('📚 ESSENTIAL DOCUMENTATION');
  const essentialDocs = [
    { file: 'CLAUDE-QUICK-START.md', desc: 'Quick orientation (START HERE)' },
    { file: 'CLAUDE.md', desc: 'Comprehensive guide' },
    { file: 'docs/QUICK-REFERENCE.md', desc: 'Common commands & patterns' },
    { file: 'package.json', desc: 'Available scripts & dependencies' }
  ];

  essentialDocs.forEach(({ file, desc }) => {
    const exists = checkFileExists(file);
    log(`${exists ? '✓' : '✗'} ${file} - ${desc}`, exists ? colors.green : colors.yellow);
  });

  // 3. Key Commands
  printSection('🚀 KEY COMMANDS');
  const commands = [
    { cmd: 'npm run dev', desc: 'Start development with self-healing' },
    { cmd: 'npm run test:dev', desc: 'Quick validation (~5s)' },
    { cmd: 'npm run doctor', desc: 'Check system health' },
    { cmd: 'npm run fix', desc: 'Auto-fix common issues' },
    { cmd: 'npm run build:prod', desc: 'Production build (before deploy)' }
  ];

  commands.forEach(({ cmd, desc }) => {
    log(`${cmd.padEnd(25)} # ${desc}`, colors.cyan);
  });

  // 4. Project Structure Overview
  printSection('🏗️  PROJECT STRUCTURE');
  const structure = [
    { path: 'source/_posts/', desc: 'Blog & portfolio content (Markdown)' },
    { path: 'themes/san-diego/', desc: 'Custom theme (templates, styles, JS)' },
    { path: 'demos/', desc: 'Interactive demo projects' },
    { path: 'build-system/', desc: 'Build tools & automation' },
    { path: 'docs/', desc: 'Technical documentation' }
  ];

  structure.forEach(({ path, desc }) => {
    const exists = checkFileExists(path);
    log(`${path.padEnd(25)} - ${desc}`, exists ? '' : colors.yellow);
  });

  // 5. Critical Rules Summary
  printSection('⚠️  CRITICAL RULES');
  const rules = [
    'ALWAYS run `npm run build` before committing',
    'NEVER cross file purpose boundaries (see CLAUDE.md)',
    'Fix ONLY what was asked - respect task constraints',
    'Test in both light/dark modes',
    'Use existing patterns - check before adding libraries'
  ];

  rules.forEach(rule => log(`• ${rule}`, colors.yellow));

  // 6. Common Workflows
  printSection('🔄 COMMON WORKFLOWS');
  log('Creating new content:', colors.bright);
  log('  hexo new portfolio-post "Project Name"', colors.dim);
  log('  hexo new blog-post "Post Title"', colors.dim);
  
  log('\nWorking with demos:', colors.bright);
  log('  npm run create:demo', colors.dim);
  log('  npm run dev:demos', colors.dim);
  
  log('\nTesting changes:', colors.bright);
  log('  npm run test:dev     # During development', colors.dim);
  log('  npm run test:quick   # Before commit', colors.dim);
  log('  npm test            # Full test suite', colors.dim);

  // 7. Quick Tips
  printSection('💡 QUICK TIPS');
  const tips = [
    'Use TodoWrite tool for task planning and tracking',
    'Take screenshots before visual changes (Cmd+Ctrl+Shift+4)',
    'Check `git status` frequently to track changes',
    'Read error messages carefully - self-healing often fixes them',
    'When in doubt, consult CLAUDE.md for detailed guidance'
  ];

  tips.forEach(tip => log(`• ${tip}`, colors.dim));

  // 8. Next Steps
  printSection('📋 NEXT STEPS');
  log('1. Read CLAUDE-QUICK-START.md for quick orientation', colors.green);
  log('2. Consult CLAUDE.md when you need detailed guidelines', colors.green);
  log('3. Run `npm run doctor` to check system health', colors.green);
  log('4. Use TodoWrite to plan your tasks', colors.green);
  log('5. Start with `npm run dev` for development', colors.green);

  // Footer
  console.log('\n' + '='.repeat(50));
  log('Ready to work! Remember: Do what was asked, nothing more, nothing less.', colors.bright + colors.green);
  console.log('='.repeat(50) + '\n');
}

// Run the script
main();