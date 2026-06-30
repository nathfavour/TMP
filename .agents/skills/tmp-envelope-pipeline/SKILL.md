---
name: tmp-envelope-pipeline
description: Implements TMP envelope construction and encoding flows for unicast, multicast, and system directives. Use when building TendonEnvelope payload logic or Nostr packaging.
disable-model-invocation: true
---

# TMP Envelope Pipeline

## Instructions
1. Model all outbound messages as `TendonEnvelope` with explicit `protocol_version`.
2. Keep payloads in a strict one-of shape:
   - `unicast_mail`
   - `multicast_chat`
   - `system_directive`
3. Keep serialization codec isolated behind a small interface to allow JSON-to-Protobuf migration without UI rewrites.
4. Ensure nonce generation and dispatch timestamp are present on every envelope.
5. When simulating Nostr events, include tags and event kind in typed structures.

## Validation Checklist
- [ ] Envelope has one payload variant only.
- [ ] `dispatch_timestamp_utc` is UTC milliseconds.
- [ ] Encoded content can be round-tripped without field loss.
