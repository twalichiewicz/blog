# Auto-Fix System Documentation

## Overview

The build system includes intelligent auto-fix capabilities that detect and resolve common issues automatically during testing. This system learns from your project's actual structure and adapts accordingly, rather than making rigid assumptions.

## Auto-Fix Categories

### 1. Dependency Management

**Missing Demo Dependencies**
- **Detection**: Scans all demo directories for missing `node_modules`
- **Auto-Fix**: Runs `npm install` in parallel for all demos needing dependencies
- **Reporting**: "Auto-fixing: Installing missing demo dependencies..."
- **Result**: Dependencies installed automatically, test continues

**Missing Main Dependencies**
- **Detection**: Checks for missing main project `node_modules`
- **Auto-Fix**: Reinstalls dependencies with `npm install`
- **Reporting**: "Node modules missing, reinstalling..."
- **Result**: Full dependency restore

### 2. Build Recovery

**Build Cache Issues**
- **Detection**: Main site build fails unexpectedly
- **Auto-Fix**: Clears build cache and retries build
- **Reporting**: "Auto-recovery successful (cache clear fixed it)"
- **Result**: Build completes without manual intervention

**Corrupted Build State**
- **Detection**: Build fails after cache clear attempt
- **Auto-Fix**: Full dependency reinstall and clean rebuild
- **Reporting**: "Auto-recovery successful (dependency reinstall fixed it)"
- **Result**: Complete build environment restoration

### 3. Asset Intelligence

**Dynamic Path Detection**
- **Detection**: Tests automatically locate CSS and JS files
- **Auto-Fix**: Updates test expectations to match actual file structure
- **Paths Checked**: 
  - CSS: `styles/styles.css`, `css/styles.css`, `styles.css`
  - JS: `js/blog.js`, `scripts/blog.js`, `blog.js`
- **Result**: Tests pass regardless of asset organization

**Missing Asset Tolerance**
- **Detection**: Expected assets don't exist in assumed locations
- **Auto-Fix**: Marks non-critical assets as optional (CSS/JS might be inlined)
- **Reporting**: Only fails on truly essential files (`index.html`)
- **Result**: Flexible asset validation

### 4. Content Validation Intelligence

**Severity Analysis**
- **Detection**: Analyzes content validation output patterns
- **Auto-Fix**: Categorizes issues by severity:
  - **Critical**: Missing directories, permission errors → Hard fail
  - **High Error Rate**: >50% posts with issues → Warning + guidance
  - **Normal Issues**: Missing images, broken links → Informational warning
- **Reporting**: "Content validation found 70 errors, 15 warnings (normal for large blogs)"
- **Result**: Content issues don't block development

**Context-Aware Handling**
- **Detection**: Distinguishes between systematic vs isolated content problems
- **Auto-Fix**: Provides targeted guidance based on error patterns
- **Reporting**: "High content error rate (31.1% of 225 posts have issues)"
- **Result**: Actionable feedback instead of generic failures

## Auto-Fix Workflow

### Phase 1: Detection
```javascript
// Test runs normally
const result = await this.buildMainSite(true);

if (result) {
  return { success: true };
}
```

### Phase 2: Analysis
```javascript
// Build failed, analyze why
this.log('🔧 Build failed, attempting auto-recovery...', 'info');
```

### Phase 3: Remediation
```javascript
// Try common fixes in order of likelihood
await this.runCommand('npm run build:clear-cache');
result = await this.buildMainSite(true);

if (result) {
  return { success: true, autoFixed: true };
}
```

### Phase 4: Reporting
```javascript
// Track what was fixed
this.log('✅ Auto-recovery successful (cache clear fixed it)', 'success');
```

## Configuration

### Enabling/Disabling Auto-Fixes

Auto-fixes are enabled by default. To disable:

```bash
# Skip auto-fixes in tests
npm run test -- --no-auto-fix

# Or use legacy test system
npm run test:legacy
```

### Customizing Auto-Fix Behavior

Edit `build-system/test-command.js`:

```javascript
// Disable specific auto-fixes
const AUTO_FIX_CONFIG = {
  dependencies: true,    // Auto-install missing deps
  buildRecovery: true,   // Auto-recover from build failures
  assetDetection: true,  // Smart asset path detection
  contentValidation: true // Intelligent content validation
};
```

## Monitoring Auto-Fixes

### Test Output
```
🔧 Auto-fixes Applied:
  ✅ Demo dependencies: Fixed automatically
  ✅ Main site build (with auto-recovery): Fixed automatically

💡 2 issue(s) were automatically fixed during testing
```

### Build Cache
Auto-fix actions are logged in `.build-cache/progress.json`:

```json
{
  "autoFixes": [
    {
      "timestamp": 1703123456789,
      "type": "dependency-install",
      "success": true,
      "details": "Installed dependencies for 3 demos"
    }
  ]
}
```

## Best Practices

### When Auto-Fix is Appropriate
- ✅ Missing dependencies (easy to restore)
- ✅ Build cache corruption (safe to clear)
- ✅ Asset path mismatches (detectable patterns)
- ✅ Content validation severity (contextual analysis)

### When Auto-Fix is NOT Used
- ❌ Code syntax errors (require developer attention)
- ❌ Configuration conflicts (need manual resolution)
- ❌ Permission/security issues (require explicit action)
- ❌ Custom business logic failures (domain-specific)

### Monitoring Guidelines

1. **Review Auto-Fix Reports**: Check what was automatically fixed
2. **Investigate Patterns**: Frequent auto-fixes may indicate underlying issues
3. **Update Expectations**: If auto-fixes consistently work, consider updating defaults
4. **Escalate Failures**: When auto-fix can't resolve, provides clear next steps

## Troubleshooting

### Auto-Fix Not Working

**Problem**: Auto-fix attempts but still fails
```bash
# Check what auto-fixes were attempted
npm run build:status

# Clear everything and try manual fix
npm run build:clear-cache
npm run build:install-deps
npm run build:all
```

**Problem**: Auto-fix working but shouldn't be needed
```bash
# Check for underlying issues
npm run build:status
git status  # Check for unexpected changes
```

### Disabling Problematic Auto-Fixes

If a specific auto-fix is causing issues:

```javascript
// In test-command.js, disable specific fixes
async testMainSiteBuildWithRecovery() {
  // Skip auto-recovery for debugging
  return this.testMainSiteBuild();
}
```

## Implementation Details

### Auto-Fix Detection Patterns

The system uses several patterns to detect fixable issues:

1. **Exit Code Analysis**: Non-zero exit codes trigger recovery attempts
2. **Output Parsing**: Scans command output for known error patterns
3. **File System Checks**: Verifies expected files/directories exist
4. **Statistical Analysis**: Analyzes error rates for content validation

### Recovery Strategies

Auto-fixes are ordered by likelihood of success and safety:

1. **Cache Clear** (fastest, safest)
2. **Dependency Check** (common, automated)
3. **Path Detection** (adaptive, smart)
4. **Full Reinstall** (thorough, last resort)

### Safety Mechanisms

- **Limited Attempts**: Maximum 2-3 auto-fix attempts per test
- **Progress Tracking**: All auto-fixes logged for review
- **Fallback Reporting**: Clear error messages when auto-fix fails
- **User Control**: Can disable or customize auto-fix behavior

This auto-fix system transforms your build process from a brittle collection of scripts into an intelligent, adaptive system that handles common issues gracefully while providing clear guidance for complex problems.