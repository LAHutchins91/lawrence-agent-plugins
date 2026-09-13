---
name: do-routes-lint
description: "Summarize DigitalOcean App Spec ingress/routes/domains and run educational heuristic lite lint on .do/app.yaml text with the local zero-auth digitalocean-app-spec-lab MCP. No DigitalOcean API, no network."
version: 1.0.0
tags: [digitalocean, app-spec, app.yaml, routes, ingress, lint, developer-tools]
---

# DigitalOcean routes hints & lite lint

When the user wants routing/domain summary or a smell-check of pasted App Spec YAML:

1. **`do_routes_hint`** — `{ text }` → `{ ingress?, routes: [{path?, preserve_path_prefix?}], domains?, alertrules_hint? }`.
2. **`do_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing name/region, plaintext secrets in envs,
     health_check tips. Not an exploit guide.

## Example prompts

- "What routes / domains are in this app.yaml?"
- "Lite-lint this DigitalOcean App Spec"
- "Any health_check tips for these services?"
