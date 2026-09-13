# IP CIDR Lab

Zero-auth **local** MCP tools for parsing/normalizing IP addresses, checking CIDR membership, explaining IPv4 CIDR blocks, and classifying private/special ranges. Educational networking helpers only — no scanning or exploitation. No SaaS, no API keys.

## Why novel

No zero-auth local MCP in the catalog focuses on IP parse/normalize + CIDR contains/explain + private-range heuristics in one stdio server using Node `net` / hand-rolled logic (no heavy IP libraries).

## Tools

| Tool | Purpose |
|------|---------|
| `ip_parse` | Detect IPv4/IPv6; normalize; strip zone id optionally → `{ version, normalized, valid, error? }` |
| `cidr_contains` | Does `ip` fall inside `cidr`? IPv4 full; IPv6 best-effort → `{ contains, ip, cidr, error? }` |
| `cidr_explain` | IPv4: network, broadcast, prefix, hosts, mask; IPv6 limited note |
| `private_check` | RFC1918 / loopback / link-local / ULA / etc. → `{ private, categories, notes }` |

## Start

```bash
node /workspace/ip-cidr-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/ip-cidr-lab`

## Skills

- **ip-parse-normalize** — Parse and normalize IPv4/IPv6 addresses
- **cidr-private-lab** — CIDR membership/explain and private-range classification

## License

MIT © Lawrence Hutchins
