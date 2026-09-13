# Changelog

All notable changes to **cookie-header-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `cookie_parse` for Cookie request header name/value pairs.
- Add `set_cookie_parse` for Set-Cookie headers (newline-separated ok) and attributes.
- Add educational `cookie_explain` notes (HttpOnly / Secure / SameSite / Path / Domain).
- Add `cookie_redact` that masks cookie values and never echoes original secrets.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network.
