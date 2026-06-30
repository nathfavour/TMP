---
name: tmp-local-first-state
description: Guides local-first persistence and reconciliation patterns for TMP clients. Use when implementing OPFS/SQLite workers, local indexes, or device sync loops.
disable-model-invocation: true
---

# TMP Local-First State

## Instructions
1. Keep stateful authority local: threads, decrypted payloads, vault metadata, and reconciliation cursors.
2. Separate concerns:
   - UI thread for rendering only.
   - Worker thread for crypto, indexing, and persistence.
3. Use append-only event storage patterns for reproducible replay.
4. Build sync code to tolerate relay gaps and out-of-order delivery.
5. Track placeholders for Negentropy set reconciliation so future implementation can replace polling logic.

## Non-Goals
- Do not assume trusted relay clocks.
- Do not require a central API or server database.
