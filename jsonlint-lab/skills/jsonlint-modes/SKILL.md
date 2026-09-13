---
name: jsonlint-modes
description: >
  List jsonlint modes and option / sort method counts
  (compact / pretty / validate / quiet; --compact / --in-place /
  --quiet / --indent / --validate / -c / -i / -q; --sort-keys /
  sortKeys / sorted / key order) from pasted CLI/config. Local only —
  never runs jsonlint CLI, no fetch.
version: 1.0.0
tags: [jsonlint, json, modes, options, sort, local]
---

# jsonlint modes, options & sort

Use these tools when the user pastes jsonlint CLI, config, or scripts (never fetch a remote file, never run jsonlint CLI):

1. **`jsonlint_modes_list`** with `source` — → `{modes: [{name?}], count}`.
2. **`jsonlint_options_hint`** with `source` — → `{options: [{method, count}], count}`.
3. **`jsonlint_sort_hint`** with `source` — → `{sort: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not jsonlint CLI; no network).

## Example prompts

- "Which jsonlint modes appear in this CLI invocation?"
- "Does this use --compact / --in-place / --quiet / --indent?"
- "What --sort-keys / sortKeys / sorted / key order hints appear here?"
