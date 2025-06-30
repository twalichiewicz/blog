#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class ContentValidator {
  constructor() {
    this.blogRoot = path.join(__dirname, '..');
    this.postsDir = path.join(this.blogRoot, 'source/_posts');
    this.demosDir = path.join(this.blogRoot, 'demos');
    this.sourceDir = path.join(this.blogRoot, 'source');
    
    this.results = {
      posts: [],
      errors: [],
      warnings: [],
      orphanedAssets: [],
      missingAssets: [],
      totalChecked: 0,
      totalErrors: 0,
      totalWarnings: 0
    };
  }

  log(message, type = 'info') {
    const colorMap = {
      error: colors.red,
      warning: colors.yellow,
      success: colors.green,
      info: colors.cyan
    };
    console.log(`${colorMap[type] || ''}${message}${colors.reset}`);
  }

  // Parse front matter from markdown file
  parseFrontMatter(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const frontMatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
      
      if (!frontMatterMatch) {
        return { frontMatter: null, content: content, error: 'No front matter found' };
      }

      const frontMatterStr = frontMatterMatch[1];
      const frontMatter = yaml.load(frontMatterStr);
      const postContent = content.replace(frontMatterMatch[0], '').trim();

      return { frontMatter, content: postContent, error: null };
    } catch (error) {
      return { frontMatter: null, content: null, error: error.message };
    }
  }

  // Validate individual post
  validatePost(filePath) {
    const fileName = path.basename(filePath);
    const postDir = path.dirname(filePath);
    const { frontMatter, content, error } = this.parseFrontMatter(filePath);

    const postResult = {
      file: fileName,
      path: filePath,
      errors: [],
      warnings: [],
      frontMatter,
      valid: true
    };

    // Check front matter parsing
    if (error) {
      postResult.errors.push(`Front matter parsing failed: ${error}`);
      postResult.valid = false;
      return postResult;
    }

    // Required fields validation
    const requiredFields = ['title', 'date'];
    requiredFields.forEach(field => {
      if (!frontMatter[field]) {
        postResult.errors.push(`Missing required field: ${field}`);
        postResult.valid = false;
      }
    });

    // Date validation
    if (frontMatter.date && isNaN(new Date(frontMatter.date))) {
      postResult.errors.push(`Invalid date format: ${frontMatter.date}`);
      postResult.valid = false;
    }

    // Check for demo component references
    if (frontMatter.demo_component) {
      const demoPath = path.join(this.demosDir, frontMatter.demo_component);
      if (!fs.existsSync(demoPath)) {
        postResult.errors.push(`Referenced demo component does not exist: ${frontMatter.demo_component}`);
        postResult.valid = false;
      }
    }

    // Check for deprecated demo_inline usage
    if (frontMatter.demo_inline) {
      postResult.warnings.push(`Using deprecated 'demo_inline' flag - remove per new demo standards`);
    }

    // Validate cover image
    if (frontMatter.cover_image) {
      const coverImagePath = this.resolveAssetPath(frontMatter.cover_image, postDir);
      if (!fs.existsSync(coverImagePath)) {
        postResult.errors.push(`Cover image not found: ${frontMatter.cover_image}`);
        postResult.valid = false;
      }
    }

    // Check images in content
    this.checkContentImages(content, postDir, postResult);

    // Check internal links
    this.checkInternalLinks(content, postResult);

    // Check for common issues
    this.checkCommonIssues(frontMatter, content, postResult);

    return postResult;
  }

  // Resolve asset paths (handles both relative and absolute)
  resolveAssetPath(assetPath, postDir) {
    if (assetPath.startsWith('/')) {
      return path.join(this.sourceDir, assetPath.substring(1));
    }
    return path.join(postDir, assetPath);
  }

  // Check images referenced in content
  checkContentImages(content, postDir, postResult) {
    // Match markdown images: ![alt](path) and HTML images: <img src="path">
    const imageRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["']([^"']+)["']/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[1] || match[2];
      if (!imagePath) continue;

      // Skip external URLs
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        continue;
      }

      const resolvedPath = this.resolveAssetPath(imagePath, postDir);
      if (!fs.existsSync(resolvedPath)) {
        postResult.errors.push(`Image not found: ${imagePath}`);
        postResult.valid = false;
      }
    }
  }

  // Check internal links
  checkInternalLinks(content, postResult) {
    // Match markdown links: [text](path) and HTML links: <a href="path">
    const linkRegex = /\[.*?\]\((.*?)\)|<a[^>]+href=["']([^"']+)["']/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const linkPath = match[1] || match[2];
      if (!linkPath) continue;

      // Skip external URLs, anchors, and mailto links
      if (linkPath.startsWith('http://') || 
          linkPath.startsWith('https://') || 
          linkPath.startsWith('#') ||
          linkPath.startsWith('mailto:')) {
        continue;
      }

      // Check for internal post references
      if (linkPath.startsWith('/')) {
        // This would need the generated site structure to validate properly
        // For now, just warn about potential issues
        if (!linkPath.includes('.html') && !linkPath.includes('#')) {
          postResult.warnings.push(`Internal link may need validation: ${linkPath}`);
        }
      }
    }
  }

  // Check for common issues
  checkCommonIssues(frontMatter, content, postResult) {
    // Check for empty content
    if (!content || content.trim().length < 50) {
      postResult.warnings.push('Post content is very short (less than 50 characters)');
    }

    // Check for missing display_name in portfolio posts
    if (frontMatter.tags && Array.isArray(frontMatter.tags) && frontMatter.tags.includes('portfolio') && !frontMatter.display_name) {
      postResult.warnings.push('Portfolio post missing display_name field');
    }

    // Check for draft posts that might be accidentally published
    if (frontMatter.draft === true) {
      postResult.warnings.push('Post is marked as draft');
    }

    // Check for very old dates (might be placeholder)
    if (frontMatter.date) {
      const postDate = new Date(frontMatter.date);
      const currentDate = new Date();
      const daysDiff = (currentDate - postDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 3650) { // 10 years
        postResult.warnings.push('Post is very old (over 10 years) - verify date is correct');
      }
    }

    // Check for TODO or placeholder content
    const todoRegex = /TODO|FIXME|PLACEHOLDER|Lorem ipsum/gi;
    if (todoRegex.test(content)) {
      postResult.warnings.push('Content contains TODO/placeholder text');
    }
  }

  // Find orphaned assets
  findOrphanedAssets() {
    this.log('🔍 Checking for orphaned assets...', 'info');
    
    try {
      // Get all posts
      const posts = glob.sync('**/*.md', { cwd: this.postsDir });
      const referencedAssets = new Set();

      // Collect all referenced assets
      posts.forEach(post => {
        const postPath = path.join(this.postsDir, post);
        const { frontMatter, content } = this.parseFrontMatter(postPath);
        
        if (frontMatter) {
          // Add cover image
          if (frontMatter.cover_image) {
            referencedAssets.add(frontMatter.cover_image);
          }

          // Add images from content
          const imageRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["']([^"']+)["']/g;
          let match;
          while ((match = imageRegex.exec(content || '')) !== null) {
            const imagePath = match[1] || match[2];
            if (imagePath && !imagePath.startsWith('http')) {
              referencedAssets.add(imagePath);
            }
          }
        }
      });

      // Find all assets in post directories
      const allAssets = glob.sync('**/*.{jpg,jpeg,png,gif,svg,mp4,webm,mov,pdf}', { 
        cwd: this.postsDir 
      });

      // Check which assets are not referenced
      allAssets.forEach(asset => {
        const assetPath = asset.replace(/\\/g, '/'); // Normalize path separators
        let isReferenced = false;
        
        // Check various possible reference formats
        for (const ref of referencedAssets) {
          if (ref.includes(path.basename(asset)) || 
              ref.includes(assetPath) ||
              assetPath.includes(ref)) {
            isReferenced = true;
            break;
          }
        }

        if (!isReferenced) {
          const fullPath = path.join(this.postsDir, asset);
          const stats = fs.statSync(fullPath);
          this.results.orphanedAssets.push({
            path: asset,
            size: stats.size,
            modified: stats.mtime
          });
        }
      });

    } catch (error) {
      this.log(`Error checking orphaned assets: ${error.message}`, 'error');
    }
  }

  // Main validation function
  async validateAllContent() {
    this.log(`${colors.bold}${colors.magenta}🔍 Content Integrity Validator${colors.reset}`);
    this.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}\n`);

    try {
      // Get all markdown files
      const posts = glob.sync('**/*.md', { cwd: this.postsDir });
      this.results.totalChecked = posts.length;

      this.log(`Found ${posts.length} posts to validate\n`, 'info');

      // Validate each post
      for (const post of posts) {
        const postPath = path.join(this.postsDir, post);
        const result = this.validatePost(postPath);
        this.results.posts.push(result);

        // Collect errors and warnings
        this.results.totalErrors += result.errors.length;
        this.results.totalWarnings += result.warnings.length;
        this.results.errors.push(...result.errors.map(e => `${post}: ${e}`));
        this.results.warnings.push(...result.warnings.map(w => `${post}: ${w}`));

        // Log immediate feedback
        if (result.errors.length > 0) {
          this.log(`❌ ${post}: ${result.errors.length} errors`, 'error');
        } else if (result.warnings.length > 0) {
          this.log(`⚠️  ${post}: ${result.warnings.length} warnings`, 'warning');
        } else {
          this.log(`✅ ${post}: OK`, 'success');
        }
      }

      // Check for orphaned assets
      this.findOrphanedAssets();

      // Display summary
      this.displaySummary();

    } catch (error) {
      this.log(`Fatal error during validation: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  // Display validation summary
  displaySummary() {
    this.log(`\n${colors.bold}${colors.magenta}📊 VALIDATION SUMMARY${colors.reset}`);
    this.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}\n`);

    this.log(`Posts checked: ${this.results.totalChecked}`, 'info');
    this.log(`Total errors: ${this.results.totalErrors}`, this.results.totalErrors > 0 ? 'error' : 'success');
    this.log(`Total warnings: ${this.results.totalWarnings}`, this.results.totalWarnings > 0 ? 'warning' : 'success');
    this.log(`Orphaned assets: ${this.results.orphanedAssets.length}`, this.results.orphanedAssets.length > 0 ? 'warning' : 'success');

    // Show detailed errors
    if (this.results.errors.length > 0) {
      this.log(`\n${colors.red}${colors.bold}❌ ERRORS:${colors.reset}`);
      this.results.errors.forEach(error => {
        this.log(`   ${error}`, 'error');
      });
    }

    // Show detailed warnings
    if (this.results.warnings.length > 0) {
      this.log(`\n${colors.yellow}${colors.bold}⚠️  WARNINGS:${colors.reset}`);
      this.results.warnings.forEach(warning => {
        this.log(`   ${warning}`, 'warning');
      });
    }

    // Show orphaned assets
    if (this.results.orphanedAssets.length > 0) {
      this.log(`\n${colors.yellow}${colors.bold}🗑️  ORPHANED ASSETS:${colors.reset}`);
      this.results.orphanedAssets.forEach(asset => {
        const sizeKB = Math.round(asset.size / 1024);
        this.log(`   ${asset.path} (${sizeKB}KB)`, 'warning');
      });

      const totalSize = this.results.orphanedAssets.reduce((sum, asset) => sum + asset.size, 0);
      const totalSizeMB = Math.round(totalSize / 1024 / 1024 * 100) / 100;
      this.log(`   Total wasted space: ${totalSizeMB}MB`, 'warning');
    }

    // Exit with appropriate code
    if (this.results.totalErrors > 0) {
      this.log(`\n${colors.red}${colors.bold}❌ Validation failed! ${this.results.totalErrors} errors found.${colors.reset}`);
      process.exit(1);
    } else {
      this.log(`\n${colors.green}${colors.bold}✅ Content validation passed!${colors.reset}`);
      if (this.results.totalWarnings > 0) {
        this.log(`${colors.yellow}${this.results.totalWarnings} warnings should be reviewed.${colors.reset}`);
      }
    }
  }
}

// CLI execution
if (require.main === module) {
  const validator = new ContentValidator();
  validator.validateAllContent();
}

module.exports = ContentValidator;