# Gatling Lab

Zero-auth **local** MCP tools for **Gatling Scala/Java simulation text**: scenario inventory + protocol signals, injection-step hints, assertion signals, and heuristic lite lint. No Gatling runtime. No load-test executor. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Gatling** simulation workflows — listing `scenario("...")` names, `http.baseUrl` / protocol defs, `atOnceUsers` / `rampUsers` / `constantUsersPerSec` injects, `assertions` / `global.responseTime` / `details` / `forAll`, and educational smell heuristics without launching Gatling.

## Tools

| Tool | Purpose |
|------|---------|
| `gat_scenarios_list` | Gatling sim text → `{ scenarios: [{name}], protocols?, count }` |
| `gat_injects_hint` | Gatling sim text → `{ injects: [{kind, args?}], count }` |
| `gat_assertions_hint` | Gatling sim text → `{ assertions: [{kind}], count }` |
| `gat_lint_lite` | Gatling sim text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports Gatling runtime, never opens files on disk or over the network, never runs a load test, never evaluates or compiles Scala/Java.
- Best-effort regex heuristics on common Gatling shapes (`scenario(` / `http.baseUrl` / `.inject(` / `atOnceUsers` / `.assertions(` / `global.responseTime`). Not a full Gatling / Scala AST or compiler.
- Lint rules are educational heuristics (empty, missing assertions tip, atOnceUsers-only tip, hardcoded credentials tip, maxDuration missing tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/gatling-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gatling-lab`

## Skills

- **gat-scenarios-injects** — scenarios list + inject hints
- **gat-assertions-lint** — assertions hints + lite lint

## License

MIT © Lawrence Hutchins
