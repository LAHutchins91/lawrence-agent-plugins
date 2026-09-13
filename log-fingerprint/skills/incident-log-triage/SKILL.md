---
name: incident-log-triage
description: >
  Triage pasted incident logs locally: fingerprint noisy lines, cluster duplicates,
  and detect volume spikes — then summarize likely failure modes for responders.
version: 1.0.0
tags: [incident, logs, fingerprint, clustering, spikes, triage]
---

# Incident log triage

When the user pastes raw application or infra logs during an incident:

1. Call **`log_fingerprint`** on the raw text to collapse volatile fields (timestamps, UUIDs, hex, addresses, numbers).
2. Call **`log_cluster`** (optionally with `maxClusters`) to get size-sorted groups with representatives.
3. Call **`log_spike_detect`** to see whether volume spiked by minute (or line-order windows).
4. Write a short responder brief:
   - Top fingerprints / clusters (count + sample)
   - Any spike buckets and why they flagged
   - Suspected failure mode and next checks (no SaaS / no external calls)

## Example prompts

- "Fingerprint these error logs"
- "Cluster this incident dump and find spikes"
