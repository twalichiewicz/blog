# Troubleshooting Guide

Common issues and solutions for the Thomas.design portfolio.

## Table of Contents

1. [Port Conflicts](#port-conflicts)
2. [Build Failures](#build-failures)
3. [Demo Issues](#demo-issues)
4. [Style Problems](#style-problems)
5. [Performance Issues](#performance-issues)
6. [Deployment Problems](#deployment-problems)

---

## Port Conflicts

### Port 4000 Already in Use

**Symptoms**: Error when running `npm run server`

**Solution**:
```bash
# Find process using port
lsof -i :4000

# Kill process
kill -9 $(lsof -t -i:4000)

# Or kill all Node processes
killall node
```

### Multiple Hexo Servers

**Symptoms**: High CPU usage, multiple Node processes

**Solution**:
```bash
# Check for Node processes
ps aux | grep node

# Kill specific process
kill -9 [PID]

# Clean restart
hexo clean
npm run server
```

---

## Build Failures

### Out of Memory Errors

**Symptoms**: Build crashes with heap allocation error

**Solution**:
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Or modify package.json script
"build": "NODE_OPTIONS='--max-old-space-size=4096' hexo clean && hexo generate"
```

### Missing Dependencies

**Symptoms**: Module not found errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For demos
npm run install:demos
```

### Sass Deprecation Warnings

**Symptoms**: Legacy JS API warnings

**Status**: Known issue, will need updating for Dart Sass 2.0

---

## Demo Issues

### Demo Not Building

**Symptoms**: `sh: vite: command not found`

**Solution**:
```bash
# Install demo dependencies
cd demos/problem-demo
npm install

# Or install all demo deps
npm run install:demos
```

### Demo Not Loading

**Symptoms**: Blank iframe or 404 errors

**Solution**:
1. Check demo build output exists:
   ```bash
   ls demos/demo-name/dist/
   ```
2. Rebuild demo:
   ```bash
   cd demos/demo-name
   npm run build
   ```
3. Check front matter:
   ```yaml
   demo_component: "demo-name"  # Must match folder name
   ```

### Asset Path Issues

**Symptoms**: Images/CSS not loading in demo

**Solution**: Ensure `vite.config.js` has:
```javascript
export default defineConfig({
  base: './',  // Required for relative paths
  // ...
})
```

---

## Style Problems

### Dark Mode Issues

**Symptoms**: Incorrect colors in dark mode

**Common Causes**:
- Missing CSS variable definitions
- Incorrect media query order
- RGB values not properly formatted

**Solution**:
```scss
// Ensure variables defined for both modes
:root {
  --card-bg: rgb(255, 255, 255);
}

@media (prefers-color-scheme: dark) {
  :root {
    --card-bg: rgb(9, 9, 9);
  }
}
```

### Mobile Styling

**Symptoms**: Layout broken on mobile

**Debug Steps**:
1. Check responsive breakpoints
2. Test touch targets (min 44px)
3. Verify mobile-first CSS
4. Test in actual devices

---

## Performance Issues

### Slow Build Times

**Solution**:
```bash
# Use production build
npm run build:prod

# Skip image optimization if not needed
SKIP_IMAGE_OPT=true npm run build

# Analyze what's slow
time npm run build
```

### Large Bundle Sizes

**Debug**:
```bash
# Analyze build
npm run analyze

# Check largest files
find public -type f -size +1M
```

**Solutions**:
- Optimize images before committing
- Use lazy loading for heavy components
- Split large demos into chunks

### High Memory Usage

**Symptoms**: Browser tab crashes, slow scrolling

**Common Causes**:
- Too many images loaded at once
- Large index.html with inline posts
- Memory leaks in JavaScript

**Solutions**:
- Enable lazy loading
- Implement pagination
- Profile with Chrome DevTools

---

## Deployment Problems

### GitHub Actions Failures

**Debug Steps**:
1. Check Actions tab for error logs
2. Run same commands locally
3. Verify Node version matches
4. Check secrets configured

### Deploy Command Fails

**Symptoms**: `npm run deploy` errors

**Solution**:
```bash
# Ensure git configured
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Check remote
git remote -v

# Manual deploy
hexo deploy
```

### Missing Files in Production

**Common Causes**:
- Files in .gitignore
- Build artifacts not generated
- Case sensitivity issues (Mac vs Linux)

**Solution**:
1. Check .gitignore
2. Verify build output locally
3. Use exact case in imports

---

## Quick Fixes

### Reset Everything
```bash
# Nuclear option - clean slate
hexo clean
rm -rf node_modules package-lock.json
npm install
npm run install:demos
npm run build
```

### Check System Health
```bash
# Run all tests
npm test

# Quick validation
npm run test:quick

# Just demos
npm run test:dev
```

### Debug Mode
```bash
# Verbose output
DEBUG=* npm run build

# Hexo debug
hexo generate --debug
```

---

## Getting Help

1. **Check logs carefully** - Error messages usually point to the issue
2. **Search existing issues** - Common problems are documented
3. **Isolate the problem** - Does it happen in dev? In build? In one browser?
4. **Provide context** - Node version, OS, recent changes

### Useful Resources
- [Hexo Troubleshooting](https://hexo.io/docs/troubleshooting.html)
- [Project README](../../../README.md)
- [Testing Guide](./testing.md)

---

*If you encounter an issue not covered here, please document it for others!*