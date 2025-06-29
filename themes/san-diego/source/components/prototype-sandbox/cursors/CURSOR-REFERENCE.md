# Cursor Reference Guide

All custom cursor SVG files for blog prototypes and demos. These can be edited in Figma for consistency.

## File Locations

### Blog Prototype Cursors
Located in: `/themes/san-diego/source/components/prototype-sandbox/cursors/`

1. **default-cursor.svg** - Basic arrow, no accent
2. **interactive-cursor.svg** - Arrow with blue dot accent
3. **active-cursor.svg** - Arrow with larger blue dot (pressed state)
4. **grab-cursor.svg** - Open hand shape
5. **grabbing-cursor.svg** - Closed hand shape
6. **loading-cursor.svg** - Arrow with dashed circle
7. **disabled-cursor.svg** - Faded arrow with red line

### Demo Cursors
Located in: `/demos/shared/assets/cursors/`

1. **demo-cursor.svg** - Arrow with blue dot and line
2. **enterprise-cursor.svg** - Arrow with red crosshair
3. **design-system-cursor.svg** - Arrow with green question mark
4. **interactive-cursor.svg** - Arrow with orange hand icon

## Design Specifications

### Base Arrow Shape (Updated Design)
- Size: 24x24px viewport
- Arrow path: `M4.89415 6.3844C4.57502 5.5334 5.46478 4.73239 6.27769 5.13885L17.5821 10.7911C18.4125 11.2063 18.2781 12.4305 17.3775 12.6556L12.5326 13.8669C12.2009 13.9498 11.9345 14.1964 11.8264 14.5208L10.8932 17.3203C10.5952 18.2144 9.3391 18.2376 9.00821 17.3552L4.89415 6.3844Z`
- Fill: white
- Stroke: black, 1.5px width
- Hotspot: 4,4 (tip of arrow)

### Accent Positioning
- Primary accent: Circle at cx="18" cy="6"
- Accent size: r="2.5" (standard), r="3.5" (active)
- Accent stroke: white, 1px width

### Color Palette
- **Interactive Blue**: #007AFF (iOS blue)
- **Active Blue**: #0051D5 (darker blue)
- **Enterprise Red**: #FF3B30
- **Success Green**: #34C759
- **Warning Orange**: #FF9500
- **Disabled Red**: #FF0000

## Figma Guidelines

### Setting Up in Figma
1. Create 24x24px frames for each cursor
2. Set frame background to transparent
3. Use consistent 1.5px stroke for main arrow
4. Keep accent elements within 18,6 coordinate area

### Exporting from Figma
1. Select the frame (not the contents)
2. Export as SVG
3. Settings:
   - Include "id" attributes: No
   - Outline text: Yes
   - Include "fill" attributes: Yes
   - Simplify stroke: No

### Optimization
After export from Figma:
1. Remove unnecessary attributes (id, data-*, etc.)
2. Ensure viewBox is "0 0 24 24"
3. Add meaningful comments
4. Test cursor hotspot alignment

## Usage in CSS

### Data URL Format
```css
cursor: url('data:image/svg+xml;utf8,%3Csvg...%3E') 4 4, pointer;
```

### URL Encoding
- Replace `<` with `%3C`
- Replace `>` with `%3E`
- Replace `#` with `%23`
- No quotes needed in SVG attributes

### As External File
```css
cursor: url('/path/to/cursor.svg') 4 4, pointer;
```

## Creating New Cursors

### Template
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Main cursor arrow -->
  <path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
  
  <!-- Your accent here -->
  <circle cx="18" cy="6" r="2.5" fill="#COLOR" stroke="white" stroke-width="1"/>
</svg>
```

### Best Practices
1. Keep designs simple - they're displayed at ~16-20px
2. Maintain consistent arrow base across all cursors
3. Use high contrast for visibility
4. Test on both light and dark backgrounds
5. Always include fallback cursor in CSS

## Quick Copy Templates

### Interactive (Blue Dot)
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="18" cy="6" r="2.5" fill="#007AFF" stroke="white" stroke-width="1"/>
  <line x1="16" y1="8" x2="14" y2="10" stroke="#007AFF" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Minimal (No Accent)
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4L20 12L12 14L10 20L4 4Z" fill="white" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
</svg>
```