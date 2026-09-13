---
name: ip-parse-normalize
description: >
  Parse and normalize IPv4/IPv6 addresses (version detect, expand/compress,
  optional zone-id strip) using the local zero-auth ip-cidr-lab MCP.
version: 1.0.0
tags: [ip, ipv4, ipv6, networking, developer-tools]
---

# IP parse & normalize

When the user needs to validate or normalize an IP address:

1. **`ip_parse`** — `{ ip }` → `{ version: 4|6|null, normalized, valid, error? }`.
   - Detects IPv4 vs IPv6.
   - Normalizes IPv4 to dotted decimal; IPv6 to a reasonable compressed form (zone id stripped).

## Example prompts

- "Is 192.168.1.1 a valid IPv4?"
- "Normalize fe80::1%eth0"
