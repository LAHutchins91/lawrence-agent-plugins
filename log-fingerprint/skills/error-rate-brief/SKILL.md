---
name: error-rate-brief
description: "Turn totalRequests + errorCount + a window label into an error-rate and SLO error-budget brief (99.9% / 99.5% / 99%) using error_budget_brief."
version: 1.0.0
tags: [slo, error-budget, reliability, incident]
---

# Error-rate brief

When the user shares request and error counts for a time window:

1. Call **`error_budget_brief`** with `totalRequests`, `errorCount`, and `windowLabel`.
2. Present the returned markdown (error rate, remaining budget per assumed SLO, status).
3. Call out exhausted or at-risk budgets and suggest burn-rate awareness — stay local; do not invent telemetry backends.

## Example prompts

- "We had 50 errors in 100k requests last hour — budget left?"
- "Draft an error-budget brief for today's deploy window"
