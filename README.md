# Tendon Message Protocol (TMP) - Next.js POC

This repository contains the initial TMP v3 protocol implementation surface and a Next.js proof-of-concept UI.

## Included now

- `ARCHITECTURE.MD`: saved TMP v3 architecture specification.
- `AGENTS.md`: project agent operating guide.
- `.agents/skills/*`: foundational local skill packs for TMP work.
- `src/lib/tmp/*`: typed protocol models, envelope builders, and encoding helpers.
- `src/app/api/protocol/envelope/route.ts`: round-trip encode/decode API endpoint.
- `src/app/page.tsx`: protocol dashboard for sample unicast, multicast, and directive events.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Protocol endpoint

- `GET /api/protocol/envelope` returns sample TMP envelopes and a Nostr-wrapped event.
- `POST /api/protocol/envelope` accepts `{ "envelope": <TendonEnvelope> }` and returns encoded/decoded round-trip data.

## Current implementation note

Envelopes serialize to **Protocol Buffers** (`proto/tendon.proto`) and are Base64-encoded for Nostr `content` fields. Regenerate bindings after schema edits:

```bash
npm run proto:gen
```

## Next protocol milestones

1. Add passkey + Argon2id vault unlock pathways.
2. Add OPFS/SQLite worker persistence and Negentropy reconciliation loop.
3. Implement gift-wrap unicast and epoch-based multicast key workflows.
