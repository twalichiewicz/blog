#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
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

// Validation rules with helpful error messages
const validationRules = {
  hasPackageJson: {
    check: (demoPath) => fs.existsSync(path.join(demoPath, 'package.json')),
    error: 'Missing package.json file',
    fix: 'Create package.json with: npm init -y'
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
    fix: 'Add to package.json dependencies: "@portfolio/demo-shared": "file:../shared"'
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
    check: (demoPath, allDemos) => {
      const viteConfigPath = path.join(demoPath, 'vite.config.js');
      if (!fs.existsSync(viteConfigPath)) return true; // Skip if no vite config
      
      const content = fs.readFileSync(viteConfigPath, 'utf-8');
      const portMatch = content.match(/port:\s*(\d+)/);
      if (!portMatch) return true; // Default port is OK for single demo
      
      const port = portMatch[1];
      const portsInUse = allDemos
        .filter(d => d !== path.basename(demoPath))
        .map(demo => {
          const configPath = path.join(path.dirname(demoPath), demo, 'vite.config.js');
          if (!fs.existsSync(configPath)) return null;
          const demoContent = fs.readFileSync(configPath, 'utf-8');
          const match = demoContent.match(/port:\s*(\d+)/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
      
      return !portsInUse.includes(port);
    },
    error: 'Port number conflicts with another demo',
    fix: 'Set a unique port in vite.config.js server settings (3001, 3002, 3003, etc.)'
  },
  
  usesDemoWrapper: {
    check: (demoPath, allDemos, demoName) => {
      // Check if it's a React demo first
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return true; // Skip validation
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      // Only check React demos
      if (!deps.react) return true;
      
      // Look for main app file
      const appFiles = ['src/App.jsx', 'src/App.tsx', 'src/app.jsx', 'src/app.tsx'];
      const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
      
      if (!appFile) return false;
      
      const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
      
      // Store details for better error messages
      this.details = {
        hasImport: content.includes('@portfolio/demo-shared'),
        usesDemoWrapper: content.includes('DemoWrapper'),
        appFile: appFile,
        demoName: demoName
      };
      
      return content.includes('DemoWrapper') && 
             content.includes('@portfolio/demo-shared');
    },
    error: 'React demo not using DemoWrapper component',
    getDetailedError: function() {
      if (!this.details) return this.error;
      
      const { hasImport, usesDemoWrapper, appFile, demoName } = this.details;
      
      if (!hasImport && !usesDemoWrapper) {
        return `${demoName} needs DemoWrapper integration. Currently using custom implementation in ${appFile}.`;
      } else if (hasImport && !usesDemoWrapper) {
        return `${demoName} imports @portfolio/demo-shared but doesn't use DemoWrapper component in ${appFile}.`;
      } else if (!hasImport && usesDemoWrapper) {
        return `${demoName} references DemoWrapper but missing import from @portfolio/demo-shared in ${appFile}.`;
      }
      return this.error;
    },
    fix: `Import and use DemoWrapper:
    
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';

function App() {
  return (
    <DemoWrapper url="your.demo.url">
      <YourContent />
    </DemoWrapper>
  );
}`,
    getDetailedFix: function(demoName) {
      const fixes = {
        'custom-install-demo': `For Autodesk Custom Install demo:
1. Replace the custom browser header (div with window controls) with DemoWrapper
2. Add to top of src/App.jsx:
   import { DemoWrapper } from '@portfolio/demo-shared';
   import '@portfolio/demo-shared/styles';
3. Wrap your content:
   <DemoWrapper url="manage.autodesk.com/custom-install" browserTheme="mac" showBackground={false}>
     {/* Remove custom header, keep everything else */}
   </DemoWrapper>`,
        
        'foreground-demo': `For Foreground Design System demo:
1. Keep your persona switching functionality
2. Add to top of src/App.jsx:
   import { DemoWrapper } from '@portfolio/demo-shared';
   import '@portfolio/demo-shared/styles';
3. Wrap your content (keep persona header inside):
   <DemoWrapper url="foreground.design/system" browserTheme="minimal">
     {/* Your existing demo with persona switching */}
   </DemoWrapper>`,
        
        'example-demo': `For Example demo:
1. Convert to React using the template in demos/examples/react-demo-template/
2. Or update current implementation to use DemoWrapper
3. This could be a showcase of all shared components`
      };
      
      return fixes[demoName] || this.fix;
    },
    severity: 'critical'
  },
  
  hasOnboardingAvailable: {
    check: (demoPath) => {
      // This is informational - not required but recommended
      const packagePath = path.join(demoPath, 'package.json');
      if (!fs.existsSync(packagePath)) return true;
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (!deps.react) return true;
      
      const appFiles = ['src/App.jsx', 'src/App.tsx', 'src/app.jsx', 'src/app.tsx'];
      const appFile = appFiles.find(f => fs.existsSync(path.join(demoPath, f)));
      
      if (!appFile) return true;
      
      const content = fs.readFileSync(path.join(demoPath, appFile), 'utf-8');
      return content.includes('DemoOnboarding');
    },
    error: 'Demo could benefit from onboarding (optional but recommended)',
    fix: `Consider adding DemoOnboarding for guided tours:

import { DemoWrapper, DemoOnboarding } from '@portfolio/demo-shared';

const steps = [
  {
    title: "Welcome",
    description: "Overview of your demo",
    developerNote: "Technical insights",
    businessImpact: "Value delivered"
  }
];

<DemoOnboarding steps={steps} demoTitle="Your Demo">
  <DemoWrapper>...</DemoWrapper>
</DemoOnboarding>`,
    severity: 'warning'
  },
  
  hasBuildOutput: {
    check: (demoPath) => {
      return fs.existsSync(path.join(demoPath, 'dist', 'index.html'));
    },
    error: 'No build output found (dist/index.html)',
    fix: 'Run: npm run build',
    severity: 'warning'
  },
  
  hasReadme: {
    check: (demoPath) => {
      return fs.existsSync(path.join(demoPath, 'README.md'));
    },
    error: 'Missing README.md documentation',
    fix: 'Create README.md explaining the demo purpose and features'
  },
  
  hasWorkingIframe: {
    check: (demoPath, allDemos, demoName) => {
      // This validation rule was incorrect - demos don't need iframe code
      // The demo IS the iframe content that gets loaded by the portfolio
      // Check if demo has proper build output for iframe loading
      
      const hasBuildOutput = fs.existsSync(path.join(demoPath, 'dist', 'index.html'));
      const hasViteConfig = fs.existsSync(path.join(demoPath, 'vite.config.js'));
      
      if (!hasViteConfig) return true; // Skip non-vite demos
      
      const viteConfig = fs.readFileSync(path.join(demoPath, 'vite.config.js'), 'utf-8');
      const hasRelativeBase = viteConfig.includes("base: './'") || viteConfig.includes('base: "./"');
      
      return hasBuildOutput && hasRelativeBase;
    },
    error: 'Demo not properly configured for iframe loading',
    fix: `Ensure demo can be loaded as iframe:
1. Build output should exist: npm run build
2. Vite config should have: base: './'
3. Demo content should work in iframe context`,
    severity: 'warning'
  }
};

// Main validation function
function validateDemo(demoPath, demoName, allDemos) {
  console.log(`\n${colors.cyan}${colors.bold}Validating: ${demoName}${colors.reset}`);
  console.log(`${'─'.repeat(50)}`);
  
  const results = {
    passed: [],
    warnings: [],
    errors: [],
    critical: []
  };
  
  for (const [ruleName, rule] of Object.entries(validationRules)) {
    try {
      const passed = rule.check(demoPath, allDemos, demoName);
      
      if (passed) {
        results.passed.push(ruleName);
      } else {
        const severity = rule.severity || 'error';
        
        // Get detailed error and fix messages if available
        const detailedError = rule.getDetailedError ? rule.getDetailedError() : rule.error;
        const detailedFix = rule.getDetailedFix ? rule.getDetailedFix(demoName) : rule.fix;
        
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
  
  // Display results
  if (results.critical.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ CRITICAL ISSUES:${colors.reset}`);
    results.critical.forEach(({ ruleName, error, fix }) => {
      console.log(`${colors.red}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}${colors.bold}⚠️  ERRORS:${colors.reset}`);
    results.errors.forEach(({ ruleName, error, fix }) => {
      console.log(`${colors.red}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}💡 SUGGESTIONS:${colors.reset}`);
    results.warnings.forEach(({ ruleName, error, fix }) => {
      console.log(`${colors.yellow}   • ${error}${colors.reset}`);
      console.log(`${colors.blue}     Fix: ${fix}${colors.reset}\n`);
    });
  }
  
  if (results.passed.length === Object.keys(validationRules).length) {
    console.log(`${colors.green}${colors.bold}✅ All checks passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.green}Passed: ${results.passed.length}/${Object.keys(validationRules).length} checks${colors.reset}`);
  }
  
  return {
    demo: demoName,
    ...results
  };
}

// Main execution
function main() {
  const demosDir = path.join(__dirname, '..');
  const demos = fs.readdirSync(demosDir)
    .filter(item => {
      const itemPath = path.join(demosDir, item);
      return fs.statSync(itemPath).isDirectory() && 
             !['build-scripts', 'shared', 'examples', 'node_modules'].includes(item);
    });
  
  console.log(`${colors.magenta}${colors.bold}🔍 Portfolio Demo Standards Validator${colors.reset}`);
  console.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}`);
  console.log(`Found ${demos.length} demos to validate\n`);
  
  const allResults = [];
  let hasFailures = false;
  
  // Validate each demo
  demos.forEach(demo => {
    const demoPath = path.join(demosDir, demo);
    const results = validateDemo(demoPath, demo, demos);
    allResults.push(results);
    
    if (results.critical.length > 0 || results.errors.length > 0) {
      hasFailures = true;
    }
  });
  
  // Summary
  console.log(`\n${colors.magenta}${colors.bold}📊 VALIDATION SUMMARY${colors.reset}`);
  console.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}\n`);
  
  const totalCritical = allResults.reduce((sum, r) => sum + r.critical.length, 0);
  const totalErrors = allResults.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = allResults.reduce((sum, r) => sum + r.warnings.length, 0);
  
  allResults.forEach(result => {
    const status = result.critical.length > 0 ? '❌' : 
                  result.errors.length > 0 ? '⚠️ ' : 
                  result.warnings.length > 0 ? '💡' : '✅';
    
    console.log(`${status} ${result.demo}: ` +
      `${result.passed.length} passed, ` +
      `${result.critical.length} critical, ` +
      `${result.errors.length} errors, ` +
      `${result.warnings.length} warnings`);
  });
  
  console.log(`\n${colors.bold}Total Issues:${colors.reset}`);
  console.log(`  Critical: ${totalCritical}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);
  
  // Best practices reminder
  console.log(`\n${colors.cyan}${colors.bold}📚 Best Practices:${colors.reset}`);
  console.log(`${colors.cyan}• Use DemoWrapper for consistent browser chrome${colors.reset}`);
  console.log(`${colors.cyan}• Implement DemoOnboarding for guided tours${colors.reset}`);
  console.log(`${colors.cyan}• Keep demos under 1MB bundle size${colors.reset}`);
  console.log(`${colors.cyan}• Test on mobile devices${colors.reset}`);
  console.log(`${colors.cyan}• Document your demo's purpose${colors.reset}`);
  
  // Generate copy-pastable feedback for failed demos
  if (hasFailures) {
    console.log(`\n${colors.magenta}${colors.bold}📋 COPY-PASTE FEEDBACK FOR EACH DEMO:${colors.reset}`);
    console.log(`${colors.magenta}${'═'.repeat(50)}${colors.reset}\n`);
    
    allResults.forEach(result => {
      if (result.critical.length > 0 || result.errors.length > 0 || result.warnings.length > 0) {
        console.log(`${colors.bold}For ${result.demo}:${colors.reset}`);
        console.log(`${'─'.repeat(50)}`);
        console.log(`Please update ${result.demo} to meet portfolio standards.\n`);
        
        if (result.critical.length > 0) {
          console.log('CRITICAL issues that must be fixed:');
          result.critical.forEach(issue => {
            console.log(`• ${issue.error}`);
          });
          console.log();
        }
        
        if (result.errors.length > 0) {
          console.log('Required fixes:');
          result.errors.forEach(issue => {
            console.log(`• ${issue.error}`);
          });
          console.log();
        }
        
        if (result.warnings.length > 0) {
          console.log('Recommended improvements:');
          result.warnings.forEach(issue => {
            console.log(`• ${issue.error}`);
          });
          console.log();
        }
        
        console.log('To fix these issues:');
        // Get unique fixes (avoid duplicates)
        const fixes = new Set();
        [...result.critical, ...result.errors].forEach(issue => {
          fixes.add(issue.fix);
        });
        
        let stepNumber = 1;
        fixes.forEach(fix => {
          console.log(`\n${stepNumber}. ${fix}`);
          stepNumber++;
        });
        
        console.log(`\nAfter making changes, run 'npm run validate:demos' to verify compliance.`);
        console.log(`Reference implementation: self-service-publishing-demo`);
        console.log(`Full guide: demos/MIGRATION_GUIDE.md\n`);
      }
    });
  }
  
  // Exit with error if critical issues or errors found
  if (hasFailures) {
    console.log(`\n${colors.red}${colors.bold}❌ Validation failed! Fix issues above before building.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ All demos meet minimum standards!${colors.reset}`);
  }
}

// Run validation
if (require.main === module) {
  main();
}

module.exports = { validateDemo, validationRules };