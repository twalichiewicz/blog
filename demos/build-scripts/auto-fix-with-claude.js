#!/usr/bin/env node

/**
 * Auto-fix failing tests with Claude API
 * This script catches test failures and automatically invokes Claude to fix them
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  maxRetries: 3,
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus-20240229', // or claude-3-sonnet-20240229 for faster/cheaper
  maxTokens: 4000,
  temperature: 0.2, // Lower temperature for more deterministic fixes
  enableAutoFix: process.env.CLAUDE_AUTO_FIX !== 'false',
  dryRun: process.env.DRY_RUN === 'true'
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Call Claude API to get fix suggestions
 */
async function callClaudeAPI(prompt) {
  if (!CONFIG.apiKey) {
    throw new Error('CLAUDE_API_KEY or ANTHROPIC_API_KEY environment variable not set');
  }

  const requestData = JSON.stringify({
    model: CONFIG.model,
    max_tokens: CONFIG.maxTokens,
    temperature: CONFIG.temperature,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': requestData.length,
      'x-api-key': CONFIG.apiKey,
      'anthropic-version': '2023-06-01'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.content[0].text);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(requestData);
    req.end();
  });
}

/**
 * Parse validation errors from the output
 */
function parseValidationErrors(output) {
  const errors = [];
  const lines = output.split('\n');
  
  let currentDemo = null;
  let currentErrors = [];
  
  for (const line of lines) {
    // Match demo name
    const demoMatch = line.match(/Validating: (.+)/);
    if (demoMatch) {
      if (currentDemo && currentErrors.length > 0) {
        errors.push({ demo: currentDemo, errors: currentErrors });
      }
      currentDemo = demoMatch[1];
      currentErrors = [];
    }
    
    // Match errors and warnings
    const errorMatch = line.match(/[❌🔴⚠️💡]\s+(.+)/);
    if (errorMatch && currentDemo) {
      currentErrors.push(errorMatch[1]);
    }
    
    // Capture fix suggestions
    const fixMatch = line.match(/Fix:\s+(.+)/);
    if (fixMatch && currentErrors.length > 0) {
      currentErrors[currentErrors.length - 1] += `\nSuggested fix: ${fixMatch[1]}`;
    }
  }
  
  // Don't forget the last demo
  if (currentDemo && currentErrors.length > 0) {
    errors.push({ demo: currentDemo, errors: currentErrors });
  }
  
  return errors;
}

/**
 * Generate a prompt for Claude to fix the issues
 */
function generateFixPrompt(errors, demoPath) {
  const demoFiles = {
    'App.jsx': fs.existsSync(path.join(demoPath, 'src/App.jsx')) ? 
      fs.readFileSync(path.join(demoPath, 'src/App.jsx'), 'utf8') : null,
    'package.json': fs.existsSync(path.join(demoPath, 'package.json')) ? 
      fs.readFileSync(path.join(demoPath, 'package.json'), 'utf8') : null
  };

  return `You are a code fixing assistant. Fix the following validation errors in a React demo project.

Demo: ${errors.demo}
Path: ${demoPath}

Validation Errors:
${errors.errors.map(e => `- ${e}`).join('\n')}

Current App.jsx:
\`\`\`jsx
${demoFiles['App.jsx'] || 'File not found'}
\`\`\`

Current package.json:
\`\`\`json
${demoFiles['package.json'] || 'File not found'}
\`\`\`

Please provide the exact fixes needed:
1. If code changes are needed, provide the complete updated file content
2. If configuration changes are needed, specify exactly what to change
3. Format your response as JSON with this structure:
{
  "fixes": [
    {
      "file": "src/App.jsx",
      "action": "update",
      "content": "full file content here"
    }
  ],
  "explanation": "Brief explanation of what was fixed"
}

Only include files that need changes. Ensure all fixes follow the demo standards.`;
}

/**
 * Apply fixes from Claude's response
 */
function applyFixes(fixes, demoPath) {
  if (CONFIG.dryRun) {
    console.log(`${colors.yellow}[DRY RUN] Would apply fixes:${colors.reset}`);
    console.log(JSON.stringify(fixes, null, 2));
    return true;
  }

  try {
    for (const fix of fixes.fixes) {
      const filePath = path.join(demoPath, fix.file);
      
      switch (fix.action) {
        case 'update':
        case 'create':
          // Ensure directory exists
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Write the file
          fs.writeFileSync(filePath, fix.content);
          console.log(`${colors.green}✓ ${fix.action === 'create' ? 'Created' : 'Updated'}: ${fix.file}${colors.reset}`);
          break;
          
        case 'delete':
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`${colors.green}✓ Deleted: ${fix.file}${colors.reset}`);
          }
          break;
      }
    }
    
    if (fixes.explanation) {
      console.log(`${colors.cyan}Explanation: ${fixes.explanation}${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error applying fixes: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Run validation and auto-fix if needed
 */
async function runWithAutoFix() {
  console.log(`${colors.bright}${colors.magenta}🤖 Claude Auto-Fix System${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (!CONFIG.enableAutoFix) {
    console.log(`${colors.yellow}Auto-fix is disabled. Set CLAUDE_AUTO_FIX=true to enable.${colors.reset}`);
    // Just run the validation normally
    try {
      execSync('node demos/build-scripts/validate-demo-standards-v2.js', { stdio: 'inherit' });
      return 0;
    } catch (error) {
      return error.status || 1;
    }
  }

  let retries = 0;
  
  while (retries < CONFIG.maxRetries) {
    try {
      console.log(`${colors.blue}Running validation... (attempt ${retries + 1}/${CONFIG.maxRetries})${colors.reset}\n`);
      
      // Run validation and capture output
      const output = execSync('node demos/build-scripts/validate-demo-standards-v2.js', {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(output);
      console.log(`${colors.green}${colors.bright}✅ All validations passed!${colors.reset}`);
      return 0;
      
    } catch (error) {
      const output = error.stdout ? error.stdout.toString() : '';
      const errorOutput = error.stderr ? error.stderr.toString() : '';
      
      console.log(output);
      if (errorOutput) console.error(errorOutput);
      
      // Parse errors from the output
      const errors = parseValidationErrors(output);
      
      if (errors.length === 0) {
        console.log(`${colors.red}Validation failed but no specific errors were parsed.${colors.reset}`);
        return 1;
      }
      
      console.log(`\n${colors.yellow}${colors.bright}🔧 Attempting auto-fix with Claude...${colors.reset}`);
      
      // Process each demo with errors
      let allFixed = true;
      
      for (const errorSet of errors) {
        const demoPath = path.join(__dirname, '../../demos', errorSet.demo);
        
        if (!fs.existsSync(demoPath)) {
          console.error(`${colors.red}Demo path not found: ${demoPath}${colors.reset}`);
          allFixed = false;
          continue;
        }
        
        try {
          console.log(`\n${colors.cyan}Fixing ${errorSet.demo}...${colors.reset}`);
          
          // Generate prompt for Claude
          const prompt = generateFixPrompt(errorSet, demoPath);
          
          // Call Claude API
          const response = await callClaudeAPI(prompt);
          
          // Parse Claude's response
          let fixes;
          try {
            // Extract JSON from response (Claude might include explanation text)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              fixes = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON found in response');
            }
          } catch (parseError) {
            console.error(`${colors.red}Failed to parse Claude's response: ${parseError.message}${colors.reset}`);
            console.log('Response:', response);
            allFixed = false;
            continue;
          }
          
          // Apply the fixes
          const success = applyFixes(fixes, demoPath);
          if (!success) {
            allFixed = false;
          }
          
        } catch (apiError) {
          console.error(`${colors.red}Claude API error: ${apiError.message}${colors.reset}`);
          allFixed = false;
        }
      }
      
      if (!allFixed) {
        console.log(`\n${colors.red}Some fixes could not be applied automatically.${colors.reset}`);
        return 1;
      }
      
      // Increment retry counter
      retries++;
      
      if (retries < CONFIG.maxRetries) {
        console.log(`\n${colors.blue}Re-running validation after fixes...${colors.reset}\n`);
      }
    }
  }
  
  console.log(`\n${colors.red}Max retries (${CONFIG.maxRetries}) reached. Some issues could not be fixed automatically.${colors.reset}`);
  return 1;
}

// Run the auto-fix system
if (require.main === module) {
  runWithAutoFix()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = { runWithAutoFix, callClaudeAPI, parseValidationErrors };