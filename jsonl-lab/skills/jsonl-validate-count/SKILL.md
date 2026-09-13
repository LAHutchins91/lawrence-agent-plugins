---
name: jsonl-validate-count
description: Validate JSON Lines and count lines/valid/invalid JSON with the local zero-auth jsonl-lab MCP. No network.
version: 1.0.0
tags: [jsonl, json-lines, validate, count, developer-tools]
---

# JSONL validate & count

When the user needs to check or measure JSONL text:

1. **`jsonl_validate`** — `{ text }` → `{ ok, lineCount, errorCount, errors }`.
   - Non-empty lines only; 1-based `line`; optional `excerpt`.
2. **`jsonl_count`** — `{ text, skipEmpty? }` → `{ lines, nonEmpty, validJson, invalidJson }`.
   - `skipEmpty: true` drops empty lines from `lines` as well.

## Example prompts

- "Validate this JSONL for parse errors"
- "How many valid JSON lines are in this dump?"
- "Count non-empty lines in the NDJSON"
