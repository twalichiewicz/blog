#!/bin/bash

# Script to commit changes from each worktree to their respective branches
echo "📝 Committing Worktree Changes to Branches"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Worktree definitions
WORKTREES=(
    "blog-js-cleanup:tech-debt/js-cleanup:Remove console.logs and fix memory leaks"
    "blog-build-opt:tech-debt/build-optimization:Remove unused dependencies (chart.js, two.js, pdfjs-dist)"
    "blog-scroll:tech-debt/scroll-consolidation:Consolidate multiple scroll implementations"
    "blog-modules:tech-debt/module-system:Implement proper module system and fix global variables"
    "blog-css-refactor:tech-debt/css-refactor:Eliminate !important flags and refactor CSS specificity"
)

# Function to commit changes in a worktree
commit_worktree_changes() {
    local worktree_path=$1
    local branch_name=$2
    local commit_message=$3
    
    echo -e "\n${BLUE}Processing $worktree_path (branch: $branch_name)${NC}"
    
    # Check if worktree directory exists
    if [ ! -d "../$worktree_path" ]; then
        echo -e "${RED}❌ Worktree directory ../$worktree_path not found${NC}"
        return 1
    fi
    
    # Change to worktree directory
    pushd "../$worktree_path" > /dev/null
    
    # Check git status
    if git status --porcelain | grep -q .; then
        echo -e "${YELLOW}Found uncommitted changes:${NC}"
        git status --short
        
        # Add all changes
        echo -e "${YELLOW}Adding all changes...${NC}"
        git add .
        
        # Commit with descriptive message
        echo -e "${YELLOW}Committing changes...${NC}"
        git commit -m "$(cat <<EOF
$commit_message

🤖 Generated with Claude Code (https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Successfully committed changes to $branch_name${NC}"
        else
            echo -e "${RED}❌ Failed to commit changes to $branch_name${NC}"
            popd > /dev/null
            return 1
        fi
    else
        echo -e "${YELLOW}⚠ No uncommitted changes found in $worktree_path${NC}"
    fi
    
    # Return to original directory
    popd > /dev/null
    return 0
}

echo -e "${BLUE}Processing all worktrees...${NC}"

# Process each worktree
for item in "${WORKTREES[@]}"; do
    IFS=':' read -r worktree_path branch_name commit_message <<< "$item"
    commit_worktree_changes "$worktree_path" "$branch_name" "$commit_message"
done

echo -e "\n${GREEN}🎉 Finished processing all worktrees!${NC}"

# Show summary of all branches
echo -e "\n${BLUE}Branch summary:${NC}"
for item in "${WORKTREES[@]}"; do
    IFS=':' read -r worktree_path branch_name commit_message <<< "$item"
    echo -e "${YELLOW}$branch_name:${NC}"
    git log --oneline -1 "$branch_name" 2>/dev/null || echo "  No commits found"
done

echo -e "\n${YELLOW}Next step: Run ./integrate-tech-debt.sh to merge all changes${NC}"