import { tendon } from "@/lib/tmp/generated";
import { base64ToBytes, bytesToBase64, bytesToHex, hexToBytes, toSafeNumber } from "@/lib/tmp/bytes";
import {
  CommandType,
  type AttachmentMetadata,
  type MulticastChat,
  type SystemDirective,
  type TendonEnvelope,
  type UnicastMail,
} from "@/lib/tmp/types";

const { TendonEnvelope, SystemDirective: SystemDirectiveProto } = tendon.protocol.v3;

function mapAttachmentToProto(attachment: AttachmentMetadata) {
  return {
    contentAddressHash: attachment.content_address_hash,
    storageSizeBytes: attachment.storage_size_bytes,
    fileMimeType: attachment.file_mime_type,
    distributedUrlHint: attachment.distributed_url_hint,
    fileDecryptionKey: base64ToBytes(attachment.file_decryption_key),
  };
}

function mapAttachmentFromProto(attachment: {
  contentAddressHash?: string | null;
  storageSizeBytes?: number | { toNumber(): number } | bigint | null;
  fileMimeType?: string | null;
  distributedUrlHint?: string | null;
  fileDecryptionKey?: Uint8Array | null;
}): AttachmentMetadata {
  return {
    content_address_hash: attachment.contentAddressHash ?? "",
    storage_size_bytes: toSafeNumber(attachment.storageSizeBytes ?? 0),
    file_mime_type: attachment.fileMimeType ?? "",
    distributed_url_hint: attachment.distributedUrlHint ?? "",
    file_decryption_key: bytesToBase64(attachment.fileDecryptionKey ?? new Uint8Array()),
  };
}

function mapUnicastToProto(mail: UnicastMail) {
  return {
    messageId: mail.message_id,
    threadId: mail.thread_id,
    subject: mail.subject,
    bodyPlaintext: mail.body_plaintext,
    ccRecipientsNpub: mail.cc_recipients_npub,
    attachments: mail.attachments.map(mapAttachmentToProto),
  };
}

function mapUnicastFromProto(mail: {
  messageId?: string | null;
  threadId?: string | null;
  subject?: string | null;
  bodyPlaintext?: string | null;
  ccRecipientsNpub?: string[] | null;
  attachments?: Array<Parameters<typeof mapAttachmentFromProto>[0]> | null;
}): UnicastMail {
  return {
    message_id: mail.messageId ?? "",
    thread_id: mail.threadId ?? "",
    subject: mail.subject ?? "",
    body_plaintext: mail.bodyPlaintext ?? "",
    cc_recipients_npub: mail.ccRecipientsNpub ?? [],
    attachments: (mail.attachments ?? []).map(mapAttachmentFromProto),
  };
}

function mapMulticastToProto(chat: MulticastChat) {
  return {
    groupId: chat.group_id,
    groupEpoch: chat.group_epoch,
    clientMessageId: chat.client_message_id,
    bodyContent: chat.body_content,
    interactiveMentions: chat.interactive_mentions,
  };
}

function mapMulticastFromProto(chat: {
  groupId?: string | null;
  groupEpoch?: number | { toNumber(): number } | bigint | null;
  clientMessageId?: string | null;
  bodyContent?: string | null;
  interactiveMentions?: string[] | null;
}): MulticastChat {
  return {
    group_id: chat.groupId ?? "",
    group_epoch: toSafeNumber(chat.groupEpoch ?? 0),
    client_message_id: chat.clientMessageId ?? "",
    body_content: chat.bodyContent ?? "",
    interactive_mentions: chat.interactiveMentions ?? [],
  };
}

function mapDirectiveToProto(directive: SystemDirective) {
  return {
    command: directive.command as SystemDirectiveProto.CommandType,
    payloadBytes: base64ToBytes(directive.payload_bytes),
  };
}

function mapDirectiveFromProto(directive: {
  command?: SystemDirectiveProto.CommandType | null;
  payloadBytes?: Uint8Array | null;
}): SystemDirective {
  return {
    command: (directive.command ?? CommandType.UNKNOWN) as CommandType,
    payload_bytes: bytesToBase64(directive.payloadBytes ?? new Uint8Array()),
  };
}

export function envelopeToProto(envelope: TendonEnvelope): tendon.protocol.v3.TendonEnvelope.$Shape {
  const base = {
    protocolVersion: envelope.protocol_version,
    dispatchTimestampUtc: envelope.dispatch_timestamp_utc,
    capabilityToken: envelope.capability_token,
    cryptographicNonce: hexToBytes(envelope.cryptographic_nonce),
  };

  switch (envelope.payload.kind) {
    case "unicast_mail":
      return {
        ...base,
        payload: "unicastMail",
        unicastMail: mapUnicastToProto(envelope.payload.value),
      };
    case "multicast_chat":
      return {
        ...base,
        payload: "multicastChat",
        multicastChat: mapMulticastToProto(envelope.payload.value),
      };
    case "system_directive":
      return {
        ...base,
        payload: "systemDirective",
        systemDirective: mapDirectiveToProto(envelope.payload.value),
      };
  }
}

export function envelopeFromProto(message: tendon.protocol.v3.TendonEnvelope): TendonEnvelope {
  const base = {
    protocol_version: message.protocolVersion ?? 0,
    dispatch_timestamp_utc: toSafeNumber(message.dispatchTimestampUtc ?? 0),
    capability_token: message.capabilityToken ?? "",
    cryptographic_nonce: bytesToHex(message.cryptographicNonce ?? new Uint8Array()),
  };

  if (message.unicastMail) {
    return {
      ...base,
      payload: {
        kind: "unicast_mail",
        value: mapUnicastFromProto(message.unicastMail),
      },
    };
  }

  if (message.multicastChat) {
    return {
      ...base,
      payload: {
        kind: "multicast_chat",
        value: mapMulticastFromProto(message.multicastChat),
      },
    };
  }

  if (message.systemDirective) {
    return {
      ...base,
      payload: {
        kind: "system_directive",
        value: mapDirectiveFromProto(message.systemDirective),
      },
    };
  }

  throw new Error("TMP envelope missing oneof payload");
}

export function encodeEnvelopeBytes(envelope: TendonEnvelope): Uint8Array {
  const proto = envelopeToProto(envelope);
  return TendonEnvelope.encode(proto).finish();
}

export function decodeEnvelopeBytes(bytes: Uint8Array): TendonEnvelope {
  const decoded = TendonEnvelope.decode(bytes);
  return envelopeFromProto(decoded);
}
