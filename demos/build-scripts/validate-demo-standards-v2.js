#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Load demo configuration
function loadDemoConfig() {
  const configPath = path.join(__dirname, '..', 'demo-config.json');
  if (!fs.existsSync(configPath)) {
    console.error(`${colors.red}Error: demo-config.json not found at ${configPath}${colors.reset}`);
    process.exit(1);
  }
  
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {
    console.error(`${colors.red}Error parsing demo-config.json: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Universal validation rules that apply to all demos
const universalRules = {
  hasPackageJson: {
    check: (demoPath) => fs.existsSync(path.join(demoPath, 'package.json')),
    error: 'Missing package.json file',
    fix: 'Create package.json with: npm init -y',
    severity: 'critical'
  },
  
  hasCorrectDependencies: {
    check: (demoPath) => {
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return false;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      return deps['@portfolio/demo-shared'] !== undefined;
    },
    error: 'Missing @portfolio/demo-shared dependency',
    fix: 'Add to package.json dependencies: "@portfolio/demo-shared": "file:../shared"',
    severity: 'error'
  },
  
  hasViteConfig: {
    check: (demoPath) => {
      const viteConfigPath = path.join(demoPath, 'vite.config.js');
      if (!fs.existsSync(viteConfigPath)) return false;
      
      const content = fs.readFileSync(viteConfigPath, 'utf-8');
      return content.includes("base: './'") || content.includes('base: "./"');
    },
    error: 'Vite config missing or base path not set to relative',
    fix: 'Ensure vite.config.js contains: base: "./"',
    severity: 'critical'
  },
  
  hasUniquePort: {
    check: (demoPath, demoName, config) => {
      const viteConfigPath = path.join(demoPath, 'vite.config.js');
      if (!fs.existsSync(viteConfigPath)) return true;
      
      const content = fs.readFileSync(viteConfigPath, 'utf-8');
      const portMatch = content.match(/port:\s*(\d+)/);
      if (!portMatch) return true;
      
      const port = parseInt(portMatch[1]);
      const reservedPorts = config.portAllocation.reserved;
      
      // Check if port is reserved for this demo
      if (reservedPorts[port] === demoName) return true;
      
      // Check if port is reserved for another demo
      if (reservedPorts[port] && reservedPorts[port] !== demoName) {
        this.conflictWith = reservedPorts[port];
        return false;
      }
      
      // Check if port is in valid range
      return port >= config.portAllocation.rangeStart && port <= config.portAllocation.rangeEnd;
    },
    error: 'Port number conflicts or outside valid range',
    getDetailedError: function() {
      if (this.conflictWith) {
        return `Port conflicts with ${this.conflictWith}`;
      }
      return 'Port outside valid range (3001-3099)';
    },
    fix: 'Set a unique port in vite.config.js server settings',
    severity: 'error'
  },
  
  usesDemoWrapper: {
    check: (demoPath, demoName, config) => {
      const demoConfig = config.demos[demoName];
      if (demoConfig?.skipStandardValidation?.includes('usesDemoWrapper')) return true;
      
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return true;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (!deps.react) return true;
      
      const appFiles = ['src/App.jsx', 'src/App.tsx', 'src/app.jsx', 'src/app.tsx'];
      const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
      
      if (!appFile) return false;
      
      const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
      
      this.appFile = appFile;
      this.hasImport = content.includes('@portfolio/demo-shared');
      this.usesDemoWrapper = content.includes('DemoWrapper');
      
      return this.usesDemoWrapper && this.hasImport;
    },
    error: 'React demo not using DemoWrapper component',
    getDetailedError: function(demoName, config) {
      const demoConfig = config.demos[demoName];
      const name = demoConfig?.name || demoName;
      
      if (!this.hasImport && !this.usesDemoWrapper) {
        return `${name} needs DemoWrapper integration. Currently using custom implementation in ${this.appFile}.`;
      } else if (this.hasImport && !this.usesDemoWrapper) {
        return `${name} imports @portfolio/demo-shared but doesn't use DemoWrapper component in ${this.appFile}.`;
      } else if (!this.hasImport && this.usesDemoWrapper) {
        return `${name} references DemoWrapper but missing import from @portfolio/demo-shared in ${this.appFile}.`;
      }
      return this.error;
    },
    getDetailedFix: function(demoName, config) {
      const demoConfig = config.demos[demoName];
      if (!demoConfig) return this.fix;
      
      const { browserTheme = 'mac', showBackground = true, url, specialInstructions } = demoConfig;
      
      let fix = `For ${demoConfig.name}:\n`;
      
      if (specialInstructions) {
        fix += `Special notes: ${specialInstructions}\n\n`;
      }
      
      fix += `1. Add to top of ${this.appFile}:\n`;
      fix += `   import { DemoWrapper } from '@portfolio/demo-shared';\n`;
      fix += `   import '@portfolio/demo-shared/styles';\n\n`;
      fix += `2. Wrap your content:\n`;
      fix += `   <DemoWrapper`;
      if (url) fix += ` url="${url}"`;
      if (browserTheme !== 'mac') fix += ` browserTheme="${browserTheme}"`;
      if (!showBackground) fix += ` showBackground={false}`;
      fix += `>\n     {/* Your existing content */}\n   </DemoWrapper>`;
      
      return fix;
    },
    fix: 'Use DemoWrapper component',
    severity: 'critical'
  },
  
  hasOnboarding: {
    check: (demoPath, demoName, config) => {
      const demoConfig = config.demos[demoName];
      if (!demoConfig?.requiresOnboarding) return true;
      if (demoConfig?.skipStandardValidation?.includes('hasOnboardingAvailable')) return true;
      
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return true;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (!deps.react) return true;
      
      const appFiles = ['src/App.jsx', 'src/App.tsx'];
      const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
      
      if (!appFile) return true;
      
      const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
      return content.includes('DemoOnboarding');
    },
    error: 'Demo configured to require onboarding but not implemented',
    fix: 'Add DemoOnboarding wrapper for guided tours',
    severity: 'warning'
  },
  
  hasReadme: {
    check: (demoPath) => fs.existsSync(path.join(demoPath, 'README.md')),
    error: 'Missing README.md documentation',
    fix: 'Create README.md explaining the demo purpose and features',
    severity: 'error'
  },
  
  noDemoInlineFlag: {
    check: (demoPath, demoName, config) => {
      // Check if corresponding portfolio post uses demo_inline flag
      const postsDir = path.join(__dirname, '../../source/_posts');
      if (!fs.existsSync(postsDir)) return true;
      
      const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      for (const post of posts) {
        const postPath = path.join(postsDir, post);
        const content = fs.readFileSync(postPath, 'utf-8');
        
        // Check if this post references this demo and uses demo_inline
        if (content.includes(`demo_component: "${demoName}"`) && content.includes('demo_inline:')) {
          return false;
        }
      }
      
      return true;
    },
    error: 'Portfolio post uses deprecated demo_inline flag',
    fix: `New standard: Remove 'demo_inline: true' from the portfolio post. 
    
Demos should:
1. Always appear inline in hero section for preview
2. Always have demo button for fullscreen with onboarding
3. Hide onboarding content when in iframe (automatic)`,
    severity: 'warning'
  },
  
  hasBuildOutput: {
    check: (demoPath) => fs.existsSync(path.join(demoPath, 'dist', 'index.html')),
    error: 'No build output found (dist/index.html)',
    fix: 'Run: npm run build',
    severity: 'warning'
  },
  
  usesCustomCursor: {
    check: (demoPath, demoName, config) => {
      const demoConfig = config.demos[demoName];
      if (demoConfig?.skipStandardValidation?.includes('usesCustomCursor')) return true;
      
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return true;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (!deps.react) return true;
      
      const appFiles = ['src/App.jsx', 'src/App.tsx', 'src/app.jsx', 'src/app.tsx'];
      const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
      
      if (!appFile) return true;
      
      const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
      
      // Check if DemoWrapper includes customCursor prop
      this.hasCustomCursor = content.includes('customCursor');
      
      return this.hasCustomCursor;
    },
    error: 'Demo should use customCursor prop for app-like experience',
    getDetailedError: function(demoName, config) {
      const demoConfig = config.demos[demoName];
      const demoType = demoConfig?.type;
      const typeDefaults = config.demoTypes[demoType];
      const expectedCursor = demoConfig?.customCursor || typeDefaults?.customCursor || 'pointer';
      
      return `Add customCursor="${expectedCursor}" to DemoWrapper to distinguish demos from regular website`;
    },
    fix: 'Add customCursor prop to DemoWrapper component',
    severity: 'warning'
  }
};

// Generate custom validation rules from demo config
function generateCustomRules(config) {
  const customRules = {};
  
  Object.entries(config.demos).forEach(([demoName, demoConfig]) => {
    if (demoConfig.customValidation) {
      Object.entries(demoConfig.customValidation).forEach(([ruleName, ruleConfig]) => {
        const ruleKey = `${demoName}_${ruleName}`;
        
        customRules[ruleKey] = {
          check: (demoPath, currentDemoName) => {
            // Only run this rule for the specific demo
            if (currentDemoName !== demoName) return true;
            if (!ruleConfig.enabled) return true;
            
            // Custom validation logic based on rule name
            switch (ruleName) {
              case 'hasWorkingIframe':
                return checkIframeImplementation(demoPath);
              default:
                return true;
            }
          },
          error: ruleConfig.error || 'Custom validation failed',
          fix: ruleConfig.fix || 'See demo configuration for fix instructions',
          severity: ruleConfig.severity || 'warning'
        };
      });
    }
  });
  
  return customRules;
}

function checkIframeImplementation(demoPath) {
  const appFiles = ['src/App.jsx', 'src/App.tsx'];
  const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
  
  if (!appFile) return true;
  
  const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
  
  return content.includes('<iframe') || 
         content.includes('iframe.contentWindow') ||
         content.includes('iframeRef');
}

// Main validation function
function validateDemo(demoPath, demoName, config) {
  console.log(`\n${colors.cyan}${colors.bold}Validating: ${demoName}${colors.reset}`);
  
  const demoConfig = config.demos[demoName] || {};
  const demoType = config.demoTypes[demoConfig.type] || {};
  
  if (demoConfig.name) {
    console.log(`${colors.blue}Demo: ${demoConfig.name}${colors.reset}`);
  }
  
  console.log(`${'─'.repeat(50)}`);
  
  // Combine universal rules with custom rules
  const customRules = generateCustomRules(config);
  const allRules = { ...universalRules, ...customRules };
  
  const results = {
    passed: [],
    warnings: [],
    errors: [],
    critical: []
  };
  
  for (const [ruleName, rule] of Object.entries(allRules)) {
    try {
      const passed = rule.check(demoPath, demoName, config);
      
      if (passed) {
        results.passed.push(ruleName);
      } else {
        const severity = rule.severity || 'error';
        
        const detailedError = rule.getDetailedError ? 
          rule.getDetailedError(demoName, config) : rule.error;
        const detailedFix = rule.getDetailedFix ? 
          rule.getDetailedFix(demoName, config) : rule.fix;
        
        const issueData = {
          ruleName,
          error: detailedError,
          fix: detailedFix,
          severity
        };
        
        if (severity === 'critical') {
          results.critical.push(issueData);
        } else if (severity === 'warning') {
          results.warnings.push(issueData);
        } else {
          results.errors.push(issueData);
        }
      }
    } catch (error) {
      console.error(`${colors.red}Error checking ${ruleName}: ${error.message}${colors.reset}`);
    }
  }
  
  // Display results (same as before)
  if (results.critical.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ CRITICAL ISSUES:${colors.reset}`);
    results.critical.forEach(({ error, fix }) => {
      console.log(`${colors.red}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}${colors.bold}⚠️  ERRORS:${colors.reset}`);
    results.errors.forEach(({ error, fix }) => {
      console.log(`${colors.red}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}💡 SUGGESTIONS:${colors.reset}`);
    results.warnings.forEach(({ error, fix }) => {
      console.log(`${colors.yellow}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.passed.length === Object.keys(allRules).length) {
    console.log(`${colors.green}${colors.bold}✅ All checks passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.green}Passed: ${results.passed.length}/${Object.keys(allRules).length} checks${colors.reset}`);
  }
  
  return {
    demo: demoName,
    ...results
  };
}

// Auto-discovery of demos with configuration fallback
function discoverDemos(config) {
  const demosDir = path.join(__dirname, '..');
  const discoveredDemos = fs.readdirSync(demosDir)
    .filter(item => {
      const itemPath = path.join(demosDir, item);
      return fs.statSync(itemPath).isDirectory() && 
             !['build-scripts', 'shared', 'examples', 'node_modules'].includes(item);
    });
  
  // Check for demos not in config
  const configuredDemos = Object.keys(config.demos);
  const unconfiguredDemos = discoveredDemos.filter(demo => !configuredDemos.includes(demo));
  
  if (unconfiguredDemos.length > 0) {
    console.log(`${colors.yellow}⚠️  Found unconfigured demos: ${unconfiguredDemos.join(', ')}${colors.reset}`);
    console.log(`${colors.yellow}   Add them to demo-config.json for proper validation${colors.reset}\n`);
  }
  
  return discoveredDemos;
}

function main() {
  const config = loadDemoConfig();
  
  console.log(`${colors.magenta}${colors.bold}🔍 Portfolio Demo Standards Validator v2${colors.reset}`);
  console.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}`);
  
  const allDemos = discoverDemos(config);
  
  // Filter out code-toys and other excluded demos
  const demosToValidate = allDemos.filter(demo => {
    const demoConfig = config.demos[demo];
    const demoType = demoConfig?.type;
    const typeConfig = config.demoTypes[demoType];
    
    return !(demoConfig?.excludeFromValidation || 
             demoConfig?.skipAllValidation || 
             typeConfig?.excludeFromValidation ||
             demoType === 'code-toy');
  });
  
  const excludedDemos = allDemos.filter(demo => !demosToValidate.includes(demo));
  
  console.log(`Found ${allDemos.length} total demos`);
  console.log(`Validating ${demosToValidate.length} demos (${excludedDemos.length} excluded)\n`);
  
  if (excludedDemos.length > 0) {
    console.log(`${colors.cyan}📝 Excluded from validation: ${excludedDemos.join(', ')} (code-toys/blog components)${colors.reset}\n`);
  }
  
  const allResults = [];
  let hasFailures = false;
  
  demosToValidate.forEach(demo => {
    const demoPath = path.join(__dirname, '..', demo);
    const results = validateDemo(demoPath, demo, config);
    allResults.push(results);
    
    if (results.critical.length > 0 || results.errors.length > 0) {
      hasFailures = true;
    }
  });
  
  // Summary and copy-paste sections (same as before but with config awareness)
  console.log(`\n${colors.magenta}${colors.bold}📊 VALIDATION SUMMARY${colors.reset}`);
  console.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}\n`);
  
  allResults.forEach(result => {
    const status = result.critical.length > 0 ? '❌' : 
                  result.errors.length > 0 ? '⚠️ ' : 
                  result.warnings.length > 0 ? '💡' : '✅';
    
    const demoConfig = config.demos[result.demo];
    const displayName = demoConfig?.name || result.demo;
    
    console.log(`${status} ${displayName}: ` +
      `${result.passed.length} passed, ` +
      `${result.critical.length} critical, ` +
      `${result.errors.length} errors, ` +
      `${result.warnings.length} warnings`);
  });
  
  if (hasFailures) {
    console.log(`\n${colors.red}${colors.bold}❌ Validation failed! Fix issues above before building.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ All demos meet minimum standards!${colors.reset}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateDemo, loadDemoConfig };