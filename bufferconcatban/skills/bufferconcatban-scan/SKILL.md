---
name: bufferconcatban-scan
description: Use when scanning for BufferConcatBan issues.
---
# BufferConcatBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI on new Buffer(), unchecked base64 Buffer.from, unsafe buf.write.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
