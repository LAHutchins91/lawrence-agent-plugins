---
name: puppet-classes-modules
description: "Inventory Puppet class/define names and module references (include, require, contain, class { 'foo': }, metadata.json, Puppetfile mod) with the local zero-auth puppet-lab MCP. Manifest string only — no Puppet CLI, agent/apply, or network."
version: 1.0.0
tags: [puppet, class, define, module, mcp, developer-tools]
---

# Puppet classes & modules

When the user pastes **Puppet** manifest / Puppetfile / metadata.json text:

1. **`puppet_classes_list`** — `{ text }` → `{ classes: [{name, kind?}], count }`.
2. **`puppet_modules_hint`** — `{ text }` → `{ modules: string[], count }`.
   - Looks for include/require/contain, `class { }`, Puppetfile `mod`, metadata deps.

## Example prompts

- "List classes and defines from this init.pp"
- "What modules does this Puppetfile / metadata.json reference?"
- "Parse includes and class { } refs in this manifest"
