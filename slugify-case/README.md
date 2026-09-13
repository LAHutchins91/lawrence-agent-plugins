# Slugify / Case

Zero-auth **local** MCP tools for slugify, case convert/detect, and filesystem filename sanitize. No network — pure string utils only.

## Why novel

No zero-auth local MCP in the catalog specializes in slugify + multi-case convert/detect + Windows-safe filename sanitize without cloud uploads.

## Tools

| Tool | Purpose |
|------|---------|
| `slugify` | Text → `{slug}` with optional `separator` (default `-`) and `lower` (default true) |
| `case_convert` | Text + target (`camel\|snake\|kebab\|pascal\|title`) → `{result, fromGuess?}` |
| `case_detect` | Heuristic detect camel/snake/kebab/pascal/title/upper/lower/mixed → `{case, confidence}` |
| `filename_sanitize` | Safe filesystem name (strip path seps, nulls, reserved Windows names) → `{safeName, changed}` |

## Start

```bash
node /workspace/slugify-case/dist/bundle.js
```

## Skills

- **slugify-text** — slugify + case convert/detect
- **filename-sanitize** — safe filesystem names

## License

MIT © Lawrence Hutchins
