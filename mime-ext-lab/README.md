# MIME Ext Lab

Zero-auth **local** MCP tools for mapping file extensions ↔ MIME types, extracting MIME from filenames, and parsing `Content-Type` headers. No SaaS product, no API keys — hand-maintained map on stdio.

## Why novel

No zero-auth local MCP in the catalog focuses on extension↔MIME + filename MIME + Content-Type param parse in one stdio server with a small hand-maintained map (no huge mime-db dependency).

## Tools

| Tool | Purpose |
|------|---------|
| `ext_to_mime` | Extension (with/without `.`) → `{ ext, mime }` (`null` if unknown) |
| `mime_to_ext` | MIME → `{ mime, ext, alts? }` (canonical + optional alts) |
| `filename_mime` | Filename/path → `{ filename, ext, mime }` (last extension) |
| `content_type_parse` | `Content-Type` header → `{ type, params, raw }` |

## Start

```bash
node /workspace/mime-ext-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/mime-ext-lab`

## Skills

- **ext-mime-lookup** — Map extensions ↔ MIME types
- **content-type-filename** — Parse Content-Type headers and filename MIME

## License

MIT © Lawrence Hutchins
