---
name: nomad-jobs-groups
description: "Inventory Nomad job HCL (id/name, type service/batch/system, datacenters, namespace) and extract group blocks (name, count, network ports) with the local zero-auth nomad-lab MCP. String/regex only — no nomad CLI, cluster, or network."
version: 1.0.0
tags: [nomad, hcl, job, group, datacenter, mcp, developer-tools]
---

# Nomad jobs & groups

When the user pastes **Nomad** job HCL:

1. **`nomad_jobs_list`** — `{ text }` → `{ jobs: [{id?, type?, datacenters?, namespace?}], count }`.
2. **`nomad_groups_hint`** — `{ text }` → `{ groups: [{name?, count?, networks?}], count }`.
   - Looks for `group "name"` with `count` and nested `network` / `port`.

## Example prompts

- "List the Nomad jobs and groups in this HCL"
- "What datacenters and namespace does this job declare?"
- "Inventory group counts and network ports in this Nomad job"
