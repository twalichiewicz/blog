Run a comprehensive performance audit on: $ARGUMENTS

Execute this systematic performance analysis:

1. **Current State Analysis**
   - If $ARGUMENTS is a specific page/component, focus on that
   - If $ARGUMENTS is "site" or "all", analyze globally
   - Run `npm run analyze` to get baseline metrics
   - Check current build size and largest files

2. **Image Optimization Check**
   ```bash
   # Find large unoptimized images
   find source/_posts -name "*.jpg" -o -name "*.png" | xargs ls -lh | sort -k5 -hr | head -20
   ```
   - Identify images > 500KB that could be optimized
   - Check for missing responsive images
   - Look for images without lazy loading

3. **CSS/JS Bundle Analysis**
   - Review the minified CSS/JS sizes in public/
   - Identify any redundant or unused code
   - Check for duplicate implementations
   - Look for opportunities to split or defer loading

4. **Render-Blocking Resources**
   - Identify CSS/JS in the critical rendering path
   - Check font loading strategies
   - Review external resource loading (CDNs, APIs)

5. **Performance Improvements List**
   Create a prioritized list with:
   - **Quick Wins** (< 30 min): Image optimization, lazy loading additions
   - **Medium Effort** (1-2 hours): Code splitting, CSS extraction
   - **Major Changes** (> 2 hours): Architecture changes, build process updates

6. **Implement Quick Wins**
   - Optimize any unoptimized images found
   - Add lazy loading where missing
   - Minify any unminified assets
   - Update resource hints in templates

7. **Document Findings**
   Create a report with:
   - Before/after metrics
   - Implemented improvements
   - Remaining opportunities
   - Estimated impact of each suggestion

8. **Verify Improvements**
   ```bash
   npm run build:prod
   npm run analyze
   ```
   Compare with baseline metrics

Output format:
```markdown
## Performance Audit: [target]
### Current Metrics
- Build size: X MB
- Largest files: ...
- Load time estimate: X seconds

### Improvements Made
1. Optimized X images (saved Y MB)
2. Added lazy loading to Z components
3. ...

### Remaining Opportunities
1. [High Impact] Description (est. X% improvement)
2. [Medium Impact] Description (est. Y% improvement)
3. ...
```