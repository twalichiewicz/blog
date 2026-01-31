# Technical Debt & Architectural Opportunities

This document tracks known technical debt, architectural risks, and opportunities for improvement identified during codebase reviews.

## 🔴 Critical Priority

### 1. Sass Deprecation & Compatibility
**Context**: The project forces a modern `sass` version (`^1.97.1`) over `hexo-renderer-sass`'s internal dependency.
**Issue**: The codebase contains legacy SCSS syntax (e.g., global variables without `@use`, mixed declarations) that triggers deprecation warnings. Dart Sass 2.0 will eventually break the build.
**Evidence**: `tools/fix-sass-warnings.js` exists, indicating an ongoing issue.
**Action Plan**:
- [ ] Run `node tools/fix-sass-warnings.js` to automate what is possible.
- [ ] Manually refactor SCSS modules to use the `@use` module system.
- [ ] Audit `themes/san-diego/source/styles` for mixed declaration warnings.

### 2. Visual Regression Testing Gaps
**Context**: While `test:css` runs in CI, it is specific to CSS borders.
**Issue**: The `visual:diff` tool (Puppeteer-based) exists in `tools/` but is **not** currently active in the CI pipeline (`optimize-and-deploy.yml`). This leaves the visual layer vulnerable to regressions during refactors.
**Action Plan**:
- [ ] Integrate `tools/visual-diff.js` into the GitHub Actions workflow (non-blocking initially).
- [ ] Establish a baseline for critical pages (Home, Portfolio, Blog Post).

## 🟡 Medium Priority

### 3. Build Script Fragmentation
**Context**: Build logic is split across `scripts/` (Hexo hooks), `tools/` (Utility scripts), and `demos/build-scripts/`.
**Issue**: Poor discoverability and potential for logic duplication.
**Action Plan**:
- [ ] Consolidate build-related scripts into `build-system/` or a dedicated `scripts/` structure.
- [ ] Standardize naming conventions (e.g., all build tools in one place).

### 4. Demo Pipeline Efficiency
**Context**: The `build:demos` script physically copies build artifacts (`dist/`) into `themes/san-diego/source/demos/`.
**Issue**: This IO operation is slower than necessary and duplicates files during development.
**Action Plan**:
- [ ] Investigate using symbolic links for demos in `npm run dev` mode to avoid copying.
- [ ] Ensure `hexo server` can serve symlinked assets correctly.

## 🟢 Low Priority (Maintenance)

### 5. "Self-Healing" System Opacity
**Context**: The `build-system/self-healing-simple.js` and `BuildManager.js` wrap standard commands.
**Issue**: While helpful, these scripts add a layer of opacity that might mask root causes of instability (e.g., memory leaks) by automatically restarting rather than alerting the developer.
**Action Plan**:
- [ ] Add verbose logging mode to self-healing scripts to expose *why* a restart occurred.
- [ ] Review restart triggers to ensure they aren't masking simple fixable bugs.
