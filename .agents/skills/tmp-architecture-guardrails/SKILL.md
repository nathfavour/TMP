---
name: tmp-architecture-guardrails
description: Enforces TMP v3 architectural invariants and boundary decisions. Use when changing identity, transport, relay trust assumptions, serialization, or storage architecture.
disable-model-invocation: true
---

# TMP Architecture Guardrails

## Instructions
1. Read `ARCHITECTURE.MD` before protocol-impacting edits.
2. Preserve these invariants:
   - Edge-driven truth (client runtime is authoritative).
   - DNS/TLS-backed identity pointers for global names.
   - Protobuf-first wire payloads (binary-first design).
   - Relay layer treated as stateless and untrusted.
3. Flag any implementation that shifts trust to relays or server state.
4. If a shortcut is needed for POC speed, keep it behind a clearly named dev-only abstraction.

## Required Output
- List which invariant(s) are touched by the change.
- Confirm whether the change is production-safe or POC-scaffold only.
