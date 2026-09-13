---
name: id-detect
description: "Heuristically classify pasted identifiers as uuid, ulid, nanoid-ish, or unknown with confidence — zero-auth local only."
version: 1.0.0
tags: [uuid, ulid, nanoid, detect, classify]
---

# ID detect

When the user pastes an opaque id and wants to know what it is:

1. Call **`id_detect`** with `text` (single token or whitespace/comma-separated list).
2. Report `primary.kind`, `confidence`, and `notes` (and `matches` for batches).
3. Kinds: `uuid`, `ulid`, `nanoid-ish`, `unknown`. Do not invent formats beyond these heuristics.

## Example prompts

- "What kind of id is 01ARZ3NDEKTSV4RRFFQ69G5FAV?"
- "Is this a UUID or nanoid?"
- "Classify these ids"
