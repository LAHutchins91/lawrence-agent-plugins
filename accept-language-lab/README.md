# Accept-Language Lab

Zero-auth **local** MCP tools for parsing pasted `Accept-Language` headers, BCP47-lite tag shape checks, quality sorting, and basic language negotiation. String analysis only — no network, no locale database downloads.

## Tools

| Tool | Purpose |
|------|---------|
| `al_parse` | Accept-Language header → `[{tag, q}]` sorted by quality then original order |
| `al_negotiate` | Requested Accept-Language (or parsed list) + `available[]` → best match + candidates (basic prefix matching, e.g. `en-US` vs `en`) |
| `bcp47_validate` | Validate language tag shape: `language[-script][-region][-variants]` lite heuristic |
| `al_quality_sort` | List of `{tag,q?}` → sorted by `q` descending (missing `q` = 1) |

## BCP47 lite limits

- Shape heuristic only — **not** a full IANA Language Subtag Registry check.
- Does not verify that `en`, `Latn`, `US`, or variants are registered codes.
- Does not support grandfathered / irregular / private-use-only tags beyond a simple `x-…` private-use pattern.
- Extension subtags (`-u-…`, `-t-…`) are rejected by the lite validator.
- Negotiation is basic prefix / exact matching — not CLDR / ICU locale matching or macrolanguage expansion.

## Limits

- Pasted header / tag text you already have. No sockets, DNS, or remote locale data.
- Inputs are length-limited (header / list text ≤ 65536 chars; tag lists capped).
- Quality values follow RFC 7231 style `q=` in `[0,1]` with up to 3 decimal places (lenient parse).

## Start

```bash
node /workspace/accept-language-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/accept-language-lab`

## Skills

- **al-parse** — parse Accept-Language and sort by quality
- **al-negotiate** — pick best available language with basic prefix matching

## License

MIT © Lawrence Hutchins — FREE
