export function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

export function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, "hex"));
}

export function bytesToBase64(bytes: Uint8Array): string {
  if (bytes.length === 0) {
    return "";
  }
  return Buffer.from(bytes).toString("base64");
}

export function base64ToBytes(value: string): Uint8Array {
  if (!value) {
    return new Uint8Array();
  }
  return new Uint8Array(Buffer.from(value, "base64"));
}

export function toSafeNumber(value: number | { toNumber(): number } | bigint): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value.toNumber();
}
