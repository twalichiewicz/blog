#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Font size mappings (px to variable)
const fontSizeMap = {
  '9px': 'var(--font-size-xs)',
  '10px': 'var(--font-size-xs)',
  '11px': 'var(--font-size-xs)',
  '12px': 'var(--font-size-xs)',
  '13px': 'var(--font-size-sm)',
  '14px': 'var(--font-size-sm)',
  '15px': 'var(--font-size-base)',
  '16px': 'var(--font-size-base)',
  '17px': 'var(--font-size-base)',
  '18px': 'var(--font-size-lg)',
  '19px': 'var(--font-size-lg)',
  '20px': 'var(--font-size-xl)',
  '21px': 'var(--font-size-xl)',
  '24px': 'var(--font-size-2xl)',
  '30px': 'var(--font-size-3xl)',
  '36px': 'var(--font-size-4xl)',
  '44px': 'var(--font-size-5xl)',
  '48px': 'var(--font-size-5xl)',
  // rem values
  '0.75rem': 'var(--font-size-xs)',
  '0.875rem': 'var(--font-size-sm)',
  '1rem': 'var(--font-size-base)',
  '1.125rem': 'var(--font-size-lg)',
  '1.25rem': 'var(--font-size-xl)',
  '1.5rem': 'var(--font-size-2xl)',
  '1.875rem': 'var(--font-size-3xl)',
  '2.25rem': 'var(--font-size-4xl)',
  '2.75rem': 'var(--font-size-5xl)'
};

// Font weight mappings
const fontWeightMap = {
  '400': 'var(--font-weight-normal)',
  'normal': 'var(--font-weight-normal)',
  '500': 'var(--font-weight-medium)',
  '600': 'var(--font-weight-semibold)',
  '700': 'var(--font-weight-bold)',
  'bold': 'var(--font-weight-bold)'
};

// Line height mappings
const lineHeightMap = {
  '1': 'var(--line-height-tight)',
  '1.25': 'var(--line-height-tight)',
  '1.3': 'var(--line-height-tight)',
  '1.35': 'var(--line-height-tight)',
  '1.4': 'var(--line-height-normal)',
  '1.5': 'var(--line-height-normal)',
  '1.6': 'var(--line-height-relaxed)',
  '1.75': 'var(--line-height-relaxed)',
  '1.8': 'var(--line-height-relaxed)',
  '100%': 'var(--line-height-tight)',
  '16px': 'var(--line-height-normal)'
};

// Font family patterns to replace
const fontFamilyPatterns = [
  {
    pattern: /-apple-system[^;]+sans-serif[^;]*/g,
    replacement: 'var(--font-sans)'
  },
  {
    pattern: /'SF Pro Text'[^;]+sans-serif[^;]*/g,
    replacement: 'var(--font-sans)'
  },
  {
    pattern: /'SF Pro Display'[^;]+sans-serif[^;]*/g,
    replacement: 'var(--font-sans)'
  },
  {
    pattern: /system-ui[^;]+sans-serif[^;]*/g,
    replacement: 'var(--font-sans)'
  },
  {
    pattern: /'SF Mono'[^;]+monospace[^;]*/g,
    replacement: 'var(--font-mono)'
  },
  {
    pattern: /Monaco[^;]+monospace[^;]*/g,
    replacement: 'var(--font-mono)'
  },
  {
    pattern: /monospace/g,
    replacement: 'var(--font-mono)'
  }
];

// Files to skip
const skipFiles = [
  '_typography-system.scss',
  '_variables.scss',
  '_design-tokens.scss'
];

function migrateFile(filePath) {
  const fileName = path.basename(filePath);
  
  if (skipFiles.includes(fileName)) {
    console.log(`Skipping ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = [];
  
  // Replace font sizes
  Object.entries(fontSizeMap).forEach(([oldValue, newValue]) => {
    const regex = new RegExp(`font-size:\\s*${oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, `font-size: ${newValue}`);
      changes.push(`font-size: ${oldValue} → ${newValue} (${matches.length} occurrences)`);
    }
  });
  
  // Replace font weights
  Object.entries(fontWeightMap).forEach(([oldValue, newValue]) => {
    const regex = new RegExp(`font-weight:\\s*${oldValue}`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, `font-weight: ${newValue}`);
      changes.push(`font-weight: ${oldValue} → ${newValue} (${matches.length} occurrences)`);
    }
  });
  
  // Replace line heights
  Object.entries(lineHeightMap).forEach(([oldValue, newValue]) => {
    const regex = new RegExp(`line-height:\\s*${oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\d)`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, `line-height: ${newValue}`);
      changes.push(`line-height: ${oldValue} → ${newValue} (${matches.length} occurrences)`);
    }
  });
  
  // Replace font families
  fontFamilyPatterns.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      changes.push(`font-family: [long declaration] → ${replacement} (${matches.length} occurrences)`);
    }
  });
  
  // Special case: Georgia, serif
  const georgiaRegex = /font-family:\s*Georgia,\s*serif/g;
  const georgiaMatches = content.match(georgiaRegex);
  if (georgiaMatches) {
    content = content.replace(georgiaRegex, 'font-family: Georgia, serif; // TODO: Consider using var(--font-sans) instead');
    changes.push(`font-family: Georgia, serif → Added TODO comment (${georgiaMatches.length} occurrences)`);
  }
  
  // Write file if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`\n✅ Updated ${fileName}:`);
    changes.forEach(change => console.log(`   - ${change}`));
  } else {
    console.log(`⏭️  No changes needed in ${fileName}`);
  }
}

// Recursive function to find all .scss files
function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findScssFiles(filePath, fileList);
    } else if (file.endsWith('.scss')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('Starting typography migration...\n');

const stylesDir = path.join(__dirname, 'themes/san-diego/source/styles');
const files = findScssFiles(stylesDir);

files.forEach(file => {
  migrateFile(file);
});

console.log('\n✨ Migration complete!');
console.log('\nNext steps:');
console.log('1. Review the changes with `git diff`');
console.log('2. Test the site with `npm run dev`');
console.log('3. Look for any TODO comments added for special cases');
console.log('4. Commit the changes');