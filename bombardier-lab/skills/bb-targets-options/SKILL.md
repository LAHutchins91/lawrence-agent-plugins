---
name: bb-targets-options
description: "Extract bombardier target URLs and CLI flags (-c / -n / -d / -m / -b / -H / -l / -p / -r) from shell lines with the local zero-auth bombardier-lab MCP. No bombardier runtime, no network."
version: 1.0.0
tags: [bombardier, cli, targets, options, load-test, developer-tools]
---

# Bombardier targets & CLI options

When the user pastes **bombardier** CLI text and needs URL / flag inventory:

1. **`bb_targets_list`** — `{ text }` → `{ targets: [{url?}], count }` from `bombardier` invocations and trailing URLs.
2. **`bb_options_hint`** — `{ text }` → `{ options: [{flag, value?}], count }` for `-c` / `-n` / `-d` / `-m` / `-b` / `-H` / `-l` / `-p` / `-r` / etc.

## Example prompts

- "Which URLs does this bombardier command hit?"
- "What flags does this bombardier line use?"
- "List -c / -n / -d values from these bombardier scripts"
