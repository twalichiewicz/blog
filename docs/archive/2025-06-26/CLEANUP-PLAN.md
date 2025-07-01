# Documentation Cleanup Plan

## Current Issues
1. **Duplicate Files**: Same content exists in multiple locations (e.g., SECURITY.md vs 01-overview/security.md)
2. **Mixed Organization**: Some files in numbered folders, others in root
3. **Redundant Content**: Multiple performance guides, refactoring plans, etc.
4. **Poor Discoverability**: Hard to find what you need

## Proposed Structure

```
docs/
├── README.md                    # Documentation overview & navigation
├── QUICK-REFERENCE.md          # Keep at root for easy access
│
├── guides/                     # How-to guides and tutorials
│   ├── development/
│   │   ├── getting-started.md
│   │   ├── creating-content.md
│   │   ├── creating-demos.md
│   │   ├── testing.md
│   │   ├── deployment.md
│   │   └── troubleshooting.md
│   │
│   ├── portfolio/
│   │   ├── editing-projects.md
│   │   ├── case-studies.md
│   │   └── best-practices.md
│   │
│   └── maintenance/
│       ├── performance-optimization.md
│       ├── security-updates.md
│       └── dependency-management.md
│
├── reference/                  # Technical reference docs
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── theme-system.md
│   │   ├── demo-system.md
│   │   └── build-pipeline.md
│   │
│   ├── components/
│   │   ├── README.md
│   │   ├── demo-components.md
│   │   ├── ui-components.md
│   │   └── media-components.md
│   │
│   └── api/
│       ├── hexo-plugins.md
│       ├── theme-helpers.md
│       └── custom-scripts.md
│
├── project/                    # Project management docs
│   ├── roadmap.md
│   ├── changelog.md
│   ├── technical-debt.md
│   └── contribution-guide.md
│
└── archive/                    # Old/deprecated docs
    └── [date-organized folders]
```

## Migration Plan

### Phase 1: Backup Current State
```bash
# Create backup
cp -r docs docs-backup-2025-06-26
```

### Phase 2: Create New Structure
```bash
# Create new directories
mkdir -p docs/guides/{development,portfolio,maintenance}
mkdir -p docs/reference/{architecture,components,api}
mkdir -p docs/project
mkdir -p docs/archive/2025-06-26
```

### Phase 3: Consolidate & Move Files

#### Development Guides
- Merge all testing docs → `guides/development/testing.md`
- Merge deployment docs → `guides/development/deployment.md`
- Extract getting started → `guides/development/getting-started.md`

#### Reference Docs
- Consolidate architecture docs → `reference/architecture/`
- Move component docs → `reference/components/`
- Technical specs → `reference/api/`

#### Project Management
- Move roadmaps → `project/roadmap.md`
- Technical debt → `project/technical-debt.md`
- Keep CHANGELOG at root level

### Phase 4: Update Links
- Update all internal documentation links
- Update README.md with new structure
- Update CLAUDE.md references

### Phase 5: Clean Up
- Remove empty directories
- Archive old/duplicate files
- Update .gitignore if needed

## Benefits
1. **Clear Organization**: Guides vs Reference vs Project docs
2. **No Duplicates**: Single source of truth
3. **Easy Navigation**: Logical hierarchy
4. **Future-Proof**: Room to grow without chaos
5. **Better Discoverability**: Know where to look

## Implementation Time
Estimated: 30-45 minutes for full cleanup and reorganization