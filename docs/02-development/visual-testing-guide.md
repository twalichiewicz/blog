# Visual Testing Guide

## Overview
This guide explains how to use the automated screenshot and visual regression testing tools.

## Setup

First, install the required dependencies:
```bash
npm install
```

## Taking Screenshots

### All viewports and routes:
```bash
npm run screenshot
```

This will:
- Take screenshots at mobile (375px), tablet (768px), and desktop (1440px)
- Capture both light and dark mode
- Screenshot all configured routes (homepage, blog, projects, components)
- Save to `screenshots/[timestamp]/`
- Generate a comparison HTML at `screenshots/[timestamp]/comparison.html`

### Specific viewport only:
```bash
npm run screenshot:mobile   # Only mobile screenshots
npm run screenshot:tablet   # Only tablet screenshots  
npm run screenshot:desktop  # Only desktop screenshots
```

## Visual Regression Testing

### 1. Create a baseline (first time):
```bash
npm run visual:baseline
```
This takes screenshots and saves them as the baseline for comparison.

### 2. Test for visual changes:
```bash
npm run visual:test
```
This will:
- Take new screenshots
- Compare them against the baseline
- Generate a diff report showing what changed
- Open `screenshots/diff/[timestamp]/report.html` to see results

### 3. Update baseline (after approved changes):
```bash
npm run visual:baseline
```
Run this after visual changes have been approved to update the baseline.

## Manual Comparison

To compare any two sets of screenshots:
```bash
npm run visual:diff screenshots/2024-01-01-12-00-00 screenshots/2024-01-02-13-00-00
```

## Understanding the Reports

### Screenshot Comparison HTML
- Shows all screenshots in a grid
- Filter by route, viewport, or color scheme
- Useful for reviewing overall appearance

### Visual Diff Report
- Shows only changed screenshots
- Side-by-side comparison: Before | After | Difference
- Red pixels indicate changes
- Percentage shows how much changed

## Workflow Example

When making CSS changes:

1. **Before changes**: Create baseline
   ```bash
   npm run visual:baseline
   ```

2. **Make your CSS changes**

3. **Test for regressions**:
   ```bash
   npm run visual:test
   ```

4. **Review the diff report**
   - Check for unintended changes
   - Verify intended changes look correct

5. **If changes are approved**: Update baseline
   ```bash
   npm run visual:baseline
   ```

## Configuration

Edit `tools/screenshot-automation.js` to:
- Add/remove routes
- Change viewport sizes
- Modify screenshot settings

## Troubleshooting

### "Local server is not running"
Start the development server first:
```bash
npm run server
```

### Screenshots look wrong
- Clear browser cache
- Ensure CSS is compiled: `npm run build`
- Check for JavaScript errors in console

### Diff shows changes but images look identical
- Adjust threshold in `tools/visual-diff.js`
- Default is 0.1 (10% difference per pixel)

## Best Practices

1. **Always create baseline before making visual changes**
2. **Review all viewport sizes** - changes might only affect certain sizes
3. **Check both light and dark modes**
4. **Keep baseline updated** after approved changes
5. **Use visual testing for**:
   - CSS refactoring
   - Component library changes
   - Theme modifications
   - Responsive design updates

## Integration with Testing Protocol

According to `TESTING-PROTOCOLS.md`, visual testing is required for:
- 🔴 Red light changes (designer review required)
- 🟡 Yellow light changes (self-review required)

Use these tools to generate screenshots for design review!