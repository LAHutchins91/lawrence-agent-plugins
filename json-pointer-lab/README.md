# JSON Pointer Lab

Zero-auth **local** MCP tools for pasted JSON: RFC6901 JSON Pointer get/set preview, RFC6902 JSON Patch preview, and flatten to dot-paths. No network, no file I/O beyond stdio — paste text in, get structured JSON out.

## Why novel

No zero-auth local MCP in the catalog specializes in RFC6901/6902 pointer + patch previews with escape handling (`~0`/`~1`) without cloud uploads.

## Tools

| Tool | Purpose |
|------|---------|
| `json_pointer_get` | JSON + pointer (`/foo/0/bar`) → `{found, value, type}` or error |
| `json_pointer_set_preview` | JSON + pointer + value → `{ok, resultJson}` preview (no write) |
| `json_patch_preview` | JSON + RFC6902 ops → `{ok, resultJson, errors?}` preview |
| `json_flatten` | JSON → `{paths}` dot-path map (arrays use numeric segments) |

## Start

```bash
node /workspace/json-pointer-lab/dist/bundle.js
```

## Skills

- **json-pointer-get** — RFC6901 get + flatten workflows
- **json-patch-preview** — set preview + RFC6902 patch preview

## License

MIT © Lawrence Hutchins
