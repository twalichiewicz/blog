# Mobile-First Design System Standardization Plan

## 1. Typography Standardization

**Current State:**
- Base font size is `0.875rem` (14px).
- User preference aligns with smaller, information-dense type on mobile.

**Revised System (14px Base):**

| Element | Mobile Size (px/rem) | Desktop Size (px/rem) | Line Height | Variable |
|:---|:---|:---|:---|:---|
| **H1** | 28px / 1.75rem | 42px / 2.625rem | 1.1 | `--text-4xl` -> `--text-5xl` |
| **H2** | 21px / 1.3125rem | 28px / 1.75rem | 1.2 | `--text-3xl` -> `--text-4xl` |
| **H3** | 18px / 1.125rem | 21px / 1.3125rem | 1.3 | `--text-2xl` -> `--text-3xl` |
| **Body** | **14px / 0.875rem** | 14px / 0.875rem | 1.5 | `--text-base` |
| **Small** | 12px / 0.75rem | 12px / 0.75rem | 1.4 | `--text-sm` |
| **Caption**| 10px / 0.625rem | 10px / 0.625rem | 1.3 | `--text-xs` |

**Action Items:**
1.  Update `_typography-system.scss`:
    - Ensure `:root` base size stays adaptable but defaults to `14px` equivalence where appropriate.
    - Define precise rem-based variables based on 16px root (e.g., 14px = 0.875rem).
2.  Refactor components to use `var(--text-*)` variables.

## 2. Spacing & Layout System (3pt Grid)

**Philosophy:** All spacing must be a multiple of **3**.

**Proposed Grid:**

| Variable | Size | Usage |
|:---|:---|:---|
| `$space-1` | 3px | Ultra tight |
| `$space-2` | 6px | Tight grouping |
| `$space-3` | 9px | Element gap |
| `$space-4` | 12px | **Standard Padding** |
| `$space-5` | 15px | Medium gap |
| `$space-6` | 18px | **Mobile Screen Padding** |
| `$space-8` | 24px | Section gap |
| `$space-16` | 48px | Large Section gap |

**Action Items:**
1.  Update `_variables.scss` to strictly enforce the 3pt scale.
2.  Standardize container padding:
    - Mobile: `padding-left: 18px ($space-6); padding-right: 18px;`
    - Desktop: `padding-left: 24px ($space-8); padding-right: 24px;`
3.  Audit codebase to remove non-conforming values (e.g., 20px, 10px).

## 3. Shape & Border Radius (Aqua System)

**Philosophy:**
- **Interactive Elements** (Buttons, Inputs, Active States): **Full Rounded / Pill** (`9999px` or `50%`).
- **Static Containers** (Cards, Images, Modals): **Slightly Rounded** (`12px` or `$space-4`).

**Action Items:**
1.  Define radius variables:
    - `--radius-interactive`: `9999px`
    - `--radius-container`: `12px`
2.  Audit buttons and inputs to ensure full rounded style.
3.  Audit cards and images to ensure consistent 12px radius.

## 4. Color System & Dark Mode

**Proposed Semantic Variables:**

| Semantic Name | Light (Default) | Dark |
|:---|:---|:---|
| `--bg-surface` | `hsl(35, 15%, 88%)` | `hsl(28, 8%, 15%)` |
| `--bg-card` | `white` | `hsl(0, 0%, 18%)` |
| `--text-primary` | `hsl(24, 3%, 35%)` | `hsl(0, 0%, 95%)` |
| `--text-secondary` | `hsl(35, 15%, 30%)` | `hsl(0, 0%, 75%)` |
| `--border-subtle` | `hsl(35, 10%, 75%)` | `hsl(0, 0%, 25%)` |

**Action Items:**
1.  Define CSS variables in `_theme-modes.scss`.
2.  Replace SCSS variables in components with CSS variables.
3.  Consolidate dark mode logic.

## 5. Refactoring & Cleanup

**Goal:** Eliminate monolithic files and overlapping styles.

**Identify Overlaps:**
- `_layout-fixes.scss` vs `_layout-system.scss`
- `_mobile-scroll-fix.scss` vs `_mobile-dynamic-content-fix.scss`
- `_project.scss` (Monolith)

**Phase 1: Merge & Purge**
- Consolidate layout fixes into `_layout-system.scss`.
- Consolidate scroll fixes into `_scroll-system.scss`.

**Phase 2: Project Breakdown**
- Split `_project.scss` into modular files:
    - `styles/project/_header.scss`
    - `styles/project/_content.scss`
    - `styles/project/_gallery.scss`

**Phase 3: Blog Cleanup**
- Extract specific post styles from `_blog.scss`.

## 6. Mobile-First Checklist

- [ ] **Touch Targets:** At least 44x44px.
- [ ] **Readable Text:** 14px base, appropriately scaled line-height.
- [ ] **Horizontal Scroll:** Ensure code blocks/tables scroll.
- [ ] **Safe Areas:** Respect `env(safe-area-inset-*)`.