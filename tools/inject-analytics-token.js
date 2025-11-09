#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get token from environment
const token = process.env.CLOUDFLARE_ANALYTICS_TOKEN;

if (!token) {
  console.warn('⚠️  Warning: CLOUDFLARE_ANALYTICS_TOKEN not set');
  console.warn('   Skipping analytics token injection');
  process.exit(0);
}

console.log('🔧 Injecting Cloudflare Analytics token...');

// Find all HTML files in the public directory that contain the hardcoded token
const publicDir = path.join(__dirname, '..', 'public');
const files = glob.sync('**/*.html', { cwd: publicDir });

let filesUpdated = 0;
const oldToken = 'e8fdac6a36f74464bcf2d55fbb7f0ca2';

files.forEach(file => {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file contains the old token
  if (content.includes(oldToken)) {
    // Replace the hardcoded token with the environment variable
    content = content.replace(
      new RegExp(oldToken, 'g'),
      token
    );
    
    fs.writeFileSync(filePath, content);
    filesUpdated++;
    console.log(`   ✓ Updated: ${file}`);
  }
});

console.log(`✅ Token injection complete! Updated ${filesUpdated} files.`);