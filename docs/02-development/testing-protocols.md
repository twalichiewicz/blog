# Testing Protocols & Quality Assurance

## 🚨 CRITICAL RULE - DEPLOYMENT BLOCKER 🚨
```bash
# MANDATORY before EVERY commit:
npm run build

# If this fails → STOP. Do not commit. Do not push.
# Fix all errors first.
```

## Overview
This document establishes testing protocols to ensure code quality and design consistency. Like a professional kitchen, we need systematic checks before changes "go out to the dining room."

## Change Classification System

### 🟢 Green Light Changes (Auto-approve)
- Bug fixes that don't affect visual appearance
- Performance optimizations
- Code refactoring without UI changes
- Documentation updates
- Dependency updates (patch versions only)

### 🟡 Yellow Light Changes (Self-review required)
- Minor CSS adjustments (spacing < 8px, color opacity changes)
- Text content updates
- Adding accessibility attributes
- Console warning fixes

### 🔴 Red Light Changes (Designer review required)
**"A designer needs to look at this" threshold:**
- Any button styling changes
- Color modifications
- Typography changes (font-size, weight, family)
- Layout structure changes
- New components or component modifications
- Spacing changes ≥ 8px
- Border or shadow modifications
- Animation/transition changes
- Responsive breakpoint adjustments

## Testing Protocol Checklist

### Pre-Implementation Phase
```markdown
- [ ] Classify the change (🟢/🟡/🔴)
- [ ] If 🔴, document what visual changes will occur
- [ ] Take "before" screenshots if visual changes
```

### 🚨 DEPLOYMENT BLOCKER - MANDATORY BEFORE EVERY COMMIT 🚨
```bash
# THIS IS NON-NEGOTIABLE - Run before EVERY commit:
npm run build

# If build fails, DO NOT COMMIT OR PUSH
# Fix all errors first
```

### Implementation Phase
```markdown
- [ ] Make changes in small, reviewable commits
- [ ] Test in development server first
- [ ] Check responsive behavior (mobile, tablet, desktop)
- [ ] Test in both light and dark modes
- [ ] Verify no unintended side effects
```

### Quality Assurance Phase

#### For ALL changes:
```bash
# 1. Run build to ensure no errors
npm run build

# 2. Start local server
npm run server

# 3. Basic functionality tests
- [ ] Page loads without console errors
- [ ] Navigation works correctly
- [ ] Interactive elements respond properly
```

#### For CSS/Visual changes (🟡/🔴):
```bash
# Visual regression testing

# 1. Create baseline before changes
npm run visual:baseline

# 2. After making changes, run visual tests
npm run visual:test

# 3. Review the diff report
# Open: screenshots/diff/[timestamp]/report.html

# Checklist:
- [ ] No unintended changes in diff report
- [ ] All viewports tested (mobile, tablet, desktop)
- [ ] Both light and dark modes verified
- [ ] Changes look correct across all pages
```

#### For JavaScript changes:
```bash
# Functionality testing
- [ ] Test all affected interactions
- [ ] Check console for errors
- [ ] Verify event handlers work correctly
- [ ] Test edge cases (empty states, errors)
```

### Design Review Protocol (🔴 Changes)

Before pushing 🔴 changes:

1. **Create Visual Summary**
   ```markdown
   ## Visual Change Summary
   
   ### What changed:
   - [Component/Element name]
   - [Specific properties modified]
   
   ### Why:
   - [Rationale for change]
   
   ### Screenshots:
   - Before: [screenshot]
   - After: [screenshot]
   
   ### Affected areas:
   - [List all pages/components affected]
   ```

2. **Self-Review Questions**
   - Does this maintain design consistency?
   - Are spacing/sizing changes proportional?
   - Do interactive states (hover, active) look correct?
   - Is text still readable?
   - Are touch targets still adequate (min 44x44px)?

3. **Flag for Designer Review**
   ```bash
   # Commit with clear visual change indicator
   git commit -m "fix: [description] 🎨 NEEDS DESIGN REVIEW"
   ```

## Automated Testing Tools

### Visual Testing Commands
```bash
# Automated screenshot testing
npm run screenshot          # All viewports & routes
npm run screenshot:mobile   # Mobile only (375px)
npm run screenshot:tablet   # Tablet only (768px)  
npm run screenshot:desktop  # Desktop only (1440px)

# Visual regression testing
npm run visual:baseline     # Create/update baseline
npm run visual:test        # Compare against baseline
npm run visual:diff <dir1> <dir2>  # Manual comparison

# Code quality checks
npm run lint:scss          # Check SCSS for issues
npm run analyze           # Analyze bundle size

# Full visual testing guide: VISUAL-TESTING-GUIDE.md
```

### Accessibility Testing
```bash
# Run accessibility audit
npm run audit:a11y

# Check color contrast
npm run check:contrast
```

## Common Pitfalls to Check

### CSS Specificity Issues
- [ ] Check if styles work in production (minification can affect specificity)
- [ ] Verify media queries aren't overriding each other
- [ ] Ensure dark mode styles are properly scoped

### Component Library Integration
- [ ] Verify overrides don't break component functionality
- [ ] Check that design tokens are used consistently
- [ ] Ensure component variants render correctly

### Responsive Design
- [ ] Test text doesn't overflow containers
- [ ] Verify images scale properly
- [ ] Check touch targets on mobile
- [ ] Test horizontal scrolling doesn't occur

## Emergency Rollback Procedure

If issues are discovered post-deployment:

```bash
# 1. Immediate rollback
git revert HEAD
git push

# 2. Document what went wrong
echo "Issue: [description]" >> ROLLBACK_LOG.md
echo "Date: $(date)" >> ROLLBACK_LOG.md

# 3. Fix locally before re-attempting
git checkout -b fix/[issue-name]
```

## Design Review Communication Template

When requesting designer review:

```markdown
Subject: Design Review Needed: [Component/Feature]

## Changes Made
- [Bullet list of specific changes]

## Visual Impact
- Affects: [pages/components]
- Screenshots: [link to comparison]

## Questions for Designer
- [Specific concerns or decisions needed]

## Test Links
- Local: http://localhost:4000/[page]
- Staging: [if applicable]
```

## Continuous Improvement

After each design review cycle:
1. Document any new patterns discovered
2. Update this protocol with lessons learned
3. Add new automated tests where possible
4. Create reusable components for approved patterns

---

Remember: **When in doubt, flag it for review!** Better to have daddy chef check than serve a messy plate. 👨‍🍳