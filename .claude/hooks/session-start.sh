#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code web sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# ── 1. Install dependencies ──────────────────────────────────────────────────
echo "📦 Installing npm dependencies..."
PUPPETEER_SKIP_DOWNLOAD=true npm install
echo "✅ Dependencies ready."

# ── 2. Measurement plan sync check ──────────────────────────────────────────
MP="measurement_plan/measurement_plan.html"
SA="measurement_plan/measurement_plan_standalone.html"

if [ -f "$MP" ] && [ -f "$SA" ]; then
  MP_TIME=$(stat -c %Y "$MP" 2>/dev/null || stat -f %m "$MP")
  SA_TIME=$(stat -c %Y "$SA" 2>/dev/null || stat -f %m "$SA")
  if [ "$MP_TIME" -gt "$SA_TIME" ]; then
    echo ""
    echo "⚠️  measurement_plan.html is newer than measurement_plan_standalone.html."
    echo "   Run: node build_standalone_measurement.mjs"
    echo ""
  else
    echo "✅ Measurement plan standalone is up to date."
  fi
fi
