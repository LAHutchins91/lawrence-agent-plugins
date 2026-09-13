---
name: packer-builds-sources
description: >
  Inventory Packer HCL/JSON build and source blocks (amazon-ebs, docker, qemu,
  etc.) and extract source label hints (ami_name, image, iso_url) with the
  local zero-auth packer-lab MCP. String/regex only — no packer CLI,
  build/deploy, or network.
version: 1.0.0
tags: [packer, hcl, source, build, ami, mcp, developer-tools]
---

# Packer builds & sources

When the user pastes **Packer** HCL or JSON:

1. **`packer_builds_list`** — `{ text }` → `{ builds: [{name?, type?, sources?}], count }`.
2. **`packer_sources_hint`** — `{ text }` → `{ sources: [{type?, name?, labels?}], count }`.
   - Looks for `source "type" "name"` and label hints (`ami_name`, `image`, `iso_url`).

## Example prompts

- "List the Packer sources and builds in this template"
- "What AMI / image labels does this Packer source declare?"
- "Inventory amazon-ebs and docker sources in this HCL"
