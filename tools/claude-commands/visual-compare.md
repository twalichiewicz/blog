Create a visual comparison for UI changes to: $ARGUMENTS

Follow this visual development workflow:

1. **Capture Baseline**
   - Start the development server: `npm run server`
   - Navigate to the relevant page/component
   - Take screenshots of current state:
     - Desktop view (1920x1080)
     - Tablet view (768x1024)
     - Mobile view (375x667)
   - Save to `tests/visual-baseline/[feature-name]/`

2. **Document Current Issues**
   - List visual problems or improvements needed
   - Note any accessibility issues
   - Check dark mode appearance
   - Test interactive states (hover, focus, active)

3. **Make Visual Changes**
   - Implement the requested changes
   - Focus on one aspect at a time
   - Maintain existing functionality
   - Ensure changes work in both light/dark modes

4. **Capture After State**
   - Take screenshots at same dimensions
   - Save to `tests/visual-current/[feature-name]/`
   - Capture any new interactive states

5. **Create Comparison Document**
   Create a markdown file with side-by-side comparisons:
   ```markdown
   # Visual Changes: [Component/Feature Name]
   
   ## Desktop View
   | Before | After |
   |--------|-------|
   | ![](baseline/desktop.png) | ![](current/desktop.png) |
   
   ### Changes Made:
   - List specific visual improvements
   - Note any color/spacing adjustments
   - Highlight accessibility improvements
   ```

6. **Responsive Testing**
   - Verify changes work at all breakpoints
   - Test transition between breakpoints
   - Check for layout shifts or overflow

7. **Interactive States**
   Document all states:
   - Default
   - Hover
   - Focus (keyboard navigation)
   - Active/pressed
   - Disabled
   - Loading
   - Error

8. **Cross-browser Check**
   Verify in:
   - Chrome (primary)
   - Safari (if on Mac)
   - Firefox
   - Mobile browsers

9. **Performance Impact**
   - Check if changes affect load time
   - Verify no new render-blocking resources
   - Ensure animations are 60fps

10. **Final Verification**
    - Run `npm run build` to ensure no errors
    - Check production build appearance
    - Verify no regressions in other areas

Remember: Visual changes should enhance user experience while maintaining the existing design language and brand consistency.