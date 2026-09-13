---
name: uuid-parse
description: "Parse RFC4122 UUID version/variant bits and generate UUID v4 or ULID — zero-auth, local only, no network."
version: 1.0.0
tags: [uuid, ulid, rfc4122, generate, parse]
---

# UUID parse & generate

When the user pastes a UUID or needs new ids:

1. Call **`uuid_parse`** with `uuid` to get `{valid, version, variant, standardForm}`. Accepts hyphenated, hex-32, braces, or `urn:uuid:`.
2. Call **`uuid_generate`** for UUID v4 (`count` optional, max 20).
3. Call **`ulid_generate`** for Crockford Base32 ULIDs (`count` optional).
4. Report structured JSON only. Never claim network or file I/O.

## Example prompts

- "Parse this UUID and tell me the version"
- "Generate 5 UUIDs"
- "Make a ULID"
