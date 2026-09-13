---
name: gemfile-gems
description: >
  Parse pasted Gemfile text locally with zero-auth MCP tools:
  list gem 'name' / version / options (require, git, path, groups),
  list group :x, :y do … end membership, and list source 'url' lines.
  Lite Ruby DSL line scanner — not Bundler. No network.
version: 1.0.0
tags: [ruby, gemfile, bundler, parse, local]
---

# Gemfile gems

Use these tools when the user pastes Gemfile text (never fetch a remote file, never run bundler or ruby):

1. **`gemfile_gems_list`** with `gemfile` — → `{gems: [{name, version?, groups?, require?, git?, path?}]}`.
2. **`gemfile_groups`** with `gemfile` — → `{groups: [{name, gems[]}]}`.
3. **`gemfile_sources`** with `gemfile` — → `{sources: [{url}]}`.

Lite Ruby DSL line scanner. Input cap ~1MB. Documented limitations apply (not Bundler, not Ruby eval).

## Example prompts

- "List every gem in this pasted Gemfile, including git/path and groups."
- "Which groups does this Gemfile declare, and which gems are in each?"
- "What source URLs are in this Gemfile?"
