# Automatic Cursor Sync System

## Overview
The cursor system now automatically syncs everywhere when you export new SVG files from Figma.

## How It Works

### 1. Export from Figma
Export your cursor SVG files to:
```
/themes/san-diego/source/components/prototype-sandbox/cursors/
```

### 2. Automatic Sync
The sync happens automatically during:
- `npm run build` - Production builds
- `npm run server` - Development server
- `npm run dev` - Development with file watching
- `npm run build:demos` - Demo builds
- GitHub Actions deployment

### 3. File Watching (Development)
Use `npm run dev` to automatically sync cursors when files change:
```bash
npm run dev
# This runs both cursor sync watcher and Hexo server
```

### 4. Manual Sync
If needed, you can manually sync cursors:
```bash
npm run sync-cursors
```

## Where Cursors Are Synced

The system automatically copies cursors to all these locations:

1. **Source** (your Figma exports go here):
   ```
   /themes/san-diego/source/components/prototype-sandbox/cursors/
   ```

2. **Demo Assets** (for portfolio demos):
   ```
   /demos/shared/assets/cursors-prototype/
   /themes/san-diego/source/demos/shared/assets/cursors-prototype/
   ```

3. **Public Folder** (after build):
   ```
   /public/components/prototype-sandbox/cursors/
   /public/demos/shared/assets/cursors-prototype/
   ```

## Benefits

1. **Single Source of Truth**: Edit cursors in one place
2. **No Manual Copying**: Automatic sync during all builds
3. **Live Updates**: File watcher updates cursors during development
4. **Build Integration**: Works with existing build pipeline
5. **CI/CD Ready**: GitHub Actions automatically syncs

## Usage in Code

### Blog Prototypes
```css
.my-prototype {
  cursor: url('/components/prototype-sandbox/cursors/interactive-cursor.svg') 4 4, pointer;
}
```

### Portfolio Demos
```javascript
// Automatically uses synced cursors
<DemoWrapper customCursor="interactive">
  <YourDemo />
</DemoWrapper>
```

### Advanced Cursor CSS
```css
/* Import from advanced-cursors.css */
.my-element {
  cursor: var(--cursor-interactive);
}
```

## Troubleshooting

### Cursors not updating?
1. Check that SVG files are in the source directory
2. Run `npm run sync-cursors` manually
3. Clear browser cache (cursors are cached)
4. Check console for sync errors

### Build errors?
The sync script is fault-tolerant and won't break builds if:
- Source directory is missing
- Destination directories don't exist
- File permissions issues

### Performance
- Sync is fast (< 1 second)
- Only runs when needed
- Doesn't affect Hexo build time

## Adding New Cursor Locations

To add a new sync destination, edit `/scripts/sync-cursors.js`:
```javascript
const DESTINATIONS = [
  // ... existing destinations
  path.join(__dirname, '../your/new/path')
];
```