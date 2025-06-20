#!/usr/bin/env node

/**
 * Test script to validate CSS border colors after build
 * Checks for missing border colors that can occur during minification
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob').glob;

// ANSI color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

// Patterns to check
const borderPatterns = {
  // Check for borders without color values
  missingColor: /border\s*:\s*\d+px\s+\w+\s*(?:;|!important)/g,
  // Check for proper border with color
  withColor: /border\s*:\s*\d+px\s+\w+\s+(?:rgba?\(|hsl|#|[a-z]+)/gi,
  // Check for border shorthand without all values
  incompleteShorthand: /border\s*:\s*(?:\d+px|solid|dotted|dashed)\s*(?:;|!important)/g
};

// Known selectors that should have borders
const criticalSelectors = [
  '.post-list-item.post-long',
  '.portfolio-item.has-writeup',
  '.card-base'
];

async function checkCSSFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  
  // Check for borders without colors
  const missingColorMatches = content.match(borderPatterns.missingColor) || [];
  const incompleteMatches = content.match(borderPatterns.incompleteShorthand) || [];
  
  if (missingColorMatches.length > 0 || incompleteMatches.length > 0) {
    issues.push({
      file: filePath,
      missingColors: missingColorMatches,
      incomplete: incompleteMatches
    });
  }
  
  // Check if critical selectors have proper borders
  for (const selector of criticalSelectors) {
    if (content.includes(selector)) {
      // Extract the rule block for this selector
      const regex = new RegExp(`${selector.replace('.', '\\.')}[^{]*{[^}]*}`, 'g');
      const matches = content.match(regex) || [];
      
      for (const match of matches) {
        if (match.includes('border') && !borderPatterns.withColor.test(match)) {
          issues.push({
            file: filePath,
            selector: selector,
            rule: match,
            issue: 'Border without color value'
          });
        }
      }
    }
  }
  
  return issues;
}

async function validateCSS() {
  console.log('🔍 Validating CSS border colors...\n');
  
  try {
    // Find all CSS files in public directory
    const cssFiles = await glob('public/**/*.css', {
      ignore: ['**/node_modules/**']
    });
    
    console.log(`Found ${cssFiles.length} CSS files to check\n`);
    
    let totalIssues = 0;
    const allIssues = [];
    
    for (const file of cssFiles) {
      const issues = await checkCSSFile(file);
      if (issues.length > 0) {
        allIssues.push(...issues);
        totalIssues += issues.length;
      }
    }
    
    // Report results
    if (totalIssues === 0) {
      console.log(`${colors.green}✓ All CSS files have proper border colors!${colors.reset}\n`);
    } else {
      console.log(`${colors.red}✗ Found ${totalIssues} potential border color issues:${colors.reset}\n`);
      
      for (const issue of allIssues) {
        console.log(`${colors.yellow}File: ${issue.file}${colors.reset}`);
        
        if (issue.missingColors) {
          console.log('  Missing colors in borders:');
          issue.missingColors.forEach(match => {
            console.log(`    ${colors.red}${match}${colors.reset}`);
          });
        }
        
        if (issue.incomplete) {
          console.log('  Incomplete border shorthand:');
          issue.incomplete.forEach(match => {
            console.log(`    ${colors.red}${match}${colors.reset}`);
          });
        }
        
        if (issue.selector) {
          console.log(`  Selector: ${issue.selector}`);
          console.log(`  Issue: ${issue.issue}`);
          console.log(`  Rule: ${issue.rule.substring(0, 100)}...`);
        }
        
        console.log('');
      }
    }
    
    // Check for specific known issues
    console.log('📋 Checking for known problematic patterns...\n');
    
    for (const file of cssFiles) {
      const content = await fs.readFile(file, 'utf8');
      
      // Check for media queries with border issues
      const mediaQueryRegex = /@media[^{]+{[^}]*border\s*:\s*\d+px\s+\w+\s*;[^}]*}/g;
      const mediaMatches = content.match(mediaQueryRegex) || [];
      
      if (mediaMatches.length > 0) {
        console.log(`${colors.yellow}Warning: Found borders in media queries without colors in ${file}${colors.reset}`);
        mediaMatches.forEach(match => {
          console.log(`  ${match.substring(0, 80)}...`);
        });
        console.log('');
      }
    }
    
    return totalIssues === 0;
    
  } catch (error) {
    console.error(`${colors.red}Error during validation:${colors.reset}`, error);
    return false;
  }
}

// Run validation
validateCSS().then(success => {
  process.exit(success ? 0 : 1);
});