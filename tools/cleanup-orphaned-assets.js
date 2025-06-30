#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ContentValidator = require('./validate-content');

// ANSI colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class AssetCleanup {
  constructor() {
    this.validator = new ContentValidator();
    this.dryRun = process.argv.includes('--dry-run');
    this.interactive = process.argv.includes('--interactive');
    this.cleanupResults = {
      filesDeleted: 0,
      spaceFreed: 0,
      skipped: 0
    };
  }

  log(message, type = 'info') {
    const colorMap = {
      error: colors.red,
      warning: colors.yellow,
      success: colors.green,
      info: colors.blue
    };
    console.log(`${colorMap[type] || ''}${message}${colors.reset}`);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async askUserConfirmation(message) {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question(`${message} (y/N): `, (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }

  async cleanupOrphanedAssets() {
    this.log(`${colors.bold}🧹 Orphaned Asset Cleanup Tool${colors.reset}`, 'info');
    this.log(`${'═'.repeat(50)}\n`, 'info');

    if (this.dryRun) {
      this.log('🔍 DRY RUN MODE - No files will be deleted\n', 'warning');
    }

    // Run validation to find orphaned assets
    this.log('Finding orphaned assets...', 'info');
    
    // Manually run the orphaned asset detection
    this.validator.findOrphanedAssets();
    const orphanedAssets = this.validator.results.orphanedAssets;

    if (orphanedAssets.length === 0) {
      this.log('✅ No orphaned assets found!', 'success');
      return;
    }

    this.log(`Found ${orphanedAssets.length} orphaned assets\n`, 'warning');

    // Sort by size (largest first)
    orphanedAssets.sort((a, b) => b.size - a.size);

    // Show summary
    const totalSize = orphanedAssets.reduce((sum, asset) => sum + asset.size, 0);
    this.log(`Total wasted space: ${this.formatFileSize(totalSize)}\n`, 'warning');

    // Categorize assets for smarter cleanup
    const categories = this.categorizeAssets(orphanedAssets);
    
    // Show categories
    Object.entries(categories).forEach(([category, assets]) => {
      if (assets.length > 0) {
        const categorySize = assets.reduce((sum, asset) => sum + asset.size, 0);
        this.log(`${category}: ${assets.length} files (${this.formatFileSize(categorySize)})`, 'info');
      }
    });

    console.log(); // Empty line

    // Cleanup strategy
    if (this.interactive) {
      await this.interactiveCleanup(categories);
    } else {
      await this.automaticCleanup(categories);
    }

    // Show results
    this.showCleanupResults();
  }

  categorizeAssets(assets) {
    const categories = {
      'Large files (>1MB)': [],
      'Video duplicates': [],
      'Old screenshots': [],
      'Small images (<100KB)': [],
      'Documents': [],
      'Other': []
    };

    assets.forEach(asset => {
      const ext = path.extname(asset.path).toLowerCase();
      const basename = path.basename(asset.path).toLowerCase();

      if (asset.size > 1024 * 1024) {
        categories['Large files (>1MB)'].push(asset);
      } else if (['.mov', '.mp4', '.webm'].includes(ext) && this.isDuplicateVideo(asset, assets)) {
        categories['Video duplicates'].push(asset);
      } else if (basename.includes('screenshot') || basename.includes('screen') || basename.includes('capture')) {
        categories['Old screenshots'].push(asset);
      } else if (['.pdf', '.doc', '.docx'].includes(ext)) {
        categories['Documents'].push(asset);
      } else if (asset.size < 100 * 1024 && ['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        categories['Small images (<100KB)'].push(asset);
      } else {
        categories['Other'].push(asset);
      }
    });

    return categories;
  }

  isDuplicateVideo(asset, allAssets) {
    const baseName = path.basename(asset.path, path.extname(asset.path));
    const dirName = path.dirname(asset.path);
    
    // Check if there are other video files with the same base name
    const similarVideos = allAssets.filter(other => 
      other !== asset &&
      path.dirname(other.path) === dirName &&
      path.basename(other.path, path.extname(other.path)) === baseName &&
      ['.mov', '.mp4', '.webm'].includes(path.extname(other.path).toLowerCase())
    );

    return similarVideos.length > 0;
  }

  async interactiveCleanup(categories) {
    this.log('🤖 Interactive cleanup mode', 'info');
    
    for (const [category, assets] of Object.entries(categories)) {
      if (assets.length === 0) continue;

      const categorySize = assets.reduce((sum, asset) => sum + asset.size, 0);
      this.log(`\n📁 ${category} (${assets.length} files, ${this.formatFileSize(categorySize)})`, 'info');

      if (await this.askUserConfirmation(`Delete all files in "${category}"?`)) {
        await this.deleteAssets(assets);
      } else {
        this.log('  Skipped', 'warning');
        this.cleanupResults.skipped += assets.length;
      }
    }
  }

  async automaticCleanup(categories) {
    this.log('🤖 Automatic cleanup mode', 'info');
    
    // Conservative automatic cleanup - only safe categories
    const safeCategories = ['Video duplicates', 'Old screenshots'];
    
    for (const category of safeCategories) {
      const assets = categories[category];
      if (assets.length > 0) {
        this.log(`\nCleaning up: ${category}`, 'info');
        await this.deleteAssets(assets);
      }
    }

    // Show what was skipped
    const skippedCategories = Object.keys(categories).filter(cat => !safeCategories.includes(cat));
    if (skippedCategories.length > 0) {
      this.log('\n⚠️  Skipped categories (use --interactive for manual review):', 'warning');
      skippedCategories.forEach(category => {
        const assets = categories[category];
        if (assets.length > 0) {
          const size = assets.reduce((sum, asset) => sum + asset.size, 0);
          this.log(`  ${category}: ${assets.length} files (${this.formatFileSize(size)})`, 'warning');
          this.cleanupResults.skipped += assets.length;
        }
      });
    }
  }

  async deleteAssets(assets) {
    for (const asset of assets) {
      const fullPath = path.join(this.validator.postsDir, asset.path);
      
      if (this.dryRun) {
        this.log(`  [DRY RUN] Would delete: ${asset.path} (${this.formatFileSize(asset.size)})`, 'info');
      } else {
        try {
          fs.unlinkSync(fullPath);
          this.log(`  ✅ Deleted: ${asset.path} (${this.formatFileSize(asset.size)})`, 'success');
          this.cleanupResults.filesDeleted++;
          this.cleanupResults.spaceFreed += asset.size;
        } catch (error) {
          this.log(`  ❌ Failed to delete ${asset.path}: ${error.message}`, 'error');
        }
      }
    }
  }

  showCleanupResults() {
    this.log(`\n${colors.bold}📊 CLEANUP SUMMARY${colors.reset}`, 'info');
    this.log('═'.repeat(30), 'info');
    
    if (this.dryRun) {
      this.log('🔍 DRY RUN - No actual changes made', 'warning');
    }
    
    this.log(`Files deleted: ${this.cleanupResults.filesDeleted}`, 'success');
    this.log(`Space freed: ${this.formatFileSize(this.cleanupResults.spaceFreed)}`, 'success');
    this.log(`Files skipped: ${this.cleanupResults.skipped}`, 'warning');

    if (!this.dryRun && this.cleanupResults.filesDeleted > 0) {
      this.log('\n💡 Run content validation again to verify cleanup:', 'info');
      this.log('npm run validate:content', 'info');
    }
  }
}

// CLI execution
if (require.main === module) {
  const cleanup = new AssetCleanup();
  
  // Show usage if no args
  if (process.argv.length === 2) {
    console.log(`
${colors.bold}🧹 Orphaned Asset Cleanup Tool${colors.reset}

Usage:
  node tools/cleanup-orphaned-assets.js [options]

Options:
  --dry-run       Preview what would be deleted (no actual deletion)
  --interactive   Review each category before deletion
  
Examples:
  node tools/cleanup-orphaned-assets.js --dry-run
  node tools/cleanup-orphaned-assets.js --interactive
  node tools/cleanup-orphaned-assets.js  # Automatic safe cleanup
`);
    process.exit(0);
  }
  
  cleanup.cleanupOrphanedAssets().catch(console.error);
}

module.exports = AssetCleanup;