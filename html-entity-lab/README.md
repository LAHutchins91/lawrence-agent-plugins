# HTML Entity Lab

Zero-auth **local** MCP tools for HTML escape/unescape, curated named-entity lookup, and naive tag stripping. No network — pure TypeScript.

## Why novel

A compact HTML-text companion: escape the five XML specials (and optionally non-ASCII to named/numeric entities), decode named + `&#NNN;` / `&#xHH;` references, look up `nbsp` ↔ `U+00A0`, and extract text from markup without a DOM.

`strip_tags` is a **text-extraction heuristic only**. It is **not** XSS-safe sanitization for untrusted HTML in browsers — do not use it to make markup safe to render.

## Tools

| Tool | Purpose |
|------|---------|
| `html_escape` | Escape `& < > " '` (optional non-ASCII → entities) → `{escaped}` |
| `html_unescape` | Decode named + numeric (`&#NNN;` `&#xHH;`) entities → `{unescaped}` |
| `entity_lookup` | Name ↔ codepoint (curated map, both directions) → `{name, codepoint, char}` |
| `strip_tags` | Naive remove HTML/XML tags (optional whitespace normalize) → `{text}` |

## Start

```bash
node /workspace/html-entity-lab/dist/bundle.js
```

## Skills

- **html-escape** — escape, unescape, and look up HTML entities
- **strip-tags** — naive tag stripping / text extraction (not XSS-safe)

## License

MIT © Lawrence Hutchins
