# Hash Lab

Zero-auth **local** MCP tools for hashing text (SHA-256 / SHA-1 / MD5), comparing digests in a constant-time-ish way, checksumming UTF-8 “file text”, and HMAC-SHA256. No SaaS product, no API keys — everything runs on stdio via Node built-in `crypto` only.

## Why novel

No zero-auth local MCP in the catalog focuses on hash + checksum + digest compare + HMAC in one stdio server with an explicit production-secrets warning on HMAC.

## Tools

| Tool | Purpose |
|------|---------|
| `hash_text` | Hash UTF-8 text → `{ algorithm, hex, encoding }` (default sha256) |
| `hash_compare` | Constant-time-ish compare of two hex/digest strings |
| `checksum_file_text` | Hash UTF-8 bytes of multiline text → `{ algorithm, hex, byteLength }` |
| `hmac_sha256` | HMAC-SHA256 → `{ hex, note }` (dev utility warning) |

## Start

```bash
node /workspace/hash-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/hash-lab`

## Skills

- **hash-text-checksum** — Hash text and checksum file-like UTF-8 content
- **hmac-compare** — HMAC-SHA256 and constant-time-ish digest compare

## License

MIT © Lawrence Hutchins
