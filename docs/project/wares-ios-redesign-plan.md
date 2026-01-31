# Wares iOS App Store Redesign Plan

## Current State (PR #258)
The `refactor/css-architecture-standardization` branch has already made significant progress:
- Converted from grid cards to a list layout using `post-preview-card`
- 90px square icons with 16px border-radius (iOS-style)
- Title and subtitle display
- Links to external CTA URLs

## Target Design (iOS App Store)
Based on the reference screenshot, each row should have:
```
[60px icon] [Title                    ] [Action Button]
            [Gray description text    ]
```

Key characteristics:
- **Compact rows** (~70px height instead of 90px)
- **Square icons** with large rounded corners (~18% radius)
- **Bold title** on top line
- **Muted description** below title (single line, truncated)
- **Action button** on the right (Get, price, or "Open" for installed apps)
- **Minimal spacing** between rows

## Implementation Plan

### Phase 1: Template Changes (`wares-items.ejs`)

1. **Add action button** to each ware item
   - Default: "Get" button for free items
   - Support `price` frontmatter field for paid items (e.g., "$29.99")
   - Consider "Open" for items user already has

2. **Restructure HTML** for App Store layout:
   ```html
   <article class="wares-item">
     <a href="..." class="wares-item__link">
       <div class="wares-item__icon">
         <img src="..." alt="..." />
       </div>
       <div class="wares-item__info">
         <h3 class="wares-item__title">Title</h3>
         <p class="wares-item__subtitle">Description</p>
       </div>
       <div class="wares-item__action">
         <span class="wares-item__button">Get</span>
       </div>
     </a>
   </article>
   ```

3. **Remove separator lines** - App Store uses clean spacing, not HR dividers

### Phase 2: Style Changes (`_wares.scss`)

1. **Update dimensions**:
   - Icon: 60px × 60px (reduced from 90px)
   - Row height: ~70px (reduced from 90px)
   - Gap between rows: 16px (tight but breathable)

2. **Icon styling**:
   - Border-radius: 12px (~20% of 60px)
   - Subtle border for light mode
   - Remove LiquidGlass overlay (simpler is better)

3. **Typography**:
   - Title: 16px, semibold, single line
   - Description: 14px, regular, secondary color, single line with ellipsis

4. **Action button**:
   - iOS-style pill button
   - Blue background (#007AFF in light, #0A84FF in dark)
   - Small padding (6px 16px)
   - Border-radius: 999px (pill shape)
   - "Get" text or price text

5. **Remove `!important`** declarations where possible (per project CSS guidelines)

### Phase 3: Frontmatter Support

1. **Add new optional fields** to ware posts:
   ```yaml
   price: "$9.99"          # Optional - shows price instead of "Get"
   cta_text: "Open"        # Optional - custom button text
   developer: "Studio Name" # Optional - for future enhancement
   ```

### Phase 4: Mobile Responsiveness

1. **Keep same layout on mobile** (App Store uses consistent layout)
2. **Adjust button size** slightly smaller on mobile
3. **Consider smaller icons** on very narrow screens (50px)

## Files to Modify

| File | Changes |
|------|---------|
| `themes/san-diego/layout/_partial/wares-items.ejs` | New template structure with action button |
| `themes/san-diego/source/styles/_wares.scss` | Complete restyle for iOS App Store look |
| `source/_posts/Typing-Tennis-Ware.md` | Add optional price/cta_text fields |

## Visual Comparison

### Before (Current PR)
```
┌──────────────────────────────────────────────────┐
│ ┌──────┐                                         │
│ │      │  Title                                  │
│ │ 90px │  Description text that can be           │
│ │      │  multiple lines                         │
│ └──────┘                                         │
├──────────────────────────────────────────────────┤
│ ┌──────┐                                         │
│ │      │  Title                                  │
```

### After (iOS App Store Style)
```
┌──────────────────────────────────────────────────┐
│ ┌────┐ Title                           ┌─────┐  │
│ │60px│ Description text truncat...     │ Get │  │
│ └────┘                                 └─────┘  │
│                                                  │
│ ┌────┐ Another App                     ┌─────┐  │
│ │60px│ Short description               │$9.99│  │
│ └────┘                                 └─────┘  │
└──────────────────────────────────────────────────┘
```

## Design Tokens to Use (from PR)

From the design tokens added in PR #258:
- `--radius-lg` for icon corners (12px)
- `--font-size-base` for title
- `--font-size-sm` for description
- `--font-weight-semibold` for title
- Semantic colors: `--text-primary`, `--text-secondary`

## Implementation Order

1. ✅ Switch to css-architecture worktree
2. Update `wares-items.ejs` with new HTML structure
3. Rewrite `.wares-item` styles in `_wares.scss`
4. Test on desktop and mobile
5. Update ware post frontmatter if needed
6. Build and verify in browser

## Questions to Consider

1. Should the action button be clickable separately, or part of the whole row link?
2. Should clicking "Get" go to external URL vs. clicking the row?
3. Do we want hover states like the App Store (subtle gray background)?
