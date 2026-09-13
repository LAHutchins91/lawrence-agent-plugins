---
name: vagrant-boxes-providers
description: >
  Inventory Vagrantfile boxes (`vm.box`, `box_version`, `vm.define` names) and
  detect providers (virtualbox, vmware, libvirt, docker, hyperv) with the local
  zero-auth vagrant-lab MCP. String/regex only — no vagrant CLI, VM start, or
  network.
version: 1.0.0
tags: [vagrant, vagrantfile, box, provider, mcp, developer-tools]
---

# Vagrant boxes & providers

When the user pastes a **Vagrantfile**:

1. **`vagrant_boxes_list`** — `{ text }` → `{ boxes: [{name?, box?, version?}], count }`.
2. **`vagrant_providers_hint`** — `{ text }` → `{ providers: string[], count }`.
   - Looks for `vm.provider "virtualbox"` (and vmware, libvirt, docker, hyperv).

## Example prompts

- "List the boxes and define names in this Vagrantfile"
- "Which providers does this Vagrantfile configure?"
- "What box_version is set for the web VM?"
