# Emoji Unicode Lab

Zero-auth **local** MCP tools for Unicode character inspection, emoji detection (including ZWJ / variation selectors), JS-style escapes, and NFKC normalization. No network — Node built-ins plus a small curated name map.

## Why novel

Quick Unicode / emoji companion for local development: inspect a character or codepoint, find emoji (including multi-codepoint sequences) in text, escape non-ASCII for JS strings, and NFKC-normalize. Name lookup is **best-effort** (curated map + optional Intl), not a full Unicode Character Database dump.

## Tools

| Tool | Purpose |
|------|---------|
| `unicode_info` | Character or `U+1F600` / hex → `{char, codepoint, hex, category?, name?, utf16Length, utf8ByteLength, …}` |
| `emoji_detect` | Scan text for emoji (ZWJ / VS reasonably) → `{matches: [{emoji, index, codepoints[]}]}` |
| `escape_unicode` | Escape non-ASCII to `\uXXXX` / `\u{XXXXX}`; astral options → `{escaped}` |
| `normalize_nfkc` | NFKC normalize → `{normalized, changed}` |

## Start

```bash
node /workspace/emoji-unicode-lab/dist/bundle.js
```

## Skills

- **unicode-info** — codepoint / character inspection + escapes + NFKC
- **emoji-detect** — scan text for emoji including ZWJ sequences

## Name coverage caveat

Unicode character names come from a small curated map for common chars (ASCII punctuation, Latin-1, popular emoji). Not a full UCD. When unavailable, `name` is omitted and `nameSource` explains the limit.

## License

MIT © Lawrence Hutchins
