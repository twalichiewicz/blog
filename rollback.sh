#!/bin/bash
# Mobile fixes rollback script
# Usage: ./rollback.sh [number-of-commits]

COMMITS=${1:-1}

echo "Rolling back $COMMITS commit(s)..."
git reset --hard HEAD~$COMMITS

echo "Cleaning build artifacts..."
npm run clean

echo "Rebuilding site..."
npm run build

echo "Rollback complete. Please verify site functionality."
echo "Current branch: $(git branch --show-current)"
echo "Latest commit: $(git log -1 --oneline)"