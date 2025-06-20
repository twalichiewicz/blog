# Claude Code Optimization Plan

This plan implements best practices from the Claude Code guide, tailored specifically for the thomas.design blog project.

## 1. Immediate Setup Improvements

### A. Install Essential Tools
```bash
# Install GitHub CLI for better GitHub integration
brew install gh
gh auth login

# Install useful analysis tools
npm install -g @11ty/performance-leaderboard
npm install -g lighthouse
```

### B. Create Custom Slash Commands

Create these files in `.claude/commands/`:

#### `.claude/commands/portfolio-improve.md`
```markdown
Please help improve the portfolio project: $ARGUMENTS

Follow these steps:
1. Read the project's markdown file in source/_posts/
2. Analyze against Apple design leadership criteria:
   - Process clarity (research → insights → solutions)
   - Visual documentation (sketches, prototypes, final designs)
   - Impact metrics and outcomes
   - Role clarity and team collaboration
3. Create a detailed improvement plan
4. Implement improvements maintaining the existing structure
5. Add proper images with captions where needed
6. Ensure mobile responsiveness is documented
7. Run npm run build to verify changes
```

#### `.claude/commands/performance-audit.md`
```markdown
Run a comprehensive performance audit on: $ARGUMENTS

Steps:
1. Analyze the current page/component performance
2. Check image optimization status
3. Review CSS/JS bundle sizes
4. Identify render-blocking resources
5. Create a prioritized list of improvements
6. Implement quick wins immediately
7. Document larger optimizations needed
```

#### `.claude/commands/fix-tech-debt.md`
```markdown
Fix the technical debt item: $ARGUMENTS

Process:
1. Read the technical debt documentation
2. Understand the specific issue thoroughly
3. Search for all affected files
4. Create a fix plan with minimal disruption
5. Implement the fix with proper error handling
6. Test thoroughly in development
7. Update technical debt documentation
```

### C. Enhance CLAUDE.md with Specific Instructions

Add these sections to your CLAUDE.md:

```markdown
## IMPORTANT: Working Patterns

### Visual Development Workflow
When working on UI changes:
1. ALWAYS take screenshots before making changes
2. Use the visual-testing protocols in docs/02-development/visual-testing-guide.md
3. Iterate on designs by comparing screenshots
4. For major changes, create a visual comparison document

### Portfolio Improvement Checklist
When improving portfolio projects:
- ✓ Clear problem statement
- ✓ Research and insights documented
- ✓ Design process shown (sketches → wireframes → final)
- ✓ Mobile designs included
- ✓ Metrics and outcomes stated
- ✓ My specific role clarified
- ✓ Team collaboration noted

### Performance First
- Run npm run analyze after significant changes
- Check that images are optimized (npm run optimize:images)
- Verify lazy loading works for new content
- Keep bundle sizes under control

### Git Workflow
- Create descriptive commits (let me write commit messages)
- Always run npm run build before committing
- Create PRs for significant changes
- Reference issues in commits when applicable
```

## 2. Optimize Common Workflows

### A. Portfolio Enhancement Workflow
```bash
# Alias for quick portfolio work
alias portfolio-enhance="claude --allowedTools Edit Read Bash WebFetch"

# Workflow:
1. Use: /project:portfolio-improve [project-name]
2. Let Claude analyze and create improvement plan
3. Review plan before implementation
4. Iterate with visual comparisons
5. Commit with detailed message
```

### B. Performance Optimization Workflow
```bash
# Create performance baseline
npm run build && npm run analyze > performance-baseline.txt

# After changes
npm run build && npm run analyze > performance-current.txt
diff performance-baseline.txt performance-current.txt
```

### C. Technical Debt Reduction Workflow
1. Start with: /project:fix-tech-debt [issue]
2. Let Claude explore and understand the issue
3. Review proposed solution
4. Implement with thorough testing
5. Update documentation

## 3. Visual Development Setup

### A. Screenshot Workflow
```bash
# Add to CLAUDE.md:
## Screenshot Commands
- Mac: Cmd+Ctrl+Shift+4 (screenshot to clipboard)
- Paste into Claude: Ctrl+V (not Cmd+V)
- For full page: Use browser DevTools > Cmd+Shift+P > "Capture full size screenshot"
```

### B. Visual Regression Testing
```bash
# Create baseline screenshots
mkdir -p tests/visual-baseline
# Take screenshots of key pages/components

# After changes, compare
mkdir -p tests/visual-current
# Use Claude to compare directories
```

## 4. Permission Optimization

Add to your allowlist for smoother workflow:
```bash
/permissions

# Add these:
- Edit (always allow file edits)
- Bash(npm *) (allow all npm commands)
- Bash(git *) (allow all git commands)
- WebFetch(*.github.com) (allow GitHub fetches)
- WebFetch(*.design) (allow fetching your own site)
```

## 5. Multi-Task Workflow Setup

### A. Git Worktrees for Parallel Work
```bash
# Set up worktrees for different types of work
git worktree add ../blog-portfolio portfolio-improvements
git worktree add ../blog-performance performance-optimization
git worktree add ../blog-tech-debt tech-debt-fixes

# Work on multiple improvements simultaneously
cd ../blog-portfolio && claude
# In another terminal:
cd ../blog-performance && claude
```

### B. Task Checklist Pattern
For complex multi-step tasks:
```markdown
# Create a checklist file
echo "# Portfolio Improvement Checklist" > TASK_CHECKLIST.md
echo "- [ ] Analyze all 25 projects" >> TASK_CHECKLIST.md
echo "- [ ] Prioritize top 8 with case studies" >> TASK_CHECKLIST.md
echo "- [ ] Enhance each project systematically" >> TASK_CHECKLIST.md

# Use with Claude
claude -p "Work through TASK_CHECKLIST.md systematically"
```

## 6. Automation Opportunities

### A. Pre-commit Hook
```bash
# .git/hooks/pre-commit
#!/bin/bash
echo "Running pre-commit checks..."
npm run build || exit 1
npm run lint:scss || exit 1
```

### B. Automated Issue Triage
```bash
# Create .claude/scripts/triage-issues.sh
claude -p "Review all open GitHub issues and add appropriate labels based on: 
- bug (technical issues)
- enhancement (new features)
- documentation (docs needed)
- portfolio (portfolio improvements)
- performance (optimization needed)
" --output-format stream-json
```

## 7. Context Management Strategy

### A. Clear Context Between Major Tasks
```
/clear
# Good times to clear:
- After completing a portfolio project improvement
- Before starting performance optimization
- When switching between features and bug fixes
```

### B. Use Subagents for Research
When exploring complex issues:
```
"Research why carousel indicators aren't showing with subagents. 
Don't write any code yet, just understand the issue thoroughly."
```

## 8. Specific Patterns for Your Project

### A. Case Study Enhancement Pattern
1. "Read [project-name].md and analyze against Apple criteria"
2. "Create visual mockups for missing mobile designs"
3. "Write detailed process documentation"
4. "Add metrics and impact statements"
5. "Generate comparison screenshots"

### B. Performance Optimization Pattern
1. "Analyze current performance metrics"
2. "Identify largest contributors to bundle size"
3. "Propose optimization strategy"
4. "Implement and measure improvements"
5. "Document changes in performance guide"

### C. Component Development Pattern
1. "Research existing component patterns"
2. "Design new component following design system"
3. "Implement with proper testing"
4. "Add to component library"
5. "Update documentation"

## Implementation Priority

### Week 1: Foundation
- [x] Install gh CLI
- [ ] Create custom slash commands
- [ ] Update CLAUDE.md with specific patterns
- [ ] Set up permission allowlist

### Week 2: Workflows
- [ ] Implement portfolio enhancement workflow
- [ ] Set up visual regression testing
- [ ] Create task checklists for major work

### Week 3: Automation
- [ ] Add pre-commit hooks
- [ ] Set up automated issue triage
- [ ] Create performance monitoring

### Week 4: Advanced
- [ ] Set up git worktrees
- [ ] Implement multi-Claude workflows
- [ ] Create project-specific commands

## Success Metrics

Track these to measure improvement:
1. Time to complete portfolio enhancement: Target 50% reduction
2. Build failures before commit: Target 0
3. Visual regression catches: Track prevented issues
4. Context switches needed: Minimize with better organization
5. Commands repeated: Should decrease as patterns establish

---

*This plan will evolve as we discover what works best for your specific workflow.*