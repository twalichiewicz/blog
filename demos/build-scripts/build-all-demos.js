#!/usr/bin/env node

/**
 * Build All Demos Script
 * 
 * This script builds all demo projects and copies them to the Hexo source directory
 * for inclusion in the blog build process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
    const entries = fs.readdirSync(DEMOS_DIR, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory() && entry.name !== 'build-scripts' && entry.name !== 'examples')
        .map(entry => entry.name);
}

function buildDemo(demoName) {
    const demoPath = path.join(DEMOS_DIR, demoName);
    const packageJsonPath = path.join(demoPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        log(`⚠️  No package.json found for ${demoName}, skipping...`);
        return false;
    }

    try {
        log(`🔨 Building demo: ${demoName}`);
        
        // Install dependencies if node_modules doesn't exist
        const nodeModulesPath = path.join(demoPath, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            log(`📦 Installing dependencies for ${demoName}...`);
            execSync('npm install', { cwd: demoPath, stdio: 'pipe' });
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
    
    // Ensure output directory exists
    ensureDirectory(HEXO_DEMOS_DIR);
    
    // Get all demo directories
    const demos = getDemoDirectories();
    
    if (demos.length === 0) {
        log('ℹ️  No demo projects found in demos/ directory');
        return;
    }
    
    log(`📁 Found ${demos.length} demo project(s): ${demos.join(', ')}`);
    
    // Build each demo
    let successCount = 0;
    for (const demo of demos) {
        if (buildDemo(demo)) {
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
        process.exit(1);
    }
}

// Run the build process
if (require.main === module) {
    main();
}

module.exports = { buildDemo, getDemoDirectories };