#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function getNextAvailablePort() {
  const configPath = path.join(__dirname, '..', 'demo-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  const usedPorts = new Set(Object.keys(config.portAllocation.reserved).map(p => parseInt(p)));
  
  for (let port = config.portAllocation.rangeStart; port <= config.portAllocation.rangeEnd; port++) {
    if (!usedPorts.has(port)) {
      return port;
    }
  }
  
  throw new Error('No available ports in range');
}

function updateDemoConfig(demoName, demoConfig, port) {
  const configPath = path.join(__dirname, '..', 'demo-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  // Add demo to config
  config.demos[demoName] = demoConfig;
  
  // Reserve port
  config.portAllocation.reserved[port] = demoName;
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function createDemoFromTemplate(demoName, options) {
  const demosDir = path.join(__dirname, '..');
  const templateDir = path.join(demosDir, 'examples', 'react-demo-template');
  const targetDir = path.join(demosDir, demoName);
  
  if (fs.existsSync(targetDir)) {
    console.error(`${colors.red}Error: Demo ${demoName} already exists${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.cyan}Creating demo: ${demoName}${colors.reset}`);
  
  // Copy template
  console.log(`${colors.blue}Copying template...${colors.reset}`);
  execSync(`cp -r "${templateDir}" "${targetDir}"`);
  
  const port = getNextAvailablePort();
  
  // Update package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  packageJson.name = `@portfolio/${demoName}`;
  packageJson.description = options.description || `Demo for ${demoName}`;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  // Update vite.config.js with unique port
  const viteConfigPath = path.join(targetDir, 'vite.config.js');
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
  viteConfig = viteConfig.replace(/port:\s*\d+/, `port: ${port}`);
  fs.writeFileSync(viteConfigPath, viteConfig);
  
  // Update App.jsx with demo-specific content
  const appPath = path.join(targetDir, 'src', 'App.jsx');
  let appContent = fs.readFileSync(appPath, 'utf-8');
  
  appContent = appContent.replace(
    /url="[^"]*"/,
    `url="${options.url || `${demoName}.example.com`}"`
  );
  
  if (options.browserTheme) {
    appContent = appContent.replace(
      /(<DemoWrapper[^>]*)/,
      `$1 browserTheme="${options.browserTheme}"`
    );
  }
  
  fs.writeFileSync(appPath, appContent);
  
  // Create demo config
  const demoConfig = {
    name: options.name || demoName,
    type: options.type || 'consumer',
    browserTheme: options.browserTheme || 'mac',
    showBackground: options.showBackground !== false,
    url: options.url || `${demoName}.example.com`,
    description: options.description || `Demo for ${demoName}`,
    requiresOnboarding: options.onboarding || false
  };
  
  if (options.specialInstructions) {
    demoConfig.specialInstructions = options.specialInstructions;
  }
  
  // Update demo-config.json
  updateDemoConfig(demoName, demoConfig, port);
  
  // Create README
  const readmePath = path.join(targetDir, 'README.md');
  const readmeContent = `# ${demoConfig.name}

## Overview
${demoConfig.description}

## Development
\`\`\`bash
npm install
npm run dev     # Starts development server on port ${port}
npm run build   # Production build
\`\`\`

## Demo Configuration
- Browser Theme: ${demoConfig.browserTheme}
- URL: ${demoConfig.url}
- Type: ${demoConfig.type}
- Port: ${port}

## Next Steps
1. Customize the demo content in src/App.jsx
2. Add your specific components
3. Run \`npm run validate:demos\` to verify compliance
4. Consider adding onboarding for guided tours
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  
  console.log(`${colors.green}✅ Demo created successfully!${colors.reset}`);
  console.log(`${colors.blue}Location: ${targetDir}${colors.reset}`);
  console.log(`${colors.blue}Port: ${port}${colors.reset}`);
  console.log(`${colors.blue}URL: ${demoConfig.url}${colors.reset}`);
  
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. cd demos/${demoName}`);
  console.log(`2. npm install`);
  console.log(`3. npm run dev`);
  console.log(`4. Edit src/App.jsx to build your demo`);
  console.log(`5. Run npm run validate:demos to check compliance`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`${colors.magenta}${colors.bold}Create New Portfolio Demo${colors.reset}`);
    console.log(`${colors.magenta}${'═'.repeat(30)}${colors.reset}\n`);
    console.log('Usage: npm run create:demo <demo-name> [options]');
    console.log('\nOptions:');
    console.log('  --name "Display Name"');
    console.log('  --url "demo.example.com"');
    console.log('  --type consumer|enterprise|design-system|template');
    console.log('  --browser-theme mac|windows|minimal');
    console.log('  --description "Demo description"');
    console.log('  --onboarding (adds onboarding requirement)');
    console.log('  --no-background (disables background pattern)');
    console.log('\nExample:');
    console.log('  npm run create:demo my-app-demo --name "My App" --url "myapp.com" --type consumer');
    process.exit(0);
  }
  
  const demoName = args[0];
  const options = {};
  
  // Parse options
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--name':
        options.name = value;
        break;
      case '--url':
        options.url = value;
        break;
      case '--type':
        options.type = value;
        break;
      case '--browser-theme':
        options.browserTheme = value;
        break;
      case '--description':
        options.description = value;
        break;
      case '--onboarding':
        options.onboarding = true;
        i--; // No value for this flag
        break;
      case '--no-background':
        options.showBackground = false;
        i--; // No value for this flag
        break;
    }
  }
  
  createDemoFromTemplate(demoName, options);
}

if (require.main === module) {
  main();
}

module.exports = { createDemoFromTemplate };