---
name: cidr-private-lab
description: >
  Check CIDR membership, explain IPv4 CIDR blocks, and classify private/special
  IP ranges with the local zero-auth ip-cidr-lab MCP. Educational only.
version: 1.0.0
tags: [cidr, ip, private, networking, developer-tools]
---

# CIDR membership, explain & private check

When the user needs CIDR or private-range help (educational networking only):

1. **`cidr_contains`** — `{ ip, cidr }` → `{ contains, ip, cidr, error? }`. IPv4 full; IPv6 best-effort.
2. **`cidr_explain`** — `{ cidr }` → IPv4 network/broadcast/prefix/hosts/mask; IPv6 limited.
3. **`private_check`** — `{ ip }` → `{ private, categories, notes }` (RFC1918, loopback, link-local, ULA, etc.).

## Example prompts

- "Is 10.0.0.5 in 10.0.0.0/8?"
- "Explain 192.168.1.0/24"
- "Is fc00::1 private?"
