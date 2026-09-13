---
name: sam-functions-events
description: "Inventory AWS SAM / CloudFormation Lambda functions (Runtime, Handler, Timeout, MemorySize) and Events (Api, HttpApi, S3, SNS, SQS, Schedule, DynamoDB, …) with the local zero-auth sam-lab MCP. YAML string only — no SAM CLI, AWS deploy, or network."
version: 1.0.0
tags: [aws-sam, sam, lambda, functions, events, mcp, developer-tools]
---

# SAM functions & events

When the user pastes **AWS SAM** `template.yaml` (or CloudFormation with Lambda):

1. **`sam_functions_list`** — `{ text }` → `{ functions: [{id?, runtime?, handler?, timeout?, memory?}], count }`.
2. **`sam_events_hint`** — `{ text }` → `{ events: [{function?, type?, properties?}], count }`.
   - Looks for `Events` on `AWS::Serverless::Function` (Api, HttpApi, S3, SNS, SQS, Schedule, DynamoDB, etc.).

## Example prompts

- "List the Lambda functions in this SAM template"
- "What events trigger HelloFunction?"
- "Parse this template.yaml — runtimes and handlers?"
