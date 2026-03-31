#!/bin/bash
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || true)

if [ "$TOOL" = "Read" ]; then
  FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
  LIMIT=$(echo "$INPUT" | jq -r '.tool_input.limit // "null"' 2>/dev/null || true)

  # Only warn when no limit is set (targeted reads are fine)
  if [ -n "$FILE_PATH" ] && [ -f "$FILE_PATH" ] && [ "$LIMIT" = "null" ]; then
    SIZE=$(stat -c%s "$FILE_PATH" 2>/dev/null || stat -f%z "$FILE_PATH" 2>/dev/null || echo 0)
    SIZE_KB=$((SIZE / 1024))

    if [ "$SIZE_KB" -gt 30 ]; then
      echo "{\"message\": \"Token notice: ${FILE_PATH##*/} is ${SIZE_KB}KB. Use Read with limit/offset to target specific lines, or Grep to find content first.\"}"
    fi
  fi
fi

exit 0
