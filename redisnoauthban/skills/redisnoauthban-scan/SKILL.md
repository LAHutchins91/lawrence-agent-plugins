---
name: redisnoauthban-scan
description: Use when scanning for RedisNoAuthBan issues.
---
# RedisNoAuthBan scan

1. Locate relevant configs/source.
2. Apply heuristics: Fail CI when Redis createClient/ioredis connects without password.
3. Return concise findings (severity, path, fix).

Free marketplace funnel. Pro: https://plugins.lawrence.dev/pro
