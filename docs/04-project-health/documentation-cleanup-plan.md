# Documentation Cleanup Plan

*Created: June 20, 2025*

## Overview

This plan outlines the cleanup and reorganization of documentation across the repository to improve discoverability, reduce redundancy, and ensure maintainability.

## Current State
- **Total documentation files**: 50+ scattered across various directories
- **Redundant content**: Multiple files covering similar topics
- **Organization**: Inconsistent structure and placement
- **Outdated content**: Some files contain obsolete information

## Proposed New Structure

```
/docs/
├── README.md                    # Documentation index and navigation
├── CONTRIBUTING.md              # How to contribute (NEW)
├── CHANGELOG.md                 # Version history (NEW)
│
├── development/                 # Development guides
│   ├── getting-started.md       # Combined from README.md + DEVELOPMENT.md
│   ├── architecture.md          # From ARCHITECTURE.md + THEME_ARCHITECTURE.md
│   ├── deployment.md            # From DEPLOYMENT.md
│   ├── testing.md               # Combined testing guides
│   └── security.md              # From SECURITY.md
│
├── guides/                      # How-to guides
│   ├── content-editing.md       # From ARTICLE_EDITING_PLAYBOOK.md
│   ├── video-conversion.md      # From video-conversion-guide.md
│   ├── visual-testing.md        # From VISUAL-TESTING-GUIDE.md
│   └── commit-checklist.md      # From COMMIT-CHECKLIST.md
│
├── components/                  # Component documentation
│   ├── README.md                # Component overview
│   ├── carousel.md              # From carousel-component.md
│   ├── alert-message.md         # From alert-message-component.md
│   ├── adaptive-video.md        # From README-adaptive-videos.md
│   ├── anchor-links.md          # From ANCHOR_LINKS.md
│   ├── project-summary.md       # From project-summary-component.md
│   └── button.md                # Moved from theme directory
│
├── refactoring/                 # Refactoring documentation
│   ├── css-refactoring.md       # Consolidated CSS refactoring docs
│   ├── js-refactoring.md        # Consolidated JS refactoring docs
│   └── performance.md           # Consolidated performance docs
│
├── technical-debt/              # Technical debt tracking
│   ├── README.md                # Overview
│   ├── analysis-2025.md         # Current TECHNICAL_DEBT_ANALYSIS.md
│   └── completed-fixes.md       # From CRITICAL_FIXES_COMPLETED.md
│
├── portfolio/                   # Portfolio documentation
│   ├── analysis.md              # From PORTFOLIO_ANALYSIS_2025.md
│   ├── improvement-plan.md      # From PORTFOLIO_IMPROVEMENT_PLAN.md
│   ├── quality-standards.md     # From PORTFOLIO_QUALITY_FOCUS.md
│   └── case-studies/
│       ├── foreground-guide.md  # From FOREGROUND_EDITING_GUIDE.md
│       └── desktop-install.md   # From DESKTOP_INSTALL_ENHANCEMENT.md
│
└── planning/                    # Planning documents
    ├── component-library.md     # From component-library-plan.md
    ├── mobile-buttons.md        # From mobile-button-alternatives.md
    └── impact-report-system.md  # From impact-report-system.md
```

## Cleanup Actions

### 1. Files to Delete
- [ ] `/temp_section.txt` - Temporary file
- [ ] Redundant refactoring files after consolidation
- [ ] Old performance files after merging

### 2. Files to Consolidate

#### CSS Refactoring (merge into one file):
- `css-refactoring-plan.md`
- `css-refactoring-implementation-guide.md`
- `css-refactoring-metrics.md`
- `css-refactoring-examples.md`

#### JS Refactoring (merge into one file):
- `js-refactoring-plan.md`
- `js-refactoring-implementation-guide.md`
- `js-refactoring-metrics.md`
- `js-refactoring-examples.md`

#### Performance (merge into one file):
- `PERFORMANCE.md`
- `PERFORMANCE_OPTIMIZATION.md`

#### Technical Debt (merge into organized structure):
- `TECH_DEBT.md`
- `TECHNICAL_DEBT_ANALYSIS.md`

### 3. Files to Move

#### From root to `/docs/`:
- `ARCHITECTURE.md` → `/docs/development/architecture.md`
- `TESTING-PROTOCOLS.md` → `/docs/development/testing.md`
- `VISUAL-TESTING-GUIDE.md` → `/docs/guides/visual-testing.md`
- `COMMIT-CHECKLIST.md` → `/docs/guides/commit-checklist.md`
- `ARTICLE_EDITING_PLAYBOOK.md` → `/docs/guides/content-editing.md`
- Planning documents → `/docs/planning/`

#### From theme directories:
- Component docs → `/docs/components/`

### 4. Files to Update

#### `CLAUDE.md` (keep in root)
- Update to reference new documentation structure
- Add links to key documentation files

#### `/docs/README.md`
- Create comprehensive index of all documentation
- Add clear navigation structure
- Include quick links to most-used docs

#### Theme READMEs
- Update to point to centralized documentation
- Keep only theme-specific information

### 5. New Files to Create

#### `/docs/CONTRIBUTING.md`
- How to contribute to the project
- Code style guidelines
- PR process
- Testing requirements

#### `/docs/CHANGELOG.md`
- Track significant changes
- Version history
- Breaking changes
- Migration guides

## Implementation Steps

### Phase 1: Preparation (1 hour)
1. Create new directory structure in `/docs/`
2. Create placeholder README files for each section
3. Back up current documentation

### Phase 2: Consolidation (2 hours)
1. Merge CSS refactoring documentation
2. Merge JS refactoring documentation
3. Merge performance documentation
4. Merge technical debt documentation

### Phase 3: Migration (1 hour)
1. Move files to new locations
2. Update internal links
3. Delete redundant files
4. Update root documentation references

### Phase 4: Enhancement (2 hours)
1. Create CONTRIBUTING.md
2. Create CHANGELOG.md
3. Update main documentation index
4. Add navigation to all sections

### Phase 5: Validation (30 minutes)
1. Check all internal links
2. Verify no documentation is lost
3. Update CLAUDE.md with new structure
4. Commit with clear message

## Benefits

1. **Improved Discoverability**: Clear hierarchy makes finding docs easier
2. **Reduced Redundancy**: No more duplicate information
3. **Better Maintenance**: Related docs are grouped together
4. **Scalability**: Structure supports future growth
5. **Professional**: Follows standard open-source documentation patterns

## Notes

- Keep file names lowercase with hyphens for consistency
- Use relative links between documentation files
- Each section should have its own README.md as an index
- Preserve git history by using `git mv` for file moves

---

*This cleanup will transform scattered documentation into a well-organized knowledge base that supports both new contributors and ongoing maintenance.*