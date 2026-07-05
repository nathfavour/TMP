# Tendon Message Protocol (TMP) Architecture Specification v3.0.1

The Tendon Message Protocol (TMP) is a serverless, client-dense, local-first application-layer protocol designed to unify asynchronous communications (asymmetric unicast email topologies and symmetric multicast chat topologies) over an untrusted, stateless transport layer (Nostr). TMP shifts identity management, access authorization, message indexing, state synchronization, and data serialization entirely to the user's local computing runtime, leveraging public DNS/TLS infrastructure for verifiable global namespaces without centralized database management or ledger consensus.

## 1. System Philosophy & Core Axioms

TMP operates under four structural invariants:

- **Edge-Driven Truth**: The transport network is inherently blind and untrusted. Relays handle transient packet routing, ephemeral multicast buffering, and immutable blob availability. The client runtime alone executes identity verification, relation-thread indexing, state reconciliation, and cryptographic payload decryption.
- **Protocol Convergence**: Unicast communications (Email) and Multicast communications (Chat) share an identical cryptographic pipeline and data model. They differ exclusively in their local client-side presentation states and key distribution vectors.
- **DNS/TLS Sovereignty**: Absolute string identity namespaces rely on static-file lookups over standard DNS and TLS endpoints, bypassing the temporal vulnerabilities of decentralized peer-to-peer timestamping.
- **Strict Binary Typification**: All operational payloads are encapsulated in immutable, compiled Protocol Buffers schemas, compiled to raw byte streams and packed into standard Nostr event envelopes.

## 2. Cryptographic Identity & Authentication Matrix

Identity is deterministically rooted in a standard BIP-39 Mnemonic recovery phrase. The Master Private Key (`nsec`) is derived mathematically from the mnemonic's binary seed entropy. During client enrollment, this root private key and mnemonic are encrypted inside the Tendon Vault Container and wrapped by hardware-backed passkeys or client-side passwords.

```text
               +───────────────────────────────────────────────────+
               |        Deterministic BIP-39 Root Mnemonic         |
               +─────────────────────────┬─────────────────────────+
                                         │
                                         ▼
               +───────────────────────────────────────────────────+
               |         Master Secp256k1 Private Key (nsec)       |
               +─────────────────────────┬─────────────────────────+
                                         │ Wrapped / Encrypted By
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
              [ Pathway 1: Passkey ]           [ Pathway 2: Password ]
                WebAuthn PRF Seed                Argon2id Client Hash
```

### 2.1 The Root Identity & Key Wrapping Vault Matrix

#### Pathway 1: Deterministic Root Mnemonic (Cryptographic Foundation)
- A standard 12-word human-readable recovery phrase generated on account creation.
- **Mechanism**: The client maps the phrase back to its underlying binary entropy seed via BIP-39 to derive the raw Secp256k1 keypair. It represents the ultimate, device-independent root identity. On new devices, entering the phrase derives the key directly without requiring prior local or remote vault configuration blobs.

#### Pathway 2: WebAuthn Passkey (Hardware Access Wrapper)
- Utilizes the WebAuthn API with the Pseudo-Random Function (PRF) Extension to generate hardware-backed keys.
- **Mechanism**: The client makes a hardware authorization call to the host system's secure enclave (e.g., Apple Secure Enclave, Titan M) using a deterministic application salt.
- **Output**: The enclave outputs a stable, high-entropy 32-byte symmetric key (`K_passkey`). This key is used with AES-256-GCM to unwrap the local/remote vault and retrieve the root key and mnemonic text.

#### Pathway 3: Client-Side Argon2id Password (Portability Wrapper)
- Provides environmental migration capabilities across operating systems lacking hardware biometric synchronization.
- **Mechanism**: The user provides a password alongside a unique random 16-byte salt (`S_random`).
- **Execution**: The client executes an Argon2id Wasm worker with parameters:
  `Key_password = Argon2id(password, salt=S_random, m=65536, t=3, p=4)`
- **Mobile Fallback**: Runtimes adapt to single-threaded mode (`p=1`, `m=32768`, `t=1` to `t=2`) when multi-threading dependencies (`SharedArrayBuffer`) are unavailable. The derived key unwraps the vault to recover the root private key.

## 3. Global Identity Verification & Discovery Engine (Static-Pointer Identity Layer)

TMP enforces a two-tier architectural model for identity resolution, avoiding race conditions and spoofing vectors native to unsynchronized, relay-driven timestamp logic.

### 3.1 Tier 1: Verified Domain Pointers (`tendon.json` manifest)

To resolve human-readable usernames (for example `nathfavour`), the client maps the identity to a DNS-backed, TLS-secured static JSON file located at:

`https://<domain_or_platform>/.well-known/tendon.json`

This static file acts as the definitive directory lookup. It enables third-party platforms (for example GitHub, Vercel) to host zero-server, high-volume application inboxes for their entire user base via simple static file routing.

#### Protocol v3.1: Cryptographic Delegation Certificates

To thwart malicious or spoofed clients claiming unauthorized name verification status, the directory endpoint exports verified signatures signed by the domain's private key. The client embeds these signatures inside their published Nostr vault events, enabling other decentralized nodes to instantly verify identity authenticity offline without checking the domain's web servers.

#### `tendon.json` schema (v3.1)

```json
{
  "names": {
    "nathfavour": "npub17x6p2q9m6a5s8d3f8g0h2j4k6l8m9n0p2q4r6s8t0u2v4w6x8y0szqpq2a"
  },
  "names_v31": {
    "nathfavour": {
      "npub": "npub17x6p2q9m6a5s8d3f8g0h2j4k6l8m9n0p2q4r6s8t0u2v4w6x8y0szqpq2a",
      "signature": "64_byte_schnorr_signature_of_username_and_npub"
    }
  },
  "domain_pubkey": "hex_public_key_of_domain",
  "vault_pointer": {
    "relays": [
      "wss://relay.damus.io",
      "wss://nos.lol",
      "wss://tendon.protocol.net"
    ]
  }
}
```

#### Verification execution flow
1. Resolution request: parse target as `username@domain.com`.
2. HTTPS fetch: GET `https://domain.com/.well-known/tendon.json`.
3. Signature verification: Confirm that `names_v31[username].signature` cryptographically validates `${username}:${npub}` against the root `domain_pubkey` using Schnorr/secp256k1.
4. Nostr publication: The client publishes their vault config containing this signature as a NIP-01 `["verification", "username@domain", signature, domain_pubkey]` event tag.

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

Multicast uses an append-only State Transaction DAG keyed by room ID tag (`h`) and segmented by epochs. Membership changes are committed as signed state mutations with key ratchets for forward/backward secrecy.

- **Epoch Commit Race Mitigation**: If conflicting group mutation events (e.g. concurrent invite and evict actions) claim the same epoch sequence index ($\text{Epoch}_{n+1}$), client runtimes apply a deterministic tie-breaker rule. The conflicting commits are sorted lexicographically by their event ID string hash. The event with the lower lexical hash is committed as the authoritative state transition for $\text{Epoch}_{n+1}$. The client that authored the losing commit must discard it, synchronize to the winning transition, and re-compute its mutation event as $\text{Epoch}_{n+2}$.

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
- **Replay Prevention Enforcement**: Capability Tokens and all matching `SystemDirective` payloads MUST be encapsulated strictly within the Section 6.1 Gift-Wrap pipeline. Transmitting static tokens in plaintext exposes them to network sniffing and replay attacks; single-use ephemeral wrapping prevents public exposure on open relays.

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
- **Base64 Payload Threshold Offloading**: To prevent high CPU serialization costs and avoid relay event size rejections (often capped at 64KB–100KB), any dynamic payload or system directive structure exceeding 48KB in raw size MUST bypass inline Base64 serialization. Instead, the runtime must write the payload to raw binary, encrypt it using the local AES-GCM media pipeline, and upload it as a static content-addressed resource to a Blossom storage node, referencing the attachment pointer in the parent message rumor structure.
