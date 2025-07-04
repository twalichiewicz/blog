# 🤖 Claude Code: START HERE

## 🚨 MANDATORY FIRST STEP - NO EXCEPTIONS 🚨

**Before doing ANYTHING in this repository, run this command:**

```bash
npm run check-branch
```

**This is NOT optional. Do it NOW.**

---

## Why This Matters

This repository has **branch protection** to prevent accidental commits to the main branch. The `npm run check-branch` command will:

1. ✅ Check what branch you're currently on
2. 🛑 Block you if you're on main
3. 🚀 Help you create a safe working environment
4. 📝 Guide you through the proper workflow

## After Running the Check

Once you're on a safe branch, you can proceed with normal development:

```bash
# Development commands
npm run dev          # Start development server
npm run build        # Test your changes
npm run doctor       # Check system health

# When ready to commit
git add -A
git commit -m "your message"
git push
```

## Quick Reference

- **Feature work**: `git checkout -b feature/my-feature`
- **Bug fixes**: `git checkout -b fix/issue-name`
- **Complex features**: Use worktrees with `git worktree add -b feature/name ../blog-feature`

---

**🔒 Remember: The main branch is PROTECTED. Work in feature branches only.**