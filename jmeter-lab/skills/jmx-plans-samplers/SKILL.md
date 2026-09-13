---
name: jmx-plans-samplers
description: "Extract JMeter TestPlan / ThreadGroup (num_threads, ramp_time) and HTTPSamplerProxy / JavaSampler (path) signals from JMX / plan XML text with the local zero-auth jmeter-lab MCP. No JMeter/load-test runtime, no network."
version: 1.0.0
tags: [jmeter, jmx, testplan, threadgroup, sampler, developer-tools]
---

# JMeter plans & samplers

When the user pastes **JMeter JMX / plan XML** and needs plan/sampler inventory:

1. **`jmx_plans_list`** — `{ text }` → `{ testPlans: [{name?}], threadGroups: [{name?, numThreads?, rampTime?}], count }` from `TestPlan` / `ThreadGroup` (guiclass/testclass).
2. **`jmx_samplers_hint`** — `{ text }` → `{ samplers: [{type, name?, path?}], count }` for `HTTPSamplerProxy` / `JavaSampler` / etc.

## Example prompts

- "Which ThreadGroups does this JMX define?"
- "List HTTPSamplerProxy paths in this plan"
- "What TestPlan name and num_threads / ramp_time are set?"
