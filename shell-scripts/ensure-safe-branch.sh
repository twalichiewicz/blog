#!/bin/bash
# Safety script to ensure Claude doesn't work on main branch

CURRENT_BRANCH=$(git branch --show-current)

echo "🤖 Claude Code Branch Safety Check"
echo "Current branch: $CURRENT_BRANCH"
echo ""

if [ "$CURRENT_BRANCH" = "main" ]; then
    echo "🛑 WORKFLOW VIOLATION PREVENTION"
    echo "You are currently on the PROTECTED main branch!"
    echo ""
    echo "🚨 YOU MUST CREATE A WORKING BRANCH BEFORE PROCEEDING 🚨"
    echo ""
    echo "Choose an option:"
    echo "1. Create a new feature branch (quick)"
    echo "2. Create a new worktree (isolated)"
    echo "3. Switch to existing branch"
    echo "4. Just show me the command to run manually"
    echo ""
    
    # Auto-suggest branch name based on current time
    SUGGESTED_BRANCH="feature/claude-work-$(date +%m%d-%H%M)"
    echo "💡 Suggested branch name: $SUGGESTED_BRANCH"
    echo ""
    
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            read -p "Enter feature branch name (e.g., fix/issue-name): " branch_name
            git checkout -b "$branch_name"
            echo "✅ Created and switched to branch: $branch_name"
            ;;
        2)
            read -p "Enter worktree name (e.g., blog-feature): " worktree_name
            read -p "Enter branch name (e.g., feature/name): " branch_name
            git worktree add -b "$branch_name" "../$worktree_name"
            echo "✅ Created worktree: ../$worktree_name with branch: $branch_name"
            echo "Navigate to ../$worktree_name to work"
            ;;
        3)
            git branch -a
            read -p "Enter branch name to switch to: " branch_name
            git checkout "$branch_name"
            echo "✅ Switched to branch: $branch_name"
            ;;
        4)
            echo "📋 Manual commands:"
            echo "   git checkout -b feature/my-feature-name"
            echo "   git worktree add -b feature/my-feature ../blog-my-feature"
            echo ""
            echo "❌ No changes made. Run one of the above commands manually."
            exit 1
            ;;
        *)
            echo "❌ Invalid choice. Exiting."
            exit 1
            ;;
    esac
else
    echo "✅ Safe to work - you're on branch: $CURRENT_BRANCH"
fi