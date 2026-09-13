---
name: helm-templates-lint
description: >
  Hint Kubernetes kinds, .Values. refs, and define/include/tpl helpers in Helm
  templates text, plus educational lite lint, with the local zero-auth helm-chart-lab MCP.
  No Helm CLI, cluster, or network.
version: 1.0.0
tags: [helm, templates, lint, kubernetes, yaml, developer-tools]
---

# Helm templates & lite lint

When the user pastes **templates** YAML/Go-template text or wants a smell-check:

1. **`helm_templates_hint`** — `{ text }` → `{ kinds, valuesRefs, helpers, count }` (multi-doc `---` ok).
2. **`helm_lint_lite`** — `{ text? }` or `{ chartText?, valuesText?, templatesText? }` → `{ findings, findingCount }`.
   - Heuristics: empty, missing Chart name/version/apiVersion, `:latest` tags in values,
     plaintext password key names, privileged/hostNetwork in templates, missing templates tip.
   - Not an exploit guide.

## Example prompts

- "What kinds and .Values. refs are in this Deployment template?"
- "Lint this chart + values + templates for :latest and privileged"
- "Any define/include helpers in _helpers.tpl?"
