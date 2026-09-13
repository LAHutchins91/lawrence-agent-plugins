---
name: make-targets-vars
description: >
  List explicit Makefile rule targets and look up simple variable assignments
  with the local zero-auth makefile-lab MCP. No make binary, no network, no shell.
version: 1.0.0
tags: [makefile, make, targets, variables, developer-tools]
---

# Makefile targets & variables

When the user pastes **Makefile** text and needs target inventory or variable values:

1. **`make_targets_list`** — `{ text }` → `{ targets:[{name, deps?, line?}], count }`.
   - Explicit rule targets only. Pattern rules (`%.o`) are skipped.
   - `.PHONY` declaration lines are not targets unless the name also has a rule.
2. **`make_var_lookup`** — `{ text, name? }` → `{ vars:[{name, value?, flavor?}], count }`.
   - Simple `VAR =` / `:=` / `?=` / `+=` assignments. Optional `name` filters to that var.

## Example prompts

- "What targets are in this Makefile?"
- "Look up CFLAGS in this Makefile"
- "List rule targets and their prerequisites"
