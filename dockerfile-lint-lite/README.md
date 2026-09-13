# Dockerfile Lint Lite

Zero-auth **local** MCP tools for lightweight Dockerfile and Compose risk heuristics: latest tags, apt cleanup, secrets in ENV/ARG, root without USER, ADD vs COPY, HEALTHCHECK hints, unpinned pip/npm, multi-stage maps, slimmer base suggestions, and compose privileged/host-network/sensitive-port scans. No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog specializes in heuristic Dockerfile + Compose risk linting (latest tags, ENV secrets, root USER, privileged/host network, sensitive port publishes) without a SaaS product.

## Tools

| Tool | Purpose |
|------|---------|
| `dockerfile_lint` | Heuristic findings: latest, apt cleanup, secrets, USER, ADD vs COPY, HEALTHCHECK, pip/npm pins |
| `dockerfile_stage_map` | List FROM stages / AS names and final stage |
| `dockerfile_base_suggest` | Slimmer base family hints (node→alpine, python→slim) — advice only |
| `compose_service_scan` | Flag privileged, host network, :latest, 0.0.0.0 + sensitive ports |

## Start

```bash
node /workspace/dockerfile-lint-lite/dist/bundle.js
```

## Skills

- **dockerfile-review** — lint + stage map + base suggestions
- **compose-risk-scan** — compose privileged / ports / latest triage

## License

MIT © Lawrence Hutchins
