---
name: csv-pii-review
description: Heuristically flag email/phone/ssn-like CSV columns and show MASKED samples only — never echo raw PII values from the paste.
version: 1.0.0
tags: [csv, pii, privacy, email, phone, ssn]
---

# CSV PII review

When the user asks whether a CSV contains PII-like columns:

1. Call **`csv_pii_scan`** with `csvText` (optional `maxSamples`).
2. Report `findings[{column, piiKind, confidence, maskedSamples, advice}]`.
3. **Never** repeat raw email/phone/SSN values from the paste in your reply — only the tool’s masked samples (e.g. `j***@x.com`, `***-**-1234`).

Optional: pair with **`csv_infer_schema`** to show types alongside PII flags.

## Example prompts

- "Scan this CSV for PII columns"
- "Which fields look like emails or SSNs? Show masks only"
