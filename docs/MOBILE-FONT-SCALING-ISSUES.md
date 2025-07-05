# Mobile Font Scaling Issues Documentation

## YouTube-Soundcloud Demo Font Scaling Issue

### Issue Description
The YouTube timecode comments demo in `/source/_posts/YouTube-Timecode-Commentary.md` has font-size scaling issues on mobile devices. The demo is implemented as inline HTML/CSS within a code_sandbox block, not as a separate demo project.

### Current Implementation
- Location: `/source/_posts/YouTube-Timecode-Commentary.md`
- Type: Inline HTML/CSS demo within a `code_sandbox` helper
- Structure: Uses inline styles directly in the HTML

### Problem
- Font sizes are hardcoded in the inline styles
- No responsive font scaling for mobile viewports
- Text may be too small to read on mobile devices

### Recommended Solution
To fix this issue, the inline demo should be:

1. **Option A: Convert to Component Demo**
   - Extract the demo into a separate React/Vue component
   - Place in `/demos/youtube-timecode-demo/`
   - Use responsive CSS with proper mobile breakpoints
   - Import shared demo components for consistency

2. **Option B: Update Inline Styles**
   - Add media queries within the inline styles
   - Use relative units (rem/em) instead of fixed pixels
   - Add viewport-based scaling for mobile devices

### Example Fix for Inline Styles
```html
<style>
  .youtube-demo {
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    .youtube-demo {
      font-size: 12px;
    }
    
    .comment-text {
      font-size: 0.75rem;
    }
  }
</style>
```

### Priority
Low - This is a contained issue affecting only one demo

### Notes
- Similar inline demos should be audited for mobile responsiveness
- Consider creating a standard approach for inline demos vs component demos
- Future demos should use the shared demo system in `/demos/shared/`