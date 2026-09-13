---
name: rollup-input-output
description: >
  Extract Rollup input entries and output formats (file/dir/format/name/exports)
  from rollup config text with the local zero-auth rollup-config-lab MCP.
  JSONC preferred; JS/TS heuristics; no rollup binary or network.
version: 1.0.0
tags: [rollup, rollup-config, input, output, formats, developer-tools]
---

# Rollup input & output formats

When the user pastes **rollup config** (`rollup.config.*`, JSONC) and needs input or output inventory:

1. **`rollup_input_list`** — `{ text }` → `{ input, inputs: string[], count }` from `input` (string, array, or object map).
2. **`rollup_output_formats`** — `{ text }` → `{ outputs:[{file?, dir?, format?, name?, exports?}], formats: string[], count }`.

## Example prompts

- "What are the inputs in this rollup config?"
- "Which output formats does this rollup.config.js emit?"
- "Does this UMD build set output.name?"
