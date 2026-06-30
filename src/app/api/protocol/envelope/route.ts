import { NextResponse } from "next/server";

import { decodeEnvelope, encodeEnvelope } from "@/lib/tmp/codec";
import { sampleMulticastEnvelope, sampleNostrUnicast, sampleSystemDirective, sampleUnicastEnvelope } from "@/lib/tmp/sample";
import type { TendonEnvelope } from "@/lib/tmp/types";

export async function GET() {
  const unicast = sampleUnicastEnvelope();
  const multicast = sampleMulticastEnvelope();
  const systemDirective = sampleSystemDirective();

  return NextResponse.json({
    protocol: "TMP v3",
    codec: "base64(JSON) development codec (protobuf upgrade path retained)",
    samples: {
      unicast,
      multicast,
      systemDirective,
      nostrWrappedUnicast: sampleNostrUnicast(),
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { envelope?: TendonEnvelope };
  if (!body.envelope) {
    return NextResponse.json({ error: "Missing envelope payload" }, { status: 400 });
  }

  const encoded = encodeEnvelope(body.envelope);
  const decoded = decodeEnvelope(encoded);
  return NextResponse.json({ encoded, decoded });
}
