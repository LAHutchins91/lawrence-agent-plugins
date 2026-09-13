---
name: dockerfile-review
description: "Review a Dockerfile with local zero-auth MCP heuristics: lint for latest tags, apt cleanup, secrets in ENV/ARG, missing USER/HEALTHCHECK, ADD vs COPY, unpinned pip/npm; map multi-stage FROMs; suggest slimmer base image families."
version: 1.0.0
tags: [dockerfile, docker, lint, multi-stage, base-image, security]
---

# Dockerfile review

When the user pastes or points at a Dockerfile:

1. Call **`dockerfile_lint`** with `dockerfileText` — triage errors (secrets) first, then warns (latest, apt, USER, unpinned deps), then info (HEALTHCHECK, ADD URL).
2. Call **`dockerfile_stage_map`** to list stages / AS names and identify the final runtime stage.
3. Call **`dockerfile_base_suggest`** for slimmer base-family hints (advice only; note musl/glibc caveats).
4. Summarize concrete fixes ordered by severity; do not invent unrelated CIS controls.

## Example prompts

- "Lint this Dockerfile for common footguns"
- "Map the multi-stage builds and suggest a slimmer final base"
- "Are there secrets or latest tags in this Dockerfile?"
