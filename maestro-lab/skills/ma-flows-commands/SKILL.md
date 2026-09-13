---
name: ma-flows-commands
description: "Extract Maestro flow meta (appId/name/tags) plus ordered command steps and command frequency from YAML text with the local zero-auth maestro-lab MCP. No Maestro/device runtime, no network."
version: 1.0.0
tags: [maestro, yaml, flows, commands, developer-tools]
---

# Maestro flows & commands

When the user pastes **Maestro** flow YAML and needs inventory:

1. **`ma_flows_list`** — `{ text }` → `{ appId?, name?, tags?, steps: string[], count }` from top-level meta + ordered command names.
2. **`ma_commands_hint`** — `{ text }` → `{ commands: [{name, count}], total }` for `launchApp` / `tapOn` / `inputText` / `assertVisible` / `scroll` / `swipe` / `runFlow` / `evalScript` / etc.

## Example prompts

- "List the steps in this Maestro flow"
- "What is the appId and tags?"
- "How often does this flow use tapOn vs assertVisible?"
