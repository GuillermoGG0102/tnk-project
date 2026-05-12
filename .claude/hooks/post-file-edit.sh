#!/bin/bash
# Auto-update sitemap.xml when HTML files are created or modified
# This hook runs after file edits in Claude Code

set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Check if any .html files were recently modified
if git diff --name-only --cached 2>/dev/null | grep -E '\.(html)$' > /dev/null || \
   git status --porcelain 2>/dev/null | grep -E '\.(html)$' > /dev/null; then
  echo "📝 HTML files detected. Updating sitemap..."
  node scripts/generate-sitemap.mjs
fi
