#!/bin/bash

# Continue integration from where we left off
echo "🔄 Continuing Technical Debt Integration"
echo "======================================="

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
    
    return 0
}

# Test scroll consolidation first
echo -e "${BLUE}Testing scroll consolidation merge...${NC}"
if run_integration_tests "scroll-consolidation"; then
    echo -e "${GREEN}✅ Scroll consolidation tests passed${NC}"
else
    echo -e "${RED}❌ Scroll consolidation tests failed${NC}"
    exit 1
fi

# Remaining branches to integrate
REMAINING_BRANCHES=(
    "module-system:Medium-high risk - architecture changes"
    "css-refactor:High risk - visual/layout changes"
)

for item in "${REMAINING_BRANCHES[@]}"; do
    IFS=':' read -r branch desc <<< "$item"
    
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}Integrating: tech-debt/$branch${NC}"
    echo -e "${BLUE}Description: $desc${NC}"
    echo -e "${BLUE}================================================${NC}"
    
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
    else
        echo -e "\n${RED}❌ Tests failed for $branch${NC}"
        echo -e "${YELLOW}Rolling back...${NC}"
        git reset --hard HEAD~1
        exit 1
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
echo "3. Circle back to pagination implementation"