#!/usr/bin/env node

/**
 * Documentation Reorganization Script
 * 
 * Implements the documentation reorganization plan safely with backups
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocumentationReorganizer {
  constructor() {
    this.root = path.join(__dirname, '..');
    this.backupDir = path.join(this.root, '.doc-reorganization-backup');
    this.dryRun = process.argv.includes('--dry-run');
    this.verbose = process.argv.includes('--verbose');
    
    this.stats = {
      filesRemoved: 0,
      filesMoved: 0,
      directoriesCreated: 0,
      backupsCreated: 0
    };
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

  createBackup() {
    if (this.dryRun) {
      this.log('DRY RUN: Would create backup directory', 'info');
      return;
    }

    try {
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
        this.stats.backupsCreated++;
      }

      // Backup key directories before changes
      const dirsToBackup = [
        'docs',
        'docs-backup-2025-06-26',
        'build-system',
        'demos'
      ];

      for (const dir of dirsToBackup) {
        const sourcePath = path.join(this.root, dir);
        const backupPath = path.join(this.backupDir, dir);
        
        if (fs.existsSync(sourcePath)) {
          this.log(`Creating backup of ${dir}...`, 'info');
          execSync(`cp -r "${sourcePath}" "${backupPath}"`);
        }
      }

      this.log('✅ Backup created successfully', 'success');
    } catch (error) {
      this.log(`❌ Backup failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  phase1Cleanup() {
    this.log('\n📋 Phase 1: Cleanup obsolete documentation', 'info');

    // Remove archived documentation
    const obsoleteDirectories = [
      'docs-backup-2025-06-26',
      'docs/archive'
    ];

    for (const dir of obsoleteDirectories) {
      const dirPath = path.join(this.root, dir);
      if (fs.existsSync(dirPath)) {
        if (this.dryRun) {
          this.log(`DRY RUN: Would remove directory ${dir}`, 'warning');
        } else {
          this.log(`Removing ${dir}...`, 'info');
          execSync(`rm -rf "${dirPath}"`);
          this.stats.filesRemoved++;
        }
      }
    }

    // Remove completed refactoring documentation
    const obsoleteFiles = [
      'docs/css-refactoring-examples.md',
      'docs/css-refactoring-implementation-guide.md',
      'docs/css-refactoring-metrics.md',
      'docs/css-refactoring-plan.md',
      'docs/js-refactoring-examples.md',
      'docs/js-refactoring-implementation-guide.md',
      'docs/js-refactoring-metrics.md',
      'docs/js-refactoring-plan.md',
      'docs/parallel-worktree-integration.md',
      'docs/worktree-improvements.md'
    ];

    for (const file of obsoleteFiles) {
      const filePath = path.join(this.root, file);
      if (fs.existsSync(filePath)) {
        if (this.dryRun) {
          this.log(`DRY RUN: Would remove file ${file}`, 'warning');
        } else {
          this.log(`Removing ${file}...`, 'info');
          fs.unlinkSync(filePath);
          this.stats.filesRemoved++;
        }
      }
    }

    this.log('✅ Phase 1 cleanup complete', 'success');
  }

  phase2Structure() {
    this.log('\n📋 Phase 2: Create new directory structure', 'info');

    const newDirectories = [
      'docs/guides',
      'docs/guides/getting-started',
      'docs/guides/content',
      'docs/guides/development',
      'docs/guides/deployment',
      'docs/guides/maintenance',
      'docs/reference',
      'docs/reference/architecture',
      'docs/reference/api',
      'docs/reference/components',
      'docs/reference/configuration',
      'docs/reference/commands',
      'docs/examples',
      'docs/examples/posts',
      'docs/examples/components',
      'docs/examples/workflows'
    ];

    for (const dir of newDirectories) {
      const dirPath = path.join(this.root, dir);
      if (!fs.existsSync(dirPath)) {
        if (this.dryRun) {
          this.log(`DRY RUN: Would create directory ${dir}`, 'info');
        } else {
          this.log(`Creating ${dir}...`, 'info');
          fs.mkdirSync(dirPath, { recursive: true });
          this.stats.directoriesCreated++;
        }
      }
    }

    this.log('✅ Phase 2 structure creation complete', 'success');
  }

  phase3Moves() {
    this.log('\n📋 Phase 3: Move and rename key files', 'info');

    const moves = [
      {
        from: 'docs/QUICK-REFERENCE.md',
        to: 'docs/QUICK-START.md',
        description: 'Rename quick reference to quick start'
      },
      {
        from: 'docs/PROTOTYPE-CURSORS.md',
        to: 'docs/reference/components/cursor-system.md',
        description: 'Move cursor documentation to components reference'
      },
      {
        from: 'docs/guides/desktop-install-enhancement.md',
        to: 'docs/examples/workflows/desktop-install-enhancement.md',
        description: 'Move desktop install guide to examples'
      }
    ];

    for (const move of moves) {
      const fromPath = path.join(this.root, move.from);
      const toPath = path.join(this.root, move.to);
      
      if (fs.existsSync(fromPath)) {
        if (this.dryRun) {
          this.log(`DRY RUN: Would move ${move.from} → ${move.to}`, 'info');
        } else {
          this.log(`Moving ${move.from} → ${move.to}`, 'info');
          
          // Ensure target directory exists
          const targetDir = path.dirname(toPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          fs.renameSync(fromPath, toPath);
          this.stats.filesMoved++;
        }
      } else {
        this.log(`⚠️  Source file not found: ${move.from}`, 'warning');
      }
    }

    this.log('✅ Phase 3 moves complete', 'success');
  }

  updateMainReadme() {
    this.log('\n📋 Updating main README.md with new structure', 'info');

    const readmePath = path.join(this.root, 'README.md');
    
    if (!fs.existsSync(readmePath)) {
      this.log('⚠️  README.md not found, skipping update', 'warning');
      return;
    }

    if (this.dryRun) {
      this.log('DRY RUN: Would update README.md with new navigation', 'info');
      return;
    }

    // Read current README
    let readme = fs.readFileSync(readmePath, 'utf-8');

    // Add documentation section if it doesn't exist
    const docSection = `
## 📚 Documentation

- **[Quick Start](./docs/QUICK-START.md)** - Get up and running in 5 minutes
- **[Full Documentation](./docs/README.md)** - Complete documentation index
- **[Build System](./build-system/README.md)** - New intelligent build system
- **[Demo Development](./demos/README.md)** - Interactive demo system

## 🚀 Common Tasks

- [Creating Content](./docs/guides/content/)
- [Building Demos](./demos/development/)  
- [Development Setup](./docs/guides/getting-started/)
- [Troubleshooting](./docs/guides/maintenance/troubleshooting.md)

## 🔧 Quick Commands

\`\`\`bash
# Development (fast, watches for changes)
npm run dev

# Testing (comprehensive, before commits)
npm run test

# Build system status
npm run build:status
\`\`\`
`;

    // Insert documentation section after the first header
    if (!readme.includes('## 📚 Documentation')) {
      const lines = readme.split('\n');
      const firstHeaderIndex = lines.findIndex(line => line.startsWith('# '));
      
      if (firstHeaderIndex !== -1) {
        lines.splice(firstHeaderIndex + 1, 0, docSection);
        readme = lines.join('\n');
        
        fs.writeFileSync(readmePath, readme);
        this.log('✅ Updated README.md with new documentation structure', 'success');
      }
    } else {
      this.log('ℹ️  README.md already has documentation section', 'info');
    }
  }

  printSummary() {
    this.log('\n📊 Reorganization Summary:', 'info');
    console.log(`📁 Directories created: ${this.stats.directoriesCreated}`);
    console.log(`📄 Files moved: ${this.stats.filesMoved}`);
    console.log(`🗑️  Files/directories removed: ${this.stats.filesRemoved}`);
    console.log(`💾 Backups created: ${this.stats.backupsCreated}`);

    if (this.dryRun) {
      this.log('\n⚠️  This was a DRY RUN - no changes were made', 'warning');
      this.log('Run without --dry-run to apply changes', 'info');
    } else {
      this.log('\n✅ Documentation reorganization complete!', 'success');
      this.log(`💾 Backup available at: ${this.backupDir}`, 'info');
    }
  }

  run() {
    this.log('🚀 Starting documentation reorganization...', 'info');
    
    if (this.dryRun) {
      this.log('📋 DRY RUN MODE - No changes will be made', 'warning');
    }

    // Create backup first
    this.createBackup();

    // Execute phases
    this.phase1Cleanup();
    this.phase2Structure();
    this.phase3Moves();
    this.updateMainReadme();

    // Summary
    this.printSummary();
  }
}

// Command line help
if (process.argv.includes('--help')) {
  console.log(`
📚 Documentation Reorganization Tool

Usage: node tools/reorganize-docs.js [options]

Options:
  --dry-run     Show what would be changed without making changes
  --verbose     Show detailed output
  --help        Show this help

This tool implements the documentation reorganization plan:
1. Removes obsolete archived documentation
2. Creates new organized directory structure  
3. Moves files to appropriate locations
4. Updates main README with new navigation

Example:
  node tools/reorganize-docs.js --dry-run    # Preview changes
  node tools/reorganize-docs.js              # Apply changes
`);
  process.exit(0);
}

// Run the reorganizer
const reorganizer = new DocumentationReorganizer();
reorganizer.run();