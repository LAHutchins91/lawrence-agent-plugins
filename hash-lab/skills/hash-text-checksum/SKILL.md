---
name: hash-text-checksum
description: Hash UTF-8 text with SHA-256/SHA-1/MD5 and checksum multiline “file text” with explicit byteLength using the local zero-auth hash-lab MCP.
version: 1.0.0
tags: [hash, sha256, checksum, md5, developer-tools]
---

# Hash text & checksum

When the user needs a digest of text or file-like content:

1. **`hash_text`** — `{ text, algorithm?: "sha256"|"sha1"|"md5" }` → `{ algorithm, hex, encoding: "utf8" }`. Default algorithm is sha256.
2. **`checksum_file_text`** — same hashing over UTF-8 bytes, but returns `{ algorithm, hex, byteLength }` for “file text” framing.

Prefer sha256 unless the user asks for sha1/md5 (legacy/interop).

## Example prompts

- "SHA-256 of hello"
- "MD5 of this string"
- "Checksum this file contents and tell me byte length"
