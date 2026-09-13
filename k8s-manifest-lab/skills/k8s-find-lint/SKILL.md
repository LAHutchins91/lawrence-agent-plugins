---
name: k8s-find-lint
description: >
  Find resources by metadata.name and run heuristic K8s lite lint on multi-doc
  YAML text with the local zero-auth k8s-manifest-lab MCP. No kubectl/cluster/API.
version: 1.0.0
tags: [kubernetes, k8s, yaml, lint, find, developer-tools]
---

# K8s find by name & lite lint

When the user wants to locate a named object or quick smell checks from **YAML text**:

1. **`k8s_find_by_name`** — `{ text, name, kind? }` → `{ matches }`.
   - Case-insensitive name match; optional kind filter.
2. **`k8s_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Rules: missing_kind, missing_name, latest_tag, privileged, host_network,
     empty_selector, host_path_volume, missing_apiVersion, etc.

## Example prompts

- "Find all resources named web in this YAML"
- "Lint this Deployment for privileged / hostNetwork / :latest"
- "Does this Service have an empty selector?"
