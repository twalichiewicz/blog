# Testing Guide

Comprehensive testing system for the Thomas.design portfolio with multiple test suites for different development needs.

## 🚀 Quick Reference

```bash
# Development testing (fastest)
npm run test:dev           # Demo validation only, no build
npm run test:quick         # Essential tests with quick build

# Full testing
npm test                   # Comprehensive test suite
npm run test:comprehensive # Same as above with options

# Specialized testing
npm run test:content       # Content validation only
npm run validate:demos     # Demo standards only
npm run install:demos      # Install demo dependencies
```

## 📋 Test Suites

### 1. Development Tests (`test:dev`)
**Use for**: Rapid development feedback
**Duration**: ~5 seconds
**Tests**: Demo validation only

```bash
npm run test:dev
```

Perfect for:
- Checking demo standards during development
- Quick validation before commits
- CI/CD pre-checks

### 2. Quick Tests (`test:quick`)
**Use for**: Pre-commit validation
**Duration**: ~20 seconds  
**Tests**: Demo validation + content check + quick build

```bash
npm run test:quick
npm run test:quick -- --no-build  # Skip build test
npm run test:quick -- --verbose   # Show error details
```

Perfect for:
- Pre-commit hooks
- Local development validation
- Fast CI checks

### 3. Comprehensive Tests (`test`)
**Use for**: Full validation
**Duration**: ~2-5 minutes
**Tests**: All systems with performance and integration checks

```bash
npm test                              # Full test suite
npm run test:comprehensive            # Same as above
npm run test:comprehensive -- --quick # Skip performance tests
npm run test:comprehensive -- --skip-build # Skip build tests
npm run test:comprehensive -- --verbose    # Detailed output
```

Perfect for:
- Pre-release validation
- Full integration testing
- Performance monitoring

## 🎯 Test Categories

### Demo System Tests
- **Standards Validation**: All demos meet portfolio standards
- **Dependency Check**: Required npm packages installed
- **Build Integration**: Demos build and copy to theme directory
- **File Integrity**: Built demos have required files and correct size

### Content Tests
- **Post Validation**: Blog posts have required metadata
- **Asset Validation**: Images and videos exist and are optimized
- **Link Validation**: Internal links work correctly
- **Size Monitoring**: Asset size optimization

### Build System Tests
- **Clean Build**: Site generates without errors
- **Asset Integration**: CSS, JS, and media files linked correctly
- **Demo Integration**: Portfolio demos load in hero sections
- **Performance**: Bundle size within acceptable limits

### Code Quality Tests
- **SCSS Linting**: Style consistency and best practices
- **Accessibility**: Basic accessibility checks
- **Performance**: Bundle analysis and optimization

## 🔧 Utility Scripts

### Demo Dependencies
```bash
npm run install:demos        # Install all demo dependencies
npm run install:demos:force  # Reinstall even if already present
```

### Validation Only
```bash
npm run validate:demos    # Demo standards validation
npm run validate:content  # Content validation
```

### Build Only
```bash
npm run build:demos       # Build all demos
npm run build:demos:force # Build without validation
```

## 📊 Test Output Examples

### Quick Test Success
```
⚡ Quick Test Suite Starting...

📦 Checking demo dependencies...
✅ All demo dependencies present
🔄 Demo validation... ✅
📝 Checking content validation (informational)...
⚠️  Content validation has warnings (see full test for details)
🔄 Quick build test... ✅

📊 Quick Test Results (22.5s):
✅ Passed: 2
❌ Failed: 0
🎉 All quick tests passed!
```

### Comprehensive Test Results
```
📊 TEST SUMMARY
============================================================
⏱️  Duration: 17.67s
✅ Passed: 3
❌ Failed: 0
⚠️  Warnings: 1

📋 Test Details:
  ✅ Demo standards validation
  ✅ Demo integration
  ❌ Content validation (69 issues found - not blocking)
  ✅ SCSS linting

🎯 OVERALL RESULT: PASSED
```

## 🛠️ Development Workflow

### Daily Development
```bash
# Start development
npm run test:dev        # Quick validation

# Before committing
npm run test:quick      # Essential checks

# Before pushing
npm test               # Full validation
```

### CI/CD Pipeline
```bash
# Fast CI check
npm run test:quick

# Full deployment validation  
npm run test:comprehensive

# Content-only validation
npm run test:content
```

## 🔍 Troubleshooting

### Common Issues

#### Demo Build Failures
```
❌ Failed to build example-demo: Command failed: npm run build
sh: vite: command not found
```

**Solution**: Install demo dependencies
```bash
npm run install:demos
```

#### Missing Demo Files
```
❌ Demo integration - FAILED: Demo custom-install missing index.html
```

**Solution**: Build demos first
```bash
npm run build:demos
```

#### Content Validation Warnings
```
⚠️ Content validation - 69 issues found (not blocking)
```

**Note**: Content warnings don't fail tests but should be reviewed periodically with:
```bash
npm run validate:content
```

### Performance Issues

#### Slow Tests
- Use `--quick` flag to skip performance tests
- Use `--skip-build` to skip build validation
- Use `test:dev` for fastest validation

#### Out of Memory
- Close other applications
- Use `--quick` flag
- Run individual test categories

### Demo-Specific Issues

#### Dependencies Not Installing
```bash
# Force reinstall
npm run install:demos:force

# Check specific demo
cd demos/example-demo && npm install
```

#### Build Configuration
- Ensure `base: './'` in vite.config.js
- Verify relative asset paths
- Check port allocation in demo-config.json

## 📈 Adding New Tests

### Custom Test Scripts
Create test scripts in `scripts/` directory following this pattern:

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');

// Your test logic here
```

### Integration with Main Suites
Add to package.json scripts:
```json
{
  "scripts": {
    "test:custom": "node scripts/custom-test.js"
  }
}
```

### Test Categories
- **Critical**: Must pass for deployment (demo validation, build)
- **Important**: Should pass but can be warning (content validation)  
- **Informational**: Nice to have (performance, optimization)

## 🎯 Best Practices

### When to Run Each Test
- **`test:dev`**: Every few minutes during development
- **`test:quick`**: Before every commit
- **`test:comprehensive`**: Before releases and weekly

### CI/CD Integration
- **Pull Requests**: `npm run test:quick`
- **Main Branch**: `npm run test:comprehensive`  
- **Releases**: `npm run test:comprehensive` with all flags

### Local Development
- Use `test:dev` for rapid feedback
- Use `test:quick` before pushing
- Run comprehensive tests weekly or before major changes

---

This testing system ensures code quality, demo integrity, and deployment readiness across all portfolio components.