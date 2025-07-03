# Claude Code Quick Start

**For new Claude instances:** Run `npm run onboard` for interactive orientation.

## Core Principles
1. **Do exactly what's asked** - Nothing more, nothing less
2. **Respect boundaries** - Don't modify files/features marked as working
3. **Test thoroughly** - Always verify changes work in both themes
4. **Use existing patterns** - Check before adding new dependencies

## Essential Commands
```bash
npm run onboard    # Run this first! Interactive orientation
npm run dev        # Start development (recommended)
npm run test:dev   # Quick validation during work
npm run doctor     # Check system health
npm run fix        # Auto-fix common issues
```

## Project Overview
- **Hexo-based** static site generator for portfolio/blog
- **Custom theme** ("san-diego") with modular SCSS/JS
- **Interactive demos** showcase project features
- **Self-healing system** auto-fixes common dev issues

## File Structure at a Glance
```
source/_posts/        → Content (Markdown)
themes/san-diego/     → Theme (templates, styles, scripts)
demos/               → Interactive project demos
build-system/        → Dev tools & automation
docs/                → Technical documentation
```

## Working Guidelines
- **Always build before commit:** `npm run build`
- **Use TodoWrite tool** for task planning/tracking
- **Screenshot before visual changes** (Cmd+Ctrl+Shift+4)
- **Check existing code** before implementing new features
- **Read CLAUDE.md** for detailed guidelines when needed

## Common Tasks
- **New content:** `hexo new portfolio-post "Title"`
- **New demo:** `npm run create:demo`
- **Fix SCSS:** `npm run lint:scss:fix`
- **Test changes:** `npm run test:quick`

## When Stuck
1. Check error messages - self-healing often helps
2. Run `npm run doctor` for health check
3. Consult `CLAUDE.md` for detailed guidance
4. Look at existing implementations for patterns

---

**Remember:** This is a working production site. Be careful, test thoroughly, and always respect the user's specific constraints.