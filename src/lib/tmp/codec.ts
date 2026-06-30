import type { TendonEnvelope } from "@/lib/tmp/types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function fromBase64(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64"));
}

export function encodeEnvelope(envelope: TendonEnvelope): string {
  // Dev codec: JSON now, swappable with Protobuf bytes later.
  const bytes = encoder.encode(JSON.stringify(envelope));
  return toBase64(bytes);
}

export function decodeEnvelope(contentBase64: string): TendonEnvelope {
  const bytes = fromBase64(contentBase64);
  const json = decoder.decode(bytes);
  return JSON.parse(json) as TendonEnvelope;
}
