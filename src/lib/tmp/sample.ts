import { buildEnvelope, wrapForNostr } from "@/lib/tmp/builder";
import { CommandType, type NostrEventEnvelope, type TendonEnvelope } from "@/lib/tmp/types";

export function sampleUnicastEnvelope(): TendonEnvelope {
  return buildEnvelope({
    kind: "unicast_mail",
    value: {
      message_id: crypto.randomUUID(),
      thread_id: "thread-alpha",
      subject: "TMP unicast bootstrap",
      body_plaintext: "Initial unicast payload for TMP protocol POC.",
      cc_recipients_npub: [],
      attachments: [],
    },
  });
}

export function sampleMulticastEnvelope(): TendonEnvelope {
  return buildEnvelope({
    kind: "multicast_chat",
    value: {
      group_id: "group-tendon-labs",
      group_epoch: 0,
      client_message_id: crypto.randomUUID(),
      body_content: "Epoch-0 multicast heartbeat",
      interactive_mentions: ["npub1example"],
    },
  });
}

export function sampleSystemDirective(): TendonEnvelope {
  return buildEnvelope({
    kind: "system_directive",
    value: {
      command: CommandType.EPOCH_COMMIT,
      payload_bytes: Buffer.from(
        JSON.stringify({ from_epoch: 0, to_epoch: 1, reason: "membership-change" }),
      ).toString("base64"),
    },
  });
}

export function sampleNostrUnicast(): NostrEventEnvelope {
  const envelope = sampleUnicastEnvelope();
  return wrapForNostr(envelope, [["p", "npub1recipient"]]);
}
