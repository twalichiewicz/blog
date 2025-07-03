#!/usr/bin/env node

/**
 * Build All Demos Script
 * 
 * This script validates demo standards, builds all demo projects, 
 * and copies them to the Hexo source directory for inclusion in the blog build process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
// Load demo configuration for filtering
function loadDemoConfig() {
  const configPath = path.join(__dirname, '..', 'demo-config.json');
  if (!fs.existsSync(configPath)) {
    return { demos: {}, demoTypes: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.warn(`Warning: Could not load demo config: ${error.message}`);
    return { demos: {}, demoTypes: {} };
  }
}

const DEMOS_DIR = path.join(__dirname, '..');
const HEXO_DEMOS_DIR = path.join(__dirname, '../../themes/san-diego/source/demos');
const BUILD_LOG = [];

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    BUILD_LOG.push(logMessage);
}

function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        log(`Created directory: ${dirPath}`);
    }
}

function getDemoDirectories() {
    const config = loadDemoConfig();
    const entries = fs.readdirSync(DEMOS_DIR, { withFileTypes: true });
    const allDemos = entries
        .filter(entry => entry.isDirectory() && 
                entry.name !== 'build-scripts' && 
                entry.name !== 'examples' && 
                entry.name !== 'shared')
        .map(entry => entry.name);
    
    // Filter out code-toys and excluded demos
    const demosToBuild = allDemos.filter(demo => {
        const demoConfig = config.demos[demo];
        const demoType = demoConfig?.type;
        const typeConfig = config.demoTypes[demoType];
        
        const isExcluded = demoConfig?.excludeFromValidation || 
                          demoConfig?.skipAllValidation || 
                          typeConfig?.excludeFromValidation ||
                          demoType === 'code-toy';
        
        return !isExcluded;
    });
    
    const excludedDemos = allDemos.filter(demo => !demosToBuild.includes(demo));
    
    if (excludedDemos.length > 0) {
        log(`📝 Excluded from build: ${excludedDemos.join(', ')} (code-toys/blog components)`);
    }
    
    return demosToBuild;
}

function buildDemo(demoName, allDemos, skipValidation = false) {
    const demoPath = path.join(DEMOS_DIR, demoName);
    const packageJsonPath = path.join(demoPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        log(`⚠️  No package.json found for ${demoName}, skipping...`);
        return false;
    }

    try {
        log(`🔨 Building demo: ${demoName}`);
        
        // Skip validation for excluded demos (they were already filtered out)
        if (!skipValidation) {
            log(`🔍 Validating demo standards for ${demoName}...`);
            // Use v2 validation script which respects demo config
            try {
                execSync('node validate-demo-standards-v2.js', { 
                    cwd: path.join(__dirname), 
                    stdio: 'pipe' 
                });
            } catch (error) {
                log(`❌ Demo ${demoName} failed validation. Use --skip-validation to build anyway.`);
                return false;
            }
        }
        
        // Install dependencies (always in CI to ensure shared deps are linked)
        const nodeModulesPath = path.join(demoPath, 'node_modules');
        const isCI = process.env.CI === 'true';
        if (!fs.existsSync(nodeModulesPath) || isCI) {
            log(`📦 Installing dependencies for ${demoName}...`);
            // Force reinstall to ensure shared dependencies are properly linked
            execSync('npm install --force', { cwd: demoPath, stdio: 'pipe' });
        }
        
        // Build the demo
        log(`⚙️  Running build for ${demoName}...`);
        execSync('npm run build', { cwd: demoPath, stdio: 'pipe' });
        
        // Copy built files to Hexo source
        const distPath = path.join(demoPath, 'dist');
        const targetPath = path.join(HEXO_DEMOS_DIR, demoName);
        
        if (fs.existsSync(distPath)) {
            ensureDirectory(targetPath);
            
            // Remove existing files
            if (fs.existsSync(targetPath)) {
                fs.rmSync(targetPath, { recursive: true, force: true });
            }
            
            // Copy dist to target
            copyDirectory(distPath, targetPath);
            log(`✅ Successfully built and copied ${demoName}`);
            return true;
        } else {
            log(`❌ Build output not found for ${demoName} (expected: ${distPath})`);
            return false;
        }
        
    } catch (error) {
        log(`❌ Failed to build ${demoName}: ${error.message}`);
        return false;
    }
}

function copyDirectory(src, dest) {
    ensureDirectory(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function main() {
    log('🚀 Starting demo build process...');
    
    // Check for --skip-validation flag
    const skipValidation = process.argv.includes('--skip-validation');
    if (skipValidation) {
        log('⚠️  Skipping validation checks (--skip-validation flag used)');
    }
    
    // Ensure output directory exists
    ensureDirectory(HEXO_DEMOS_DIR);
    
    // Get all demo directories
    const demos = getDemoDirectories();
    
    if (demos.length === 0) {
        log('ℹ️  No demo projects found in demos/ directory');
        return;
    }
    
    log(`📁 Found ${demos.length} demo project(s): ${demos.join(', ')}`);
    
    // Install shared dependencies first (critical for CI)
    const sharedPath = path.join(DEMOS_DIR, 'shared');
    if (fs.existsSync(sharedPath)) {
        const sharedNodeModules = path.join(sharedPath, 'node_modules');
        if (!fs.existsSync(sharedNodeModules) || process.env.CI === 'true') {
            log('📦 Installing shared dependencies...');
            execSync('npm install', { cwd: sharedPath, stdio: 'pipe' });
        }
    }
    
    // First run validation on all demos to show complete report
    if (!skipValidation) {
        log('\n📋 Running validation checks on all demos...\n');
        execSync('node validate-demo-standards-v2.js', { 
            cwd: path.join(__dirname), 
            stdio: 'inherit' 
        });
        log('\n');
    }
    
    // Build each demo
    let successCount = 0;
    for (const demo of demos) {
        if (buildDemo(demo, demos, skipValidation)) {
            successCount++;
        }
    }
    
    // Summary
    log(`\n📊 Build Summary:`);
    log(`   Total demos: ${demos.length}`);
    log(`   Successful: ${successCount}`);
    log(`   Failed: ${demos.length - successCount}`);
    
    if (successCount === demos.length) {
        log('🎉 All demos built successfully!');
        process.exit(0);
    } else {
        log('⚠️  Some demos failed to build. Check logs above.');
        log('💡 Run "npm run validate:demos" to see all validation issues.');
        log('📚 See demos/shared/README.md for demo standards documentation.');
        process.exit(1);
    }
}

// Run the build process
if (require.main === module) {
    main();
}

module.exports = { buildDemo, getDemoDirectories };