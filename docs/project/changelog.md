# Changelog

All notable changes to the Thomas.design portfolio are documented here.

## [Unreleased]

### Added
- Comprehensive demo standardization system
- DemoOnboarding component with business metrics
- Automated testing suites (dev, quick, comprehensive)
- Claude AI auto-fix system for failing tests
- Documentation reorganization and cleanup

### Changed
- All demos now use consistent shared components
- Testing system now has multiple speed tiers
- Content validation is now non-blocking
- Documentation structure simplified

### Fixed
- Demo cursor consistency issues
- Example demo converted from HTML to React
- Build failures from missing dependencies
- Test suite brittleness

## [2025.06.26] - Demo Standardization

### Overview
Major standardization effort across all portfolio demos to ensure consistency and maintainability.

### Components Standardized
1. **DemoWrapper** - Consistent browser chrome
2. **DemoOnboarding** - Unified onboarding flow
3. **Custom Cursors** - Demo-type specific cursors
4. **Grid Backgrounds** - Consistent visual style

### Demos Updated
- ✅ custom-install-demo
- ✅ foreground-demo  
- ✅ self-service-publishing-demo
- ✅ youtube-timecode-demo
- ✅ overlay-demo
- ✅ example-demo (converted to React)

### Testing Improvements
- New multi-tier testing system
- Automated dependency installation
- Non-blocking content validation
- Claude AI auto-fix integration

### Documentation
- Reorganized folder structure
- Consolidated duplicate content
- Created comprehensive guides
- Updated all cross-references

## [2025.06.24] - Performance Optimizations

### Added
- Enhanced notebook customization system
- Sticker support for notebooks
- Additional texture options

### Changed
- Improved image optimization pipeline
- Updated build scripts for better performance

### Fixed
- Memory leaks in carousel component
- Safari-specific CSS issues

## [2025.06.20] - Architecture Documentation

### Added
- Comprehensive architecture documentation
- Theme system documentation
- Component library planning

### Changed
- Reorganized documentation structure
- Updated development guides

## [2025.06.15] - Content Updates

### Added
- New portfolio projects
- Enhanced media handling
- Video conversion guides

### Changed
- Updated project gallery layouts
- Improved responsive design

### Fixed
- Mobile navigation issues
- Dark mode color inconsistencies

## Contributing to Changelog

When making changes:
1. Add entry under [Unreleased]
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Link to relevant PRs/issues
4. Keep descriptions concise and clear

On release:
1. Move [Unreleased] items to new version section
2. Add release date
3. Tag release in git
4. Update version references

---

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)