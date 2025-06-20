# COMMIT CHECKLIST - STOP AND CHECK!

## Before EVERY commit:

### 1. ✅ BUILD TEST (MANDATORY)
```bash
npm run build
```
**If this fails → STOP. Fix errors before proceeding.**

### 2. ✅ Classification Check
- [ ] Is this a 🟢 Green Light change? (proceed)
- [ ] Is this a 🟡 Yellow Light change? (self-review required)
- [ ] Is this a 🔴 Red Light change? (designer review required)

### 3. ✅ For Visual Changes (🟡/🔴)
- [ ] Created baseline screenshots before changes?
- [ ] Ran visual regression tests?
- [ ] Reviewed diff report?

### 4. ✅ Code Quality
- [ ] No console.log() statements left?
- [ ] No commented-out code?
- [ ] Followed existing code patterns?

### 5. ✅ Testing
- [ ] Tested in development server?
- [ ] Checked both light and dark modes?
- [ ] Verified mobile responsiveness?

## Remember:
**"Pushing broken builds is like sending out raw chicken from the kitchen"**

When in doubt → Test it out!