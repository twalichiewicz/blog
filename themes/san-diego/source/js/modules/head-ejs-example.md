# How to Update head.ejs for Module System

This document shows how to update the head.ejs file to use the new module loader system.

## Current Script Loading (Lines 157-167)

```html
<!-- Core Scripts -->
<script type="module" src="<%- url_for('js/main.js') %>"></script>
<script type="module" src="<%- url_for('js/components/HomeVisuals.js') %>"></script>
<script type="module" src="<%- url_for('js/mobile-tabs.js') %>"></script>
<script type="module" src="<%- url_for('js/carousel.js') %>"></script>
<script type="module" src="<%- url_for('js/animations.js') %>"></script>
<script src="<%- url_for('js/project-tabs.js') %>"></script>
<script src="<%- url_for('js/project-summary.js') %>"></script>
<script src="<%- url_for('js/scroll.js') %>"></script>
<script src="<%- url_for('js/sound-effects.js') %>"></script>
<script src="<%- url_for('js/external-links.js') %>"></script>
```

## New Module Loader Approach

Replace the above lines with:

```html
<!-- San Diego Module System -->
<script src="<%- url_for('js/module-loader.js') %>"></script>

<!-- Keep these module scripts that haven't been converted yet -->
<script type="module" src="<%- url_for('js/components/HomeVisuals.js') %>"></script>
<script type="module" src="<%- url_for('js/carousel.js') %>"></script>
<script type="module" src="<%- url_for('js/animations.js') %>"></script>
```

## Scripts to Remove from Other Templates

### In layout.ejs:
Remove these duplicate scripts:
- `/js/device-detection.js`
- `/js/main.js` (duplicate)
- `/js/mobile-tabs.js` (duplicate) 
- `/js/sound-effects.js` (duplicate)

### In index.ejs:
Update these scripts:
- `/js/blog.js` - Now loaded as part of the module system
- `/js/anchor-links-simple.js` - Now part of navigation module

Keep these for now:
- `/js/blog-init.js` - Needs to be converted
- `/js/visibility-debug.js` - Optional debug tool

## Benefits

1. **Single Entry Point**: Only one main script to load
2. **No Duplicates**: Scripts are loaded once in the correct order
3. **Automatic Initialization**: Modules initialize themselves
4. **Better Performance**: Scripts load in parallel but initialize in order
5. **Easier Maintenance**: Add/remove modules in one place

## Migration Checklist

- [ ] Update head.ejs to use module-loader.js
- [ ] Remove duplicate script tags from layout.ejs
- [ ] Update index.ejs to remove migrated scripts
- [ ] Test that all functionality still works
- [ ] Convert remaining module scripts (HomeVisuals, carousel, animations)
- [ ] Remove legacy script includes once everything is converted

## Example Full Update

Here's what the script section in head.ejs should look like after migration:

```html
<!-- Core Module System -->
<script src="<%- url_for('js/module-loader.js') %>"></script>

<!-- Temporary: Scripts not yet converted to modules -->
<script type="module" src="<%- url_for('js/components/HomeVisuals.js') %>"></script>
<script type="module" src="<%- url_for('js/carousel.js') %>"></script>
<script type="module" src="<%- url_for('js/animations.js') %>"></script>

<!-- Project-specific Scripts (unchanged) -->
<% if (page.layout === 'project') { %>
  <!-- Chart.js, Two.js, propel-visualizations remain the same -->
<% } %>
```

## Testing

After making these changes:

1. Clear browser cache
2. Test all pages (index, blog posts, portfolio items)
3. Check browser console for errors
4. Verify all interactive features work:
   - Sound effects
   - Modals
   - Tab switching
   - Anchor links
   - External link processing
   - Blog search
   - Carousels

## Rollback Plan

If issues occur, simply revert the head.ejs changes. The module system is designed to work alongside existing scripts during the transition period.