# Claude Custom Commands

This directory contains custom commands for Claude Code to streamline common workflows.

## Setup

To use these commands, copy them to your local `.claude/commands/` directory:

```bash
# One-time setup
mkdir -p ~/.claude/commands
cp tools/claude-commands/*.md ~/.claude/commands/

# Or symlink for automatic updates
ln -s $(pwd)/tools/claude-commands/*.md ~/.claude/commands/
```

## Available Commands

### `/project:portfolio-improve [project-name]`
Systematically enhance a portfolio case study following Apple design leadership criteria.

Example: `/project:portfolio-improve tinyPod`

### `/project:performance-audit [target]`
Run comprehensive performance analysis on a page, component, or the entire site.

Example: `/project:performance-audit site`

### `/project:fix-tech-debt [issue]`
Address specific technical debt items with a structured approach.

Example: `/project:fix-tech-debt "duplicate scroll implementations"`

### `/project:visual-compare [component]`
Create visual regression comparisons for UI changes.

Example: `/project:visual-compare navigation`

## Creating New Commands

1. Create a new `.md` file in this directory
2. Use `$ARGUMENTS` to capture user input
3. Structure the command with clear steps
4. Test locally before committing

## Best Practices

- Keep commands focused on a single workflow
- Include verification steps
- Add example usage in the command
- Update this README when adding new commands

---

*These commands implement Claude Code best practices for the thomas.design blog project.*