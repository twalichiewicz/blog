#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Specific mappings for small font sizes
const smallFontSizeMap = {
  // Update var(--font-size-xs) to the correct size based on original value
  // This requires checking comments or git history
  'var\\(--font-size-xs\\)': {
    '9px': 'var(--font-size-2xs)',
    '10px': 'var(--font-size-xs)',
    '11px': 'var(--font-size-xs)',
    '12px': 'var(--font-size-sm)'
  }
};

// Files to check based on git diff
const filesToCheck = [
  '_blog.scss',
  '_components.scss',
  '_mobile-tabs.scss',
  '_tags.scss',
  '_impact-grid.scss',
  '_responsive-layouts.scss',
  '_notebook-customization.scss',
  '_alerts.scss',
  '_contact-modal.scss',
  '_demo-walkthrough.scss',
  '_emoji.scss',
  '_loading.scss',
  '_post-preview-card.scss',
  '_print.scss',
  '_project-summary.scss',
  '_propel.scss',
  '_references.scss',
  '_screen-wipe-transition.scss',
  '_substack-post.scss',
  '_ux-artifacts.scss',
  'components/_mobile-tabs.scss',
  'components/_modals.scss',
  'components/_profile.scss',
  'components/_search.scss',
  'components/_tags.scss'
];

function fixFile(filePath) {
  const fileName = path.basename(filePath);
  
  // Get the original file from git to see what values were converted
  const gitDiff = require('child_process').execSync(
    `git diff ${filePath} | grep -B1 "font-size: var(--font-size-xs)" | grep "^-.*font-size:" || true`,
    { encoding: 'utf8' }
  ).trim();
  
  if (!gitDiff) {
    console.log(`No font-size-xs changes found in ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = [];
  
  // Parse the git diff to find original values
  const lines = gitDiff.split('\n');
  lines.forEach(line => {
    const match = line.match(/-\s*font-size:\s*(9px|10px|11px|12px)/);
    if (match) {
      const originalSize = match[1];
      let newVar;
      
      switch(originalSize) {
        case '9px':
          newVar = 'var(--font-size-2xs)';
          break;
        case '10px':
          newVar = 'var(--font-size-xs)';
          break;
        case '11px':
          newVar = 'var(--font-size-xs)'; // 11px maps to 10px
          break;
        case '12px':
          newVar = 'var(--font-size-sm)';
          break;
      }
      
      if (newVar && newVar !== 'var(--font-size-xs)') {
        // Need to update this specific instance
        // This is tricky - we need context to know which var(--font-size-xs) to update
        changes.push(`Would update ${originalSize} → ${newVar}`);
      }
    }
  });
  
  if (changes.length > 0) {
    console.log(`\n✅ Found in ${fileName}:`);
    changes.forEach(change => console.log(`   - ${change}`));
  }
}

// Main execution
console.log('Analyzing small font size conversions...\n');

const stylesDir = path.join(__dirname, 'themes/san-diego/source/styles');

filesToCheck.forEach(file => {
  const fullPath = path.join(stylesDir, file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  }
});

console.log('\n⚠️  Manual Review Required:');
console.log('Due to the complexity of the conversions, please manually review and update:');
console.log('- 9px → var(--font-size-2xs)');
console.log('- 10px → var(--font-size-xs)');
console.log('- 11px → var(--font-size-xs)');
console.log('- 12px → var(--font-size-sm)');
console.log('\nUse git diff to see original values and update accordingly.');