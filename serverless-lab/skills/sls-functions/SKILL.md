---
name: sls-functions
description: "List Serverless Framework functions (name + handler) and event hints (http / httpApi / schedule / sns / sqs / stream / s3 / websocket / alb / eventBridge) from pasted serverless.yml / serverless.ts. Local only — never runs Serverless Framework CLI or AWS deploy, no fetch."
version: 1.0.0
tags: [serverless, aws-lambda, yaml, functions, events, local]
---

# Serverless functions & events

Use these tools when the user pastes serverless.yml / serverless.ts text (never fetch a remote file, never run serverless CLI):

1. **`sls_functions_list`** with `source` — → `{functions: [{name?, handler?}], count}`.
2. **`sls_events_hint`** with `source` — → `{events: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Serverless Framework CLI; no AWS deploy; no network).

## Example prompts

- "Which Lambda functions are defined in this serverless.yml?"
- "What event types does this service use?"
- "List handlers from this paste."
