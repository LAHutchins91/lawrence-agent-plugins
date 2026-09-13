---
name: gat-scenarios-injects
description: >
  Extract Gatling scenario("...") names, http.baseUrl / protocol defs, and
  inject( / atOnceUsers / rampUsers / constantUsersPerSec / stressPeakUsers
  signals from Scala/Java simulation text with the local zero-auth gatling-lab
  MCP. No Gatling/load-test runtime, no network.
version: 1.0.0
tags: [gatling, scala, java, scenarios, inject, developer-tools]
---

# Gatling scenarios & injects

When the user pastes **Gatling** Scala/Java simulation source and needs scenario/inject inventory:

1. **`gat_scenarios_list`** — `{ text }` → `{ scenarios: [{name}], protocols?: string[], count }` from `scenario("...")` / `http.baseUrl` / protocol defs.
2. **`gat_injects_hint`** — `{ text }` → `{ injects: [{kind, args?}], count }` from `inject(` / `OpenInjectionStep` / `atOnceUsers` / `rampUsers` / `constantUsersPerSec` / `stressPeakUsers`.

## Example prompts

- "Which scenarios does this Gatling Simulation define?"
- "List atOnceUsers / rampUsers injects in this Scala file"
- "What http.baseUrl / protocols are set here?"
