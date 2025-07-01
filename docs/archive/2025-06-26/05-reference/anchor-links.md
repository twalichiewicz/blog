# Anchor Links Documentation

## Overview
This document describes the anchor link functionality that allows deep linking to specific posts on the homepage.

## Implementation Details

### File Structure
- **Handler**: `/themes/san-diego/source/js/anchor-links-simple.js`
- **Styles**: Anchor glow effect in `/themes/san-diego/source/styles/_blog.scss`
- **Template**: Post IDs generated in `/themes/san-diego/layout/_partial/blog-posts.ejs`

### How It Works

1. **ID Generation**
   - Post IDs are created from the filename: `My-Post-Name.md` → `id="post-My-Post-Name"`
   - IDs are case-sensitive and preserve the exact filename format
   - Applied to posts with class `.post-list-item`

2. **Link Format**
   ```markdown
   [Link text](#post-Exact-Filename)
   ```

3. **Behavior**
   - Intercepts clicks on links starting with `#`
   - Finds the target element by ID
   - Switches tabs if needed (blog ↔ portfolio)
   - Smoothly scrolls to the target
   - Adds temporary visual feedback (anchor-glow class)

### Mobile vs Desktop
- **Mobile**: Scrolls the entire page using `window.scrollIntoView()`
- **Desktop**: Scrolls within the `.blog-content` container if present

## Common Issues and Solutions

### Issue: Anchor link not working
**Causes**:
1. Post is marked as `draft: true`
2. Filename doesn't match the anchor (case-sensitive)
3. Post doesn't exist yet

**Solution**: 
- Remove `draft: true` from post frontmatter
- Verify exact filename matches anchor link
- Ensure post file exists in `source/_posts/`

### Issue: Wrong post highlighted
**Cause**: ID mismatch between link and actual post ID

**Solution**: Check the generated HTML to verify the actual ID:
```bash
npm run build
grep "id=\"post-" public/index.html
```

## Examples

### Working Example
```markdown
---
title: Play Next
short: true
tags:
  - blog
date: 2025-05-25 16:10:05
---

Content here...
```

Link to it:
```markdown
[Thank you Apple Music design team.](#post-Play-Next)
```

### Tab Switching Example
If linking to a portfolio item from a blog post:
```markdown
[See my project](#post-Project-Name)
```
The script will automatically switch to the portfolio tab before scrolling.

## Testing Anchor Links

1. Start the dev server: `npm run server`
2. Navigate to a post with an anchor link
3. Click the link
4. Verify:
   - Correct tab is active
   - Target post is scrolled into view
   - Anchor glow effect appears briefly

## Future Improvements

1. **Add URL persistence**: Update browser URL when clicking anchor links
2. **Handle initial load**: Support loading page with anchor in URL (e.g., `/#post-Name`)
3. **Better error handling**: Show user-friendly message when target not found
4. **Accessibility**: Announce navigation to screen readers