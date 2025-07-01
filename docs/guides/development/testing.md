# Testing Guide

Comprehensive guide to testing the Thomas.design portfolio, including automated test suites, visual testing, and validation protocols.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Suites](#test-suites)
3. [Testing Protocols](#testing-protocols)
4. [Visual Testing](#visual-testing)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Most Common Commands

```bash
# Development testing (fastest - 5s)
npm run test:dev

# Pre-commit testing (quick - 20s)  
npm run test:quick

# Full test suite (comprehensive - 2-5min)
npm test

# Install demo dependencies
npm run install:demos
```

### Development Workflow

```bash
# While coding
npm run test:dev        # Quick validation

# Before committing
npm run test:quick      # Essential checks

# Before pushing
npm test               # Full validation
```

---

## Test Suites

### 1. Development Test (`test:dev`)
**Duration**: ~5 seconds  
**Purpose**: Rapid feedback during development

```bash
npm run test:dev
```

Tests:
- Demo validation only
- No build tests
- No content validation

Perfect for:
- Active development
- Quick checks
- CI pre-checks

### 2. Quick Test (`test:quick`)
**Duration**: ~20 seconds  
**Purpose**: Pre-commit validation

```bash
npm run test:quick
npm run test:quick -- --no-build  # Skip build test
npm run test:quick -- --verbose   # Show error details
```

Tests:
- Demo standards validation
- Content check (warnings only)
- Quick build test

Perfect for:
- Pre-commit hooks
- Local validation
- Fast CI checks

### 3. Comprehensive Test (`test`)
**Duration**: ~2-5 minutes  
**Purpose**: Full system validation

```bash
npm test                              # Full suite
npm run test:comprehensive -- --quick # Skip performance
npm run test:comprehensive -- --skip-build # Skip build tests
npm run test:comprehensive -- --verbose    # Detailed output
```

Tests:
- Demo system (validation, dependencies, integration)
- Content validation (posts, assets, links)
- Build system (generation, integrity, performance)
- Code quality (SCSS linting, standards)

Perfect for:
- Pre-release validation
- Weekly checks
- Full CI/CD pipeline

---

## Testing Protocols

### Change Classification System

Before making changes, classify them:

#### 🟢 Green Light Changes
**No testing required beyond standard checks**
- Documentation updates
- Comment additions
- README modifications
- Non-functional refactoring

#### 🟡 Yellow Light Changes  
**Targeted testing required**
- CSS modifications → Visual testing
- JS behavior changes → Functional testing
- Component updates → Integration testing
- Build config → Build testing

#### 🔴 Red Light Changes
**Comprehensive testing required**
- Core functionality changes
- Theme system modifications
- Build pipeline updates
- Security-related changes

### Testing Requirements by Change Type

| Change Type | Required Tests | Commands |
|------------|---------------|----------|
| CSS/Styling | Visual + Build | `npm run test:quick` |
| JavaScript | Unit + Integration | `npm test` |
| Demo Components | Demo validation | `npm run validate:demos` |
| Content | Content validation | `npm run validate:content` |
| Build System | Full suite | `npm test` |

---

## Visual Testing

### Screenshot Testing

```bash
# Take screenshots at different viewports
npm run screenshot          # All viewports
npm run screenshot:mobile   # Mobile only
npm run screenshot:tablet   # Tablet only
npm run screenshot:desktop  # Desktop only

# Visual regression testing
npm run visual:baseline     # Create baseline
npm run visual:test        # Compare against baseline
```

### Manual Visual Testing

1. **Before Changes**: Take screenshots (Cmd+Ctrl+Shift+4 on Mac)
2. **Make Changes**: Implement modifications
3. **After Changes**: Take new screenshots
4. **Compare**: Use visual diff tools or manual comparison

### Browser Testing Matrix

Test in these browsers:
- Chrome (primary)
- Firefox
- Safari (Mac)
- Edge (Windows)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

---

## Demo System Testing

### Demo Validation

```bash
# Validate all demos
npm run validate:demos

# Build all demos
npm run build:demos

# Build without validation (force)
npm run build:demos:force
```

### Demo Standards Checked

1. **Package Structure**
   - Valid package.json
   - Correct dependencies
   - Build configuration

2. **Component Integration**
   - Uses DemoWrapper
   - Has DemoOnboarding
   - Proper imports

3. **Build Output**
   - Generates dist/index.html
   - Correct file sizes
   - Asset paths work

### Creating Test Demos

```bash
# Create new demo from template
npm run create:demo

# Or manually
cp -r demos/examples/react-demo-template demos/test-demo
cd demos/test-demo
npm install
npm run dev
```

---

## Content Validation

### What's Validated

1. **Blog Posts**
   - Required front matter
   - Valid dates
   - Existing categories/tags

2. **Assets**
   - Images exist
   - Videos are optimized
   - No broken references

3. **File Sizes**
   - Images < 500KB (warned)
   - Videos < 50MB (warned)
   - Identifies optimization opportunities

### Running Content Validation

```bash
# Full content validation
npm run validate:content

# Note: Content issues are warnings in test suites
# They won't fail builds but should be addressed
```

---

## Performance Testing

### Bundle Analysis

```bash
# Analyze build size
npm run analyze

# Results show:
# - Total build size
# - Largest files
# - Optimization opportunities
```

### Performance Budgets

Current targets:
- Homepage: < 2MB
- Blog posts: < 1MB  
- Demo bundles: < 1MB each
- Images: < 500KB (optimized)

---

## Troubleshooting

### Common Issues

#### Demo Build Failures
```bash
# Error: sh: vite: command not found
npm run install:demos

# Or for specific demo
cd demos/problem-demo && npm install
```

#### Test Timeouts
```bash
# Use quick mode
npm run test:comprehensive -- --quick

# Skip slow tests
npm run test:comprehensive -- --skip-build
```

#### Content Validation Errors
```bash
# Content errors don't fail tests
# To see details:
npm run validate:content
```

#### Port Conflicts
```bash
# Check what's using port 4000
lsof -i :4000

# Kill process
kill -9 $(lsof -t -i:4000)
```

### Debug Mode

```bash
# Verbose output for all tests
npm test -- --verbose

# Check specific demo
cd demos/demo-name
npm run dev
```

### CI/CD Failures

1. Check GitHub Actions logs
2. Run locally with same Node version
3. Ensure all dependencies committed
4. Verify build artifacts generated

---

## Test Configuration

### Files Involved

- `scripts/comprehensive-test.js` - Full test suite
- `scripts/quick-test.js` - Quick test suite  
- `scripts/install-demo-deps.js` - Demo dependency installer
- `demos/build-scripts/validate-demo-standards-v2.js` - Demo validation
- `tools/validate-content.js` - Content validation

### Environment Variables

```bash
# Skip visual tests
SKIP_VISUAL=true npm test

# Verbose mode
VERBOSE=true npm test

# Quick mode
QUICK=true npm test
```

---

## Best Practices

### When to Test

1. **Every Change**: Run `test:dev` frequently
2. **Before Commit**: Always run `test:quick`
3. **Before Push**: Run full `npm test`
4. **Weekly**: Full comprehensive test with visual checks

### Test-Driven Development

1. Write/update tests first
2. Make changes
3. Verify tests pass
4. Refactor if needed

### Continuous Integration

GitHub Actions runs:
- `test:quick` on pull requests
- `test:comprehensive` on main branch
- Full deployment validation on releases

---

## Related Documentation

- [Development Guide](./getting-started.md)
- [Creating Demos](./creating-demos.md)
- [Deployment Guide](./deployment.md)
- [Troubleshooting](./troubleshooting.md)

---

*Last updated: June 26, 2025*