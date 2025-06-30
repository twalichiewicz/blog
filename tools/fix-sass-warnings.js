#!/usr/bin/env node

/**
 * Fix Sass Deprecation Warnings - Mixed Declarations
 * 
 * Fixes the mixed-decls warnings by moving CSS properties before @media queries
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class SassWarningFixer {
  constructor() {
    this.fixed = 0;
    this.warnings = 0;
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    const color = colors[type] || colors.info;
    console.log(`${color}${message}${colors.reset}`);
  }

  fixMixedDeclarations(content) {
    // Pattern 1: Find CSS properties that come after @media queries
    const mediaBlockPattern = /(@media[^{]*{[^}]*})\s*((?:\s*[a-z-]+\s*:[^;]+;)+)/g;
    
    // Pattern 2: Find CSS properties after mixins that end with @media
    const mixinPattern = /(@include\s+[^;]+;)\s*((?:\s*[a-z-]+\s*:[^;]+;)+)/g;
    
    let fixed = content;
    let matches = 0;
    
    // Fix direct @media cases
    fixed = fixed.replace(mediaBlockPattern, (match, mediaBlock, declarations) => {
      matches++;
      this.fixed++;
      
      // Move declarations before the media block
      return declarations.trim() + '\n\t\t\t\t' + mediaBlock;
    });
    
    // Fix mixin cases by wrapping declarations in & {}
    fixed = fixed.replace(mixinPattern, (match, mixinCall, declarations) => {
      // Check if this is likely a problematic case
      if (declarations.trim()) {
        matches++;
        this.fixed++;
        
        // Wrap declarations in & {} block
        const indent = match.match(/^\s*/)[0];
        const wrappedDeclarations = `\n${indent}\t& {\n${indent}\t\t${declarations.trim().replace(/\n\s*/g, `\n${indent}\t\t`)}\n${indent}\t}`;
        
        return mixinCall + wrappedDeclarations;
      }
      return match;
    });
    
    if (matches > 0) {
      this.log(`  ✅ Fixed ${matches} mixed declaration issues`, 'success');
    }
    
    return fixed;
  }

  async fixFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fixed = this.fixMixedDeclarations(content);
      
      if (content !== fixed) {
        fs.writeFileSync(filePath, fixed);
        this.log(`📄 Fixed: ${path.relative(process.cwd(), filePath)}`, 'info');
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`❌ Error fixing ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  async run() {
    this.log('🔧 Scanning for Sass mixed-decls warnings...', 'info');
    
    // Find all SCSS files
    const scssFiles = await glob('themes/san-diego/source/styles/**/*.scss');
    
    this.log(`📁 Found ${scssFiles.length} SCSS files`, 'info');
    
    let filesFixed = 0;
    
    for (const file of scssFiles) {
      const wasFixed = await this.fixFile(file);
      if (wasFixed) {
        filesFixed++;
      }
    }
    
    this.log('\n📊 Summary:', 'info');
    console.log(`✅ Files processed: ${scssFiles.length}`);
    console.log(`🔧 Files fixed: ${filesFixed}`);
    console.log(`📝 Total issues fixed: ${this.fixed}`);
    
    if (this.fixed > 0) {
      this.log('\n🎉 Mixed declaration warnings should now be resolved!', 'success');
      this.log('💡 Run npm run dev to see if warnings are gone', 'info');
    } else {
      this.log('\n✅ No mixed declaration issues found', 'success');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new SassWarningFixer();
  fixer.run().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = SassWarningFixer;