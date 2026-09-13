---
name: al-parse
description: >
  Parse pasted Accept-Language headers and sort language tags by quality
  locally with zero-auth MCP tools. No network.
version: 1.0.0
tags: [accept-language, bcp47, header, parse, i18n, local]
---

# Accept-Language parse & quality sort

Use these tools when the user pastes an Accept-Language header or a list of tags:

1. **`al_parse`** with `header` — parse `Accept-Language:` into `[{tag, q}]` sorted by quality then order.
2. **`al_quality_sort`** with `items` — JSON `[{tag,q?}]` or comma-separated tags → sorted by `q` desc.
3. **`bcp47_validate`** with `tag` — lite shape check (`language[-script][-region][-variants]`). Reminder: **not** full IANA registry validation.

String analysis of pasted text only. Do not fetch URLs or download locale databases.

## Example prompts

- "Parse `Accept-Language: en-US,en;q=0.8,fr;q=0.5`."
- "Sort these tags by q: `[{tag:\"fr\",q:0.5},{tag:\"en\"}]`."
- "Is `zh-Hans-CN` a valid BCP47 shape?"
