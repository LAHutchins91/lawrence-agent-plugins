---
name: gha-jobs-triggers
description: "List GitHub Actions jobs and normalize workflow `on:` triggers from workflow YAML text with the local zero-auth github-actions-lab MCP. String/YAML only — no GitHub API or network."
version: 1.0.0
tags: [github-actions, gha, workflow, yaml, jobs, triggers, developer-tools]
---

# GHA jobs & triggers

When the user pastes **GitHub Actions workflow YAML** and needs job inventory or trigger normalization:

1. **`gha_list_jobs`** — `{ text }` → `{ name?, jobs: [{id, name?, runsOn?, stepsCount?}], count }`.
   - Reads top-level `name` and `jobs:` map; reports `runs-on` and step counts.
2. **`gha_list_triggers`** — `{ text }` → `{ on, events }`.
   - Normalizes `on:` whether it is a string, list, or map into `events: string[]`.

## Example prompts

- "What jobs are in this workflow?"
- "Which events trigger this Actions YAML?"
- "List runs-on and step counts for each job"
