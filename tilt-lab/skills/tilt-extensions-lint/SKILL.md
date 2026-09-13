---
name: tilt-extensions-lint
description: "Detect Tiltfile load()/load_dynamic()/v1alpha1.extension/tilt_extensions paths and educational lite lint with the local zero-auth tilt-lab MCP. No Tilt CLI, cluster, or network."
version: 1.0.0
tags: [tilt, tiltfile, extensions, lint, mcp, developer-tools]
---

# Tilt extensions & lite lint

When the user pastes **Tiltfile** text or wants a smell-check:

1. **`tilt_extensions_hint`** — `{ text }` → `{ extensions: [{path?, symbols?}], count }`.
2. **`tilt_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing docker_build/k8s_yaml, `:latest` tags,
     plaintext secret/password tip, remote git load tip, allow_k8s_contexts tip.
   - Not an exploit guide.

## Example prompts

- "What load() extensions does this Tiltfile use?"
- "Lint this Tiltfile for :latest and missing k8s_yaml"
- "Any remote git load or allow_k8s_contexts tips?"
