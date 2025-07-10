# Blog Project Claude Instructions

## Git Worktree Workflow
- ALWAYS use git worktrees for new features or fixes
- Create worktrees inside the `./worktrees/` directory to avoid parent directory access issues
- **CRITICAL: After creating a worktree, ALWAYS cd into it immediately**
- Example workflow:
  ```bash
  # From the blog root directory
  git worktree add ./worktrees/feature-name -b feature/name
  # IMMEDIATELY cd into it
  cd ./worktrees/feature-name
  # Now do all work here
  ```
- To list existing worktrees: `git worktree list`
- To remove a worktree: `git worktree remove ./worktrees/feature-name`

## CSS Best Practices
- **NEVER use `!important`** - it's a code smell indicating specificity problems
- Instead of using `!important`, fix the root cause:
  - Check the cascade order and file import sequence
  - Use more specific selectors when needed
  - Refactor conflicting styles rather than overriding them
  - Remove duplicate or competing rules
- When encountering specificity issues:
  1. Identify all rules affecting the element
  2. Understand why conflicts exist
  3. Restructure the CSS to work with the cascade
  4. Consider using CSS custom properties for themeable values

## Demo Development Workflow
- **CRITICAL**: After making changes to any demo, you MUST build the demos before pushing
- Run `npm run build:demos` from the main blog directory (not from worktree)
- This copies built files to `themes/san-diego/source/demos/` for deployment
- Without this build step, your changes won't appear on Netlify
- Example workflow:
  ```bash
  # After editing demo files in worktree
  cd ../..  # Go to blog root
  npm run build:demos
  cd worktrees/feature-name  # Return to worktree
  git add -A
  git commit -m "feat: implement feature + build: generate demo artifacts"
  git push
  ```

## Demo-Related Commands
- `npm run build:demos` - Build all demos (required for deployment)
- `npm run build:demos:safe` - Build with error tolerance
- `npm run validate:demos` - Check demo standards
- `npm run dev:demos` - Watch mode for local development
- `npm run create:demo` - Create a new demo from template

## Custom Cursor Implementation - COMPLETE DEBUGGING GUIDE

### CRITICAL: Always Check the Actual Source Code First!
When implementing custom cursors, you MUST trace the entire rendering pipeline. The YouTube demo issue could have been found immediately by checking the markdown source.

### Types of Demo Implementations and Their Cursor Requirements

#### 1. Iframe Demos (React apps)
**Rendering Path:**
```
/demos/*/src/App.jsx → Build → /themes/san-diego/source/demos/*/ → Iframe → Browser
```
- CSS cannot cross iframe boundaries
- Each demo needs cursor CSS imported internally
- Cursor files must be in demo's public directory
- Use relative paths from demo root

#### 2. Inline HTML Demos (e.g., YouTube demo)
**Rendering Path:**
```
/source/_posts/*.md → Hexo → Public HTML → Browser renders inline
```
- **CRITICAL: Styles are defined IN THE MARKDOWN FILE**
- Check for `<style>` tags with hardcoded cursor paths
- Uses main site's cursor files from `/cursors/`
- Paths must be absolute from site root

#### 3. Prototype Sandbox Demos
- May have competing cursor systems
- Check for `advanced-cursors.css`
- Look in `themes/san-diego/source/components/prototype-sandbox/`

### Systematic Debugging Process

#### Step 1: Identify Demo Type
```bash
# Check the actual source - THIS IS THE MOST IMPORTANT STEP
cat source/_posts/[post-name].md | grep -n "cursor:"

# Check if it's an iframe
grep -n "iframe" source/_posts/[post-name].md

# Check for inline styles
grep -n "<style>" source/_posts/[post-name].md
```

#### Step 2: Trace All Cursor Implementations
```bash
# Find ALL cursor CSS/styles
find . -name "*.css" -o -name "*.scss" | xargs grep -l "cursor:" | grep -v node_modules

# Check for hardcoded paths in markdown
grep -r "cursor:" source/_posts/ | grep -v ".css"

# Check compiled output
grep "cursor:" public/styles/styles.css | grep -C3 "[demo-name]"
```

#### Step 3: Verify File Paths
```bash
# List all cursor files
find . -name "*.svg" -path "*cursor*" | sort

# Check if paths in CSS match actual files
ls -la public/cursors/
```

#### Step 4: Check for Conflicts
```bash
# Find competing cursor systems
find . -name "*cursor*.css" -o -name "*cursor*.scss" | grep -v node_modules

# Look for !important overrides
grep -r "cursor.*!important" themes/
```

### Common Pitfalls and Solutions

1. **Not Checking Markdown Source**
   - ALWAYS run: `grep "cursor:" source/_posts/[post-name].md`
   - Inline demos often have hardcoded styles

2. **Path Resolution Issues**
   - Iframe demos: paths relative to demo root
   - Inline demos: paths from site root (/cursors/)
   - Always check Network tab for 404s

3. **Iframe Boundary Issues**
   - Parent CSS cannot style iframe content
   - Must import cursor CSS inside the demo app

4. **Competing Systems**
   - Disable `advanced-cursors.css` if found
   - Remove hardcoded cursor styles
   - Check for multiple cursor imports

### Quick Debug Commands
```bash
# Complete cursor audit for a demo
DEMO="YouTube-Timecode-Commentary"
echo "=== Checking $DEMO ==="
echo "1. Source markdown:"
grep -n "cursor:" source/_posts/$DEMO.md
echo "2. Compiled CSS:"
hexo generate && grep -A5 -B5 "$DEMO" public/styles/styles.css | grep cursor
echo "3. File paths:"
ls -la public/cursors/ | head -10
```

### Testing Checklist
- [ ] Check browser DevTools Network tab for 404s
- [ ] Verify computed styles show correct cursor
- [ ] Test all hover states
- [ ] Check both light/dark modes
- [ ] Clear cache and test again

## Project-Specific Notes
- All worktrees are stored in `/Users/waliwalu/GitHub/blog/worktrees/`
- This prevents Claude Code access issues with parent directories
- Each worktree maintains its own isolated environment
- Demo source files are in `/demos/` but built files go to `/themes/san-diego/source/demos/`