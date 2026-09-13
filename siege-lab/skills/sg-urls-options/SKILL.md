---
name: sg-urls-options
description: "Extract siege URLs (urls.txt / CLI) and options (-c / -r / -t / -d / -f / -i / -b / -g and .siegerc key = value) with the local zero-auth siege-lab MCP. No siege runtime, no network."
version: 1.0.0
tags: [siege, cli, urls, options, load-test, developer-tools]
---

# Siege URLs & options

When the user pastes **siege** CLI, urls.txt, or `.siegerc` text and needs URL / flag inventory:

1. **`sg_urls_list`** — `{ text }` → `{ urls: string[], count }` from urls.txt lines or siege invocations.
2. **`sg_options_hint`** — `{ text }` → `{ options: [{flag, value?}], count }` for `-c` / `-r` / `-t` / `-d` / `-f` / `-i` / `-b` / `-g` / `.siegerc` keys.

## Example prompts

- "Which URLs are in this urls.txt / siege command?"
- "What flags does this siege line use?"
- "Parse concurrent / delay from this .siegerc paste"
