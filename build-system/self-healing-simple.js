#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\nThomas.design Health Check\n');

const issues = [];

// Check Hexo database
if (fs.existsSync('db.json')) {
  try {
    const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    console.log('Hexo database OK');
  } catch (error) {
    issues.push({ type: 'hexo-db', message: 'Hexo database corrupted' });
    console.log('Hexo database corrupted');
  }
} else {
  console.log('- No Hexo database found');
}

// Check port 4000
try {
  execSync('lsof -i :4000', { stdio: 'pipe' });
  issues.push({ type: 'port', message: 'Port 4000 is in use' });
  console.log('Port 4000 is in use');
} catch (error) {
  console.log('Port 4000 is free');
}

// Check demo builds
const demosPath = path.join(process.cwd(), 'themes/san-diego/source/demos');
if (!fs.existsSync(demosPath)) {
  issues.push({ type: 'demos', message: 'Demo builds missing' });
  console.log('Demo builds missing');
} else {
  console.log('Demo builds present');
}

// Check node_modules
if (!fs.existsSync('node_modules')) {
  issues.push({ type: 'deps', message: 'Dependencies not installed' });
  console.log('Dependencies not installed');
} else {
  console.log('Dependencies installed');
}

if (issues.length === 0) {
  console.log('\nAll systems healthy.\n');
  process.exit(0);
}

console.log(`\nFound ${issues.length} issue(s)\n`);

// If --fix flag is provided, apply fixes
if (process.argv.includes('--fix')) {
  console.log('Applying fixes...\n');
  
  for (const issue of issues) {
    switch (issue.type) {
      case 'hexo-db':
        console.log('  Cleaning Hexo database...');
        try {
          execSync('npx hexo clean', { stdio: 'inherit' });
          console.log('  Database cleaned');
        } catch (error) {
          console.log('  Failed to clean database');
        }
        break;
        
      case 'port':
        console.log('  Killing process on port 4000...');
        try {
          execSync('kill -9 $(lsof -t -i:4000)', { shell: true });
          console.log('  Port freed');
        } catch (error) {
          console.log('  Failed to free port');
        }
        break;
        
      case 'demos':
        console.log('  Building demos...');
        try {
          execSync('npm run build:demos', { stdio: 'inherit' });
          console.log('  Demos built');
        } catch (error) {
          console.log('  Failed to build demos');
        }
        break;
        
      case 'deps':
        console.log('  Installing dependencies...');
        try {
          execSync('npm install', { stdio: 'inherit' });
          console.log('  Dependencies installed');
        } catch (error) {
          console.log('  Failed to install dependencies');
        }
        break;
    }
  }
  
  console.log('\nFixes applied.\n');
} else {
  console.log('Run `npm run fix` to apply automatic fixes\n');
}
