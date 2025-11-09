#!/bin/bash

# Integration script for technical debt fixes
echo "🚀 Technical Debt Integration with Testing"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to run integration tests
run_integration_tests() {
    local branch_name=$1
    echo -e "\n${YELLOW}🧪 Running Integration Tests for $branch_name${NC}"
    
    # Test 1: Build succeeds
    echo -n "Testing build... "
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
    
    # Test 2: No active console.logs in production
    echo -n "Checking for active console.logs... "
    if ! grep -r '^\s*console\.log' themes/san-diego/source/js --exclude='*.min.js' > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
    
    # Test 3: Server starts
    echo -n "Testing server startup... "
    hexo server -p 4444 > /dev/null 2>&1 &
    SERVER_PID=$!
    sleep 3
    if kill -0 $SERVER_PID 2>/dev/null; then
        kill $SERVER_PID
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        echo -e "${RED}✗ FAILED${NC}"
        return 1
    fi
    
    # Test 4: Package audit
    echo -n "Running npm audit... "
    if npm audit --audit-level=high > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
    else
        echo -e "${YELLOW}⚠ WARNINGS${NC}"
    fi
    
    return 0
}

# Function to create backup tag
create_backup() {
    local step=$1
    git tag -a "backup-before-$step-$(date +%Y%m%d-%H%M)" -m "Backup before $step integration"
}

# Integration order (lowest risk to highest)
INTEGRATION_ORDER=(
    "js-cleanup:Low risk - removing console.logs"
    "build-optimization:Low risk - removing unused dependencies"
    "scroll-consolidation:Medium risk - behavior changes"
    "module-system:Medium-high risk - architecture changes"
    "css-refactor:High risk - visual/layout changes"
)

echo -e "${BLUE}Integration Order:${NC}"
for i in "${!INTEGRATION_ORDER[@]}"; do
    IFS=':' read -r branch desc <<< "${INTEGRATION_ORDER[$i]}"
    echo "  $((i+1)). $branch - $desc"
done

echo -e "\n${YELLOW}Starting integration process...${NC}"

# Run baseline tests
echo -e "\n${BLUE}Running baseline tests on main branch...${NC}"
if ! run_integration_tests "main"; then
    echo -e "${RED}❌ Baseline tests failed! Fix main branch first.${NC}"
    exit 1
fi

# Process each branch
for item in "${INTEGRATION_ORDER[@]}"; do
    IFS=':' read -r branch desc <<< "$item"
    
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}Integrating: tech-debt/$branch${NC}"
    echo -e "${BLUE}Description: $desc${NC}"
    echo -e "${BLUE}================================================${NC}"
    
    # Create backup tag
    create_backup "$branch"
    
    # Check if branch has changes
    if git log --oneline main..tech-debt/$branch | grep -q .; then
        echo -e "${GREEN}Found changes in tech-debt/$branch${NC}"
        
        # Merge the branch
        echo -e "\n${YELLOW}Merging tech-debt/$branch...${NC}"
        if git merge --no-ff tech-debt/$branch; then
            echo -e "${GREEN}✓ Merge successful${NC}"
        else
            echo -e "${RED}❌ Merge failed! Manual intervention required.${NC}"
            exit 1
        fi
        
        # Run integration tests
        if run_integration_tests "$branch"; then
            echo -e "\n${GREEN}✅ All tests passed for $branch${NC}"
            echo -e "${YELLOW}Committing integration...${NC}"
            # Already committed by merge
        else
            echo -e "\n${RED}❌ Tests failed for $branch${NC}"
            echo -e "${YELLOW}Rolling back...${NC}"
            git reset --hard HEAD~1
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠ No changes found in tech-debt/$branch - skipping${NC}"
    fi
    
    echo -e "\n${GREEN}✅ Successfully integrated $branch${NC}"
    echo -e "${BLUE}Pausing for 2 seconds before next integration...${NC}"
    sleep 2
done

echo -e "\n${GREEN}🎉 All technical debt fixes integrated successfully!${NC}"
echo -e "${BLUE}Summary of changes:${NC}"
git log --oneline --graph -10

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Run comprehensive manual testing"
echo "2. Deploy to staging environment"
echo "3. Monitor for 24 hours before production"
echo "4. Circle back to pagination implementation"