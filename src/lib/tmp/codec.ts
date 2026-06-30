import { decodeEnvelopeBytes, encodeEnvelopeBytes } from "@/lib/tmp/proto-mapper";
import type { TendonEnvelope } from "@/lib/tmp/types";

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function fromBase64(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64"));
}

/** Base64-encoded protobuf wire bytes for Nostr event content. */
export function encodeEnvelope(envelope: TendonEnvelope): string {
  return toBase64(encodeEnvelopeBytes(envelope));
}

export function decodeEnvelope(contentBase64: string): TendonEnvelope {
  return decodeEnvelopeBytes(fromBase64(contentBase64));
}
