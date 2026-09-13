# Line Ending Lab

Zero-auth **local** MCP tools for detecting and normalizing line endings (LF/CRLF/CR), counting lines, and stripping a UTF-8 BOM. No network — pure TypeScript.

## Why novel

A compact text-hygiene companion: classify mixed EOL styles, convert between LF and CRLF, count lines with trailing-newline awareness, and remove `\uFEFF` when editors leave a BOM.

## Tools

| Tool | Purpose |
|------|---------|
| `detect_eol` | Analyze text → `{eol: lf\|crlf\|cr\|mixed\|none, lfCount, crlfCount, crCount}` |
| `normalize_eol` | Convert to `lf` or `crlf` → `{text, changed}` |
| `count_lines` | Line count (final newline vs not) → `{lines, trailingNewline}` |
| `strip_bom` | Remove UTF-8 BOM (`\uFEFF`) if present → `{text, hadBom}` |

## Start

```bash
node /workspace/line-ending-lab/dist/bundle.js
```

## Skills

- **detect-eol** — detect and report LF / CRLF / CR / mixed line endings
- **normalize-eol** — convert text to LF or CRLF; strip BOM; count lines

## License

MIT © Lawrence Hutchins
