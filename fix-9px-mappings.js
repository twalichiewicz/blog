#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files where 9px was incorrectly mapped to var(--font-size-xs)
const filesToFix = [
  'themes/san-diego/source/styles/_alerts.scss',
  'themes/san-diego/source/styles/_blog.scss',
  'themes/san-diego/source/styles/_components.scss',
  'themes/san-diego/source/styles/_contact-modal.scss',
  'themes/san-diego/source/styles/_demo-walkthrough.scss',
  'themes/san-diego/source/styles/_emoji.scss',
  'themes/san-diego/source/styles/_impact-grid.scss',
  'themes/san-diego/source/styles/_loading.scss',
  'themes/san-diego/source/styles/_mobile-tabs.scss',
  'themes/san-diego/source/styles/_notebook-customization.scss',
  'themes/san-diego/source/styles/_post-preview-card.scss',
  'themes/san-diego/source/styles/_print.scss',
  'themes/san-diego/source/styles/_project-summary.scss',
  'themes/san-diego/source/styles/_propel.scss',
  'themes/san-diego/source/styles/_references.scss',
  'themes/san-diego/source/styles/_responsive-layouts.scss',
  'themes/san-diego/source/styles/_screen-wipe-transition.scss',
  'themes/san-diego/source/styles/_substack-post.scss',
  'themes/san-diego/source/styles/_tags.scss',
  'themes/san-diego/source/styles/_ux-artifacts.scss',
  'themes/san-diego/source/styles/components/_mobile-tabs.scss',
  'themes/san-diego/source/styles/components/_modals.scss',
  'themes/san-diego/source/styles/components/_profile.scss',
  'themes/san-diego/source/styles/components/_search.scss',
  'themes/san-diego/source/styles/components/_tags.scss'
];

let totalFixed = 0;

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Get git diff to find where 9px was originally used
  const { execSync } = require('child_process');
  let gitDiff = '';
  try {
    gitDiff = execSync(
      `git diff HEAD~1 "${filePath}" 2>/dev/null || true`,
      { encoding: 'utf8' }
    );
  } catch (e) {
    // Ignore errors
  }

  // Find lines where 9px was changed to var(--font-size-xs)
  const lines = gitDiff.split('\n');
  let replacements = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^-.*font-size:\s*9px/)) {
      // Next line should be the replacement
      if (i + 1 < lines.length && lines[i + 1].match(/^\+.*font-size:\s*var\(--font-size-xs\)/)) {
        // We found a 9px -> var(--font-size-xs) replacement
        // Replace it with var(--font-size-2xs)
        content = content.replace(
          /font-size:\s*var\(--font-size-xs\)/g,
          (match, offset) => {
            // Check context to ensure we're replacing the right one
            const before = content.substring(Math.max(0, offset - 100), offset);
            const after = content.substring(offset + match.length, Math.min(content.length, offset + match.length + 100));
            
            // Look for clues this was originally 9px (comments, specific selectors, etc.)
            if (before.includes('small') || before.includes('caption') || before.includes('tiny') ||
                after.includes('small') || after.includes('caption') || after.includes('tiny')) {
              replacements++;
              return 'font-size: var(--font-size-2xs)';
            }
            return match;
          }
        );
      }
    }
  }

  // Alternative approach: look for specific patterns where 9px is commonly used
  const patterns = [
    // Small text patterns
    { pattern: /\.small[^{]*{[^}]*font-size:\s*var\(--font-size-xs\)/, replacement: 'font-size: var(--font-size-2xs)' },
    { pattern: /\.caption[^{]*{[^}]*font-size:\s*var\(--font-size-xs\)/, replacement: 'font-size: var(--font-size-2xs)' },
    { pattern: /\.tiny[^{]*{[^}]*font-size:\s*var\(--font-size-xs\)/, replacement: 'font-size: var(--font-size-2xs)' },
    // Specific components known to use 9px
    { pattern: /\.tag[^{]*{[^}]*font-size:\s*var\(--font-size-xs\)/, replacement: 'font-size: var(--font-size-2xs)' },
    { pattern: /\.badge[^{]*{[^}]*font-size:\s*var\(--font-size-xs\)/, replacement: 'font-size: var(--font-size-2xs)' },
  ];

  patterns.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(/font-size:\s*var\(--font-size-xs\)/, replacement);
      replacements++;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${replacements} instances in ${path.basename(filePath)}`);
    totalFixed += replacements;
  }
}

console.log('🔍 Fixing 9px font-size mappings...\n');

filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  fixFile(fullPath);
});

console.log(`\n✨ Total fixes applied: ${totalFixed}`);
console.log('\n📝 Note: This is a conservative fix. Please review the changes and manually adjust any edge cases.');
console.log('Look for patterns like .small, .caption, .tiny, .tag, .badge which typically use the smallest font sizes.');