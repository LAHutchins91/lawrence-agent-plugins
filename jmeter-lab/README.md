# JMeter Lab

Zero-auth **local** MCP tools for **JMeter JMX / plan XML text**: TestPlan + ThreadGroup inventory, sampler hints, assertion hints, and heuristic lite lint. No JMeter runtime. No load-test executor. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **JMeter** plan workflows — listing `TestPlan` / `ThreadGroup` (num_threads / ramp_time), `HTTPSamplerProxy` / `JavaSampler` paths, `ResponseAssertion` / `DurationAssertion` / `JSONPathAssertion`, and educational smell heuristics without launching JMeter.

## Tools

| Tool | Purpose |
|------|---------|
| `jmx_plans_list` | JMX text → `{ testPlans: [{name?}], threadGroups: [{name?, numThreads?, rampTime?}], count }` |
| `jmx_samplers_hint` | JMX text → `{ samplers: [{type, name?, path?}], count }` |
| `jmx_assertions_hint` | JMX text → `{ assertions: [{type, name?}], count }` |
| `jmx_lint_lite` | JMX text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports JMeter runtime, never opens files on disk or over the network, never runs a load test, never evaluates or executes plan XML.
- Best-effort XML regex / light tag scans on common JMeter shapes (`TestPlan` / `ThreadGroup` / `HTTPSamplerProxy` / `ResponseAssertion`). Not a full DOM or JMeter schema validator.
- Lint rules are educational heuristics (empty, missing ThreadGroup tip, no assertions tip, hardcoded credentials tip, infinite loop tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/jmeter-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jmeter-lab`

## Skills

- **jmx-plans-samplers** — plans/thread-groups list + sampler hints
- **jmx-assertions-lint** — assertions hints + lite lint

## License

MIT © Lawrence Hutchins
