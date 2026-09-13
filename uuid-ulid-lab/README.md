# UUID / ULID Lab

Zero-auth **local** MCP tools for UUID parse/generate (RFC4122), ULID generate (Crockford base32), and heuristic ID detection. No network — crypto + paste only.

## Why novel

No zero-auth local MCP in the catalog specializes in RFC4122 UUID bit inspection + ULID generation + ID classification without cloud uploads.

## Tools

| Tool | Purpose |
|------|---------|
| `uuid_parse` | UUID string → `{valid, version, variant, standardForm, errors?}` |
| `uuid_generate` | Generate UUID v4(s); optional `count` (default 1, max 20) → `{uuids}` |
| `ulid_generate` | Generate ULID(s) (26-char Crockford); optional `count` → `{ulids}` |
| `id_detect` | Text/id → heuristic `{kind, confidence, notes}` (uuid / ulid / nanoid-ish / unknown) |

## Start

```bash
node /workspace/uuid-ulid-lab/dist/bundle.js
```

## Skills

- **uuid-parse** — RFC4122 parse + UUID/ULID generate
- **id-detect** — classify pasted identifiers

## License

MIT © Lawrence Hutchins
