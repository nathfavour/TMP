# Tendon Message Protocol (TMP) Architecture Specification v3.0

The Tendon Message Protocol (TMP) is a serverless, client-dense, local-first application-layer protocol designed to unify asynchronous communications (asymmetric unicast email topologies and symmetric multicast chat topologies) over an untrusted, stateless transport layer (Nostr). TMP shifts identity management, access authorization, message indexing, state synchronization, and data serialization entirely to the user's local computing runtime, leveraging public DNS/TLS infrastructure for verifiable global namespaces without centralized database management or ledger consensus.

## 1. System Philosophy & Core Axioms

TMP operates under four structural invariants:

- **Edge-Driven Truth**: The transport network is inherently blind and untrusted. Relays handle transient packet routing, ephemeral multicast buffering, and immutable blob availability. The client runtime alone executes identity verification, relation-thread indexing, state reconciliation, and cryptographic payload decryption.
- **Protocol Convergence**: Unicast communications (Email) and Multicast communications (Chat) share an identical cryptographic pipeline and data model. They differ exclusively in their local client-side presentation states and key distribution vectors.
- **DNS/TLS Sovereignty**: Absolute string identity namespaces rely on static-file lookups over standard DNS and TLS endpoints, bypassing the temporal vulnerabilities of decentralized peer-to-peer timestamping.
- **Strict Binary Typification**: All operational payloads are encapsulated in immutable, compiled Protocol Buffers schemas, compiled to raw byte streams and packed into standard Nostr event envelopes.

## 2. Cryptographic Identity & Authentication Matrix

Identity is rooted in a standard asymmetric Secp256k1 keypair, where the public key (`npub`) serves as the cryptographic destination address. The Master Private Key (`nsec`) is sealed within a client-side encrypted vault container, hydrated into a memory-pinned location via three mutually independent local authentication vectors.

```text
      +───────────────────────────────────────────────────+
      |         Tendon Encrypted Vault Container         |
      |  [ AES-GCM Encrypted Master Private Key (nsec) ] |
      +─────────────────────────▲─────────────────────────+
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
 [ Pathway 1: Passkey ]  [ Pathway 2: Password ] [ Pathway 3: Mnemonic ]
   WebAuthn PRF Seed       Argon2id Client Hash    BIP-39 Mnemonic Seed
```

### 2.1 The 3-Tier Key Wrapping Vault Matrix

#### Pathway 1: WebAuthn Passkey (Hardware Boundary)
- Utilizes the WebAuthn API with the Pseudo-Random Function (PRF) Extension to generate hardware-backed keys.
- **Mechanism**: The application client makes a hardware authorization call to the host system's secure enclave (for example Apple Secure Enclave or Titan M-series chip) using a deterministic application salt string (`textEncoder.encode("tendon-v3-prf-salt")`).
- **Output**: The enclave outputs a stable, high-entropy 32-byte symmetric key (`K_passkey`). This key is fed into an AES-256-GCM decryption pipeline to unwrap the Master Vault Container entirely inside local client memory boundaries.

#### Pathway 2: Client-Side Argon2id Password (Portability Layer)
- Provides environmental migration capabilities across operating systems or platforms lacking biometric/hardware synchronization channels.
- **Mechanism**: The user provides their password alongside an unencrypted, unique random 16-byte salt value (`S_random`) retrieved during system bootstrap.
- **Execution**: The client engine executes an Argon2id implementation compiled to a WebAssembly (WASM) background worker thread using the following cryptographic parameters:

```text
Key_password = Argon2id(password, salt=S_random, m=65536, t=3, p=4)
```

- **Security Bounds**: The 64MB memory footprint, 3 time iterations, and 4 parallel execution lanes are strictly computed on the edge machine. The explicit generation of a unique random salt ensures resistance against targeted dictionary pre-computation attacks, even if the user's public address or vault file is leaked from an open relay.

#### Pathway 3: BIP-39 Recovery Phrase (Absolute Fallback)
- A standard 12 or 24-word human-readable mnemonic seed block.
- The client maps the phrase back to its underlying binary entropy array to reconstruct the raw Secp256k1 keypair mathematically, functioning as the definitive recovery override.

## 3. Global Identity Verification & Discovery Engine (Static-Pointer Identity Layer)

TMP enforces a two-tier architectural model for identity resolution, avoiding race conditions and spoofing vectors native to unsynchronized, relay-driven timestamp logic.

### 3.1 Tier 1: Verified Domain Pointers (`tendon.json` manifest)

To resolve human-readable usernames (for example `nathfavour`), the client maps the identity to a DNS-backed, TLS-secured static JSON file located at:

`https://<domain_or_platform>/.well-known/tendon.json`

This static file acts as the definitive directory lookup. It enables third-party platforms (for example GitHub, Vercel) to host zero-server, high-volume application inboxes for their entire user base via simple static file routing.

#### `tendon.json` schema

```json
{
  "names": {
    "nathfavour": "64_char_hex_public_key_npub_identifier"
  },
  "vault_pointer": {
    "relays": [
      "wss://relay.damus.io",
      "wss://nos.lol",
      "wss://tendon.protocol.net"
    ],
    "event_id": "hex_id_of_kind_30078_vault_event",
    "argon2_salt": "a8f3b2c9d1e7f0a4b3c2d1e0f9a8b7c6"
  }
}
```

#### Verification execution flow
1. Resolution request: parse target as `username@domain.com`.
2. HTTPS fetch: GET `https://domain.com/.well-known/tendon.json`.
3. Mapping: find username in `names`, extract pubkey, fetch matching `kind:30078` vault configurations from declared relays using `event_id`.

### 3.2 Tier 2: Free Local Petname Overlays

Nodes without web domains or static hosting route directly using raw `npub` keys. Local clients track aliases (petnames) in local storage and optionally publish mappings via Nostr `kind:3` contact events.

## 4. Local Storage, Client Hydration & Replication Engine

TMP is offline-first, using untrusted remote networks purely for transient transport.

### 4.1 Client-Side Database Tiering

Complete state (threads, decrypted payloads, keys, tracking variables) is retained inside an embedded SQLite database instance compiled to WASM and backed by browser OPFS.

```text
+──────────────────────────────────────────────────────────+
|                    Browser Sandbox                      |
|  +──────────────────────+      +──────────────────────+ |
|  | Main UI Thread       |      | Worker Thread (WASM) | |
|  | Render Loop / UI     |◄────►| SQLite + Negentropy  | |
|  +──────────────────────+      +──────────────────────+ |
+───────────────────────────────────────────▲──────────────+
                                            │ Direct Binary I/O
                                            ▼
+──────────────────────────────────────────────────────────+
|           Origin Private File System (OPFS)             |
|  [ local_state.db ] ──► Fast Atomic Block Writes        |
+──────────────────────────────────────────────────────────+
```

- Threading separation: database and sync operations run in workers.
- OPFS provides atomic, synchronous binary file access for high-volume lookups.

### 4.2 State Synchronization & Set Reconciliation (Negentropy log)
- Devices exchange compact range hashes (NIP-77 style reconciliation).
- Missing intervals are identified and fetched.
- Validated events are appended atomically to local state logs.

## 5. Wire Format & Data Serialization

TMP prohibits arbitrary text payloads in transport frames. Every interaction is compiled against strict Protocol Buffers schemas.

### 5.1 Protobuf-in-Nostr Packaging

Compiled protobuf bytes are Base64 encoded into Nostr `content`. This preserves relay interoperability while improving wire efficiency over JSON key/value payloads.

### 5.2 Definitive Protobuf Core Schema Spec

```proto
syntax = "proto3";
package tendon.protocol.v3;

message TendonEnvelope {
  uint32 protocol_version = 1;
  int64 dispatch_timestamp_utc = 2;
  string capability_token = 3;
  bytes cryptographic_nonce = 4;

  oneof payload {
    UnicastMail unicast_mail = 5;
    MulticastChat multicast_chat = 6;
    SystemDirective system_directive = 7;
  }
}

message UnicastMail {
  string message_id = 1;
  string thread_id = 2;
  string subject = 3;
  string body_plaintext = 4;
  repeated string cc_recipients_npub = 5;
  repeated AttachmentMetadata attachments = 6;
}

message MulticastChat {
  string group_id = 1;
  uint64 group_epoch = 2;
  string client_message_id = 3;
  string body_content = 4;
  repeated string interactive_mentions = 5;
}

message AttachmentMetadata {
  string content_address_hash = 1;
  uint64 storage_size_bytes = 2;
  string file_mime_type = 3;
  string distributed_url_hint = 4;
  bytes file_decryption_key = 5;
}

message SystemDirective {
  enum CommandType {
    UNKNOWN = 0;
    KEY_ROTATION_NOTICE = 1;
    CAPABILITY_REVOCATION = 2;
    GROUP_MEMBERSHIP_SYNC = 3;
    EPOCH_COMMIT = 4;
  }
  CommandType command = 1;
  bytes payload_bytes = 2;
}
```

## 6. Unicast & Multicast Message Delivery Pipelines

### 6.1 Unicast Pipeline: Metadata Obfuscation via Gift-Wrapping (NIP-17 / NIP-59)

```text
[ Raw Message Payload ] (Serialized via UnicastMail Protobuf)
          │
          ▼
   [ 1. Rumor Layer ] ────► Signed by Sender's Real Master Key
          │
          ▼
   [ 2. Sealed Layer ] ───► Encrypted via NIP-44 (ChaCha20-HMAC) for Recipient
          │
          ▼
 [ 3. Gift-Wrap Layer ] ──► Encrypted via Single-Use Ephemeral Key
          │
          +───────────────► Exposed Exterior Tag: ONLY Recipient's ['p'] Tag
```

### 6.2 Multicast Pipeline: Headless Epoch Group Commits (HEGC)

Multicast uses an append-only State Transaction DAG keyed by room ID tag (`h`) and segmented by epochs. Membership changes are committed as signed state mutations with key ratchets for forward/backward secrecy.

## 7. Network Protection & Anti-Spam Framework

### 7.1 Computational Proof-of-Work (PoW) Web Workers
- Unknown senders perform SHA-256 target mining (typically 20-24 leading zero bits).
- Human usage incurs small delay; bulk spam incurs prohibitive cost.

### 7.2 Capability Tokens

```text
Capability Token = SHA-256(Recipient_nsec + Sender_npub)
```

- Approved senders include capability token to bypass PoW.
- Revocation is local: recipient marks token invalid and sender falls back to PoW.

## 8. Large Asset Offloading Subsystem (Media Attachments)

```text
[ Local File Asset ]
        │
        ├──► 1. Hash with BLAKE3 ───► Content-Addressed Fingerprint
        ├──► 2. Encrypt (AES-GCM) ──► Cryptographic Media Key
        │
        ▼
[ Raw Encrypted Blob ] ──► Uploaded to Decentralized Blossom Node (NIP-96)
        │
        ▼
[ AttachmentMetadata Protobuf ] ──► Dropped into Core Nostr Message Envelope
```

- Attachments are encrypted locally with unique symmetric keys.
- Encrypted blobs are uploaded out-of-band (NIP-96 compatible storage nodes).
- Message envelopes contain only metadata pointers and keys needed for recipient retrieval/decryption.
