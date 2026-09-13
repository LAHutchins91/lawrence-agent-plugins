---
name: yaml-path-get
description: >
  Parse-check pasted YAML and fetch values by dot-path (a.b.0.c) — zero-auth,
  local only, no network or file reads beyond the paste.
version: 1.0.0
tags: [yaml, path, parse, query, config]
---

# YAML path get

When the user pastes YAML and asks whether it is valid or wants a nested value:

1. Call **`yaml_parse_check`** with `yamlText` if validity/errors matter. Report `errors[{line?, message, excerpt?}]`.
2. Call **`yaml_get`** with `yamlText` + `path` (dot-path like `database.host` or `items.0.name`). Use empty path for the root document.
3. Optionally call **`yaml_diff_keys`** when comparing two YAML pastes for nested key drift.

Summarize found types/values and parse errors. Operate on pasted text only.

## Example prompts

- "Is this YAML valid?"
- "Get a.b.0.c from this YAML paste"
- "Diff keys between these two config YAMLs"
