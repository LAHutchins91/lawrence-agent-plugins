---
name: or-outputs
description: "List orval output targets (defineConfig / export default / output: / target: / project keys) and client hints (axios / axios-functions / react-query / solid-query / vue-query / svelte-query / swr / fetch / angular) from pasted orval.config.(js|ts|mjs). Local only — never runs orval or codegen, never fetches specs, no fetch."
version: 1.0.0
tags: [orval, openapi, outputs, clients, local]
---

# orval outputs & clients

Use these tools when the user pastes orval.config text (never fetch a remote file, never run orval):

1. **`or_outputs_list`** with `source` — → `{outputs: [{name?, target?, client?}], count}`.
2. **`or_client_hint`** with `source` — → `{clients: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not orval CLI; no codegen; no network).

## Example prompts

- "Which orval projects/outputs are in this config?"
- "What client: values are used?"
- "List output.target paths from this orval.config."
