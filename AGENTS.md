# TMP Agents Operating Guide

## Mission
- Build TMP as a local-first, serverless protocol and a runnable Next.js proof-of-concept in this repository.
- Treat Nostr relays as untrusted transport only; all identity, authz, indexing, and decryption stay client-side.

## Primary Artifacts
- `ARCHITECTURE.MD`: source-of-truth architecture specification.
- `src/lib/tmp/*`: protocol domain models, crypto flow helpers, and packaging primitives.
- `src/app/*`: POC UI and API routes for protocol exploration.
- `.agents/skills/*`: reusable skills for protocol implementation workflows.

## Engineering Constraints
- Keep protocol structures strongly typed and versioned (`protocol_version` must always be explicit).
- Maintain compatibility with strict binary serialization goals (Protobuf wire format via `proto/tendon.proto`).
- Design every subsystem for offline-first hydration and deterministic local replay.
- Never rely on relay timestamps as authoritative truth; prefer local reconciliation semantics.

## Implementation Priorities
1. Identity and vault hydration pathways (passkey, Argon2id, mnemonic recovery).
2. Envelope serialization pipeline (`TendonEnvelope` with unicast/multicast/system directive payloads).
3. Local state model for OPFS/SQLite worker execution.
4. Unicast gift-wrap and multicast epoch lifecycle primitives.
5. POC observability screens to inspect encoded envelopes and protocol state transitions.

## Agent Workflow
- Read `ARCHITECTURE.MD` before making protocol-impacting changes.
- Prefer additive changes that preserve backward compatibility for v3 envelope fields.
- Run `npm run lint` after meaningful edits.
- Update `README.md` whenever new protocol modules, scripts, or routes are introduced.
