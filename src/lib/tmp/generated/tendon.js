/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
var $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $TypeError = $util.global.TypeError, $Number = $util.global.Number, $parseInt = $util.global.parseInt, $String = $util.global.String, $BigInt = $util.global.BigInt, $Array = $util.global.Array;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.tendon = (function() {

    /**
     * Namespace tendon.
     * @exports tendon
     * @namespace
     */
    var tendon = {};

    tendon.protocol = (function() {

        /**
         * Namespace protocol.
         * @memberof tendon
         * @namespace
         */
        var protocol = {};

        protocol.v3 = (function() {

            /**
             * Namespace v3.
             * @memberof tendon.protocol
             * @namespace
             */
            var v3 = {};

            v3.TendonEnvelope = (function() {

                /**
                 * Properties of a TendonEnvelope.
                 * @typedef {Object} tendon.protocol.v3.TendonEnvelope.$Properties
                 * @property {number|null} [protocolVersion] TendonEnvelope protocolVersion
                 * @property {number|Long|null} [dispatchTimestampUtc] TendonEnvelope dispatchTimestampUtc
                 * @property {string|null} [capabilityToken] TendonEnvelope capabilityToken
                 * @property {Uint8Array|null} [cryptographicNonce] TendonEnvelope cryptographicNonce
                 * @property {tendon.protocol.v3.UnicastMail.$Properties|null} [unicastMail] TendonEnvelope unicastMail
                 * @property {tendon.protocol.v3.MulticastChat.$Properties|null} [multicastChat] TendonEnvelope multicastChat
                 * @property {tendon.protocol.v3.SystemDirective.$Properties|null} [systemDirective] TendonEnvelope systemDirective
                 * @property {"unicastMail"|"multicastChat"|"systemDirective"} [payload] TendonEnvelope payload
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */

                /**
                 * Properties of a TendonEnvelope.
                 * @memberof tendon.protocol.v3
                 * @interface ITendonEnvelope
                 * @augments tendon.protocol.v3.TendonEnvelope.$Properties
                 * @deprecated Use tendon.protocol.v3.TendonEnvelope.$Properties instead.
                 */

                /**
                 * Narrowed shape of a TendonEnvelope.
                 * @typedef {{
                 *   protocolVersion?: number|null;
                 *   dispatchTimestampUtc?: number|Long|null;
                 *   capabilityToken?: string|null;
                 *   cryptographicNonce?: Uint8Array|null;
                 *   unicastMail?: tendon.protocol.v3.UnicastMail.$Shape|null;
                 *   multicastChat?: tendon.protocol.v3.MulticastChat.$Shape|null;
                 *   systemDirective?: tendon.protocol.v3.SystemDirective.$Shape|null;
                 *   $unknowns?: Array.<Uint8Array>;
                 * } & (
                 *   ({ payload?: undefined; unicastMail?: null; multicastChat?: null; systemDirective?: null }|{ payload?: "unicastMail"; unicastMail: tendon.protocol.v3.UnicastMail.$Shape; multicastChat?: null; systemDirective?: null }|{ payload?: "multicastChat"; unicastMail?: null; multicastChat: tendon.protocol.v3.MulticastChat.$Shape; systemDirective?: null }|{ payload?: "systemDirective"; unicastMail?: null; multicastChat?: null; systemDirective: tendon.protocol.v3.SystemDirective.$Shape })
                 * )} tendon.protocol.v3.TendonEnvelope.$Shape
                 */

                /**
                 * Constructs a new TendonEnvelope.
                 * @memberof tendon.protocol.v3
                 * @classdesc Represents a TendonEnvelope.
                 * @constructor
                 * @param {tendon.protocol.v3.TendonEnvelope.$Properties=} [properties] Properties to set
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */
                var TendonEnvelope = function (properties) {
                    if (properties)
                        for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                };

                /**
                 * TendonEnvelope protocolVersion.
                 * @member {number} protocolVersion
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.protocolVersion = 0;

                /**
                 * TendonEnvelope dispatchTimestampUtc.
                 * @member {number|Long} dispatchTimestampUtc
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.dispatchTimestampUtc = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * TendonEnvelope capabilityToken.
                 * @member {string} capabilityToken
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.capabilityToken = "";

                /**
                 * TendonEnvelope cryptographicNonce.
                 * @member {Uint8Array} cryptographicNonce
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.cryptographicNonce = $util.newBuffer([]);

                /**
                 * TendonEnvelope unicastMail.
                 * @member {tendon.protocol.v3.UnicastMail.$Properties|null|undefined} unicastMail
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.unicastMail = null;

                /**
                 * TendonEnvelope multicastChat.
                 * @member {tendon.protocol.v3.MulticastChat.$Properties|null|undefined} multicastChat
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.multicastChat = null;

                /**
                 * TendonEnvelope systemDirective.
                 * @member {tendon.protocol.v3.SystemDirective.$Properties|null|undefined} systemDirective
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                TendonEnvelope.prototype.systemDirective = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * TendonEnvelope payload.
                 * @member {"unicastMail"|"multicastChat"|"systemDirective"|undefined} payload
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 */
                $Object.defineProperty(TendonEnvelope.prototype, "payload", {
                    get: $util.oneOfGetter($oneOfFields = ["unicastMail", "multicastChat", "systemDirective"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new TendonEnvelope instance using the specified properties.
                 * @function create
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {tendon.protocol.v3.TendonEnvelope.$Properties=} [properties] Properties to set
                 * @returns {tendon.protocol.v3.TendonEnvelope} TendonEnvelope instance
                 * @type {{
                 *   (properties: tendon.protocol.v3.TendonEnvelope.$Shape): tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape;
                 *   (properties?: tendon.protocol.v3.TendonEnvelope.$Properties): tendon.protocol.v3.TendonEnvelope;
                 * }}
                 */
                TendonEnvelope.create = function(properties) {
                    return new TendonEnvelope(properties);
                };

                /**
                 * Encodes the specified TendonEnvelope message. Does not implicitly {@link tendon.protocol.v3.TendonEnvelope.verify|verify} messages.
                 * @function encode
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {tendon.protocol.v3.TendonEnvelope.$Properties} message TendonEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TendonEnvelope.encode = function (message, writer, _depth) {
                    if (!writer)
                        writer = $Writer.create();
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    if (message.protocolVersion != null && $Object.hasOwnProperty.call(message, "protocolVersion") && message.protocolVersion !== 0)
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.protocolVersion);
                    if (message.dispatchTimestampUtc != null && $Object.hasOwnProperty.call(message, "dispatchTimestampUtc") && (typeof message.dispatchTimestampUtc === "object" ? message.dispatchTimestampUtc.low || message.dispatchTimestampUtc.high : message.dispatchTimestampUtc !== 0))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.dispatchTimestampUtc);
                    if (message.capabilityToken != null && $Object.hasOwnProperty.call(message, "capabilityToken") && message.capabilityToken !== "")
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.capabilityToken);
                    if (message.cryptographicNonce != null && $Object.hasOwnProperty.call(message, "cryptographicNonce") && message.cryptographicNonce.length)
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.cryptographicNonce);
                    if (message.unicastMail != null && $Object.hasOwnProperty.call(message, "unicastMail"))
                        $root.tendon.protocol.v3.UnicastMail.encode(message.unicastMail, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                    if (message.multicastChat != null && $Object.hasOwnProperty.call(message, "multicastChat"))
                        $root.tendon.protocol.v3.MulticastChat.encode(message.multicastChat, writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                    if (message.systemDirective != null && $Object.hasOwnProperty.call(message, "systemDirective"))
                        $root.tendon.protocol.v3.SystemDirective.encode(message.systemDirective, writer.uint32(/* id 7, wireType 2 =*/58).fork(), _depth + 1).ldelim();
                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                        for (var i = 0; i < message.$unknowns.length; ++i)
                            writer.raw(message.$unknowns[i]);
                    return writer;
                };

                /**
                 * Encodes the specified TendonEnvelope message, length delimited. Does not implicitly {@link tendon.protocol.v3.TendonEnvelope.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {tendon.protocol.v3.TendonEnvelope.$Properties} message TendonEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TendonEnvelope.encodeDelimited = function(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a TendonEnvelope message from the specified reader or buffer.
                 * @function decode
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape} TendonEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TendonEnvelope.decode = function (reader, length, _end, _depth, _target) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $Reader.recursionLimit)
                        throw $Error("max depth exceeded");
                    var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.tendon.protocol.v3.TendonEnvelope(), value;
                    while (reader.pos < end) {
                        var start = reader.pos;
                        var tag = reader.tag();
                        if (tag === _end) {
                            _end = $undefined;
                            break;
                        }
                        var wireType = tag & 7;
                        switch (tag >>>= 3) {
                        case 1: {
                                if (wireType !== 0)
                                    break;
                                if (value = reader.uint32())
                                    message.protocolVersion = value;
                                else
                                    delete message.protocolVersion;
                                continue;
                            }
                        case 2: {
                                if (wireType !== 0)
                                    break;
                                if (typeof (value = reader.int64()) === "object" ? value.low || value.high : value !== 0)
                                    message.dispatchTimestampUtc = value;
                                else
                                    delete message.dispatchTimestampUtc;
                                continue;
                            }
                        case 3: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.capabilityToken = value;
                                else
                                    delete message.capabilityToken;
                                continue;
                            }
                        case 4: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.bytes()).length)
                                    message.cryptographicNonce = value;
                                else
                                    delete message.cryptographicNonce;
                                continue;
                            }
                        case 5: {
                                if (wireType !== 2)
                                    break;
                                message.unicastMail = $root.tendon.protocol.v3.UnicastMail.decode(reader, reader.uint32(), $undefined, _depth + 1, message.unicastMail);
                                message.payload = "unicastMail";
                                continue;
                            }
                        case 6: {
                                if (wireType !== 2)
                                    break;
                                message.multicastChat = $root.tendon.protocol.v3.MulticastChat.decode(reader, reader.uint32(), $undefined, _depth + 1, message.multicastChat);
                                message.payload = "multicastChat";
                                continue;
                            }
                        case 7: {
                                if (wireType !== 2)
                                    break;
                                message.systemDirective = $root.tendon.protocol.v3.SystemDirective.decode(reader, reader.uint32(), $undefined, _depth + 1, message.systemDirective);
                                message.payload = "systemDirective";
                                continue;
                            }
                        }
                        reader.skipType(wireType, _depth, tag);
                        if (!reader.discardUnknown) {
                            $util.makeProp(message, "$unknowns", false);
                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                        }
                    }
                    if (_end !== $undefined)
                        throw $Error("missing end group");
                    return message;
                };

                /**
                 * Decodes a TendonEnvelope message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.TendonEnvelope & tendon.protocol.v3.TendonEnvelope.$Shape} TendonEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TendonEnvelope.decodeDelimited = function(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a TendonEnvelope message.
                 * @function verify
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                TendonEnvelope.verify = function (message, _depth) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        return "max depth exceeded";
                    var properties = {};
                    if (message.protocolVersion != null && $Object.hasOwnProperty.call(message, "protocolVersion"))
                        if (!$util.isInteger(message.protocolVersion))
                            return "protocolVersion: integer expected";
                    if (message.dispatchTimestampUtc != null && $Object.hasOwnProperty.call(message, "dispatchTimestampUtc"))
                        if (!$util.isInteger(message.dispatchTimestampUtc) && !(message.dispatchTimestampUtc && $util.isInteger(message.dispatchTimestampUtc.low) && $util.isInteger(message.dispatchTimestampUtc.high)))
                            return "dispatchTimestampUtc: integer|Long expected";
                    if (message.capabilityToken != null && $Object.hasOwnProperty.call(message, "capabilityToken"))
                        if (!$util.isString(message.capabilityToken))
                            return "capabilityToken: string expected";
                    if (message.cryptographicNonce != null && $Object.hasOwnProperty.call(message, "cryptographicNonce"))
                        if (!(message.cryptographicNonce && typeof message.cryptographicNonce.length === "number" || $util.isString(message.cryptographicNonce)))
                            return "cryptographicNonce: buffer expected";
                    if (message.unicastMail != null && $Object.hasOwnProperty.call(message, "unicastMail")) {
                        properties.payload = 1;
                        {
                            var error = $root.tendon.protocol.v3.UnicastMail.verify(message.unicastMail, _depth + 1);
                            if (error)
                                return "unicastMail." + error;
                        }
                    }
                    if (message.multicastChat != null && $Object.hasOwnProperty.call(message, "multicastChat")) {
                        if (properties.payload === 1)
                            return "payload: multiple values";
                        properties.payload = 1;
                        {
                            var error = $root.tendon.protocol.v3.MulticastChat.verify(message.multicastChat, _depth + 1);
                            if (error)
                                return "multicastChat." + error;
                        }
                    }
                    if (message.systemDirective != null && $Object.hasOwnProperty.call(message, "systemDirective")) {
                        if (properties.payload === 1)
                            return "payload: multiple values";
                        properties.payload = 1;
                        {
                            var error = $root.tendon.protocol.v3.SystemDirective.verify(message.systemDirective, _depth + 1);
                            if (error)
                                return "systemDirective." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a TendonEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {tendon.protocol.v3.TendonEnvelope} TendonEnvelope
                 */
                TendonEnvelope.fromObject = function (object, _depth) {
                    if (object instanceof $root.tendon.protocol.v3.TendonEnvelope)
                        return object;
                    if (!$util.isObject(object))
                        throw $TypeError(".tendon.protocol.v3.TendonEnvelope: object expected");
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var message = new $root.tendon.protocol.v3.TendonEnvelope();
                    if (object.protocolVersion != null)
                        if ($Number(object.protocolVersion) !== 0)
                            message.protocolVersion = object.protocolVersion >>> 0;
                    if (object.dispatchTimestampUtc != null)
                        if (typeof object.dispatchTimestampUtc === "object" ? object.dispatchTimestampUtc.low || object.dispatchTimestampUtc.high : $Number(object.dispatchTimestampUtc) !== 0)
                            if ($util.Long)
                                message.dispatchTimestampUtc = $util.Long.fromValue(object.dispatchTimestampUtc, false);
                            else if (typeof object.dispatchTimestampUtc === "string")
                                message.dispatchTimestampUtc = $parseInt(object.dispatchTimestampUtc, 10);
                            else if (typeof object.dispatchTimestampUtc === "number")
                                message.dispatchTimestampUtc = object.dispatchTimestampUtc;
                            else if (typeof object.dispatchTimestampUtc === "object")
                                message.dispatchTimestampUtc = new $util.LongBits(object.dispatchTimestampUtc.low >>> 0, object.dispatchTimestampUtc.high >>> 0).toNumber();
                    if (object.capabilityToken != null)
                        if (typeof object.capabilityToken !== "string" || object.capabilityToken.length)
                            message.capabilityToken = $String(object.capabilityToken);
                    if (object.cryptographicNonce != null)
                        if (object.cryptographicNonce.length)
                            if (typeof object.cryptographicNonce === "string")
                                $util.base64.decode(object.cryptographicNonce, message.cryptographicNonce = $util.newBuffer($util.base64.length(object.cryptographicNonce)), 0);
                            else if (object.cryptographicNonce.length >= 0)
                                message.cryptographicNonce = object.cryptographicNonce;
                    if (object.unicastMail != null) {
                        if (!$util.isObject(object.unicastMail))
                            throw $TypeError(".tendon.protocol.v3.TendonEnvelope.unicastMail: object expected");
                        message.unicastMail = $root.tendon.protocol.v3.UnicastMail.fromObject(object.unicastMail, _depth + 1);
                    }
                    if (object.multicastChat != null) {
                        if (!$util.isObject(object.multicastChat))
                            throw $TypeError(".tendon.protocol.v3.TendonEnvelope.multicastChat: object expected");
                        message.multicastChat = $root.tendon.protocol.v3.MulticastChat.fromObject(object.multicastChat, _depth + 1);
                    }
                    if (object.systemDirective != null) {
                        if (!$util.isObject(object.systemDirective))
                            throw $TypeError(".tendon.protocol.v3.TendonEnvelope.systemDirective: object expected");
                        message.systemDirective = $root.tendon.protocol.v3.SystemDirective.fromObject(object.systemDirective, _depth + 1);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a TendonEnvelope message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {tendon.protocol.v3.TendonEnvelope} message TendonEnvelope
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                TendonEnvelope.toObject = function (message, options, _depth) {
                    if (!options)
                        options = {};
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.protocolVersion = 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, false);
                            object.dispatchTimestampUtc = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                        } else
                            object.dispatchTimestampUtc = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                        object.capabilityToken = "";
                        if (options.bytes === $String)
                            object.cryptographicNonce = "";
                        else {
                            object.cryptographicNonce = [];
                            if (options.bytes !== $Array)
                                object.cryptographicNonce = $util.newBuffer(object.cryptographicNonce);
                        }
                    }
                    if (message.protocolVersion != null && $Object.hasOwnProperty.call(message, "protocolVersion"))
                        object.protocolVersion = message.protocolVersion;
                    if (message.dispatchTimestampUtc != null && $Object.hasOwnProperty.call(message, "dispatchTimestampUtc"))
                        if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                            object.dispatchTimestampUtc = typeof message.dispatchTimestampUtc === "number" ? $BigInt(message.dispatchTimestampUtc) : $util.Long.fromBits(message.dispatchTimestampUtc.low >>> 0, message.dispatchTimestampUtc.high >>> 0, false).toBigInt();
                        else if (typeof message.dispatchTimestampUtc === "number")
                            object.dispatchTimestampUtc = options.longs === $String ? $String(message.dispatchTimestampUtc) : message.dispatchTimestampUtc;
                        else
                            object.dispatchTimestampUtc = options.longs === $String ? $util.Long.prototype.toString.call(message.dispatchTimestampUtc) : options.longs === $Number ? new $util.LongBits(message.dispatchTimestampUtc.low >>> 0, message.dispatchTimestampUtc.high >>> 0).toNumber() : message.dispatchTimestampUtc;
                    if (message.capabilityToken != null && $Object.hasOwnProperty.call(message, "capabilityToken"))
                        object.capabilityToken = message.capabilityToken;
                    if (message.cryptographicNonce != null && $Object.hasOwnProperty.call(message, "cryptographicNonce"))
                        object.cryptographicNonce = options.bytes === $String ? $util.base64.encode(message.cryptographicNonce, 0, message.cryptographicNonce.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.cryptographicNonce) : message.cryptographicNonce;
                    if (message.unicastMail != null && $Object.hasOwnProperty.call(message, "unicastMail")) {
                        object.unicastMail = $root.tendon.protocol.v3.UnicastMail.toObject(message.unicastMail, options, _depth + 1);
                        if (options.oneofs)
                            object.payload = "unicastMail";
                    }
                    if (message.multicastChat != null && $Object.hasOwnProperty.call(message, "multicastChat")) {
                        object.multicastChat = $root.tendon.protocol.v3.MulticastChat.toObject(message.multicastChat, options, _depth + 1);
                        if (options.oneofs)
                            object.payload = "multicastChat";
                    }
                    if (message.systemDirective != null && $Object.hasOwnProperty.call(message, "systemDirective")) {
                        object.systemDirective = $root.tendon.protocol.v3.SystemDirective.toObject(message.systemDirective, options, _depth + 1);
                        if (options.oneofs)
                            object.payload = "systemDirective";
                    }
                    return object;
                };

                /**
                 * Converts this TendonEnvelope to JSON.
                 * @function toJSON
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                TendonEnvelope.prototype.toJSON = function() {
                    return TendonEnvelope.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the type url for TendonEnvelope
                 * @function getTypeUrl
                 * @memberof tendon.protocol.v3.TendonEnvelope
                 * @static
                 * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns {string} The type url
                 */
                TendonEnvelope.getTypeUrl = function(prefix) {
                    if (prefix === $undefined)
                        prefix = "type.googleapis.com";
                    return prefix + "/tendon.protocol.v3.TendonEnvelope";
                };

                return TendonEnvelope;
            })();

            v3.UnicastMail = (function() {

                /**
                 * Properties of a UnicastMail.
                 * @typedef {Object} tendon.protocol.v3.UnicastMail.$Properties
                 * @property {string|null} [messageId] UnicastMail messageId
                 * @property {string|null} [threadId] UnicastMail threadId
                 * @property {string|null} [subject] UnicastMail subject
                 * @property {string|null} [bodyPlaintext] UnicastMail bodyPlaintext
                 * @property {Array.<string>|null} [ccRecipientsNpub] UnicastMail ccRecipientsNpub
                 * @property {Array.<tendon.protocol.v3.AttachmentMetadata.$Properties>|null} [attachments] UnicastMail attachments
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */

                /**
                 * Properties of a UnicastMail.
                 * @memberof tendon.protocol.v3
                 * @interface IUnicastMail
                 * @augments tendon.protocol.v3.UnicastMail.$Properties
                 * @deprecated Use tendon.protocol.v3.UnicastMail.$Properties instead.
                 */

                /**
                 * Shape of a UnicastMail.
                 * @typedef {tendon.protocol.v3.UnicastMail.$Properties} tendon.protocol.v3.UnicastMail.$Shape
                 */

                /**
                 * Constructs a new UnicastMail.
                 * @memberof tendon.protocol.v3
                 * @classdesc Represents a UnicastMail.
                 * @constructor
                 * @param {tendon.protocol.v3.UnicastMail.$Properties=} [properties] Properties to set
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */
                var UnicastMail = function (properties) {
                    this.ccRecipientsNpub = [];
                    this.attachments = [];
                    if (properties)
                        for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                };

                /**
                 * UnicastMail messageId.
                 * @member {string} messageId
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.messageId = "";

                /**
                 * UnicastMail threadId.
                 * @member {string} threadId
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.threadId = "";

                /**
                 * UnicastMail subject.
                 * @member {string} subject
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.subject = "";

                /**
                 * UnicastMail bodyPlaintext.
                 * @member {string} bodyPlaintext
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.bodyPlaintext = "";

                /**
                 * UnicastMail ccRecipientsNpub.
                 * @member {Array.<string>} ccRecipientsNpub
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.ccRecipientsNpub = $util.emptyArray;

                /**
                 * UnicastMail attachments.
                 * @member {Array.<tendon.protocol.v3.AttachmentMetadata.$Properties>} attachments
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 */
                UnicastMail.prototype.attachments = $util.emptyArray;

                /**
                 * Creates a new UnicastMail instance using the specified properties.
                 * @function create
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {tendon.protocol.v3.UnicastMail.$Properties=} [properties] Properties to set
                 * @returns {tendon.protocol.v3.UnicastMail} UnicastMail instance
                 * @type {{
                 *   (properties: tendon.protocol.v3.UnicastMail.$Shape): tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape;
                 *   (properties?: tendon.protocol.v3.UnicastMail.$Properties): tendon.protocol.v3.UnicastMail;
                 * }}
                 */
                UnicastMail.create = function(properties) {
                    return new UnicastMail(properties);
                };

                /**
                 * Encodes the specified UnicastMail message. Does not implicitly {@link tendon.protocol.v3.UnicastMail.verify|verify} messages.
                 * @function encode
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {tendon.protocol.v3.UnicastMail.$Properties} message UnicastMail message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnicastMail.encode = function (message, writer, _depth) {
                    if (!writer)
                        writer = $Writer.create();
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    if (message.messageId != null && $Object.hasOwnProperty.call(message, "messageId") && message.messageId !== "")
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
                    if (message.threadId != null && $Object.hasOwnProperty.call(message, "threadId") && message.threadId !== "")
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.threadId);
                    if (message.subject != null && $Object.hasOwnProperty.call(message, "subject") && message.subject !== "")
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.subject);
                    if (message.bodyPlaintext != null && $Object.hasOwnProperty.call(message, "bodyPlaintext") && message.bodyPlaintext !== "")
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.bodyPlaintext);
                    if (message.ccRecipientsNpub != null && message.ccRecipientsNpub.length)
                        for (var i = 0; i < message.ccRecipientsNpub.length; ++i)
                            writer.uint32(/* id 5, wireType 2 =*/42).string(message.ccRecipientsNpub[i]);
                    if (message.attachments != null && message.attachments.length)
                        for (var i = 0; i < message.attachments.length; ++i)
                            $root.tendon.protocol.v3.AttachmentMetadata.encode(message.attachments[i], writer.uint32(/* id 6, wireType 2 =*/50).fork(), _depth + 1).ldelim();
                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                        for (var i = 0; i < message.$unknowns.length; ++i)
                            writer.raw(message.$unknowns[i]);
                    return writer;
                };

                /**
                 * Encodes the specified UnicastMail message, length delimited. Does not implicitly {@link tendon.protocol.v3.UnicastMail.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {tendon.protocol.v3.UnicastMail.$Properties} message UnicastMail message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UnicastMail.encodeDelimited = function(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a UnicastMail message from the specified reader or buffer.
                 * @function decode
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape} UnicastMail
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UnicastMail.decode = function (reader, length, _end, _depth, _target) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $Reader.recursionLimit)
                        throw $Error("max depth exceeded");
                    var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.tendon.protocol.v3.UnicastMail(), value;
                    while (reader.pos < end) {
                        var start = reader.pos;
                        var tag = reader.tag();
                        if (tag === _end) {
                            _end = $undefined;
                            break;
                        }
                        var wireType = tag & 7;
                        switch (tag >>>= 3) {
                        case 1: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.messageId = value;
                                else
                                    delete message.messageId;
                                continue;
                            }
                        case 2: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.threadId = value;
                                else
                                    delete message.threadId;
                                continue;
                            }
                        case 3: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.subject = value;
                                else
                                    delete message.subject;
                                continue;
                            }
                        case 4: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.bodyPlaintext = value;
                                else
                                    delete message.bodyPlaintext;
                                continue;
                            }
                        case 5: {
                                if (wireType !== 2)
                                    break;
                                if (!(message.ccRecipientsNpub && message.ccRecipientsNpub.length))
                                    message.ccRecipientsNpub = [];
                                message.ccRecipientsNpub.push(reader.stringVerify());
                                continue;
                            }
                        case 6: {
                                if (wireType !== 2)
                                    break;
                                if (!(message.attachments && message.attachments.length))
                                    message.attachments = [];
                                message.attachments.push($root.tendon.protocol.v3.AttachmentMetadata.decode(reader, reader.uint32(), $undefined, _depth + 1));
                                continue;
                            }
                        }
                        reader.skipType(wireType, _depth, tag);
                        if (!reader.discardUnknown) {
                            $util.makeProp(message, "$unknowns", false);
                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                        }
                    }
                    if (_end !== $undefined)
                        throw $Error("missing end group");
                    return message;
                };

                /**
                 * Decodes a UnicastMail message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.UnicastMail & tendon.protocol.v3.UnicastMail.$Shape} UnicastMail
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UnicastMail.decodeDelimited = function(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a UnicastMail message.
                 * @function verify
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                UnicastMail.verify = function (message, _depth) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        return "max depth exceeded";
                    if (message.messageId != null && $Object.hasOwnProperty.call(message, "messageId"))
                        if (!$util.isString(message.messageId))
                            return "messageId: string expected";
                    if (message.threadId != null && $Object.hasOwnProperty.call(message, "threadId"))
                        if (!$util.isString(message.threadId))
                            return "threadId: string expected";
                    if (message.subject != null && $Object.hasOwnProperty.call(message, "subject"))
                        if (!$util.isString(message.subject))
                            return "subject: string expected";
                    if (message.bodyPlaintext != null && $Object.hasOwnProperty.call(message, "bodyPlaintext"))
                        if (!$util.isString(message.bodyPlaintext))
                            return "bodyPlaintext: string expected";
                    if (message.ccRecipientsNpub != null && $Object.hasOwnProperty.call(message, "ccRecipientsNpub")) {
                        if (!$Array.isArray(message.ccRecipientsNpub))
                            return "ccRecipientsNpub: array expected";
                        for (var i = 0; i < message.ccRecipientsNpub.length; ++i)
                            if (!$util.isString(message.ccRecipientsNpub[i]))
                                return "ccRecipientsNpub: string[] expected";
                    }
                    if (message.attachments != null && $Object.hasOwnProperty.call(message, "attachments")) {
                        if (!$Array.isArray(message.attachments))
                            return "attachments: array expected";
                        for (var i = 0; i < message.attachments.length; ++i) {
                            var error = $root.tendon.protocol.v3.AttachmentMetadata.verify(message.attachments[i], _depth + 1);
                            if (error)
                                return "attachments." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a UnicastMail message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {tendon.protocol.v3.UnicastMail} UnicastMail
                 */
                UnicastMail.fromObject = function (object, _depth) {
                    if (object instanceof $root.tendon.protocol.v3.UnicastMail)
                        return object;
                    if (!$util.isObject(object))
                        throw $TypeError(".tendon.protocol.v3.UnicastMail: object expected");
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var message = new $root.tendon.protocol.v3.UnicastMail();
                    if (object.messageId != null)
                        if (typeof object.messageId !== "string" || object.messageId.length)
                            message.messageId = $String(object.messageId);
                    if (object.threadId != null)
                        if (typeof object.threadId !== "string" || object.threadId.length)
                            message.threadId = $String(object.threadId);
                    if (object.subject != null)
                        if (typeof object.subject !== "string" || object.subject.length)
                            message.subject = $String(object.subject);
                    if (object.bodyPlaintext != null)
                        if (typeof object.bodyPlaintext !== "string" || object.bodyPlaintext.length)
                            message.bodyPlaintext = $String(object.bodyPlaintext);
                    if (object.ccRecipientsNpub) {
                        if (!$Array.isArray(object.ccRecipientsNpub))
                            throw $TypeError(".tendon.protocol.v3.UnicastMail.ccRecipientsNpub: array expected");
                        message.ccRecipientsNpub = $Array(object.ccRecipientsNpub.length);
                        for (var i = 0; i < object.ccRecipientsNpub.length; ++i)
                            message.ccRecipientsNpub[i] = $String(object.ccRecipientsNpub[i]);
                    }
                    if (object.attachments) {
                        if (!$Array.isArray(object.attachments))
                            throw $TypeError(".tendon.protocol.v3.UnicastMail.attachments: array expected");
                        message.attachments = $Array(object.attachments.length);
                        for (var i = 0; i < object.attachments.length; ++i) {
                            if (!$util.isObject(object.attachments[i]))
                                throw $TypeError(".tendon.protocol.v3.UnicastMail.attachments: object expected");
                            message.attachments[i] = $root.tendon.protocol.v3.AttachmentMetadata.fromObject(object.attachments[i], _depth + 1);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a UnicastMail message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {tendon.protocol.v3.UnicastMail} message UnicastMail
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UnicastMail.toObject = function (message, options, _depth) {
                    if (!options)
                        options = {};
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.ccRecipientsNpub = [];
                        object.attachments = [];
                    }
                    if (options.defaults) {
                        object.messageId = "";
                        object.threadId = "";
                        object.subject = "";
                        object.bodyPlaintext = "";
                    }
                    if (message.messageId != null && $Object.hasOwnProperty.call(message, "messageId"))
                        object.messageId = message.messageId;
                    if (message.threadId != null && $Object.hasOwnProperty.call(message, "threadId"))
                        object.threadId = message.threadId;
                    if (message.subject != null && $Object.hasOwnProperty.call(message, "subject"))
                        object.subject = message.subject;
                    if (message.bodyPlaintext != null && $Object.hasOwnProperty.call(message, "bodyPlaintext"))
                        object.bodyPlaintext = message.bodyPlaintext;
                    if (message.ccRecipientsNpub && message.ccRecipientsNpub.length) {
                        object.ccRecipientsNpub = $Array(message.ccRecipientsNpub.length);
                        for (var j = 0; j < message.ccRecipientsNpub.length; ++j)
                            object.ccRecipientsNpub[j] = message.ccRecipientsNpub[j];
                    }
                    if (message.attachments && message.attachments.length) {
                        object.attachments = $Array(message.attachments.length);
                        for (var j = 0; j < message.attachments.length; ++j)
                            object.attachments[j] = $root.tendon.protocol.v3.AttachmentMetadata.toObject(message.attachments[j], options, _depth + 1);
                    }
                    return object;
                };

                /**
                 * Converts this UnicastMail to JSON.
                 * @function toJSON
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                UnicastMail.prototype.toJSON = function() {
                    return UnicastMail.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the type url for UnicastMail
                 * @function getTypeUrl
                 * @memberof tendon.protocol.v3.UnicastMail
                 * @static
                 * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns {string} The type url
                 */
                UnicastMail.getTypeUrl = function(prefix) {
                    if (prefix === $undefined)
                        prefix = "type.googleapis.com";
                    return prefix + "/tendon.protocol.v3.UnicastMail";
                };

                return UnicastMail;
            })();

            v3.MulticastChat = (function() {

                /**
                 * Properties of a MulticastChat.
                 * @typedef {Object} tendon.protocol.v3.MulticastChat.$Properties
                 * @property {string|null} [groupId] MulticastChat groupId
                 * @property {number|Long|null} [groupEpoch] MulticastChat groupEpoch
                 * @property {string|null} [clientMessageId] MulticastChat clientMessageId
                 * @property {string|null} [bodyContent] MulticastChat bodyContent
                 * @property {Array.<string>|null} [interactiveMentions] MulticastChat interactiveMentions
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */

                /**
                 * Properties of a MulticastChat.
                 * @memberof tendon.protocol.v3
                 * @interface IMulticastChat
                 * @augments tendon.protocol.v3.MulticastChat.$Properties
                 * @deprecated Use tendon.protocol.v3.MulticastChat.$Properties instead.
                 */

                /**
                 * Shape of a MulticastChat.
                 * @typedef {tendon.protocol.v3.MulticastChat.$Properties} tendon.protocol.v3.MulticastChat.$Shape
                 */

                /**
                 * Constructs a new MulticastChat.
                 * @memberof tendon.protocol.v3
                 * @classdesc Represents a MulticastChat.
                 * @constructor
                 * @param {tendon.protocol.v3.MulticastChat.$Properties=} [properties] Properties to set
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */
                var MulticastChat = function (properties) {
                    this.interactiveMentions = [];
                    if (properties)
                        for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                };

                /**
                 * MulticastChat groupId.
                 * @member {string} groupId
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 */
                MulticastChat.prototype.groupId = "";

                /**
                 * MulticastChat groupEpoch.
                 * @member {number|Long} groupEpoch
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 */
                MulticastChat.prototype.groupEpoch = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * MulticastChat clientMessageId.
                 * @member {string} clientMessageId
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 */
                MulticastChat.prototype.clientMessageId = "";

                /**
                 * MulticastChat bodyContent.
                 * @member {string} bodyContent
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 */
                MulticastChat.prototype.bodyContent = "";

                /**
                 * MulticastChat interactiveMentions.
                 * @member {Array.<string>} interactiveMentions
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 */
                MulticastChat.prototype.interactiveMentions = $util.emptyArray;

                /**
                 * Creates a new MulticastChat instance using the specified properties.
                 * @function create
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {tendon.protocol.v3.MulticastChat.$Properties=} [properties] Properties to set
                 * @returns {tendon.protocol.v3.MulticastChat} MulticastChat instance
                 * @type {{
                 *   (properties: tendon.protocol.v3.MulticastChat.$Shape): tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape;
                 *   (properties?: tendon.protocol.v3.MulticastChat.$Properties): tendon.protocol.v3.MulticastChat;
                 * }}
                 */
                MulticastChat.create = function(properties) {
                    return new MulticastChat(properties);
                };

                /**
                 * Encodes the specified MulticastChat message. Does not implicitly {@link tendon.protocol.v3.MulticastChat.verify|verify} messages.
                 * @function encode
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {tendon.protocol.v3.MulticastChat.$Properties} message MulticastChat message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MulticastChat.encode = function (message, writer, _depth) {
                    if (!writer)
                        writer = $Writer.create();
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    if (message.groupId != null && $Object.hasOwnProperty.call(message, "groupId") && message.groupId !== "")
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.groupId);
                    if (message.groupEpoch != null && $Object.hasOwnProperty.call(message, "groupEpoch") && (typeof message.groupEpoch === "object" ? message.groupEpoch.low || message.groupEpoch.high : message.groupEpoch !== 0))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.groupEpoch);
                    if (message.clientMessageId != null && $Object.hasOwnProperty.call(message, "clientMessageId") && message.clientMessageId !== "")
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.clientMessageId);
                    if (message.bodyContent != null && $Object.hasOwnProperty.call(message, "bodyContent") && message.bodyContent !== "")
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.bodyContent);
                    if (message.interactiveMentions != null && message.interactiveMentions.length)
                        for (var i = 0; i < message.interactiveMentions.length; ++i)
                            writer.uint32(/* id 5, wireType 2 =*/42).string(message.interactiveMentions[i]);
                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                        for (var i = 0; i < message.$unknowns.length; ++i)
                            writer.raw(message.$unknowns[i]);
                    return writer;
                };

                /**
                 * Encodes the specified MulticastChat message, length delimited. Does not implicitly {@link tendon.protocol.v3.MulticastChat.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {tendon.protocol.v3.MulticastChat.$Properties} message MulticastChat message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                MulticastChat.encodeDelimited = function(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a MulticastChat message from the specified reader or buffer.
                 * @function decode
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape} MulticastChat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MulticastChat.decode = function (reader, length, _end, _depth, _target) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $Reader.recursionLimit)
                        throw $Error("max depth exceeded");
                    var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.tendon.protocol.v3.MulticastChat(), value;
                    while (reader.pos < end) {
                        var start = reader.pos;
                        var tag = reader.tag();
                        if (tag === _end) {
                            _end = $undefined;
                            break;
                        }
                        var wireType = tag & 7;
                        switch (tag >>>= 3) {
                        case 1: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.groupId = value;
                                else
                                    delete message.groupId;
                                continue;
                            }
                        case 2: {
                                if (wireType !== 0)
                                    break;
                                if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                                    message.groupEpoch = value;
                                else
                                    delete message.groupEpoch;
                                continue;
                            }
                        case 3: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.clientMessageId = value;
                                else
                                    delete message.clientMessageId;
                                continue;
                            }
                        case 4: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.bodyContent = value;
                                else
                                    delete message.bodyContent;
                                continue;
                            }
                        case 5: {
                                if (wireType !== 2)
                                    break;
                                if (!(message.interactiveMentions && message.interactiveMentions.length))
                                    message.interactiveMentions = [];
                                message.interactiveMentions.push(reader.stringVerify());
                                continue;
                            }
                        }
                        reader.skipType(wireType, _depth, tag);
                        if (!reader.discardUnknown) {
                            $util.makeProp(message, "$unknowns", false);
                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                        }
                    }
                    if (_end !== $undefined)
                        throw $Error("missing end group");
                    return message;
                };

                /**
                 * Decodes a MulticastChat message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.MulticastChat & tendon.protocol.v3.MulticastChat.$Shape} MulticastChat
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                MulticastChat.decodeDelimited = function(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a MulticastChat message.
                 * @function verify
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                MulticastChat.verify = function (message, _depth) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        return "max depth exceeded";
                    if (message.groupId != null && $Object.hasOwnProperty.call(message, "groupId"))
                        if (!$util.isString(message.groupId))
                            return "groupId: string expected";
                    if (message.groupEpoch != null && $Object.hasOwnProperty.call(message, "groupEpoch"))
                        if (!$util.isInteger(message.groupEpoch) && !(message.groupEpoch && $util.isInteger(message.groupEpoch.low) && $util.isInteger(message.groupEpoch.high)))
                            return "groupEpoch: integer|Long expected";
                    if (message.clientMessageId != null && $Object.hasOwnProperty.call(message, "clientMessageId"))
                        if (!$util.isString(message.clientMessageId))
                            return "clientMessageId: string expected";
                    if (message.bodyContent != null && $Object.hasOwnProperty.call(message, "bodyContent"))
                        if (!$util.isString(message.bodyContent))
                            return "bodyContent: string expected";
                    if (message.interactiveMentions != null && $Object.hasOwnProperty.call(message, "interactiveMentions")) {
                        if (!$Array.isArray(message.interactiveMentions))
                            return "interactiveMentions: array expected";
                        for (var i = 0; i < message.interactiveMentions.length; ++i)
                            if (!$util.isString(message.interactiveMentions[i]))
                                return "interactiveMentions: string[] expected";
                    }
                    return null;
                };

                /**
                 * Creates a MulticastChat message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {tendon.protocol.v3.MulticastChat} MulticastChat
                 */
                MulticastChat.fromObject = function (object, _depth) {
                    if (object instanceof $root.tendon.protocol.v3.MulticastChat)
                        return object;
                    if (!$util.isObject(object))
                        throw $TypeError(".tendon.protocol.v3.MulticastChat: object expected");
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var message = new $root.tendon.protocol.v3.MulticastChat();
                    if (object.groupId != null)
                        if (typeof object.groupId !== "string" || object.groupId.length)
                            message.groupId = $String(object.groupId);
                    if (object.groupEpoch != null)
                        if (typeof object.groupEpoch === "object" ? object.groupEpoch.low || object.groupEpoch.high : $Number(object.groupEpoch) !== 0)
                            if ($util.Long)
                                message.groupEpoch = $util.Long.fromValue(object.groupEpoch, true);
                            else if (typeof object.groupEpoch === "string")
                                message.groupEpoch = $parseInt(object.groupEpoch, 10);
                            else if (typeof object.groupEpoch === "number")
                                message.groupEpoch = object.groupEpoch;
                            else if (typeof object.groupEpoch === "object")
                                message.groupEpoch = new $util.LongBits(object.groupEpoch.low >>> 0, object.groupEpoch.high >>> 0).toNumber(true);
                    if (object.clientMessageId != null)
                        if (typeof object.clientMessageId !== "string" || object.clientMessageId.length)
                            message.clientMessageId = $String(object.clientMessageId);
                    if (object.bodyContent != null)
                        if (typeof object.bodyContent !== "string" || object.bodyContent.length)
                            message.bodyContent = $String(object.bodyContent);
                    if (object.interactiveMentions) {
                        if (!$Array.isArray(object.interactiveMentions))
                            throw $TypeError(".tendon.protocol.v3.MulticastChat.interactiveMentions: array expected");
                        message.interactiveMentions = $Array(object.interactiveMentions.length);
                        for (var i = 0; i < object.interactiveMentions.length; ++i)
                            message.interactiveMentions[i] = $String(object.interactiveMentions[i]);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a MulticastChat message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {tendon.protocol.v3.MulticastChat} message MulticastChat
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                MulticastChat.toObject = function (message, options, _depth) {
                    if (!options)
                        options = {};
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.interactiveMentions = [];
                    if (options.defaults) {
                        object.groupId = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.groupEpoch = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                        } else
                            object.groupEpoch = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                        object.clientMessageId = "";
                        object.bodyContent = "";
                    }
                    if (message.groupId != null && $Object.hasOwnProperty.call(message, "groupId"))
                        object.groupId = message.groupId;
                    if (message.groupEpoch != null && $Object.hasOwnProperty.call(message, "groupEpoch"))
                        if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                            object.groupEpoch = typeof message.groupEpoch === "number" ? $BigInt(message.groupEpoch) : $util.Long.fromBits(message.groupEpoch.low >>> 0, message.groupEpoch.high >>> 0, true).toBigInt();
                        else if (typeof message.groupEpoch === "number")
                            object.groupEpoch = options.longs === $String ? $String(message.groupEpoch) : message.groupEpoch;
                        else
                            object.groupEpoch = options.longs === $String ? $util.Long.prototype.toString.call(message.groupEpoch) : options.longs === $Number ? new $util.LongBits(message.groupEpoch.low >>> 0, message.groupEpoch.high >>> 0).toNumber(true) : message.groupEpoch;
                    if (message.clientMessageId != null && $Object.hasOwnProperty.call(message, "clientMessageId"))
                        object.clientMessageId = message.clientMessageId;
                    if (message.bodyContent != null && $Object.hasOwnProperty.call(message, "bodyContent"))
                        object.bodyContent = message.bodyContent;
                    if (message.interactiveMentions && message.interactiveMentions.length) {
                        object.interactiveMentions = $Array(message.interactiveMentions.length);
                        for (var j = 0; j < message.interactiveMentions.length; ++j)
                            object.interactiveMentions[j] = message.interactiveMentions[j];
                    }
                    return object;
                };

                /**
                 * Converts this MulticastChat to JSON.
                 * @function toJSON
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                MulticastChat.prototype.toJSON = function() {
                    return MulticastChat.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the type url for MulticastChat
                 * @function getTypeUrl
                 * @memberof tendon.protocol.v3.MulticastChat
                 * @static
                 * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns {string} The type url
                 */
                MulticastChat.getTypeUrl = function(prefix) {
                    if (prefix === $undefined)
                        prefix = "type.googleapis.com";
                    return prefix + "/tendon.protocol.v3.MulticastChat";
                };

                return MulticastChat;
            })();

            v3.AttachmentMetadata = (function() {

                /**
                 * Properties of an AttachmentMetadata.
                 * @typedef {Object} tendon.protocol.v3.AttachmentMetadata.$Properties
                 * @property {string|null} [contentAddressHash] AttachmentMetadata contentAddressHash
                 * @property {number|Long|null} [storageSizeBytes] AttachmentMetadata storageSizeBytes
                 * @property {string|null} [fileMimeType] AttachmentMetadata fileMimeType
                 * @property {string|null} [distributedUrlHint] AttachmentMetadata distributedUrlHint
                 * @property {Uint8Array|null} [fileDecryptionKey] AttachmentMetadata fileDecryptionKey
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */

                /**
                 * Properties of an AttachmentMetadata.
                 * @memberof tendon.protocol.v3
                 * @interface IAttachmentMetadata
                 * @augments tendon.protocol.v3.AttachmentMetadata.$Properties
                 * @deprecated Use tendon.protocol.v3.AttachmentMetadata.$Properties instead.
                 */

                /**
                 * Shape of an AttachmentMetadata.
                 * @typedef {tendon.protocol.v3.AttachmentMetadata.$Properties} tendon.protocol.v3.AttachmentMetadata.$Shape
                 */

                /**
                 * Constructs a new AttachmentMetadata.
                 * @memberof tendon.protocol.v3
                 * @classdesc Represents an AttachmentMetadata.
                 * @constructor
                 * @param {tendon.protocol.v3.AttachmentMetadata.$Properties=} [properties] Properties to set
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */
                var AttachmentMetadata = function (properties) {
                    if (properties)
                        for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                };

                /**
                 * AttachmentMetadata contentAddressHash.
                 * @member {string} contentAddressHash
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 */
                AttachmentMetadata.prototype.contentAddressHash = "";

                /**
                 * AttachmentMetadata storageSizeBytes.
                 * @member {number|Long} storageSizeBytes
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 */
                AttachmentMetadata.prototype.storageSizeBytes = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * AttachmentMetadata fileMimeType.
                 * @member {string} fileMimeType
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 */
                AttachmentMetadata.prototype.fileMimeType = "";

                /**
                 * AttachmentMetadata distributedUrlHint.
                 * @member {string} distributedUrlHint
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 */
                AttachmentMetadata.prototype.distributedUrlHint = "";

                /**
                 * AttachmentMetadata fileDecryptionKey.
                 * @member {Uint8Array} fileDecryptionKey
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 */
                AttachmentMetadata.prototype.fileDecryptionKey = $util.newBuffer([]);

                /**
                 * Creates a new AttachmentMetadata instance using the specified properties.
                 * @function create
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {tendon.protocol.v3.AttachmentMetadata.$Properties=} [properties] Properties to set
                 * @returns {tendon.protocol.v3.AttachmentMetadata} AttachmentMetadata instance
                 * @type {{
                 *   (properties: tendon.protocol.v3.AttachmentMetadata.$Shape): tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape;
                 *   (properties?: tendon.protocol.v3.AttachmentMetadata.$Properties): tendon.protocol.v3.AttachmentMetadata;
                 * }}
                 */
                AttachmentMetadata.create = function(properties) {
                    return new AttachmentMetadata(properties);
                };

                /**
                 * Encodes the specified AttachmentMetadata message. Does not implicitly {@link tendon.protocol.v3.AttachmentMetadata.verify|verify} messages.
                 * @function encode
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {tendon.protocol.v3.AttachmentMetadata.$Properties} message AttachmentMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AttachmentMetadata.encode = function (message, writer, _depth) {
                    if (!writer)
                        writer = $Writer.create();
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    if (message.contentAddressHash != null && $Object.hasOwnProperty.call(message, "contentAddressHash") && message.contentAddressHash !== "")
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.contentAddressHash);
                    if (message.storageSizeBytes != null && $Object.hasOwnProperty.call(message, "storageSizeBytes") && (typeof message.storageSizeBytes === "object" ? message.storageSizeBytes.low || message.storageSizeBytes.high : message.storageSizeBytes !== 0))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.storageSizeBytes);
                    if (message.fileMimeType != null && $Object.hasOwnProperty.call(message, "fileMimeType") && message.fileMimeType !== "")
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.fileMimeType);
                    if (message.distributedUrlHint != null && $Object.hasOwnProperty.call(message, "distributedUrlHint") && message.distributedUrlHint !== "")
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.distributedUrlHint);
                    if (message.fileDecryptionKey != null && $Object.hasOwnProperty.call(message, "fileDecryptionKey") && message.fileDecryptionKey.length)
                        writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.fileDecryptionKey);
                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                        for (var i = 0; i < message.$unknowns.length; ++i)
                            writer.raw(message.$unknowns[i]);
                    return writer;
                };

                /**
                 * Encodes the specified AttachmentMetadata message, length delimited. Does not implicitly {@link tendon.protocol.v3.AttachmentMetadata.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {tendon.protocol.v3.AttachmentMetadata.$Properties} message AttachmentMetadata message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AttachmentMetadata.encodeDelimited = function(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes an AttachmentMetadata message from the specified reader or buffer.
                 * @function decode
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape} AttachmentMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AttachmentMetadata.decode = function (reader, length, _end, _depth, _target) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $Reader.recursionLimit)
                        throw $Error("max depth exceeded");
                    var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.tendon.protocol.v3.AttachmentMetadata(), value;
                    while (reader.pos < end) {
                        var start = reader.pos;
                        var tag = reader.tag();
                        if (tag === _end) {
                            _end = $undefined;
                            break;
                        }
                        var wireType = tag & 7;
                        switch (tag >>>= 3) {
                        case 1: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.contentAddressHash = value;
                                else
                                    delete message.contentAddressHash;
                                continue;
                            }
                        case 2: {
                                if (wireType !== 0)
                                    break;
                                if (typeof (value = reader.uint64()) === "object" ? value.low || value.high : value !== 0)
                                    message.storageSizeBytes = value;
                                else
                                    delete message.storageSizeBytes;
                                continue;
                            }
                        case 3: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.fileMimeType = value;
                                else
                                    delete message.fileMimeType;
                                continue;
                            }
                        case 4: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.stringVerify()).length)
                                    message.distributedUrlHint = value;
                                else
                                    delete message.distributedUrlHint;
                                continue;
                            }
                        case 5: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.bytes()).length)
                                    message.fileDecryptionKey = value;
                                else
                                    delete message.fileDecryptionKey;
                                continue;
                            }
                        }
                        reader.skipType(wireType, _depth, tag);
                        if (!reader.discardUnknown) {
                            $util.makeProp(message, "$unknowns", false);
                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                        }
                    }
                    if (_end !== $undefined)
                        throw $Error("missing end group");
                    return message;
                };

                /**
                 * Decodes an AttachmentMetadata message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.AttachmentMetadata & tendon.protocol.v3.AttachmentMetadata.$Shape} AttachmentMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AttachmentMetadata.decodeDelimited = function(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AttachmentMetadata message.
                 * @function verify
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AttachmentMetadata.verify = function (message, _depth) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        return "max depth exceeded";
                    if (message.contentAddressHash != null && $Object.hasOwnProperty.call(message, "contentAddressHash"))
                        if (!$util.isString(message.contentAddressHash))
                            return "contentAddressHash: string expected";
                    if (message.storageSizeBytes != null && $Object.hasOwnProperty.call(message, "storageSizeBytes"))
                        if (!$util.isInteger(message.storageSizeBytes) && !(message.storageSizeBytes && $util.isInteger(message.storageSizeBytes.low) && $util.isInteger(message.storageSizeBytes.high)))
                            return "storageSizeBytes: integer|Long expected";
                    if (message.fileMimeType != null && $Object.hasOwnProperty.call(message, "fileMimeType"))
                        if (!$util.isString(message.fileMimeType))
                            return "fileMimeType: string expected";
                    if (message.distributedUrlHint != null && $Object.hasOwnProperty.call(message, "distributedUrlHint"))
                        if (!$util.isString(message.distributedUrlHint))
                            return "distributedUrlHint: string expected";
                    if (message.fileDecryptionKey != null && $Object.hasOwnProperty.call(message, "fileDecryptionKey"))
                        if (!(message.fileDecryptionKey && typeof message.fileDecryptionKey.length === "number" || $util.isString(message.fileDecryptionKey)))
                            return "fileDecryptionKey: buffer expected";
                    return null;
                };

                /**
                 * Creates an AttachmentMetadata message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {tendon.protocol.v3.AttachmentMetadata} AttachmentMetadata
                 */
                AttachmentMetadata.fromObject = function (object, _depth) {
                    if (object instanceof $root.tendon.protocol.v3.AttachmentMetadata)
                        return object;
                    if (!$util.isObject(object))
                        throw $TypeError(".tendon.protocol.v3.AttachmentMetadata: object expected");
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var message = new $root.tendon.protocol.v3.AttachmentMetadata();
                    if (object.contentAddressHash != null)
                        if (typeof object.contentAddressHash !== "string" || object.contentAddressHash.length)
                            message.contentAddressHash = $String(object.contentAddressHash);
                    if (object.storageSizeBytes != null)
                        if (typeof object.storageSizeBytes === "object" ? object.storageSizeBytes.low || object.storageSizeBytes.high : $Number(object.storageSizeBytes) !== 0)
                            if ($util.Long)
                                message.storageSizeBytes = $util.Long.fromValue(object.storageSizeBytes, true);
                            else if (typeof object.storageSizeBytes === "string")
                                message.storageSizeBytes = $parseInt(object.storageSizeBytes, 10);
                            else if (typeof object.storageSizeBytes === "number")
                                message.storageSizeBytes = object.storageSizeBytes;
                            else if (typeof object.storageSizeBytes === "object")
                                message.storageSizeBytes = new $util.LongBits(object.storageSizeBytes.low >>> 0, object.storageSizeBytes.high >>> 0).toNumber(true);
                    if (object.fileMimeType != null)
                        if (typeof object.fileMimeType !== "string" || object.fileMimeType.length)
                            message.fileMimeType = $String(object.fileMimeType);
                    if (object.distributedUrlHint != null)
                        if (typeof object.distributedUrlHint !== "string" || object.distributedUrlHint.length)
                            message.distributedUrlHint = $String(object.distributedUrlHint);
                    if (object.fileDecryptionKey != null)
                        if (object.fileDecryptionKey.length)
                            if (typeof object.fileDecryptionKey === "string")
                                $util.base64.decode(object.fileDecryptionKey, message.fileDecryptionKey = $util.newBuffer($util.base64.length(object.fileDecryptionKey)), 0);
                            else if (object.fileDecryptionKey.length >= 0)
                                message.fileDecryptionKey = object.fileDecryptionKey;
                    return message;
                };

                /**
                 * Creates a plain object from an AttachmentMetadata message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {tendon.protocol.v3.AttachmentMetadata} message AttachmentMetadata
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AttachmentMetadata.toObject = function (message, options, _depth) {
                    if (!options)
                        options = {};
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.contentAddressHash = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.storageSizeBytes = options.longs === $String ? long.toString() : options.longs === $Number ? long.toNumber() : typeof $BigInt !== "undefined" && options.longs === $BigInt ? long.toBigInt() : long;
                        } else
                            object.storageSizeBytes = options.longs === $String ? "0" : typeof $BigInt !== "undefined" && options.longs === $BigInt ? $BigInt("0") : 0;
                        object.fileMimeType = "";
                        object.distributedUrlHint = "";
                        if (options.bytes === $String)
                            object.fileDecryptionKey = "";
                        else {
                            object.fileDecryptionKey = [];
                            if (options.bytes !== $Array)
                                object.fileDecryptionKey = $util.newBuffer(object.fileDecryptionKey);
                        }
                    }
                    if (message.contentAddressHash != null && $Object.hasOwnProperty.call(message, "contentAddressHash"))
                        object.contentAddressHash = message.contentAddressHash;
                    if (message.storageSizeBytes != null && $Object.hasOwnProperty.call(message, "storageSizeBytes"))
                        if (typeof $BigInt !== "undefined" && options.longs === $BigInt)
                            object.storageSizeBytes = typeof message.storageSizeBytes === "number" ? $BigInt(message.storageSizeBytes) : $util.Long.fromBits(message.storageSizeBytes.low >>> 0, message.storageSizeBytes.high >>> 0, true).toBigInt();
                        else if (typeof message.storageSizeBytes === "number")
                            object.storageSizeBytes = options.longs === $String ? $String(message.storageSizeBytes) : message.storageSizeBytes;
                        else
                            object.storageSizeBytes = options.longs === $String ? $util.Long.prototype.toString.call(message.storageSizeBytes) : options.longs === $Number ? new $util.LongBits(message.storageSizeBytes.low >>> 0, message.storageSizeBytes.high >>> 0).toNumber(true) : message.storageSizeBytes;
                    if (message.fileMimeType != null && $Object.hasOwnProperty.call(message, "fileMimeType"))
                        object.fileMimeType = message.fileMimeType;
                    if (message.distributedUrlHint != null && $Object.hasOwnProperty.call(message, "distributedUrlHint"))
                        object.distributedUrlHint = message.distributedUrlHint;
                    if (message.fileDecryptionKey != null && $Object.hasOwnProperty.call(message, "fileDecryptionKey"))
                        object.fileDecryptionKey = options.bytes === $String ? $util.base64.encode(message.fileDecryptionKey, 0, message.fileDecryptionKey.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.fileDecryptionKey) : message.fileDecryptionKey;
                    return object;
                };

                /**
                 * Converts this AttachmentMetadata to JSON.
                 * @function toJSON
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AttachmentMetadata.prototype.toJSON = function() {
                    return AttachmentMetadata.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the type url for AttachmentMetadata
                 * @function getTypeUrl
                 * @memberof tendon.protocol.v3.AttachmentMetadata
                 * @static
                 * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns {string} The type url
                 */
                AttachmentMetadata.getTypeUrl = function(prefix) {
                    if (prefix === $undefined)
                        prefix = "type.googleapis.com";
                    return prefix + "/tendon.protocol.v3.AttachmentMetadata";
                };

                return AttachmentMetadata;
            })();

            v3.SystemDirective = (function() {

                /**
                 * Properties of a SystemDirective.
                 * @typedef {Object} tendon.protocol.v3.SystemDirective.$Properties
                 * @property {tendon.protocol.v3.SystemDirective.CommandType|null} [command] SystemDirective command
                 * @property {Uint8Array|null} [payloadBytes] SystemDirective payloadBytes
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */

                /**
                 * Properties of a SystemDirective.
                 * @memberof tendon.protocol.v3
                 * @interface ISystemDirective
                 * @augments tendon.protocol.v3.SystemDirective.$Properties
                 * @deprecated Use tendon.protocol.v3.SystemDirective.$Properties instead.
                 */

                /**
                 * Shape of a SystemDirective.
                 * @typedef {tendon.protocol.v3.SystemDirective.$Properties} tendon.protocol.v3.SystemDirective.$Shape
                 */

                /**
                 * Constructs a new SystemDirective.
                 * @memberof tendon.protocol.v3
                 * @classdesc Represents a SystemDirective.
                 * @constructor
                 * @param {tendon.protocol.v3.SystemDirective.$Properties=} [properties] Properties to set
                 * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
                 */
                var SystemDirective = function (properties) {
                    if (properties)
                        for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null && keys[i] !== "__proto__")
                                this[keys[i]] = properties[keys[i]];
                };

                /**
                 * SystemDirective command.
                 * @member {tendon.protocol.v3.SystemDirective.CommandType} command
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @instance
                 */
                SystemDirective.prototype.command = 0;

                /**
                 * SystemDirective payloadBytes.
                 * @member {Uint8Array} payloadBytes
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @instance
                 */
                SystemDirective.prototype.payloadBytes = $util.newBuffer([]);

                /**
                 * Creates a new SystemDirective instance using the specified properties.
                 * @function create
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {tendon.protocol.v3.SystemDirective.$Properties=} [properties] Properties to set
                 * @returns {tendon.protocol.v3.SystemDirective} SystemDirective instance
                 * @type {{
                 *   (properties: tendon.protocol.v3.SystemDirective.$Shape): tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape;
                 *   (properties?: tendon.protocol.v3.SystemDirective.$Properties): tendon.protocol.v3.SystemDirective;
                 * }}
                 */
                SystemDirective.create = function(properties) {
                    return new SystemDirective(properties);
                };

                /**
                 * Encodes the specified SystemDirective message. Does not implicitly {@link tendon.protocol.v3.SystemDirective.verify|verify} messages.
                 * @function encode
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {tendon.protocol.v3.SystemDirective.$Properties} message SystemDirective message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SystemDirective.encode = function (message, writer, _depth) {
                    if (!writer)
                        writer = $Writer.create();
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    if (message.command != null && $Object.hasOwnProperty.call(message, "command") && message.command !== 0)
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.command);
                    if (message.payloadBytes != null && $Object.hasOwnProperty.call(message, "payloadBytes") && message.payloadBytes.length)
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.payloadBytes);
                    if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                        for (var i = 0; i < message.$unknowns.length; ++i)
                            writer.raw(message.$unknowns[i]);
                    return writer;
                };

                /**
                 * Encodes the specified SystemDirective message, length delimited. Does not implicitly {@link tendon.protocol.v3.SystemDirective.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {tendon.protocol.v3.SystemDirective.$Properties} message SystemDirective message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SystemDirective.encodeDelimited = function(message, writer) {
                    return this.encode(message, writer && writer.len ? writer.fork() : writer).ldelim();
                };

                /**
                 * Decodes a SystemDirective message from the specified reader or buffer.
                 * @function decode
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape} SystemDirective
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SystemDirective.decode = function (reader, length, _end, _depth, _target) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $Reader.recursionLimit)
                        throw $Error("max depth exceeded");
                    var end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.tendon.protocol.v3.SystemDirective(), value;
                    while (reader.pos < end) {
                        var start = reader.pos;
                        var tag = reader.tag();
                        if (tag === _end) {
                            _end = $undefined;
                            break;
                        }
                        var wireType = tag & 7;
                        switch (tag >>>= 3) {
                        case 1: {
                                if (wireType !== 0)
                                    break;
                                if (value = reader.int32())
                                    message.command = value;
                                else
                                    delete message.command;
                                continue;
                            }
                        case 2: {
                                if (wireType !== 2)
                                    break;
                                if ((value = reader.bytes()).length)
                                    message.payloadBytes = value;
                                else
                                    delete message.payloadBytes;
                                continue;
                            }
                        }
                        reader.skipType(wireType, _depth, tag);
                        if (!reader.discardUnknown) {
                            $util.makeProp(message, "$unknowns", false);
                            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                        }
                    }
                    if (_end !== $undefined)
                        throw $Error("missing end group");
                    return message;
                };

                /**
                 * Decodes a SystemDirective message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {tendon.protocol.v3.SystemDirective & tendon.protocol.v3.SystemDirective.$Shape} SystemDirective
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SystemDirective.decodeDelimited = function(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a SystemDirective message.
                 * @function verify
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SystemDirective.verify = function (message, _depth) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        return "max depth exceeded";
                    if (message.command != null && $Object.hasOwnProperty.call(message, "command"))
                        if (typeof message.command !== "number" || (message.command | 0) !== message.command)
                            return "command: enum value expected";
                    if (message.payloadBytes != null && $Object.hasOwnProperty.call(message, "payloadBytes"))
                        if (!(message.payloadBytes && typeof message.payloadBytes.length === "number" || $util.isString(message.payloadBytes)))
                            return "payloadBytes: buffer expected";
                    return null;
                };

                /**
                 * Creates a SystemDirective message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {tendon.protocol.v3.SystemDirective} SystemDirective
                 */
                SystemDirective.fromObject = function (object, _depth) {
                    if (object instanceof $root.tendon.protocol.v3.SystemDirective)
                        return object;
                    if (!$util.isObject(object))
                        throw $TypeError(".tendon.protocol.v3.SystemDirective: object expected");
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var message = new $root.tendon.protocol.v3.SystemDirective();
                    if (object.command !== 0 && (typeof object.command !== "string" || $root.tendon.protocol.v3.SystemDirective.CommandType[object.command] !== 0))
                        switch (object.command) {
                        case "UNKNOWN":
                        case 0:
                            message.command = 0;
                            break;
                        case "KEY_ROTATION_NOTICE":
                        case 1:
                            message.command = 1;
                            break;
                        case "CAPABILITY_REVOCATION":
                        case 2:
                            message.command = 2;
                            break;
                        case "GROUP_MEMBERSHIP_SYNC":
                        case 3:
                            message.command = 3;
                            break;
                        case "EPOCH_COMMIT":
                        case 4:
                            message.command = 4;
                            break;
                        default:
                            if (typeof object.command === "number" && (object.command | 0) === object.command)
                                message.command = object.command;
                        }
                    if (object.payloadBytes != null)
                        if (object.payloadBytes.length)
                            if (typeof object.payloadBytes === "string")
                                $util.base64.decode(object.payloadBytes, message.payloadBytes = $util.newBuffer($util.base64.length(object.payloadBytes)), 0);
                            else if (object.payloadBytes.length >= 0)
                                message.payloadBytes = object.payloadBytes;
                    return message;
                };

                /**
                 * Creates a plain object from a SystemDirective message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {tendon.protocol.v3.SystemDirective} message SystemDirective
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SystemDirective.toObject = function (message, options, _depth) {
                    if (!options)
                        options = {};
                    if (_depth === $undefined)
                        _depth = 0;
                    if (_depth > $util.recursionLimit)
                        throw $Error("max depth exceeded");
                    var object = {};
                    if (options.defaults) {
                        object.command = options.enums === $String ? "UNKNOWN" : 0;
                        if (options.bytes === $String)
                            object.payloadBytes = "";
                        else {
                            object.payloadBytes = [];
                            if (options.bytes !== $Array)
                                object.payloadBytes = $util.newBuffer(object.payloadBytes);
                        }
                    }
                    if (message.command != null && $Object.hasOwnProperty.call(message, "command"))
                        object.command = options.enums === $String ? $root.tendon.protocol.v3.SystemDirective.CommandType[message.command] === $undefined ? message.command : $root.tendon.protocol.v3.SystemDirective.CommandType[message.command] : message.command;
                    if (message.payloadBytes != null && $Object.hasOwnProperty.call(message, "payloadBytes"))
                        object.payloadBytes = options.bytes === $String ? $util.base64.encode(message.payloadBytes, 0, message.payloadBytes.length) : options.bytes === $Array ? $Array.prototype.slice.call(message.payloadBytes) : message.payloadBytes;
                    return object;
                };

                /**
                 * Converts this SystemDirective to JSON.
                 * @function toJSON
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SystemDirective.prototype.toJSON = function() {
                    return SystemDirective.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the type url for SystemDirective
                 * @function getTypeUrl
                 * @memberof tendon.protocol.v3.SystemDirective
                 * @static
                 * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
                 * @returns {string} The type url
                 */
                SystemDirective.getTypeUrl = function(prefix) {
                    if (prefix === $undefined)
                        prefix = "type.googleapis.com";
                    return prefix + "/tendon.protocol.v3.SystemDirective";
                };

                /**
                 * CommandType enum.
                 * @name tendon.protocol.v3.SystemDirective.CommandType
                 * @enum {number}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} KEY_ROTATION_NOTICE=1 KEY_ROTATION_NOTICE value
                 * @property {number} CAPABILITY_REVOCATION=2 CAPABILITY_REVOCATION value
                 * @property {number} GROUP_MEMBERSHIP_SYNC=3 GROUP_MEMBERSHIP_SYNC value
                 * @property {number} EPOCH_COMMIT=4 EPOCH_COMMIT value
                 */
                SystemDirective.CommandType = (function() {
                    var valuesById = $Object.create(null), values = $Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "KEY_ROTATION_NOTICE"] = 1;
                    values[valuesById[2] = "CAPABILITY_REVOCATION"] = 2;
                    values[valuesById[3] = "GROUP_MEMBERSHIP_SYNC"] = 3;
                    values[valuesById[4] = "EPOCH_COMMIT"] = 4;
                    return values;
                })();

                return SystemDirective;
            })();

            return v3;
        })();

        return protocol;
    })();

    return tendon;
})();

module.exports = $root;
