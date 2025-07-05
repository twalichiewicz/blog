# Foreground Carousel Image Loading Fix - Implementation Plan

## Problem Statement
When first loading https://thomas.design/2019/02/01/foreground/, several images in the carousels are broken. Additionally, there's a URL redirection issue where the URL briefly redirects to `/?project=%2F2019%2F02%2F01%2Fforeground%2F&tab=portfolio` before returning to the original URL.

## Root Cause Analysis
1. **Image Loading Issue**: The carousel initialization happens before images are fully loaded when content is dynamically rendered
2. **URL Redirection**: The mobile tabs system incorrectly detects project pages and interferes with direct project URL access

## Proposed Solution

### 1. Fix Image Loading in Carousel
- **File**: `themes/san-diego/source/js/carousel.js`
- **Changes**:
  - Enhance `updateCarouselImages()` to properly resolve relative image paths (e.g., `./image.jpg`)
  - Add `waitForImagesAndUpdate()` method that waits for all images to load before finalizing carousel
  - Replace setTimeout delay with proper image load event handling

### 2. Fix URL Redirection Issue
- **Files**: 
  - `themes/san-diego/source/js/mobile-tabs.js`
  - `themes/san-diego/source/js/components/MobileTabs.js`
- **Changes**:
  - Prevent mobile tabs initialization on project pages (URLs containing `/20`)
  - Update `validateActiveState()` to detect project pages and avoid URL manipulation
  - Clean exit when on project pages to prevent interference

## Files to be Modified
1. `/themes/san-diego/source/js/carousel.js`
2. `/themes/san-diego/source/js/mobile-tabs.js` 
3. `/themes/san-diego/source/js/components/MobileTabs.js`

## Potential Risks
- **Low Risk**: Changes are isolated to specific components
- **Fallback**: Image loading has error handling to prevent carousel blocking
- **Backwards Compatible**: No breaking changes to existing functionality

## Testing Strategy
1. Test direct access to `/2019/02/01/foreground/` - images should load properly
2. Verify URL remains stable without redirects
3. Test carousel functionality on other projects
4. Verify mobile tabs still work correctly on home page

## Success Criteria
- Images load correctly on first visit to foreground project
- No URL redirection when accessing project directly
- Carousel functionality preserved across all projects
- Mobile tabs continue working on home page