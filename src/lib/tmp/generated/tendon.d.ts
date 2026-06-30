import * as $protobuf from "protobufjs";
import Long = require("long");

/** Namespace tendon. */
export namespace tendon {

    /** Namespace protocol. */
    namespace protocol {

        /** Namespace v3. */
        namespace v3 {

            /**
             * Properties of a TendonEnvelope.
             * @deprecated Use tendon.protocol.v3.TendonEnvelope.$Properties instead.
             */
            interface ITendonEnvelope extends tendon.protocol.v3.TendonEnvelope.$Properties {
            }

            /** Represents a TendonEnvelope. */
            class TendonEnvelope {

                /**
                 * Constructs a new TendonEnvelope.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: tendon.protocol.v3.TendonEnvelope.$Properties);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];

                /** TendonEnvelope protocolVersion. */
                protocolVersion: number;

                /** TendonEnvelope dispatchTimestampUtc. */
                dispatchTimestampUtc: (number|Long);

                /** TendonEnvelope capabilityToken. */
                capabilityToken: string;

                /** TendonEnvelope cryptographicNonce. */
                cryptographicNonce: Uint8Array;

                /** TendonEnvelope unicastMail. */
                unicastMail?: (tendon.protocol.v3.UnicastMail.$Properties|null);

                /** TendonEnvelope multicastChat. */
                multicastChat?: (tendon.protocol.v3.MulticastChat.$Properties|null);

                /** TendonEnvelope systemDirective. */
                systemDirective?: (tendon.protocol.v3.SystemDirective.$Properties|null);

                /** TendonEnvelope payload. */
                payload?: ("unicastMail"|"multicastChat"|"systemDirective");

                /**
                 * Creates a new TendonEnvelope instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TendonEnvelope instance
                 */
                static create(properties: tendon.protocol.v3.TendonEnvelope.$Shape): tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape;
                static create(properties?: tendon.protocol.v3.TendonEnvelope.$Properties): tendon.protocol.v3.TendonEnvelope;

                /**
                 * Encodes the specified TendonEnvelope message. Does not implicitly {@link tendon.protocol.v3.TendonEnvelope.verify|verify} messages.
                 * @param message TendonEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encode(message: tendon.protocol.v3.TendonEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TendonEnvelope message, length delimited. Does not implicitly {@link tendon.protocol.v3.TendonEnvelope.verify|verify} messages.
                 * @param message TendonEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encodeDelimited(message: tendon.protocol.v3.TendonEnvelope.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TendonEnvelope message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape} TendonEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape;

                /**
                 * Decodes a TendonEnvelope message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape} TendonEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape;

                /**
                 * Verifies a TendonEnvelope message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TendonEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TendonEnvelope
                 */
                static fromObject(object: { [k: string]: any }): tendon.protocol.v3.TendonEnvelope;

                /**
                 * Creates a plain object from a TendonEnvelope message. Also converts values to other types if specified.
                 * @param message TendonEnvelope
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                static toObject(message: tendon.protocol.v3.TendonEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TendonEnvelope to JSON.
                 * @returns JSON object
                 */
                toJSON(): { [k: string]: any };

                /**
                 * Gets the type url for TendonEnvelope
                 * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns The type url
                 */
                static getTypeUrl(prefix?: string): string;
            }

            namespace TendonEnvelope {

                /** Properties of a TendonEnvelope. */
                interface $Properties {

                    /** TendonEnvelope protocolVersion */
                    protocolVersion?: (number|null);

                    /** TendonEnvelope dispatchTimestampUtc */
                    dispatchTimestampUtc?: (number|Long|null);

                    /** TendonEnvelope capabilityToken */
                    capabilityToken?: (string|null);

                    /** TendonEnvelope cryptographicNonce */
                    cryptographicNonce?: (Uint8Array|null);

                    /** TendonEnvelope unicastMail */
                    unicastMail?: (tendon.protocol.v3.UnicastMail.$Properties|null);

                    /** TendonEnvelope multicastChat */
                    multicastChat?: (tendon.protocol.v3.MulticastChat.$Properties|null);

                    /** TendonEnvelope systemDirective */
                    systemDirective?: (tendon.protocol.v3.SystemDirective.$Properties|null);

                    /** TendonEnvelope payload */
                    payload?: ("unicastMail"|"multicastChat"|"systemDirective");

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];
                }

                /** Narrowed shape of a TendonEnvelope. */
                type $Shape = {
                  protocolVersion?: number|null;
                  dispatchTimestampUtc?: number|Long|null;
                  capabilityToken?: string|null;
                  cryptographicNonce?: Uint8Array|null;
                  unicastMail?: tendon.protocol.v3.UnicastMail.$Shape|null;
                  multicastChat?: tendon.protocol.v3.MulticastChat.$Shape|null;
                  systemDirective?: tendon.protocol.v3.SystemDirective.$Shape|null;
                  $unknowns?: Uint8Array[];
                } & (
                  ({ payload?: undefined; unicastMail?: null; multicastChat?: null; systemDirective?: null }|{ payload?: "unicastMail"; unicastMail: tendon.protocol.v3.UnicastMail.$Shape; multicastChat?: null; systemDirective?: null }|{ payload?: "multicastChat"; unicastMail?: null; multicastChat: tendon.protocol.v3.MulticastChat.$Shape; systemDirective?: null }|{ payload?: "systemDirective"; unicastMail?: null; multicastChat?: null; systemDirective: tendon.protocol.v3.SystemDirective.$Shape })
                );
            }

            /**
             * Properties of a UnicastMail.
             * @deprecated Use tendon.protocol.v3.UnicastMail.$Properties instead.
             */
            interface IUnicastMail extends tendon.protocol.v3.UnicastMail.$Properties {
            }

            /** Represents a UnicastMail. */
            class UnicastMail {

                /**
                 * Constructs a new UnicastMail.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: tendon.protocol.v3.UnicastMail.$Properties);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];

                /** UnicastMail messageId. */
                messageId: string;

                /** UnicastMail threadId. */
                threadId: string;

                /** UnicastMail subject. */
                subject: string;

                /** UnicastMail bodyPlaintext. */
                bodyPlaintext: string;

                /** UnicastMail ccRecipientsNpub. */
                ccRecipientsNpub: string[];

                /** UnicastMail attachments. */
                attachments: tendon.protocol.v3.AttachmentMetadata.$Properties[];

                /**
                 * Creates a new UnicastMail instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UnicastMail instance
                 */
                static create(properties: tendon.protocol.v3.UnicastMail.$Shape): tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape;
                static create(properties?: tendon.protocol.v3.UnicastMail.$Properties): tendon.protocol.v3.UnicastMail;

                /**
                 * Encodes the specified UnicastMail message. Does not implicitly {@link tendon.protocol.v3.UnicastMail.verify|verify} messages.
                 * @param message UnicastMail message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encode(message: tendon.protocol.v3.UnicastMail.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UnicastMail message, length delimited. Does not implicitly {@link tendon.protocol.v3.UnicastMail.verify|verify} messages.
                 * @param message UnicastMail message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encodeDelimited(message: tendon.protocol.v3.UnicastMail.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a UnicastMail message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape} UnicastMail
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape;

                /**
                 * Decodes a UnicastMail message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape} UnicastMail
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape;

                /**
                 * Verifies a UnicastMail message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a UnicastMail message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UnicastMail
                 */
                static fromObject(object: { [k: string]: any }): tendon.protocol.v3.UnicastMail;

                /**
                 * Creates a plain object from a UnicastMail message. Also converts values to other types if specified.
                 * @param message UnicastMail
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                static toObject(message: tendon.protocol.v3.UnicastMail, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UnicastMail to JSON.
                 * @returns JSON object
                 */
                toJSON(): { [k: string]: any };

                /**
                 * Gets the type url for UnicastMail
                 * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns The type url
                 */
                static getTypeUrl(prefix?: string): string;
            }

            namespace UnicastMail {

                /** Properties of a UnicastMail. */
                interface $Properties {

                    /** UnicastMail messageId */
                    messageId?: (string|null);

                    /** UnicastMail threadId */
                    threadId?: (string|null);

                    /** UnicastMail subject */
                    subject?: (string|null);

                    /** UnicastMail bodyPlaintext */
                    bodyPlaintext?: (string|null);

                    /** UnicastMail ccRecipientsNpub */
                    ccRecipientsNpub?: (string[]|null);

                    /** UnicastMail attachments */
                    attachments?: (tendon.protocol.v3.AttachmentMetadata.$Properties[]|null);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];
                }

                /** Shape of a UnicastMail. */
                type $Shape = tendon.protocol.v3.UnicastMail.$Properties;
            }

            /**
             * Properties of a MulticastChat.
             * @deprecated Use tendon.protocol.v3.MulticastChat.$Properties instead.
             */
            interface IMulticastChat extends tendon.protocol.v3.MulticastChat.$Properties {
            }

            /** Represents a MulticastChat. */
            class MulticastChat {

                /**
                 * Constructs a new MulticastChat.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: tendon.protocol.v3.MulticastChat.$Properties);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];

                /** MulticastChat groupId. */
                groupId: string;

                /** MulticastChat groupEpoch. */
                groupEpoch: (number|Long);

                /** MulticastChat clientMessageId. */
                clientMessageId: string;

                /** MulticastChat bodyContent. */
                bodyContent: string;

                /** MulticastChat interactiveMentions. */
                interactiveMentions: string[];

                /**
                 * Creates a new MulticastChat instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns MulticastChat instance
                 */
                static create(properties: tendon.protocol.v3.MulticastChat.$Shape): tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape;
                static create(properties?: tendon.protocol.v3.MulticastChat.$Properties): tendon.protocol.v3.MulticastChat;

                /**
                 * Encodes the specified MulticastChat message. Does not implicitly {@link tendon.protocol.v3.MulticastChat.verify|verify} messages.
                 * @param message MulticastChat message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encode(message: tendon.protocol.v3.MulticastChat.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified MulticastChat message, length delimited. Does not implicitly {@link tendon.protocol.v3.MulticastChat.verify|verify} messages.
                 * @param message MulticastChat message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encodeDelimited(message: tendon.protocol.v3.MulticastChat.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a MulticastChat message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape} MulticastChat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape;

                /**
                 * Decodes a MulticastChat message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape} MulticastChat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape;

                /**
                 * Verifies a MulticastChat message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a MulticastChat message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns MulticastChat
                 */
                static fromObject(object: { [k: string]: any }): tendon.protocol.v3.MulticastChat;

                /**
                 * Creates a plain object from a MulticastChat message. Also converts values to other types if specified.
                 * @param message MulticastChat
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                static toObject(message: tendon.protocol.v3.MulticastChat, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this MulticastChat to JSON.
                 * @returns JSON object
                 */
                toJSON(): { [k: string]: any };

                /**
                 * Gets the type url for MulticastChat
                 * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns The type url
                 */
                static getTypeUrl(prefix?: string): string;
            }

            namespace MulticastChat {

                /** Properties of a MulticastChat. */
                interface $Properties {

                    /** MulticastChat groupId */
                    groupId?: (string|null);

                    /** MulticastChat groupEpoch */
                    groupEpoch?: (number|Long|null);

                    /** MulticastChat clientMessageId */
                    clientMessageId?: (string|null);

                    /** MulticastChat bodyContent */
                    bodyContent?: (string|null);

                    /** MulticastChat interactiveMentions */
                    interactiveMentions?: (string[]|null);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];
                }

                /** Shape of a MulticastChat. */
                type $Shape = tendon.protocol.v3.MulticastChat.$Properties;
            }

            /**
             * Properties of an AttachmentMetadata.
             * @deprecated Use tendon.protocol.v3.AttachmentMetadata.$Properties instead.
             */
            interface IAttachmentMetadata extends tendon.protocol.v3.AttachmentMetadata.$Properties {
            }

            /** Represents an AttachmentMetadata. */
            class AttachmentMetadata {

                /**
                 * Constructs a new AttachmentMetadata.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: tendon.protocol.v3.AttachmentMetadata.$Properties);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];

                /** AttachmentMetadata contentAddressHash. */
                contentAddressHash: string;

                /** AttachmentMetadata storageSizeBytes. */
                storageSizeBytes: (number|Long);

                /** AttachmentMetadata fileMimeType. */
                fileMimeType: string;

                /** AttachmentMetadata distributedUrlHint. */
                distributedUrlHint: string;

                /** AttachmentMetadata fileDecryptionKey. */
                fileDecryptionKey: Uint8Array;

                /**
                 * Creates a new AttachmentMetadata instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AttachmentMetadata instance
                 */
                static create(properties: tendon.protocol.v3.AttachmentMetadata.$Shape): tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape;
                static create(properties?: tendon.protocol.v3.AttachmentMetadata.$Properties): tendon.protocol.v3.AttachmentMetadata;

                /**
                 * Encodes the specified AttachmentMetadata message. Does not implicitly {@link tendon.protocol.v3.AttachmentMetadata.verify|verify} messages.
                 * @param message AttachmentMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encode(message: tendon.protocol.v3.AttachmentMetadata.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AttachmentMetadata message, length delimited. Does not implicitly {@link tendon.protocol.v3.AttachmentMetadata.verify|verify} messages.
                 * @param message AttachmentMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encodeDelimited(message: tendon.protocol.v3.AttachmentMetadata.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AttachmentMetadata message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape} AttachmentMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape;

                /**
                 * Decodes an AttachmentMetadata message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape} AttachmentMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape;

                /**
                 * Verifies an AttachmentMetadata message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AttachmentMetadata message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AttachmentMetadata
                 */
                static fromObject(object: { [k: string]: any }): tendon.protocol.v3.AttachmentMetadata;

                /**
                 * Creates a plain object from an AttachmentMetadata message. Also converts values to other types if specified.
                 * @param message AttachmentMetadata
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                static toObject(message: tendon.protocol.v3.AttachmentMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AttachmentMetadata to JSON.
                 * @returns JSON object
                 */
                toJSON(): { [k: string]: any };

                /**
                 * Gets the type url for AttachmentMetadata
                 * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns The type url
                 */
                static getTypeUrl(prefix?: string): string;
            }

            namespace AttachmentMetadata {

                /** Properties of an AttachmentMetadata. */
                interface $Properties {

                    /** AttachmentMetadata contentAddressHash */
                    contentAddressHash?: (string|null);

                    /** AttachmentMetadata storageSizeBytes */
                    storageSizeBytes?: (number|Long|null);

                    /** AttachmentMetadata fileMimeType */
                    fileMimeType?: (string|null);

                    /** AttachmentMetadata distributedUrlHint */
                    distributedUrlHint?: (string|null);

                    /** AttachmentMetadata fileDecryptionKey */
                    fileDecryptionKey?: (Uint8Array|null);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];
                }

                /** Shape of an AttachmentMetadata. */
                type $Shape = tendon.protocol.v3.AttachmentMetadata.$Properties;
            }

            /**
             * Properties of a SystemDirective.
             * @deprecated Use tendon.protocol.v3.SystemDirective.$Properties instead.
             */
            interface ISystemDirective extends tendon.protocol.v3.SystemDirective.$Properties {
            }

            /** Represents a SystemDirective. */
            class SystemDirective {

                /**
                 * Constructs a new SystemDirective.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: tendon.protocol.v3.SystemDirective.$Properties);

                /** Unknown fields preserved while decoding when enabled */
                $unknowns?: Uint8Array[];

                /** SystemDirective command. */
                command: tendon.protocol.v3.SystemDirective.CommandType;

                /** SystemDirective payloadBytes. */
                payloadBytes: Uint8Array;

                /**
                 * Creates a new SystemDirective instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SystemDirective instance
                 */
                static create(properties: tendon.protocol.v3.SystemDirective.$Shape): tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape;
                static create(properties?: tendon.protocol.v3.SystemDirective.$Properties): tendon.protocol.v3.SystemDirective;

                /**
                 * Encodes the specified SystemDirective message. Does not implicitly {@link tendon.protocol.v3.SystemDirective.verify|verify} messages.
                 * @param message SystemDirective message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encode(message: tendon.protocol.v3.SystemDirective.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SystemDirective message, length delimited. Does not implicitly {@link tendon.protocol.v3.SystemDirective.verify|verify} messages.
                 * @param message SystemDirective message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                static encodeDelimited(message: tendon.protocol.v3.SystemDirective.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SystemDirective message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape} SystemDirective
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape;

                /**
                 * Decodes a SystemDirective message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape} SystemDirective
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape;

                /**
                 * Verifies a SystemDirective message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SystemDirective message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SystemDirective
                 */
                static fromObject(object: { [k: string]: any }): tendon.protocol.v3.SystemDirective;

                /**
                 * Creates a plain object from a SystemDirective message. Also converts values to other types if specified.
                 * @param message SystemDirective
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                static toObject(message: tendon.protocol.v3.SystemDirective, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SystemDirective to JSON.
                 * @returns JSON object
                 */
                toJSON(): { [k: string]: any };

                /**
                 * Gets the type url for SystemDirective
                 * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns The type url
                 */
                static getTypeUrl(prefix?: string): string;
            }

            namespace SystemDirective {

                /** Properties of a SystemDirective. */
                interface $Properties {

                    /** SystemDirective command */
                    command?: (tendon.protocol.v3.SystemDirective.CommandType|null);

                    /** SystemDirective payloadBytes */
                    payloadBytes?: (Uint8Array|null);

                    /** Unknown fields preserved while decoding when enabled */
                    $unknowns?: Uint8Array[];
                }

                /** Shape of a SystemDirective. */
                type $Shape = tendon.protocol.v3.SystemDirective.$Properties;

                /** CommandType enum. */
                enum CommandType {

                    /** UNKNOWN value */
                    UNKNOWN = 0,

                    /** KEY_ROTATION_NOTICE value */
                    KEY_ROTATION_NOTICE = 1,

                    /** CAPABILITY_REVOCATION value */
                    CAPABILITY_REVOCATION = 2,

                    /** GROUP_MEMBERSHIP_SYNC value */
                    GROUP_MEMBERSHIP_SYNC = 3,

                    /** EPOCH_COMMIT value */
                    EPOCH_COMMIT = 4
                }
            }
        }
    }
}
