/* eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, camelcase, default-case-last, no-mixed-operators */
import * as $protobuf from 'protobufjs/minimal'

const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util

const $root = $protobuf.roots.default || ($protobuf.roots.default = {})

export const PB_App = $root.PB_App = (() => {
  const PB_App = {}

  PB_App.StartRequest = (function () {
    function StartRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StartRequest.prototype.name = ''
    StartRequest.prototype.args = ''

    StartRequest.create = function create (properties) {
      return new StartRequest(properties)
    }

    StartRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.name != null && Object.hasOwnProperty.call(message, 'name')) { writer.uint32(10).string(message.name) }
      if (message.args != null && Object.hasOwnProperty.call(message, 'args')) { writer.uint32(18).string(message.args) }
      return writer
    }

    StartRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StartRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.StartRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.name = reader.string()
            break
          case 2:
            message.args = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StartRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StartRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.name != null && message.hasOwnProperty('name')) {
        if (!$util.isString(message.name)) { return 'name: string expected' }
      }
      if (message.args != null && message.hasOwnProperty('args')) {
        if (!$util.isString(message.args)) { return 'args: string expected' }
      }
      return null
    }

    StartRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.StartRequest) { return object }
      const message = new $root.PB_App.StartRequest()
      if (object.name != null) { message.name = String(object.name) }
      if (object.args != null) { message.args = String(object.args) }
      return message
    }

    StartRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.name = ''
        object.args = ''
      }
      if (message.name != null && message.hasOwnProperty('name')) { object.name = message.name }
      if (message.args != null && message.hasOwnProperty('args')) { object.args = message.args }
      return object
    }

    StartRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StartRequest
  })()

  PB_App.LockStatusRequest = (function () {
    function LockStatusRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    LockStatusRequest.create = function create (properties) {
      return new LockStatusRequest(properties)
    }

    LockStatusRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    LockStatusRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    LockStatusRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.LockStatusRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    LockStatusRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    LockStatusRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    LockStatusRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.LockStatusRequest) { return object }
      return new $root.PB_App.LockStatusRequest()
    }

    LockStatusRequest.toObject = function toObject () {
      return {}
    }

    LockStatusRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return LockStatusRequest
  })()

  PB_App.LockStatusResponse = (function () {
    function LockStatusResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    LockStatusResponse.prototype.locked = false

    LockStatusResponse.create = function create (properties) {
      return new LockStatusResponse(properties)
    }

    LockStatusResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.locked != null && Object.hasOwnProperty.call(message, 'locked')) { writer.uint32(8).bool(message.locked) }
      return writer
    }

    LockStatusResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    LockStatusResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.LockStatusResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.locked = reader.bool()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    LockStatusResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    LockStatusResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.locked != null && message.hasOwnProperty('locked')) {
        if (typeof message.locked !== 'boolean') { return 'locked: boolean expected' }
      }
      return null
    }

    LockStatusResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.LockStatusResponse) { return object }
      const message = new $root.PB_App.LockStatusResponse()
      if (object.locked != null) { message.locked = Boolean(object.locked) }
      return message
    }

    LockStatusResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.locked = false }
      if (message.locked != null && message.hasOwnProperty('locked')) { object.locked = message.locked }
      return object
    }

    LockStatusResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return LockStatusResponse
  })()

  PB_App.AppExitRequest = (function () {
    function AppExitRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    AppExitRequest.create = function create (properties) {
      return new AppExitRequest(properties)
    }

    AppExitRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    AppExitRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    AppExitRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.AppExitRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    AppExitRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    AppExitRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    AppExitRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.AppExitRequest) { return object }
      return new $root.PB_App.AppExitRequest()
    }

    AppExitRequest.toObject = function toObject () {
      return {}
    }

    AppExitRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return AppExitRequest
  })()

  PB_App.AppLoadFileRequest = (function () {
    function AppLoadFileRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    AppLoadFileRequest.prototype.path = ''

    AppLoadFileRequest.create = function create (properties) {
      return new AppLoadFileRequest(properties)
    }

    AppLoadFileRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    AppLoadFileRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    AppLoadFileRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.AppLoadFileRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    AppLoadFileRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    AppLoadFileRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    AppLoadFileRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.AppLoadFileRequest) { return object }
      const message = new $root.PB_App.AppLoadFileRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    AppLoadFileRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    AppLoadFileRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return AppLoadFileRequest
  })()

  PB_App.AppButtonPressRequest = (function () {
    function AppButtonPressRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    AppButtonPressRequest.prototype.args = ''
    AppButtonPressRequest.prototype.index = 0

    AppButtonPressRequest.create = function create (properties) {
      return new AppButtonPressRequest(properties)
    }

    AppButtonPressRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.args != null && Object.hasOwnProperty.call(message, 'args')) { writer.uint32(10).string(message.args) }
      if (message.index != null && Object.hasOwnProperty.call(message, 'index')) { writer.uint32(16).int32(message.index) }
      return writer
    }

    AppButtonPressRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    AppButtonPressRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.AppButtonPressRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.args = reader.string()
            break
          case 2:
            message.index = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    AppButtonPressRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    AppButtonPressRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.args != null && message.hasOwnProperty('args')) {
        if (!$util.isString(message.args)) { return 'args: string expected' }
      }
      if (message.index != null && message.hasOwnProperty('index')) {
        if (!$util.isInteger(message.index)) { return 'index: integer expected' }
      }
      return null
    }

    AppButtonPressRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.AppButtonPressRequest) { return object }
      const message = new $root.PB_App.AppButtonPressRequest()
      if (object.args != null) { message.args = String(object.args) }
      if (object.index != null) { message.index = object.index | 0 }
      return message
    }

    AppButtonPressRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.args = ''
        object.index = 0
      }
      if (message.args != null && message.hasOwnProperty('args')) { object.args = message.args }
      if (message.index != null && message.hasOwnProperty('index')) { object.index = message.index }
      return object
    }

    AppButtonPressRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return AppButtonPressRequest
  })()

  PB_App.AppButtonReleaseRequest = (function () {
    function AppButtonReleaseRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    AppButtonReleaseRequest.create = function create (properties) {
      return new AppButtonReleaseRequest(properties)
    }

    AppButtonReleaseRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    AppButtonReleaseRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    AppButtonReleaseRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.AppButtonReleaseRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    AppButtonReleaseRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    AppButtonReleaseRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    AppButtonReleaseRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.AppButtonReleaseRequest) { return object }
      return new $root.PB_App.AppButtonReleaseRequest()
    }

    AppButtonReleaseRequest.toObject = function toObject () {
      return {}
    }

    AppButtonReleaseRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return AppButtonReleaseRequest
  })()

  PB_App.AppState = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'APP_CLOSED'] = 0
    values[valuesById[1] = 'APP_STARTED'] = 1
    return values
  })()

  PB_App.AppStateResponse = (function () {
    function AppStateResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    AppStateResponse.prototype.state = 0

    AppStateResponse.create = function create (properties) {
      return new AppStateResponse(properties)
    }

    AppStateResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.state != null && Object.hasOwnProperty.call(message, 'state')) { writer.uint32(8).int32(message.state) }
      return writer
    }

    AppStateResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    AppStateResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.AppStateResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.state = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    AppStateResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    AppStateResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.state != null && message.hasOwnProperty('state')) {
        switch (message.state) {
          default:
            return 'state: enum value expected'
          case 0:
          case 1:
            break
        }
      }
      return null
    }

    AppStateResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.AppStateResponse) { return object }
      const message = new $root.PB_App.AppStateResponse()
      switch (object.state) {
        case 'APP_CLOSED':
        case 0:
          message.state = 0
          break
        case 'APP_STARTED':
        case 1:
          message.state = 1
          break
      }
      return message
    }

    AppStateResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.state = options.enums === String ? 'APP_CLOSED' : 0 }
      if (message.state != null && message.hasOwnProperty('state')) { object.state = options.enums === String ? $root.PB_App.AppState[message.state] : message.state }
      return object
    }

    AppStateResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return AppStateResponse
  })()

  PB_App.GetErrorRequest = (function () {
    function GetErrorRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetErrorRequest.create = function create (properties) {
      return new GetErrorRequest(properties)
    }

    GetErrorRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    GetErrorRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetErrorRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.GetErrorRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetErrorRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetErrorRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    GetErrorRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.GetErrorRequest) { return object }
      return new $root.PB_App.GetErrorRequest()
    }

    GetErrorRequest.toObject = function toObject () {
      return {}
    }

    GetErrorRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetErrorRequest
  })()

  PB_App.GetErrorResponse = (function () {
    function GetErrorResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetErrorResponse.prototype.code = 0
    GetErrorResponse.prototype.text = ''

    GetErrorResponse.create = function create (properties) {
      return new GetErrorResponse(properties)
    }

    GetErrorResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.code != null && Object.hasOwnProperty.call(message, 'code')) { writer.uint32(8).uint32(message.code) }
      if (message.text != null && Object.hasOwnProperty.call(message, 'text')) { writer.uint32(18).string(message.text) }
      return writer
    }

    GetErrorResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetErrorResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.GetErrorResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.code = reader.uint32()
            break
          case 2:
            message.text = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetErrorResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetErrorResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.code != null && message.hasOwnProperty('code')) {
        if (!$util.isInteger(message.code)) { return 'code: integer expected' }
      }
      if (message.text != null && message.hasOwnProperty('text')) {
        if (!$util.isString(message.text)) { return 'text: string expected' }
      }
      return null
    }

    GetErrorResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.GetErrorResponse) { return object }
      const message = new $root.PB_App.GetErrorResponse()
      if (object.code != null) { message.code = object.code >>> 0 }
      if (object.text != null) { message.text = String(object.text) }
      return message
    }

    GetErrorResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.code = 0
        object.text = ''
      }
      if (message.code != null && message.hasOwnProperty('code')) { object.code = message.code }
      if (message.text != null && message.hasOwnProperty('text')) { object.text = message.text }
      return object
    }

    GetErrorResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetErrorResponse
  })()

  PB_App.DataExchangeRequest = (function () {
    function DataExchangeRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    DataExchangeRequest.prototype.data = $util.newBuffer([])

    DataExchangeRequest.create = function create (properties) {
      return new DataExchangeRequest(properties)
    }

    DataExchangeRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.data != null && Object.hasOwnProperty.call(message, 'data')) { writer.uint32(10).bytes(message.data) }
      return writer
    }

    DataExchangeRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    DataExchangeRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_App.DataExchangeRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.data = reader.bytes()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    DataExchangeRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    DataExchangeRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.data != null && message.hasOwnProperty('data')) {
        if (!(message.data && typeof message.data.length === 'number' || $util.isString(message.data))) { return 'data: buffer expected' }
      }
      return null
    }

    DataExchangeRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_App.DataExchangeRequest) { return object }
      const message = new $root.PB_App.DataExchangeRequest()
      if (object.data != null) {
        if (typeof object.data === 'string') { $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0) } else if (object.data.length) { message.data = object.data }
      }
      return message
    }

    DataExchangeRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        if (options.bytes === String) { object.data = '' } else {
          object.data = []
          if (options.bytes !== Array) { object.data = $util.newBuffer(object.data) }
        }
      }
      if (message.data != null && message.hasOwnProperty('data')) { object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data }
      return object
    }

    DataExchangeRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return DataExchangeRequest
  })()

  return PB_App
})()

export const PB_Desktop = $root.PB_Desktop = (() => {
  const PB_Desktop = {}

  PB_Desktop.IsLockedRequest = (function () {
    function IsLockedRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    IsLockedRequest.create = function create (properties) {
      return new IsLockedRequest(properties)
    }

    IsLockedRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    IsLockedRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    IsLockedRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Desktop.IsLockedRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    IsLockedRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    IsLockedRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    IsLockedRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Desktop.IsLockedRequest) { return object }
      return new $root.PB_Desktop.IsLockedRequest()
    }

    IsLockedRequest.toObject = function toObject () {
      return {}
    }

    IsLockedRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return IsLockedRequest
  })()

  PB_Desktop.UnlockRequest = (function () {
    function UnlockRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    UnlockRequest.create = function create (properties) {
      return new UnlockRequest(properties)
    }

    UnlockRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    UnlockRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    UnlockRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Desktop.UnlockRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    UnlockRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    UnlockRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    UnlockRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Desktop.UnlockRequest) { return object }
      return new $root.PB_Desktop.UnlockRequest()
    }

    UnlockRequest.toObject = function toObject () {
      return {}
    }

    UnlockRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return UnlockRequest
  })()

  PB_Desktop.StatusSubscribeRequest = (function () {
    function StatusSubscribeRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StatusSubscribeRequest.create = function create (properties) {
      return new StatusSubscribeRequest(properties)
    }

    StatusSubscribeRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StatusSubscribeRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StatusSubscribeRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Desktop.StatusSubscribeRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StatusSubscribeRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StatusSubscribeRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StatusSubscribeRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Desktop.StatusSubscribeRequest) { return object }
      return new $root.PB_Desktop.StatusSubscribeRequest()
    }

    StatusSubscribeRequest.toObject = function toObject () {
      return {}
    }

    StatusSubscribeRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StatusSubscribeRequest
  })()

  PB_Desktop.StatusUnsubscribeRequest = (function () {
    function StatusUnsubscribeRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StatusUnsubscribeRequest.create = function create (properties) {
      return new StatusUnsubscribeRequest(properties)
    }

    StatusUnsubscribeRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StatusUnsubscribeRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StatusUnsubscribeRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Desktop.StatusUnsubscribeRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StatusUnsubscribeRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StatusUnsubscribeRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StatusUnsubscribeRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Desktop.StatusUnsubscribeRequest) { return object }
      return new $root.PB_Desktop.StatusUnsubscribeRequest()
    }

    StatusUnsubscribeRequest.toObject = function toObject () {
      return {}
    }

    StatusUnsubscribeRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StatusUnsubscribeRequest
  })()

  PB_Desktop.Status = (function () {
    function Status (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Status.prototype.locked = false

    Status.create = function create (properties) {
      return new Status(properties)
    }

    Status.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.locked != null && Object.hasOwnProperty.call(message, 'locked')) { writer.uint32(8).bool(message.locked) }
      return writer
    }

    Status.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Status.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Desktop.Status()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.locked = reader.bool()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Status.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Status.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.locked != null && message.hasOwnProperty('locked')) {
        if (typeof message.locked !== 'boolean') { return 'locked: boolean expected' }
      }
      return null
    }

    Status.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Desktop.Status) { return object }
      const message = new $root.PB_Desktop.Status()
      if (object.locked != null) { message.locked = Boolean(object.locked) }
      return message
    }

    Status.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.locked = false }
      if (message.locked != null && message.hasOwnProperty('locked')) { object.locked = message.locked }
      return object
    }

    Status.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Status
  })()

  return PB_Desktop
})()

export const PB = $root.PB = (() => {
  const PB = {}

  PB.CommandStatus = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'OK'] = 0
    values[valuesById[1] = 'ERROR'] = 1
    values[valuesById[2] = 'ERROR_DECODE'] = 2
    values[valuesById[3] = 'ERROR_NOT_IMPLEMENTED'] = 3
    values[valuesById[4] = 'ERROR_BUSY'] = 4
    values[valuesById[14] = 'ERROR_CONTINUOUS_COMMAND_INTERRUPTED'] = 14
    values[valuesById[15] = 'ERROR_INVALID_PARAMETERS'] = 15
    values[valuesById[5] = 'ERROR_STORAGE_NOT_READY'] = 5
    values[valuesById[6] = 'ERROR_STORAGE_EXIST'] = 6
    values[valuesById[7] = 'ERROR_STORAGE_NOT_EXIST'] = 7
    values[valuesById[8] = 'ERROR_STORAGE_INVALID_PARAMETER'] = 8
    values[valuesById[9] = 'ERROR_STORAGE_DENIED'] = 9
    values[valuesById[10] = 'ERROR_STORAGE_INVALID_NAME'] = 10
    values[valuesById[11] = 'ERROR_STORAGE_INTERNAL'] = 11
    values[valuesById[12] = 'ERROR_STORAGE_NOT_IMPLEMENTED'] = 12
    values[valuesById[13] = 'ERROR_STORAGE_ALREADY_OPEN'] = 13
    values[valuesById[18] = 'ERROR_STORAGE_DIR_NOT_EMPTY'] = 18
    values[valuesById[16] = 'ERROR_APP_CANT_START'] = 16
    values[valuesById[17] = 'ERROR_APP_SYSTEM_LOCKED'] = 17
    values[valuesById[21] = 'ERROR_APP_NOT_RUNNING'] = 21
    values[valuesById[22] = 'ERROR_APP_CMD_ERROR'] = 22
    values[valuesById[19] = 'ERROR_VIRTUAL_DISPLAY_ALREADY_STARTED'] = 19
    values[valuesById[20] = 'ERROR_VIRTUAL_DISPLAY_NOT_STARTED'] = 20
    values[valuesById[58] = 'ERROR_GPIO_MODE_INCORRECT'] = 58
    values[valuesById[59] = 'ERROR_GPIO_UNKNOWN_PIN_MODE'] = 59
    return values
  })()

  PB.Empty = (function () {
    function Empty (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Empty.create = function create (properties) {
      return new Empty(properties)
    }

    Empty.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    Empty.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Empty.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB.Empty()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Empty.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Empty.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    Empty.fromObject = function fromObject (object) {
      if (object instanceof $root.PB.Empty) { return object }
      return new $root.PB.Empty()
    }

    Empty.toObject = function toObject () {
      return {}
    }

    Empty.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Empty
  })()

  PB.StopSession = (function () {
    function StopSession (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StopSession.create = function create (properties) {
      return new StopSession(properties)
    }

    StopSession.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StopSession.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StopSession.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB.StopSession()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StopSession.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StopSession.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StopSession.fromObject = function fromObject (object) {
      if (object instanceof $root.PB.StopSession) { return object }
      return new $root.PB.StopSession()
    }

    StopSession.toObject = function toObject () {
      return {}
    }

    StopSession.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StopSession
  })()

  PB.Main = (function () {
    function Main (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Main.prototype.commandId = 0
    Main.prototype.commandStatus = 0
    Main.prototype.hasNext = false
    Main.prototype.empty = null
    Main.prototype.stopSession = null
    Main.prototype.systemPingRequest = null
    Main.prototype.systemPingResponse = null
    Main.prototype.systemRebootRequest = null
    Main.prototype.systemDeviceInfoRequest = null
    Main.prototype.systemDeviceInfoResponse = null
    Main.prototype.systemFactoryResetRequest = null
    Main.prototype.systemGetDatetimeRequest = null
    Main.prototype.systemGetDatetimeResponse = null
    Main.prototype.systemSetDatetimeRequest = null
    Main.prototype.systemPlayAudiovisualAlertRequest = null
    Main.prototype.systemProtobufVersionRequest = null
    Main.prototype.systemProtobufVersionResponse = null
    Main.prototype.systemUpdateRequest = null
    Main.prototype.systemUpdateResponse = null
    Main.prototype.systemPowerInfoRequest = null
    Main.prototype.systemPowerInfoResponse = null
    Main.prototype.storageInfoRequest = null
    Main.prototype.storageInfoResponse = null
    Main.prototype.storageTimestampRequest = null
    Main.prototype.storageTimestampResponse = null
    Main.prototype.storageStatRequest = null
    Main.prototype.storageStatResponse = null
    Main.prototype.storageListRequest = null
    Main.prototype.storageListResponse = null
    Main.prototype.storageReadRequest = null
    Main.prototype.storageReadResponse = null
    Main.prototype.storageWriteRequest = null
    Main.prototype.storageDeleteRequest = null
    Main.prototype.storageMkdirRequest = null
    Main.prototype.storageMd5sumRequest = null
    Main.prototype.storageMd5sumResponse = null
    Main.prototype.storageRenameRequest = null
    Main.prototype.storageBackupCreateRequest = null
    Main.prototype.storageBackupRestoreRequest = null
    Main.prototype.storageTarExtractRequest = null
    Main.prototype.appStartRequest = null
    Main.prototype.appLockStatusRequest = null
    Main.prototype.appLockStatusResponse = null
    Main.prototype.appExitRequest = null
    Main.prototype.appLoadFileRequest = null
    Main.prototype.appButtonPressRequest = null
    Main.prototype.appButtonReleaseRequest = null
    Main.prototype.appGetErrorRequest = null
    Main.prototype.appGetErrorResponse = null
    Main.prototype.appDataExchangeRequest = null
    Main.prototype.guiStartScreenStreamRequest = null
    Main.prototype.guiStopScreenStreamRequest = null
    Main.prototype.guiScreenFrame = null
    Main.prototype.guiSendInputEventRequest = null
    Main.prototype.guiStartVirtualDisplayRequest = null
    Main.prototype.guiStopVirtualDisplayRequest = null
    Main.prototype.gpioSetPinMode = null
    Main.prototype.gpioSetInputPull = null
    Main.prototype.gpioGetPinMode = null
    Main.prototype.gpioGetPinModeResponse = null
    Main.prototype.gpioReadPin = null
    Main.prototype.gpioReadPinResponse = null
    Main.prototype.gpioWritePin = null
    Main.prototype.appStateResponse = null
    Main.prototype.propertyGetRequest = null
    Main.prototype.propertyGetResponse = null
    Main.prototype.desktopIsLockedRequest = null
    Main.prototype.desktopUnlockRequest = null
    Main.prototype.desktopStatusSubscribeRequest = null
    Main.prototype.desktopStatusUnsubscribeRequest = null
    Main.prototype.desktopStatus = null

    let $oneOfFields

    Object.defineProperty(Main.prototype, 'content', {
      get: $util.oneOfGetter($oneOfFields = ['empty', 'stopSession', 'systemPingRequest', 'systemPingResponse', 'systemRebootRequest', 'systemDeviceInfoRequest', 'systemDeviceInfoResponse', 'systemFactoryResetRequest', 'systemGetDatetimeRequest', 'systemGetDatetimeResponse', 'systemSetDatetimeRequest', 'systemPlayAudiovisualAlertRequest', 'systemProtobufVersionRequest', 'systemProtobufVersionResponse', 'systemUpdateRequest', 'systemUpdateResponse', 'systemPowerInfoRequest', 'systemPowerInfoResponse', 'storageInfoRequest', 'storageInfoResponse', 'storageTimestampRequest', 'storageTimestampResponse', 'storageStatRequest', 'storageStatResponse', 'storageListRequest', 'storageListResponse', 'storageReadRequest', 'storageReadResponse', 'storageWriteRequest', 'storageDeleteRequest', 'storageMkdirRequest', 'storageMd5sumRequest', 'storageMd5sumResponse', 'storageRenameRequest', 'storageBackupCreateRequest', 'storageBackupRestoreRequest', 'storageTarExtractRequest', 'appStartRequest', 'appLockStatusRequest', 'appLockStatusResponse', 'appExitRequest', 'appLoadFileRequest', 'appButtonPressRequest', 'appButtonReleaseRequest', 'appGetErrorRequest', 'appGetErrorResponse', 'appDataExchangeRequest', 'guiStartScreenStreamRequest', 'guiStopScreenStreamRequest', 'guiScreenFrame', 'guiSendInputEventRequest', 'guiStartVirtualDisplayRequest', 'guiStopVirtualDisplayRequest', 'gpioSetPinMode', 'gpioSetInputPull', 'gpioGetPinMode', 'gpioGetPinModeResponse', 'gpioReadPin', 'gpioReadPinResponse', 'gpioWritePin', 'appStateResponse', 'propertyGetRequest', 'propertyGetResponse', 'desktopIsLockedRequest', 'desktopUnlockRequest', 'desktopStatusSubscribeRequest', 'desktopStatusUnsubscribeRequest', 'desktopStatus']),
      set: $util.oneOfSetter($oneOfFields)
    })

    Main.create = function create (properties) {
      return new Main(properties)
    }

    Main.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.commandId != null && Object.hasOwnProperty.call(message, 'commandId')) { writer.uint32(8).uint32(message.commandId) }
      if (message.commandStatus != null && Object.hasOwnProperty.call(message, 'commandStatus')) { writer.uint32(16).int32(message.commandStatus) }
      if (message.hasNext != null && Object.hasOwnProperty.call(message, 'hasNext')) { writer.uint32(24).bool(message.hasNext) }
      if (message.empty != null && Object.hasOwnProperty.call(message, 'empty')) { $root.PB.Empty.encode(message.empty, writer.uint32(34).fork()).ldelim() }
      if (message.systemPingRequest != null && Object.hasOwnProperty.call(message, 'systemPingRequest')) { $root.PB_System.PingRequest.encode(message.systemPingRequest, writer.uint32(42).fork()).ldelim() }
      if (message.systemPingResponse != null && Object.hasOwnProperty.call(message, 'systemPingResponse')) { $root.PB_System.PingResponse.encode(message.systemPingResponse, writer.uint32(50).fork()).ldelim() }
      if (message.storageListRequest != null && Object.hasOwnProperty.call(message, 'storageListRequest')) { $root.PB_Storage.ListRequest.encode(message.storageListRequest, writer.uint32(58).fork()).ldelim() }
      if (message.storageListResponse != null && Object.hasOwnProperty.call(message, 'storageListResponse')) { $root.PB_Storage.ListResponse.encode(message.storageListResponse, writer.uint32(66).fork()).ldelim() }
      if (message.storageReadRequest != null && Object.hasOwnProperty.call(message, 'storageReadRequest')) { $root.PB_Storage.ReadRequest.encode(message.storageReadRequest, writer.uint32(74).fork()).ldelim() }
      if (message.storageReadResponse != null && Object.hasOwnProperty.call(message, 'storageReadResponse')) { $root.PB_Storage.ReadResponse.encode(message.storageReadResponse, writer.uint32(82).fork()).ldelim() }
      if (message.storageWriteRequest != null && Object.hasOwnProperty.call(message, 'storageWriteRequest')) { $root.PB_Storage.WriteRequest.encode(message.storageWriteRequest, writer.uint32(90).fork()).ldelim() }
      if (message.storageDeleteRequest != null && Object.hasOwnProperty.call(message, 'storageDeleteRequest')) { $root.PB_Storage.DeleteRequest.encode(message.storageDeleteRequest, writer.uint32(98).fork()).ldelim() }
      if (message.storageMkdirRequest != null && Object.hasOwnProperty.call(message, 'storageMkdirRequest')) { $root.PB_Storage.MkdirRequest.encode(message.storageMkdirRequest, writer.uint32(106).fork()).ldelim() }
      if (message.storageMd5sumRequest != null && Object.hasOwnProperty.call(message, 'storageMd5sumRequest')) { $root.PB_Storage.Md5sumRequest.encode(message.storageMd5sumRequest, writer.uint32(114).fork()).ldelim() }
      if (message.storageMd5sumResponse != null && Object.hasOwnProperty.call(message, 'storageMd5sumResponse')) { $root.PB_Storage.Md5sumResponse.encode(message.storageMd5sumResponse, writer.uint32(122).fork()).ldelim() }
      if (message.appStartRequest != null && Object.hasOwnProperty.call(message, 'appStartRequest')) { $root.PB_App.StartRequest.encode(message.appStartRequest, writer.uint32(130).fork()).ldelim() }
      if (message.appLockStatusRequest != null && Object.hasOwnProperty.call(message, 'appLockStatusRequest')) { $root.PB_App.LockStatusRequest.encode(message.appLockStatusRequest, writer.uint32(138).fork()).ldelim() }
      if (message.appLockStatusResponse != null && Object.hasOwnProperty.call(message, 'appLockStatusResponse')) { $root.PB_App.LockStatusResponse.encode(message.appLockStatusResponse, writer.uint32(146).fork()).ldelim() }
      if (message.stopSession != null && Object.hasOwnProperty.call(message, 'stopSession')) { $root.PB.StopSession.encode(message.stopSession, writer.uint32(154).fork()).ldelim() }
      if (message.guiStartScreenStreamRequest != null && Object.hasOwnProperty.call(message, 'guiStartScreenStreamRequest')) { $root.PB_Gui.StartScreenStreamRequest.encode(message.guiStartScreenStreamRequest, writer.uint32(162).fork()).ldelim() }
      if (message.guiStopScreenStreamRequest != null && Object.hasOwnProperty.call(message, 'guiStopScreenStreamRequest')) { $root.PB_Gui.StopScreenStreamRequest.encode(message.guiStopScreenStreamRequest, writer.uint32(170).fork()).ldelim() }
      if (message.guiScreenFrame != null && Object.hasOwnProperty.call(message, 'guiScreenFrame')) { $root.PB_Gui.ScreenFrame.encode(message.guiScreenFrame, writer.uint32(178).fork()).ldelim() }
      if (message.guiSendInputEventRequest != null && Object.hasOwnProperty.call(message, 'guiSendInputEventRequest')) { $root.PB_Gui.SendInputEventRequest.encode(message.guiSendInputEventRequest, writer.uint32(186).fork()).ldelim() }
      if (message.storageStatRequest != null && Object.hasOwnProperty.call(message, 'storageStatRequest')) { $root.PB_Storage.StatRequest.encode(message.storageStatRequest, writer.uint32(194).fork()).ldelim() }
      if (message.storageStatResponse != null && Object.hasOwnProperty.call(message, 'storageStatResponse')) { $root.PB_Storage.StatResponse.encode(message.storageStatResponse, writer.uint32(202).fork()).ldelim() }
      if (message.guiStartVirtualDisplayRequest != null && Object.hasOwnProperty.call(message, 'guiStartVirtualDisplayRequest')) { $root.PB_Gui.StartVirtualDisplayRequest.encode(message.guiStartVirtualDisplayRequest, writer.uint32(210).fork()).ldelim() }
      if (message.guiStopVirtualDisplayRequest != null && Object.hasOwnProperty.call(message, 'guiStopVirtualDisplayRequest')) { $root.PB_Gui.StopVirtualDisplayRequest.encode(message.guiStopVirtualDisplayRequest, writer.uint32(218).fork()).ldelim() }
      if (message.storageInfoRequest != null && Object.hasOwnProperty.call(message, 'storageInfoRequest')) { $root.PB_Storage.InfoRequest.encode(message.storageInfoRequest, writer.uint32(226).fork()).ldelim() }
      if (message.storageInfoResponse != null && Object.hasOwnProperty.call(message, 'storageInfoResponse')) { $root.PB_Storage.InfoResponse.encode(message.storageInfoResponse, writer.uint32(234).fork()).ldelim() }
      if (message.storageRenameRequest != null && Object.hasOwnProperty.call(message, 'storageRenameRequest')) { $root.PB_Storage.RenameRequest.encode(message.storageRenameRequest, writer.uint32(242).fork()).ldelim() }
      if (message.systemRebootRequest != null && Object.hasOwnProperty.call(message, 'systemRebootRequest')) { $root.PB_System.RebootRequest.encode(message.systemRebootRequest, writer.uint32(250).fork()).ldelim() }
      if (message.systemDeviceInfoRequest != null && Object.hasOwnProperty.call(message, 'systemDeviceInfoRequest')) { $root.PB_System.DeviceInfoRequest.encode(message.systemDeviceInfoRequest, writer.uint32(258).fork()).ldelim() }
      if (message.systemDeviceInfoResponse != null && Object.hasOwnProperty.call(message, 'systemDeviceInfoResponse')) { $root.PB_System.DeviceInfoResponse.encode(message.systemDeviceInfoResponse, writer.uint32(266).fork()).ldelim() }
      if (message.systemFactoryResetRequest != null && Object.hasOwnProperty.call(message, 'systemFactoryResetRequest')) { $root.PB_System.FactoryResetRequest.encode(message.systemFactoryResetRequest, writer.uint32(274).fork()).ldelim() }
      if (message.systemGetDatetimeRequest != null && Object.hasOwnProperty.call(message, 'systemGetDatetimeRequest')) { $root.PB_System.GetDateTimeRequest.encode(message.systemGetDatetimeRequest, writer.uint32(282).fork()).ldelim() }
      if (message.systemGetDatetimeResponse != null && Object.hasOwnProperty.call(message, 'systemGetDatetimeResponse')) { $root.PB_System.GetDateTimeResponse.encode(message.systemGetDatetimeResponse, writer.uint32(290).fork()).ldelim() }
      if (message.systemSetDatetimeRequest != null && Object.hasOwnProperty.call(message, 'systemSetDatetimeRequest')) { $root.PB_System.SetDateTimeRequest.encode(message.systemSetDatetimeRequest, writer.uint32(298).fork()).ldelim() }
      if (message.systemPlayAudiovisualAlertRequest != null && Object.hasOwnProperty.call(message, 'systemPlayAudiovisualAlertRequest')) { $root.PB_System.PlayAudiovisualAlertRequest.encode(message.systemPlayAudiovisualAlertRequest, writer.uint32(306).fork()).ldelim() }
      if (message.systemProtobufVersionRequest != null && Object.hasOwnProperty.call(message, 'systemProtobufVersionRequest')) { $root.PB_System.ProtobufVersionRequest.encode(message.systemProtobufVersionRequest, writer.uint32(314).fork()).ldelim() }
      if (message.systemProtobufVersionResponse != null && Object.hasOwnProperty.call(message, 'systemProtobufVersionResponse')) { $root.PB_System.ProtobufVersionResponse.encode(message.systemProtobufVersionResponse, writer.uint32(322).fork()).ldelim() }
      if (message.systemUpdateRequest != null && Object.hasOwnProperty.call(message, 'systemUpdateRequest')) { $root.PB_System.UpdateRequest.encode(message.systemUpdateRequest, writer.uint32(330).fork()).ldelim() }
      if (message.storageBackupCreateRequest != null && Object.hasOwnProperty.call(message, 'storageBackupCreateRequest')) { $root.PB_Storage.BackupCreateRequest.encode(message.storageBackupCreateRequest, writer.uint32(338).fork()).ldelim() }
      if (message.storageBackupRestoreRequest != null && Object.hasOwnProperty.call(message, 'storageBackupRestoreRequest')) { $root.PB_Storage.BackupRestoreRequest.encode(message.storageBackupRestoreRequest, writer.uint32(346).fork()).ldelim() }
      if (message.systemPowerInfoRequest != null && Object.hasOwnProperty.call(message, 'systemPowerInfoRequest')) { $root.PB_System.PowerInfoRequest.encode(message.systemPowerInfoRequest, writer.uint32(354).fork()).ldelim() }
      if (message.systemPowerInfoResponse != null && Object.hasOwnProperty.call(message, 'systemPowerInfoResponse')) { $root.PB_System.PowerInfoResponse.encode(message.systemPowerInfoResponse, writer.uint32(362).fork()).ldelim() }
      if (message.systemUpdateResponse != null && Object.hasOwnProperty.call(message, 'systemUpdateResponse')) { $root.PB_System.UpdateResponse.encode(message.systemUpdateResponse, writer.uint32(370).fork()).ldelim() }
      if (message.appExitRequest != null && Object.hasOwnProperty.call(message, 'appExitRequest')) { $root.PB_App.AppExitRequest.encode(message.appExitRequest, writer.uint32(378).fork()).ldelim() }
      if (message.appLoadFileRequest != null && Object.hasOwnProperty.call(message, 'appLoadFileRequest')) { $root.PB_App.AppLoadFileRequest.encode(message.appLoadFileRequest, writer.uint32(386).fork()).ldelim() }
      if (message.appButtonPressRequest != null && Object.hasOwnProperty.call(message, 'appButtonPressRequest')) { $root.PB_App.AppButtonPressRequest.encode(message.appButtonPressRequest, writer.uint32(394).fork()).ldelim() }
      if (message.appButtonReleaseRequest != null && Object.hasOwnProperty.call(message, 'appButtonReleaseRequest')) { $root.PB_App.AppButtonReleaseRequest.encode(message.appButtonReleaseRequest, writer.uint32(402).fork()).ldelim() }
      if (message.gpioSetPinMode != null && Object.hasOwnProperty.call(message, 'gpioSetPinMode')) { $root.PB_Gpio.SetPinMode.encode(message.gpioSetPinMode, writer.uint32(410).fork()).ldelim() }
      if (message.gpioSetInputPull != null && Object.hasOwnProperty.call(message, 'gpioSetInputPull')) { $root.PB_Gpio.SetInputPull.encode(message.gpioSetInputPull, writer.uint32(418).fork()).ldelim() }
      if (message.gpioGetPinMode != null && Object.hasOwnProperty.call(message, 'gpioGetPinMode')) { $root.PB_Gpio.GetPinMode.encode(message.gpioGetPinMode, writer.uint32(426).fork()).ldelim() }
      if (message.gpioGetPinModeResponse != null && Object.hasOwnProperty.call(message, 'gpioGetPinModeResponse')) { $root.PB_Gpio.GetPinModeResponse.encode(message.gpioGetPinModeResponse, writer.uint32(434).fork()).ldelim() }
      if (message.gpioReadPin != null && Object.hasOwnProperty.call(message, 'gpioReadPin')) { $root.PB_Gpio.ReadPin.encode(message.gpioReadPin, writer.uint32(442).fork()).ldelim() }
      if (message.gpioReadPinResponse != null && Object.hasOwnProperty.call(message, 'gpioReadPinResponse')) { $root.PB_Gpio.ReadPinResponse.encode(message.gpioReadPinResponse, writer.uint32(450).fork()).ldelim() }
      if (message.gpioWritePin != null && Object.hasOwnProperty.call(message, 'gpioWritePin')) { $root.PB_Gpio.WritePin.encode(message.gpioWritePin, writer.uint32(458).fork()).ldelim() }
      if (message.appStateResponse != null && Object.hasOwnProperty.call(message, 'appStateResponse')) { $root.PB_App.AppStateResponse.encode(message.appStateResponse, writer.uint32(466).fork()).ldelim() }
      if (message.storageTimestampRequest != null && Object.hasOwnProperty.call(message, 'storageTimestampRequest')) { $root.PB_Storage.TimestampRequest.encode(message.storageTimestampRequest, writer.uint32(474).fork()).ldelim() }
      if (message.storageTimestampResponse != null && Object.hasOwnProperty.call(message, 'storageTimestampResponse')) { $root.PB_Storage.TimestampResponse.encode(message.storageTimestampResponse, writer.uint32(482).fork()).ldelim() }
      if (message.propertyGetRequest != null && Object.hasOwnProperty.call(message, 'propertyGetRequest')) { $root.PB_Property.GetRequest.encode(message.propertyGetRequest, writer.uint32(490).fork()).ldelim() }
      if (message.propertyGetResponse != null && Object.hasOwnProperty.call(message, 'propertyGetResponse')) { $root.PB_Property.GetResponse.encode(message.propertyGetResponse, writer.uint32(498).fork()).ldelim() }
      if (message.appGetErrorRequest != null && Object.hasOwnProperty.call(message, 'appGetErrorRequest')) { $root.PB_App.GetErrorRequest.encode(message.appGetErrorRequest, writer.uint32(506).fork()).ldelim() }
      if (message.appGetErrorResponse != null && Object.hasOwnProperty.call(message, 'appGetErrorResponse')) { $root.PB_App.GetErrorResponse.encode(message.appGetErrorResponse, writer.uint32(514).fork()).ldelim() }
      if (message.appDataExchangeRequest != null && Object.hasOwnProperty.call(message, 'appDataExchangeRequest')) { $root.PB_App.DataExchangeRequest.encode(message.appDataExchangeRequest, writer.uint32(522).fork()).ldelim() }
      if (message.desktopIsLockedRequest != null && Object.hasOwnProperty.call(message, 'desktopIsLockedRequest')) { $root.PB_Desktop.IsLockedRequest.encode(message.desktopIsLockedRequest, writer.uint32(530).fork()).ldelim() }
      if (message.desktopUnlockRequest != null && Object.hasOwnProperty.call(message, 'desktopUnlockRequest')) { $root.PB_Desktop.UnlockRequest.encode(message.desktopUnlockRequest, writer.uint32(538).fork()).ldelim() }
      if (message.desktopStatusSubscribeRequest != null && Object.hasOwnProperty.call(message, 'desktopStatusSubscribeRequest')) { $root.PB_Desktop.StatusSubscribeRequest.encode(message.desktopStatusSubscribeRequest, writer.uint32(546).fork()).ldelim() }
      if (message.desktopStatusUnsubscribeRequest != null && Object.hasOwnProperty.call(message, 'desktopStatusUnsubscribeRequest')) { $root.PB_Desktop.StatusUnsubscribeRequest.encode(message.desktopStatusUnsubscribeRequest, writer.uint32(554).fork()).ldelim() }
      if (message.desktopStatus != null && Object.hasOwnProperty.call(message, 'desktopStatus')) { $root.PB_Desktop.Status.encode(message.desktopStatus, writer.uint32(562).fork()).ldelim() }
      if (message.storageTarExtractRequest != null && Object.hasOwnProperty.call(message, 'storageTarExtractRequest')) { $root.PB_Storage.TarExtractRequest.encode(message.storageTarExtractRequest, writer.uint32(570).fork()).ldelim() }
      return writer
    }

    Main.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Main.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB.Main()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.commandId = reader.uint32()
            break
          case 2:
            message.commandStatus = reader.int32()
            break
          case 3:
            message.hasNext = reader.bool()
            break
          case 4:
            message.empty = $root.PB.Empty.decode(reader, reader.uint32())
            break
          case 19:
            message.stopSession = $root.PB.StopSession.decode(reader, reader.uint32())
            break
          case 5:
            message.systemPingRequest = $root.PB_System.PingRequest.decode(reader, reader.uint32())
            break
          case 6:
            message.systemPingResponse = $root.PB_System.PingResponse.decode(reader, reader.uint32())
            break
          case 31:
            message.systemRebootRequest = $root.PB_System.RebootRequest.decode(reader, reader.uint32())
            break
          case 32:
            message.systemDeviceInfoRequest = $root.PB_System.DeviceInfoRequest.decode(reader, reader.uint32())
            break
          case 33:
            message.systemDeviceInfoResponse = $root.PB_System.DeviceInfoResponse.decode(reader, reader.uint32())
            break
          case 34:
            message.systemFactoryResetRequest = $root.PB_System.FactoryResetRequest.decode(reader, reader.uint32())
            break
          case 35:
            message.systemGetDatetimeRequest = $root.PB_System.GetDateTimeRequest.decode(reader, reader.uint32())
            break
          case 36:
            message.systemGetDatetimeResponse = $root.PB_System.GetDateTimeResponse.decode(reader, reader.uint32())
            break
          case 37:
            message.systemSetDatetimeRequest = $root.PB_System.SetDateTimeRequest.decode(reader, reader.uint32())
            break
          case 38:
            message.systemPlayAudiovisualAlertRequest = $root.PB_System.PlayAudiovisualAlertRequest.decode(reader, reader.uint32())
            break
          case 39:
            message.systemProtobufVersionRequest = $root.PB_System.ProtobufVersionRequest.decode(reader, reader.uint32())
            break
          case 40:
            message.systemProtobufVersionResponse = $root.PB_System.ProtobufVersionResponse.decode(reader, reader.uint32())
            break
          case 41:
            message.systemUpdateRequest = $root.PB_System.UpdateRequest.decode(reader, reader.uint32())
            break
          case 46:
            message.systemUpdateResponse = $root.PB_System.UpdateResponse.decode(reader, reader.uint32())
            break
          case 44:
            message.systemPowerInfoRequest = $root.PB_System.PowerInfoRequest.decode(reader, reader.uint32())
            break
          case 45:
            message.systemPowerInfoResponse = $root.PB_System.PowerInfoResponse.decode(reader, reader.uint32())
            break
          case 28:
            message.storageInfoRequest = $root.PB_Storage.InfoRequest.decode(reader, reader.uint32())
            break
          case 29:
            message.storageInfoResponse = $root.PB_Storage.InfoResponse.decode(reader, reader.uint32())
            break
          case 59:
            message.storageTimestampRequest = $root.PB_Storage.TimestampRequest.decode(reader, reader.uint32())
            break
          case 60:
            message.storageTimestampResponse = $root.PB_Storage.TimestampResponse.decode(reader, reader.uint32())
            break
          case 24:
            message.storageStatRequest = $root.PB_Storage.StatRequest.decode(reader, reader.uint32())
            break
          case 25:
            message.storageStatResponse = $root.PB_Storage.StatResponse.decode(reader, reader.uint32())
            break
          case 7:
            message.storageListRequest = $root.PB_Storage.ListRequest.decode(reader, reader.uint32())
            break
          case 8:
            message.storageListResponse = $root.PB_Storage.ListResponse.decode(reader, reader.uint32())
            break
          case 9:
            message.storageReadRequest = $root.PB_Storage.ReadRequest.decode(reader, reader.uint32())
            break
          case 10:
            message.storageReadResponse = $root.PB_Storage.ReadResponse.decode(reader, reader.uint32())
            break
          case 11:
            message.storageWriteRequest = $root.PB_Storage.WriteRequest.decode(reader, reader.uint32())
            break
          case 12:
            message.storageDeleteRequest = $root.PB_Storage.DeleteRequest.decode(reader, reader.uint32())
            break
          case 13:
            message.storageMkdirRequest = $root.PB_Storage.MkdirRequest.decode(reader, reader.uint32())
            break
          case 14:
            message.storageMd5sumRequest = $root.PB_Storage.Md5sumRequest.decode(reader, reader.uint32())
            break
          case 15:
            message.storageMd5sumResponse = $root.PB_Storage.Md5sumResponse.decode(reader, reader.uint32())
            break
          case 30:
            message.storageRenameRequest = $root.PB_Storage.RenameRequest.decode(reader, reader.uint32())
            break
          case 42:
            message.storageBackupCreateRequest = $root.PB_Storage.BackupCreateRequest.decode(reader, reader.uint32())
            break
          case 43:
            message.storageBackupRestoreRequest = $root.PB_Storage.BackupRestoreRequest.decode(reader, reader.uint32())
            break
          case 71:
            message.storageTarExtractRequest = $root.PB_Storage.TarExtractRequest.decode(reader, reader.uint32())
            break
          case 16:
            message.appStartRequest = $root.PB_App.StartRequest.decode(reader, reader.uint32())
            break
          case 17:
            message.appLockStatusRequest = $root.PB_App.LockStatusRequest.decode(reader, reader.uint32())
            break
          case 18:
            message.appLockStatusResponse = $root.PB_App.LockStatusResponse.decode(reader, reader.uint32())
            break
          case 47:
            message.appExitRequest = $root.PB_App.AppExitRequest.decode(reader, reader.uint32())
            break
          case 48:
            message.appLoadFileRequest = $root.PB_App.AppLoadFileRequest.decode(reader, reader.uint32())
            break
          case 49:
            message.appButtonPressRequest = $root.PB_App.AppButtonPressRequest.decode(reader, reader.uint32())
            break
          case 50:
            message.appButtonReleaseRequest = $root.PB_App.AppButtonReleaseRequest.decode(reader, reader.uint32())
            break
          case 63:
            message.appGetErrorRequest = $root.PB_App.GetErrorRequest.decode(reader, reader.uint32())
            break
          case 64:
            message.appGetErrorResponse = $root.PB_App.GetErrorResponse.decode(reader, reader.uint32())
            break
          case 65:
            message.appDataExchangeRequest = $root.PB_App.DataExchangeRequest.decode(reader, reader.uint32())
            break
          case 20:
            message.guiStartScreenStreamRequest = $root.PB_Gui.StartScreenStreamRequest.decode(reader, reader.uint32())
            break
          case 21:
            message.guiStopScreenStreamRequest = $root.PB_Gui.StopScreenStreamRequest.decode(reader, reader.uint32())
            break
          case 22:
            message.guiScreenFrame = $root.PB_Gui.ScreenFrame.decode(reader, reader.uint32())
            break
          case 23:
            message.guiSendInputEventRequest = $root.PB_Gui.SendInputEventRequest.decode(reader, reader.uint32())
            break
          case 26:
            message.guiStartVirtualDisplayRequest = $root.PB_Gui.StartVirtualDisplayRequest.decode(reader, reader.uint32())
            break
          case 27:
            message.guiStopVirtualDisplayRequest = $root.PB_Gui.StopVirtualDisplayRequest.decode(reader, reader.uint32())
            break
          case 51:
            message.gpioSetPinMode = $root.PB_Gpio.SetPinMode.decode(reader, reader.uint32())
            break
          case 52:
            message.gpioSetInputPull = $root.PB_Gpio.SetInputPull.decode(reader, reader.uint32())
            break
          case 53:
            message.gpioGetPinMode = $root.PB_Gpio.GetPinMode.decode(reader, reader.uint32())
            break
          case 54:
            message.gpioGetPinModeResponse = $root.PB_Gpio.GetPinModeResponse.decode(reader, reader.uint32())
            break
          case 55:
            message.gpioReadPin = $root.PB_Gpio.ReadPin.decode(reader, reader.uint32())
            break
          case 56:
            message.gpioReadPinResponse = $root.PB_Gpio.ReadPinResponse.decode(reader, reader.uint32())
            break
          case 57:
            message.gpioWritePin = $root.PB_Gpio.WritePin.decode(reader, reader.uint32())
            break
          case 58:
            message.appStateResponse = $root.PB_App.AppStateResponse.decode(reader, reader.uint32())
            break
          case 61:
            message.propertyGetRequest = $root.PB_Property.GetRequest.decode(reader, reader.uint32())
            break
          case 62:
            message.propertyGetResponse = $root.PB_Property.GetResponse.decode(reader, reader.uint32())
            break
          case 66:
            message.desktopIsLockedRequest = $root.PB_Desktop.IsLockedRequest.decode(reader, reader.uint32())
            break
          case 67:
            message.desktopUnlockRequest = $root.PB_Desktop.UnlockRequest.decode(reader, reader.uint32())
            break
          case 68:
            message.desktopStatusSubscribeRequest = $root.PB_Desktop.StatusSubscribeRequest.decode(reader, reader.uint32())
            break
          case 69:
            message.desktopStatusUnsubscribeRequest = $root.PB_Desktop.StatusUnsubscribeRequest.decode(reader, reader.uint32())
            break
          case 70:
            message.desktopStatus = $root.PB_Desktop.Status.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Main.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Main.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      const properties = {}
      if (message.commandId != null && message.hasOwnProperty('commandId')) {
        if (!$util.isInteger(message.commandId)) { return 'commandId: integer expected' }
      }
      if (message.commandStatus != null && message.hasOwnProperty('commandStatus')) {
        switch (message.commandStatus) {
          default:
            return 'commandStatus: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 14:
          case 15:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 18:
          case 16:
          case 17:
          case 21:
          case 22:
          case 19:
          case 20:
          case 58:
          case 59:
            break
        }
      }
      if (message.hasNext != null && message.hasOwnProperty('hasNext')) {
        if (typeof message.hasNext !== 'boolean') { return 'hasNext: boolean expected' }
      }
      if (message.empty != null && message.hasOwnProperty('empty')) {
        properties.content = 1
        {
          const error = $root.PB.Empty.verify(message.empty)
          if (error) { return 'empty.' + error }
        }
      }
      if (message.stopSession != null && message.hasOwnProperty('stopSession')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB.StopSession.verify(message.stopSession)
          if (error) { return 'stopSession.' + error }
        }
      }
      if (message.systemPingRequest != null && message.hasOwnProperty('systemPingRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.PingRequest.verify(message.systemPingRequest)
          if (error) { return 'systemPingRequest.' + error }
        }
      }
      if (message.systemPingResponse != null && message.hasOwnProperty('systemPingResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.PingResponse.verify(message.systemPingResponse)
          if (error) { return 'systemPingResponse.' + error }
        }
      }
      if (message.systemRebootRequest != null && message.hasOwnProperty('systemRebootRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.RebootRequest.verify(message.systemRebootRequest)
          if (error) { return 'systemRebootRequest.' + error }
        }
      }
      if (message.systemDeviceInfoRequest != null && message.hasOwnProperty('systemDeviceInfoRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.DeviceInfoRequest.verify(message.systemDeviceInfoRequest)
          if (error) { return 'systemDeviceInfoRequest.' + error }
        }
      }
      if (message.systemDeviceInfoResponse != null && message.hasOwnProperty('systemDeviceInfoResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.DeviceInfoResponse.verify(message.systemDeviceInfoResponse)
          if (error) { return 'systemDeviceInfoResponse.' + error }
        }
      }
      if (message.systemFactoryResetRequest != null && message.hasOwnProperty('systemFactoryResetRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.FactoryResetRequest.verify(message.systemFactoryResetRequest)
          if (error) { return 'systemFactoryResetRequest.' + error }
        }
      }
      if (message.systemGetDatetimeRequest != null && message.hasOwnProperty('systemGetDatetimeRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.GetDateTimeRequest.verify(message.systemGetDatetimeRequest)
          if (error) { return 'systemGetDatetimeRequest.' + error }
        }
      }
      if (message.systemGetDatetimeResponse != null && message.hasOwnProperty('systemGetDatetimeResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.GetDateTimeResponse.verify(message.systemGetDatetimeResponse)
          if (error) { return 'systemGetDatetimeResponse.' + error }
        }
      }
      if (message.systemSetDatetimeRequest != null && message.hasOwnProperty('systemSetDatetimeRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.SetDateTimeRequest.verify(message.systemSetDatetimeRequest)
          if (error) { return 'systemSetDatetimeRequest.' + error }
        }
      }
      if (message.systemPlayAudiovisualAlertRequest != null && message.hasOwnProperty('systemPlayAudiovisualAlertRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.PlayAudiovisualAlertRequest.verify(message.systemPlayAudiovisualAlertRequest)
          if (error) { return 'systemPlayAudiovisualAlertRequest.' + error }
        }
      }
      if (message.systemProtobufVersionRequest != null && message.hasOwnProperty('systemProtobufVersionRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.ProtobufVersionRequest.verify(message.systemProtobufVersionRequest)
          if (error) { return 'systemProtobufVersionRequest.' + error }
        }
      }
      if (message.systemProtobufVersionResponse != null && message.hasOwnProperty('systemProtobufVersionResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.ProtobufVersionResponse.verify(message.systemProtobufVersionResponse)
          if (error) { return 'systemProtobufVersionResponse.' + error }
        }
      }
      if (message.systemUpdateRequest != null && message.hasOwnProperty('systemUpdateRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.UpdateRequest.verify(message.systemUpdateRequest)
          if (error) { return 'systemUpdateRequest.' + error }
        }
      }
      if (message.systemUpdateResponse != null && message.hasOwnProperty('systemUpdateResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.UpdateResponse.verify(message.systemUpdateResponse)
          if (error) { return 'systemUpdateResponse.' + error }
        }
      }
      if (message.systemPowerInfoRequest != null && message.hasOwnProperty('systemPowerInfoRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.PowerInfoRequest.verify(message.systemPowerInfoRequest)
          if (error) { return 'systemPowerInfoRequest.' + error }
        }
      }
      if (message.systemPowerInfoResponse != null && message.hasOwnProperty('systemPowerInfoResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_System.PowerInfoResponse.verify(message.systemPowerInfoResponse)
          if (error) { return 'systemPowerInfoResponse.' + error }
        }
      }
      if (message.storageInfoRequest != null && message.hasOwnProperty('storageInfoRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.InfoRequest.verify(message.storageInfoRequest)
          if (error) { return 'storageInfoRequest.' + error }
        }
      }
      if (message.storageInfoResponse != null && message.hasOwnProperty('storageInfoResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.InfoResponse.verify(message.storageInfoResponse)
          if (error) { return 'storageInfoResponse.' + error }
        }
      }
      if (message.storageTimestampRequest != null && message.hasOwnProperty('storageTimestampRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.TimestampRequest.verify(message.storageTimestampRequest)
          if (error) { return 'storageTimestampRequest.' + error }
        }
      }
      if (message.storageTimestampResponse != null && message.hasOwnProperty('storageTimestampResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.TimestampResponse.verify(message.storageTimestampResponse)
          if (error) { return 'storageTimestampResponse.' + error }
        }
      }
      if (message.storageStatRequest != null && message.hasOwnProperty('storageStatRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.StatRequest.verify(message.storageStatRequest)
          if (error) { return 'storageStatRequest.' + error }
        }
      }
      if (message.storageStatResponse != null && message.hasOwnProperty('storageStatResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.StatResponse.verify(message.storageStatResponse)
          if (error) { return 'storageStatResponse.' + error }
        }
      }
      if (message.storageListRequest != null && message.hasOwnProperty('storageListRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.ListRequest.verify(message.storageListRequest)
          if (error) { return 'storageListRequest.' + error }
        }
      }
      if (message.storageListResponse != null && message.hasOwnProperty('storageListResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.ListResponse.verify(message.storageListResponse)
          if (error) { return 'storageListResponse.' + error }
        }
      }
      if (message.storageReadRequest != null && message.hasOwnProperty('storageReadRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.ReadRequest.verify(message.storageReadRequest)
          if (error) { return 'storageReadRequest.' + error }
        }
      }
      if (message.storageReadResponse != null && message.hasOwnProperty('storageReadResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.ReadResponse.verify(message.storageReadResponse)
          if (error) { return 'storageReadResponse.' + error }
        }
      }
      if (message.storageWriteRequest != null && message.hasOwnProperty('storageWriteRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.WriteRequest.verify(message.storageWriteRequest)
          if (error) { return 'storageWriteRequest.' + error }
        }
      }
      if (message.storageDeleteRequest != null && message.hasOwnProperty('storageDeleteRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.DeleteRequest.verify(message.storageDeleteRequest)
          if (error) { return 'storageDeleteRequest.' + error }
        }
      }
      if (message.storageMkdirRequest != null && message.hasOwnProperty('storageMkdirRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.MkdirRequest.verify(message.storageMkdirRequest)
          if (error) { return 'storageMkdirRequest.' + error }
        }
      }
      if (message.storageMd5sumRequest != null && message.hasOwnProperty('storageMd5sumRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.Md5sumRequest.verify(message.storageMd5sumRequest)
          if (error) { return 'storageMd5sumRequest.' + error }
        }
      }
      if (message.storageMd5sumResponse != null && message.hasOwnProperty('storageMd5sumResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.Md5sumResponse.verify(message.storageMd5sumResponse)
          if (error) { return 'storageMd5sumResponse.' + error }
        }
      }
      if (message.storageRenameRequest != null && message.hasOwnProperty('storageRenameRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.RenameRequest.verify(message.storageRenameRequest)
          if (error) { return 'storageRenameRequest.' + error }
        }
      }
      if (message.storageBackupCreateRequest != null && message.hasOwnProperty('storageBackupCreateRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.BackupCreateRequest.verify(message.storageBackupCreateRequest)
          if (error) { return 'storageBackupCreateRequest.' + error }
        }
      }
      if (message.storageBackupRestoreRequest != null && message.hasOwnProperty('storageBackupRestoreRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.BackupRestoreRequest.verify(message.storageBackupRestoreRequest)
          if (error) { return 'storageBackupRestoreRequest.' + error }
        }
      }
      if (message.storageTarExtractRequest != null && message.hasOwnProperty('storageTarExtractRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Storage.TarExtractRequest.verify(message.storageTarExtractRequest)
          if (error) { return 'storageTarExtractRequest.' + error }
        }
      }
      if (message.appStartRequest != null && message.hasOwnProperty('appStartRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.StartRequest.verify(message.appStartRequest)
          if (error) { return 'appStartRequest.' + error }
        }
      }
      if (message.appLockStatusRequest != null && message.hasOwnProperty('appLockStatusRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.LockStatusRequest.verify(message.appLockStatusRequest)
          if (error) { return 'appLockStatusRequest.' + error }
        }
      }
      if (message.appLockStatusResponse != null && message.hasOwnProperty('appLockStatusResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.LockStatusResponse.verify(message.appLockStatusResponse)
          if (error) { return 'appLockStatusResponse.' + error }
        }
      }
      if (message.appExitRequest != null && message.hasOwnProperty('appExitRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.AppExitRequest.verify(message.appExitRequest)
          if (error) { return 'appExitRequest.' + error }
        }
      }
      if (message.appLoadFileRequest != null && message.hasOwnProperty('appLoadFileRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.AppLoadFileRequest.verify(message.appLoadFileRequest)
          if (error) { return 'appLoadFileRequest.' + error }
        }
      }
      if (message.appButtonPressRequest != null && message.hasOwnProperty('appButtonPressRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.AppButtonPressRequest.verify(message.appButtonPressRequest)
          if (error) { return 'appButtonPressRequest.' + error }
        }
      }
      if (message.appButtonReleaseRequest != null && message.hasOwnProperty('appButtonReleaseRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.AppButtonReleaseRequest.verify(message.appButtonReleaseRequest)
          if (error) { return 'appButtonReleaseRequest.' + error }
        }
      }
      if (message.appGetErrorRequest != null && message.hasOwnProperty('appGetErrorRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.GetErrorRequest.verify(message.appGetErrorRequest)
          if (error) { return 'appGetErrorRequest.' + error }
        }
      }
      if (message.appGetErrorResponse != null && message.hasOwnProperty('appGetErrorResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.GetErrorResponse.verify(message.appGetErrorResponse)
          if (error) { return 'appGetErrorResponse.' + error }
        }
      }
      if (message.appDataExchangeRequest != null && message.hasOwnProperty('appDataExchangeRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.DataExchangeRequest.verify(message.appDataExchangeRequest)
          if (error) { return 'appDataExchangeRequest.' + error }
        }
      }
      if (message.guiStartScreenStreamRequest != null && message.hasOwnProperty('guiStartScreenStreamRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.StartScreenStreamRequest.verify(message.guiStartScreenStreamRequest)
          if (error) { return 'guiStartScreenStreamRequest.' + error }
        }
      }
      if (message.guiStopScreenStreamRequest != null && message.hasOwnProperty('guiStopScreenStreamRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.StopScreenStreamRequest.verify(message.guiStopScreenStreamRequest)
          if (error) { return 'guiStopScreenStreamRequest.' + error }
        }
      }
      if (message.guiScreenFrame != null && message.hasOwnProperty('guiScreenFrame')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.ScreenFrame.verify(message.guiScreenFrame)
          if (error) { return 'guiScreenFrame.' + error }
        }
      }
      if (message.guiSendInputEventRequest != null && message.hasOwnProperty('guiSendInputEventRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.SendInputEventRequest.verify(message.guiSendInputEventRequest)
          if (error) { return 'guiSendInputEventRequest.' + error }
        }
      }
      if (message.guiStartVirtualDisplayRequest != null && message.hasOwnProperty('guiStartVirtualDisplayRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.StartVirtualDisplayRequest.verify(message.guiStartVirtualDisplayRequest)
          if (error) { return 'guiStartVirtualDisplayRequest.' + error }
        }
      }
      if (message.guiStopVirtualDisplayRequest != null && message.hasOwnProperty('guiStopVirtualDisplayRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gui.StopVirtualDisplayRequest.verify(message.guiStopVirtualDisplayRequest)
          if (error) { return 'guiStopVirtualDisplayRequest.' + error }
        }
      }
      if (message.gpioSetPinMode != null && message.hasOwnProperty('gpioSetPinMode')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.SetPinMode.verify(message.gpioSetPinMode)
          if (error) { return 'gpioSetPinMode.' + error }
        }
      }
      if (message.gpioSetInputPull != null && message.hasOwnProperty('gpioSetInputPull')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.SetInputPull.verify(message.gpioSetInputPull)
          if (error) { return 'gpioSetInputPull.' + error }
        }
      }
      if (message.gpioGetPinMode != null && message.hasOwnProperty('gpioGetPinMode')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.GetPinMode.verify(message.gpioGetPinMode)
          if (error) { return 'gpioGetPinMode.' + error }
        }
      }
      if (message.gpioGetPinModeResponse != null && message.hasOwnProperty('gpioGetPinModeResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.GetPinModeResponse.verify(message.gpioGetPinModeResponse)
          if (error) { return 'gpioGetPinModeResponse.' + error }
        }
      }
      if (message.gpioReadPin != null && message.hasOwnProperty('gpioReadPin')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.ReadPin.verify(message.gpioReadPin)
          if (error) { return 'gpioReadPin.' + error }
        }
      }
      if (message.gpioReadPinResponse != null && message.hasOwnProperty('gpioReadPinResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.ReadPinResponse.verify(message.gpioReadPinResponse)
          if (error) { return 'gpioReadPinResponse.' + error }
        }
      }
      if (message.gpioWritePin != null && message.hasOwnProperty('gpioWritePin')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Gpio.WritePin.verify(message.gpioWritePin)
          if (error) { return 'gpioWritePin.' + error }
        }
      }
      if (message.appStateResponse != null && message.hasOwnProperty('appStateResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_App.AppStateResponse.verify(message.appStateResponse)
          if (error) { return 'appStateResponse.' + error }
        }
      }
      if (message.propertyGetRequest != null && message.hasOwnProperty('propertyGetRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Property.GetRequest.verify(message.propertyGetRequest)
          if (error) { return 'propertyGetRequest.' + error }
        }
      }
      if (message.propertyGetResponse != null && message.hasOwnProperty('propertyGetResponse')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Property.GetResponse.verify(message.propertyGetResponse)
          if (error) { return 'propertyGetResponse.' + error }
        }
      }
      if (message.desktopIsLockedRequest != null && message.hasOwnProperty('desktopIsLockedRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Desktop.IsLockedRequest.verify(message.desktopIsLockedRequest)
          if (error) { return 'desktopIsLockedRequest.' + error }
        }
      }
      if (message.desktopUnlockRequest != null && message.hasOwnProperty('desktopUnlockRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Desktop.UnlockRequest.verify(message.desktopUnlockRequest)
          if (error) { return 'desktopUnlockRequest.' + error }
        }
      }
      if (message.desktopStatusSubscribeRequest != null && message.hasOwnProperty('desktopStatusSubscribeRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Desktop.StatusSubscribeRequest.verify(message.desktopStatusSubscribeRequest)
          if (error) { return 'desktopStatusSubscribeRequest.' + error }
        }
      }
      if (message.desktopStatusUnsubscribeRequest != null && message.hasOwnProperty('desktopStatusUnsubscribeRequest')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Desktop.StatusUnsubscribeRequest.verify(message.desktopStatusUnsubscribeRequest)
          if (error) { return 'desktopStatusUnsubscribeRequest.' + error }
        }
      }
      if (message.desktopStatus != null && message.hasOwnProperty('desktopStatus')) {
        if (properties.content === 1) { return 'content: multiple values' }
        properties.content = 1
        {
          const error = $root.PB_Desktop.Status.verify(message.desktopStatus)
          if (error) { return 'desktopStatus.' + error }
        }
      }
      return null
    }

    Main.fromObject = function fromObject (object) {
      if (object instanceof $root.PB.Main) { return object }
      const message = new $root.PB.Main()
      if (object.commandId != null) { message.commandId = object.commandId >>> 0 }
      switch (object.commandStatus) {
        case 'OK':
        case 0:
          message.commandStatus = 0
          break
        case 'ERROR':
        case 1:
          message.commandStatus = 1
          break
        case 'ERROR_DECODE':
        case 2:
          message.commandStatus = 2
          break
        case 'ERROR_NOT_IMPLEMENTED':
        case 3:
          message.commandStatus = 3
          break
        case 'ERROR_BUSY':
        case 4:
          message.commandStatus = 4
          break
        case 'ERROR_CONTINUOUS_COMMAND_INTERRUPTED':
        case 14:
          message.commandStatus = 14
          break
        case 'ERROR_INVALID_PARAMETERS':
        case 15:
          message.commandStatus = 15
          break
        case 'ERROR_STORAGE_NOT_READY':
        case 5:
          message.commandStatus = 5
          break
        case 'ERROR_STORAGE_EXIST':
        case 6:
          message.commandStatus = 6
          break
        case 'ERROR_STORAGE_NOT_EXIST':
        case 7:
          message.commandStatus = 7
          break
        case 'ERROR_STORAGE_INVALID_PARAMETER':
        case 8:
          message.commandStatus = 8
          break
        case 'ERROR_STORAGE_DENIED':
        case 9:
          message.commandStatus = 9
          break
        case 'ERROR_STORAGE_INVALID_NAME':
        case 10:
          message.commandStatus = 10
          break
        case 'ERROR_STORAGE_INTERNAL':
        case 11:
          message.commandStatus = 11
          break
        case 'ERROR_STORAGE_NOT_IMPLEMENTED':
        case 12:
          message.commandStatus = 12
          break
        case 'ERROR_STORAGE_ALREADY_OPEN':
        case 13:
          message.commandStatus = 13
          break
        case 'ERROR_STORAGE_DIR_NOT_EMPTY':
        case 18:
          message.commandStatus = 18
          break
        case 'ERROR_APP_CANT_START':
        case 16:
          message.commandStatus = 16
          break
        case 'ERROR_APP_SYSTEM_LOCKED':
        case 17:
          message.commandStatus = 17
          break
        case 'ERROR_APP_NOT_RUNNING':
        case 21:
          message.commandStatus = 21
          break
        case 'ERROR_APP_CMD_ERROR':
        case 22:
          message.commandStatus = 22
          break
        case 'ERROR_VIRTUAL_DISPLAY_ALREADY_STARTED':
        case 19:
          message.commandStatus = 19
          break
        case 'ERROR_VIRTUAL_DISPLAY_NOT_STARTED':
        case 20:
          message.commandStatus = 20
          break
        case 'ERROR_GPIO_MODE_INCORRECT':
        case 58:
          message.commandStatus = 58
          break
        case 'ERROR_GPIO_UNKNOWN_PIN_MODE':
        case 59:
          message.commandStatus = 59
          break
      }
      if (object.hasNext != null) { message.hasNext = Boolean(object.hasNext) }
      if (object.empty != null) {
        if (typeof object.empty !== 'object') { throw TypeError('.PB.Main.empty: object expected') }
        message.empty = $root.PB.Empty.fromObject(object.empty)
      }
      if (object.stopSession != null) {
        if (typeof object.stopSession !== 'object') { throw TypeError('.PB.Main.stopSession: object expected') }
        message.stopSession = $root.PB.StopSession.fromObject(object.stopSession)
      }
      if (object.systemPingRequest != null) {
        if (typeof object.systemPingRequest !== 'object') { throw TypeError('.PB.Main.systemPingRequest: object expected') }
        message.systemPingRequest = $root.PB_System.PingRequest.fromObject(object.systemPingRequest)
      }
      if (object.systemPingResponse != null) {
        if (typeof object.systemPingResponse !== 'object') { throw TypeError('.PB.Main.systemPingResponse: object expected') }
        message.systemPingResponse = $root.PB_System.PingResponse.fromObject(object.systemPingResponse)
      }
      if (object.systemRebootRequest != null) {
        if (typeof object.systemRebootRequest !== 'object') { throw TypeError('.PB.Main.systemRebootRequest: object expected') }
        message.systemRebootRequest = $root.PB_System.RebootRequest.fromObject(object.systemRebootRequest)
      }
      if (object.systemDeviceInfoRequest != null) {
        if (typeof object.systemDeviceInfoRequest !== 'object') { throw TypeError('.PB.Main.systemDeviceInfoRequest: object expected') }
        message.systemDeviceInfoRequest = $root.PB_System.DeviceInfoRequest.fromObject(object.systemDeviceInfoRequest)
      }
      if (object.systemDeviceInfoResponse != null) {
        if (typeof object.systemDeviceInfoResponse !== 'object') { throw TypeError('.PB.Main.systemDeviceInfoResponse: object expected') }
        message.systemDeviceInfoResponse = $root.PB_System.DeviceInfoResponse.fromObject(object.systemDeviceInfoResponse)
      }
      if (object.systemFactoryResetRequest != null) {
        if (typeof object.systemFactoryResetRequest !== 'object') { throw TypeError('.PB.Main.systemFactoryResetRequest: object expected') }
        message.systemFactoryResetRequest = $root.PB_System.FactoryResetRequest.fromObject(object.systemFactoryResetRequest)
      }
      if (object.systemGetDatetimeRequest != null) {
        if (typeof object.systemGetDatetimeRequest !== 'object') { throw TypeError('.PB.Main.systemGetDatetimeRequest: object expected') }
        message.systemGetDatetimeRequest = $root.PB_System.GetDateTimeRequest.fromObject(object.systemGetDatetimeRequest)
      }
      if (object.systemGetDatetimeResponse != null) {
        if (typeof object.systemGetDatetimeResponse !== 'object') { throw TypeError('.PB.Main.systemGetDatetimeResponse: object expected') }
        message.systemGetDatetimeResponse = $root.PB_System.GetDateTimeResponse.fromObject(object.systemGetDatetimeResponse)
      }
      if (object.systemSetDatetimeRequest != null) {
        if (typeof object.systemSetDatetimeRequest !== 'object') { throw TypeError('.PB.Main.systemSetDatetimeRequest: object expected') }
        message.systemSetDatetimeRequest = $root.PB_System.SetDateTimeRequest.fromObject(object.systemSetDatetimeRequest)
      }
      if (object.systemPlayAudiovisualAlertRequest != null) {
        if (typeof object.systemPlayAudiovisualAlertRequest !== 'object') { throw TypeError('.PB.Main.systemPlayAudiovisualAlertRequest: object expected') }
        message.systemPlayAudiovisualAlertRequest = $root.PB_System.PlayAudiovisualAlertRequest.fromObject(object.systemPlayAudiovisualAlertRequest)
      }
      if (object.systemProtobufVersionRequest != null) {
        if (typeof object.systemProtobufVersionRequest !== 'object') { throw TypeError('.PB.Main.systemProtobufVersionRequest: object expected') }
        message.systemProtobufVersionRequest = $root.PB_System.ProtobufVersionRequest.fromObject(object.systemProtobufVersionRequest)
      }
      if (object.systemProtobufVersionResponse != null) {
        if (typeof object.systemProtobufVersionResponse !== 'object') { throw TypeError('.PB.Main.systemProtobufVersionResponse: object expected') }
        message.systemProtobufVersionResponse = $root.PB_System.ProtobufVersionResponse.fromObject(object.systemProtobufVersionResponse)
      }
      if (object.systemUpdateRequest != null) {
        if (typeof object.systemUpdateRequest !== 'object') { throw TypeError('.PB.Main.systemUpdateRequest: object expected') }
        message.systemUpdateRequest = $root.PB_System.UpdateRequest.fromObject(object.systemUpdateRequest)
      }
      if (object.systemUpdateResponse != null) {
        if (typeof object.systemUpdateResponse !== 'object') { throw TypeError('.PB.Main.systemUpdateResponse: object expected') }
        message.systemUpdateResponse = $root.PB_System.UpdateResponse.fromObject(object.systemUpdateResponse)
      }
      if (object.systemPowerInfoRequest != null) {
        if (typeof object.systemPowerInfoRequest !== 'object') { throw TypeError('.PB.Main.systemPowerInfoRequest: object expected') }
        message.systemPowerInfoRequest = $root.PB_System.PowerInfoRequest.fromObject(object.systemPowerInfoRequest)
      }
      if (object.systemPowerInfoResponse != null) {
        if (typeof object.systemPowerInfoResponse !== 'object') { throw TypeError('.PB.Main.systemPowerInfoResponse: object expected') }
        message.systemPowerInfoResponse = $root.PB_System.PowerInfoResponse.fromObject(object.systemPowerInfoResponse)
      }
      if (object.storageInfoRequest != null) {
        if (typeof object.storageInfoRequest !== 'object') { throw TypeError('.PB.Main.storageInfoRequest: object expected') }
        message.storageInfoRequest = $root.PB_Storage.InfoRequest.fromObject(object.storageInfoRequest)
      }
      if (object.storageInfoResponse != null) {
        if (typeof object.storageInfoResponse !== 'object') { throw TypeError('.PB.Main.storageInfoResponse: object expected') }
        message.storageInfoResponse = $root.PB_Storage.InfoResponse.fromObject(object.storageInfoResponse)
      }
      if (object.storageTimestampRequest != null) {
        if (typeof object.storageTimestampRequest !== 'object') { throw TypeError('.PB.Main.storageTimestampRequest: object expected') }
        message.storageTimestampRequest = $root.PB_Storage.TimestampRequest.fromObject(object.storageTimestampRequest)
      }
      if (object.storageTimestampResponse != null) {
        if (typeof object.storageTimestampResponse !== 'object') { throw TypeError('.PB.Main.storageTimestampResponse: object expected') }
        message.storageTimestampResponse = $root.PB_Storage.TimestampResponse.fromObject(object.storageTimestampResponse)
      }
      if (object.storageStatRequest != null) {
        if (typeof object.storageStatRequest !== 'object') { throw TypeError('.PB.Main.storageStatRequest: object expected') }
        message.storageStatRequest = $root.PB_Storage.StatRequest.fromObject(object.storageStatRequest)
      }
      if (object.storageStatResponse != null) {
        if (typeof object.storageStatResponse !== 'object') { throw TypeError('.PB.Main.storageStatResponse: object expected') }
        message.storageStatResponse = $root.PB_Storage.StatResponse.fromObject(object.storageStatResponse)
      }
      if (object.storageListRequest != null) {
        if (typeof object.storageListRequest !== 'object') { throw TypeError('.PB.Main.storageListRequest: object expected') }
        message.storageListRequest = $root.PB_Storage.ListRequest.fromObject(object.storageListRequest)
      }
      if (object.storageListResponse != null) {
        if (typeof object.storageListResponse !== 'object') { throw TypeError('.PB.Main.storageListResponse: object expected') }
        message.storageListResponse = $root.PB_Storage.ListResponse.fromObject(object.storageListResponse)
      }
      if (object.storageReadRequest != null) {
        if (typeof object.storageReadRequest !== 'object') { throw TypeError('.PB.Main.storageReadRequest: object expected') }
        message.storageReadRequest = $root.PB_Storage.ReadRequest.fromObject(object.storageReadRequest)
      }
      if (object.storageReadResponse != null) {
        if (typeof object.storageReadResponse !== 'object') { throw TypeError('.PB.Main.storageReadResponse: object expected') }
        message.storageReadResponse = $root.PB_Storage.ReadResponse.fromObject(object.storageReadResponse)
      }
      if (object.storageWriteRequest != null) {
        if (typeof object.storageWriteRequest !== 'object') { throw TypeError('.PB.Main.storageWriteRequest: object expected') }
        message.storageWriteRequest = $root.PB_Storage.WriteRequest.fromObject(object.storageWriteRequest)
      }
      if (object.storageDeleteRequest != null) {
        if (typeof object.storageDeleteRequest !== 'object') { throw TypeError('.PB.Main.storageDeleteRequest: object expected') }
        message.storageDeleteRequest = $root.PB_Storage.DeleteRequest.fromObject(object.storageDeleteRequest)
      }
      if (object.storageMkdirRequest != null) {
        if (typeof object.storageMkdirRequest !== 'object') { throw TypeError('.PB.Main.storageMkdirRequest: object expected') }
        message.storageMkdirRequest = $root.PB_Storage.MkdirRequest.fromObject(object.storageMkdirRequest)
      }
      if (object.storageMd5sumRequest != null) {
        if (typeof object.storageMd5sumRequest !== 'object') { throw TypeError('.PB.Main.storageMd5sumRequest: object expected') }
        message.storageMd5sumRequest = $root.PB_Storage.Md5sumRequest.fromObject(object.storageMd5sumRequest)
      }
      if (object.storageMd5sumResponse != null) {
        if (typeof object.storageMd5sumResponse !== 'object') { throw TypeError('.PB.Main.storageMd5sumResponse: object expected') }
        message.storageMd5sumResponse = $root.PB_Storage.Md5sumResponse.fromObject(object.storageMd5sumResponse)
      }
      if (object.storageRenameRequest != null) {
        if (typeof object.storageRenameRequest !== 'object') { throw TypeError('.PB.Main.storageRenameRequest: object expected') }
        message.storageRenameRequest = $root.PB_Storage.RenameRequest.fromObject(object.storageRenameRequest)
      }
      if (object.storageBackupCreateRequest != null) {
        if (typeof object.storageBackupCreateRequest !== 'object') { throw TypeError('.PB.Main.storageBackupCreateRequest: object expected') }
        message.storageBackupCreateRequest = $root.PB_Storage.BackupCreateRequest.fromObject(object.storageBackupCreateRequest)
      }
      if (object.storageBackupRestoreRequest != null) {
        if (typeof object.storageBackupRestoreRequest !== 'object') { throw TypeError('.PB.Main.storageBackupRestoreRequest: object expected') }
        message.storageBackupRestoreRequest = $root.PB_Storage.BackupRestoreRequest.fromObject(object.storageBackupRestoreRequest)
      }
      if (object.storageTarExtractRequest != null) {
        if (typeof object.storageTarExtractRequest !== 'object') { throw TypeError('.PB.Main.storageTarExtractRequest: object expected') }
        message.storageTarExtractRequest = $root.PB_Storage.TarExtractRequest.fromObject(object.storageTarExtractRequest)
      }
      if (object.appStartRequest != null) {
        if (typeof object.appStartRequest !== 'object') { throw TypeError('.PB.Main.appStartRequest: object expected') }
        message.appStartRequest = $root.PB_App.StartRequest.fromObject(object.appStartRequest)
      }
      if (object.appLockStatusRequest != null) {
        if (typeof object.appLockStatusRequest !== 'object') { throw TypeError('.PB.Main.appLockStatusRequest: object expected') }
        message.appLockStatusRequest = $root.PB_App.LockStatusRequest.fromObject(object.appLockStatusRequest)
      }
      if (object.appLockStatusResponse != null) {
        if (typeof object.appLockStatusResponse !== 'object') { throw TypeError('.PB.Main.appLockStatusResponse: object expected') }
        message.appLockStatusResponse = $root.PB_App.LockStatusResponse.fromObject(object.appLockStatusResponse)
      }
      if (object.appExitRequest != null) {
        if (typeof object.appExitRequest !== 'object') { throw TypeError('.PB.Main.appExitRequest: object expected') }
        message.appExitRequest = $root.PB_App.AppExitRequest.fromObject(object.appExitRequest)
      }
      if (object.appLoadFileRequest != null) {
        if (typeof object.appLoadFileRequest !== 'object') { throw TypeError('.PB.Main.appLoadFileRequest: object expected') }
        message.appLoadFileRequest = $root.PB_App.AppLoadFileRequest.fromObject(object.appLoadFileRequest)
      }
      if (object.appButtonPressRequest != null) {
        if (typeof object.appButtonPressRequest !== 'object') { throw TypeError('.PB.Main.appButtonPressRequest: object expected') }
        message.appButtonPressRequest = $root.PB_App.AppButtonPressRequest.fromObject(object.appButtonPressRequest)
      }
      if (object.appButtonReleaseRequest != null) {
        if (typeof object.appButtonReleaseRequest !== 'object') { throw TypeError('.PB.Main.appButtonReleaseRequest: object expected') }
        message.appButtonReleaseRequest = $root.PB_App.AppButtonReleaseRequest.fromObject(object.appButtonReleaseRequest)
      }
      if (object.appGetErrorRequest != null) {
        if (typeof object.appGetErrorRequest !== 'object') { throw TypeError('.PB.Main.appGetErrorRequest: object expected') }
        message.appGetErrorRequest = $root.PB_App.GetErrorRequest.fromObject(object.appGetErrorRequest)
      }
      if (object.appGetErrorResponse != null) {
        if (typeof object.appGetErrorResponse !== 'object') { throw TypeError('.PB.Main.appGetErrorResponse: object expected') }
        message.appGetErrorResponse = $root.PB_App.GetErrorResponse.fromObject(object.appGetErrorResponse)
      }
      if (object.appDataExchangeRequest != null) {
        if (typeof object.appDataExchangeRequest !== 'object') { throw TypeError('.PB.Main.appDataExchangeRequest: object expected') }
        message.appDataExchangeRequest = $root.PB_App.DataExchangeRequest.fromObject(object.appDataExchangeRequest)
      }
      if (object.guiStartScreenStreamRequest != null) {
        if (typeof object.guiStartScreenStreamRequest !== 'object') { throw TypeError('.PB.Main.guiStartScreenStreamRequest: object expected') }
        message.guiStartScreenStreamRequest = $root.PB_Gui.StartScreenStreamRequest.fromObject(object.guiStartScreenStreamRequest)
      }
      if (object.guiStopScreenStreamRequest != null) {
        if (typeof object.guiStopScreenStreamRequest !== 'object') { throw TypeError('.PB.Main.guiStopScreenStreamRequest: object expected') }
        message.guiStopScreenStreamRequest = $root.PB_Gui.StopScreenStreamRequest.fromObject(object.guiStopScreenStreamRequest)
      }
      if (object.guiScreenFrame != null) {
        if (typeof object.guiScreenFrame !== 'object') { throw TypeError('.PB.Main.guiScreenFrame: object expected') }
        message.guiScreenFrame = $root.PB_Gui.ScreenFrame.fromObject(object.guiScreenFrame)
      }
      if (object.guiSendInputEventRequest != null) {
        if (typeof object.guiSendInputEventRequest !== 'object') { throw TypeError('.PB.Main.guiSendInputEventRequest: object expected') }
        message.guiSendInputEventRequest = $root.PB_Gui.SendInputEventRequest.fromObject(object.guiSendInputEventRequest)
      }
      if (object.guiStartVirtualDisplayRequest != null) {
        if (typeof object.guiStartVirtualDisplayRequest !== 'object') { throw TypeError('.PB.Main.guiStartVirtualDisplayRequest: object expected') }
        message.guiStartVirtualDisplayRequest = $root.PB_Gui.StartVirtualDisplayRequest.fromObject(object.guiStartVirtualDisplayRequest)
      }
      if (object.guiStopVirtualDisplayRequest != null) {
        if (typeof object.guiStopVirtualDisplayRequest !== 'object') { throw TypeError('.PB.Main.guiStopVirtualDisplayRequest: object expected') }
        message.guiStopVirtualDisplayRequest = $root.PB_Gui.StopVirtualDisplayRequest.fromObject(object.guiStopVirtualDisplayRequest)
      }
      if (object.gpioSetPinMode != null) {
        if (typeof object.gpioSetPinMode !== 'object') { throw TypeError('.PB.Main.gpioSetPinMode: object expected') }
        message.gpioSetPinMode = $root.PB_Gpio.SetPinMode.fromObject(object.gpioSetPinMode)
      }
      if (object.gpioSetInputPull != null) {
        if (typeof object.gpioSetInputPull !== 'object') { throw TypeError('.PB.Main.gpioSetInputPull: object expected') }
        message.gpioSetInputPull = $root.PB_Gpio.SetInputPull.fromObject(object.gpioSetInputPull)
      }
      if (object.gpioGetPinMode != null) {
        if (typeof object.gpioGetPinMode !== 'object') { throw TypeError('.PB.Main.gpioGetPinMode: object expected') }
        message.gpioGetPinMode = $root.PB_Gpio.GetPinMode.fromObject(object.gpioGetPinMode)
      }
      if (object.gpioGetPinModeResponse != null) {
        if (typeof object.gpioGetPinModeResponse !== 'object') { throw TypeError('.PB.Main.gpioGetPinModeResponse: object expected') }
        message.gpioGetPinModeResponse = $root.PB_Gpio.GetPinModeResponse.fromObject(object.gpioGetPinModeResponse)
      }
      if (object.gpioReadPin != null) {
        if (typeof object.gpioReadPin !== 'object') { throw TypeError('.PB.Main.gpioReadPin: object expected') }
        message.gpioReadPin = $root.PB_Gpio.ReadPin.fromObject(object.gpioReadPin)
      }
      if (object.gpioReadPinResponse != null) {
        if (typeof object.gpioReadPinResponse !== 'object') { throw TypeError('.PB.Main.gpioReadPinResponse: object expected') }
        message.gpioReadPinResponse = $root.PB_Gpio.ReadPinResponse.fromObject(object.gpioReadPinResponse)
      }
      if (object.gpioWritePin != null) {
        if (typeof object.gpioWritePin !== 'object') { throw TypeError('.PB.Main.gpioWritePin: object expected') }
        message.gpioWritePin = $root.PB_Gpio.WritePin.fromObject(object.gpioWritePin)
      }
      if (object.appStateResponse != null) {
        if (typeof object.appStateResponse !== 'object') { throw TypeError('.PB.Main.appStateResponse: object expected') }
        message.appStateResponse = $root.PB_App.AppStateResponse.fromObject(object.appStateResponse)
      }
      if (object.propertyGetRequest != null) {
        if (typeof object.propertyGetRequest !== 'object') { throw TypeError('.PB.Main.propertyGetRequest: object expected') }
        message.propertyGetRequest = $root.PB_Property.GetRequest.fromObject(object.propertyGetRequest)
      }
      if (object.propertyGetResponse != null) {
        if (typeof object.propertyGetResponse !== 'object') { throw TypeError('.PB.Main.propertyGetResponse: object expected') }
        message.propertyGetResponse = $root.PB_Property.GetResponse.fromObject(object.propertyGetResponse)
      }
      if (object.desktopIsLockedRequest != null) {
        if (typeof object.desktopIsLockedRequest !== 'object') { throw TypeError('.PB.Main.desktopIsLockedRequest: object expected') }
        message.desktopIsLockedRequest = $root.PB_Desktop.IsLockedRequest.fromObject(object.desktopIsLockedRequest)
      }
      if (object.desktopUnlockRequest != null) {
        if (typeof object.desktopUnlockRequest !== 'object') { throw TypeError('.PB.Main.desktopUnlockRequest: object expected') }
        message.desktopUnlockRequest = $root.PB_Desktop.UnlockRequest.fromObject(object.desktopUnlockRequest)
      }
      if (object.desktopStatusSubscribeRequest != null) {
        if (typeof object.desktopStatusSubscribeRequest !== 'object') { throw TypeError('.PB.Main.desktopStatusSubscribeRequest: object expected') }
        message.desktopStatusSubscribeRequest = $root.PB_Desktop.StatusSubscribeRequest.fromObject(object.desktopStatusSubscribeRequest)
      }
      if (object.desktopStatusUnsubscribeRequest != null) {
        if (typeof object.desktopStatusUnsubscribeRequest !== 'object') { throw TypeError('.PB.Main.desktopStatusUnsubscribeRequest: object expected') }
        message.desktopStatusUnsubscribeRequest = $root.PB_Desktop.StatusUnsubscribeRequest.fromObject(object.desktopStatusUnsubscribeRequest)
      }
      if (object.desktopStatus != null) {
        if (typeof object.desktopStatus !== 'object') { throw TypeError('.PB.Main.desktopStatus: object expected') }
        message.desktopStatus = $root.PB_Desktop.Status.fromObject(object.desktopStatus)
      }
      return message
    }

    Main.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.commandId = 0
        object.commandStatus = options.enums === String ? 'OK' : 0
        object.hasNext = false
      }
      if (message.commandId != null && message.hasOwnProperty('commandId')) { object.commandId = message.commandId }
      if (message.commandStatus != null && message.hasOwnProperty('commandStatus')) { object.commandStatus = options.enums === String ? $root.PB.CommandStatus[message.commandStatus] : message.commandStatus }
      if (message.hasNext != null && message.hasOwnProperty('hasNext')) { object.hasNext = message.hasNext }
      if (message.empty != null && message.hasOwnProperty('empty')) {
        object.empty = $root.PB.Empty.toObject(message.empty, options)
        if (options.oneofs) { object.content = 'empty' }
      }
      if (message.systemPingRequest != null && message.hasOwnProperty('systemPingRequest')) {
        object.systemPingRequest = $root.PB_System.PingRequest.toObject(message.systemPingRequest, options)
        if (options.oneofs) { object.content = 'systemPingRequest' }
      }
      if (message.systemPingResponse != null && message.hasOwnProperty('systemPingResponse')) {
        object.systemPingResponse = $root.PB_System.PingResponse.toObject(message.systemPingResponse, options)
        if (options.oneofs) { object.content = 'systemPingResponse' }
      }
      if (message.storageListRequest != null && message.hasOwnProperty('storageListRequest')) {
        object.storageListRequest = $root.PB_Storage.ListRequest.toObject(message.storageListRequest, options)
        if (options.oneofs) { object.content = 'storageListRequest' }
      }
      if (message.storageListResponse != null && message.hasOwnProperty('storageListResponse')) {
        object.storageListResponse = $root.PB_Storage.ListResponse.toObject(message.storageListResponse, options)
        if (options.oneofs) { object.content = 'storageListResponse' }
      }
      if (message.storageReadRequest != null && message.hasOwnProperty('storageReadRequest')) {
        object.storageReadRequest = $root.PB_Storage.ReadRequest.toObject(message.storageReadRequest, options)
        if (options.oneofs) { object.content = 'storageReadRequest' }
      }
      if (message.storageReadResponse != null && message.hasOwnProperty('storageReadResponse')) {
        object.storageReadResponse = $root.PB_Storage.ReadResponse.toObject(message.storageReadResponse, options)
        if (options.oneofs) { object.content = 'storageReadResponse' }
      }
      if (message.storageWriteRequest != null && message.hasOwnProperty('storageWriteRequest')) {
        object.storageWriteRequest = $root.PB_Storage.WriteRequest.toObject(message.storageWriteRequest, options)
        if (options.oneofs) { object.content = 'storageWriteRequest' }
      }
      if (message.storageDeleteRequest != null && message.hasOwnProperty('storageDeleteRequest')) {
        object.storageDeleteRequest = $root.PB_Storage.DeleteRequest.toObject(message.storageDeleteRequest, options)
        if (options.oneofs) { object.content = 'storageDeleteRequest' }
      }
      if (message.storageMkdirRequest != null && message.hasOwnProperty('storageMkdirRequest')) {
        object.storageMkdirRequest = $root.PB_Storage.MkdirRequest.toObject(message.storageMkdirRequest, options)
        if (options.oneofs) { object.content = 'storageMkdirRequest' }
      }
      if (message.storageMd5sumRequest != null && message.hasOwnProperty('storageMd5sumRequest')) {
        object.storageMd5sumRequest = $root.PB_Storage.Md5sumRequest.toObject(message.storageMd5sumRequest, options)
        if (options.oneofs) { object.content = 'storageMd5sumRequest' }
      }
      if (message.storageMd5sumResponse != null && message.hasOwnProperty('storageMd5sumResponse')) {
        object.storageMd5sumResponse = $root.PB_Storage.Md5sumResponse.toObject(message.storageMd5sumResponse, options)
        if (options.oneofs) { object.content = 'storageMd5sumResponse' }
      }
      if (message.appStartRequest != null && message.hasOwnProperty('appStartRequest')) {
        object.appStartRequest = $root.PB_App.StartRequest.toObject(message.appStartRequest, options)
        if (options.oneofs) { object.content = 'appStartRequest' }
      }
      if (message.appLockStatusRequest != null && message.hasOwnProperty('appLockStatusRequest')) {
        object.appLockStatusRequest = $root.PB_App.LockStatusRequest.toObject(message.appLockStatusRequest, options)
        if (options.oneofs) { object.content = 'appLockStatusRequest' }
      }
      if (message.appLockStatusResponse != null && message.hasOwnProperty('appLockStatusResponse')) {
        object.appLockStatusResponse = $root.PB_App.LockStatusResponse.toObject(message.appLockStatusResponse, options)
        if (options.oneofs) { object.content = 'appLockStatusResponse' }
      }
      if (message.stopSession != null && message.hasOwnProperty('stopSession')) {
        object.stopSession = $root.PB.StopSession.toObject(message.stopSession, options)
        if (options.oneofs) { object.content = 'stopSession' }
      }
      if (message.guiStartScreenStreamRequest != null && message.hasOwnProperty('guiStartScreenStreamRequest')) {
        object.guiStartScreenStreamRequest = $root.PB_Gui.StartScreenStreamRequest.toObject(message.guiStartScreenStreamRequest, options)
        if (options.oneofs) { object.content = 'guiStartScreenStreamRequest' }
      }
      if (message.guiStopScreenStreamRequest != null && message.hasOwnProperty('guiStopScreenStreamRequest')) {
        object.guiStopScreenStreamRequest = $root.PB_Gui.StopScreenStreamRequest.toObject(message.guiStopScreenStreamRequest, options)
        if (options.oneofs) { object.content = 'guiStopScreenStreamRequest' }
      }
      if (message.guiScreenFrame != null && message.hasOwnProperty('guiScreenFrame')) {
        object.guiScreenFrame = $root.PB_Gui.ScreenFrame.toObject(message.guiScreenFrame, options)
        if (options.oneofs) { object.content = 'guiScreenFrame' }
      }
      if (message.guiSendInputEventRequest != null && message.hasOwnProperty('guiSendInputEventRequest')) {
        object.guiSendInputEventRequest = $root.PB_Gui.SendInputEventRequest.toObject(message.guiSendInputEventRequest, options)
        if (options.oneofs) { object.content = 'guiSendInputEventRequest' }
      }
      if (message.storageStatRequest != null && message.hasOwnProperty('storageStatRequest')) {
        object.storageStatRequest = $root.PB_Storage.StatRequest.toObject(message.storageStatRequest, options)
        if (options.oneofs) { object.content = 'storageStatRequest' }
      }
      if (message.storageStatResponse != null && message.hasOwnProperty('storageStatResponse')) {
        object.storageStatResponse = $root.PB_Storage.StatResponse.toObject(message.storageStatResponse, options)
        if (options.oneofs) { object.content = 'storageStatResponse' }
      }
      if (message.guiStartVirtualDisplayRequest != null && message.hasOwnProperty('guiStartVirtualDisplayRequest')) {
        object.guiStartVirtualDisplayRequest = $root.PB_Gui.StartVirtualDisplayRequest.toObject(message.guiStartVirtualDisplayRequest, options)
        if (options.oneofs) { object.content = 'guiStartVirtualDisplayRequest' }
      }
      if (message.guiStopVirtualDisplayRequest != null && message.hasOwnProperty('guiStopVirtualDisplayRequest')) {
        object.guiStopVirtualDisplayRequest = $root.PB_Gui.StopVirtualDisplayRequest.toObject(message.guiStopVirtualDisplayRequest, options)
        if (options.oneofs) { object.content = 'guiStopVirtualDisplayRequest' }
      }
      if (message.storageInfoRequest != null && message.hasOwnProperty('storageInfoRequest')) {
        object.storageInfoRequest = $root.PB_Storage.InfoRequest.toObject(message.storageInfoRequest, options)
        if (options.oneofs) { object.content = 'storageInfoRequest' }
      }
      if (message.storageInfoResponse != null && message.hasOwnProperty('storageInfoResponse')) {
        object.storageInfoResponse = $root.PB_Storage.InfoResponse.toObject(message.storageInfoResponse, options)
        if (options.oneofs) { object.content = 'storageInfoResponse' }
      }
      if (message.storageRenameRequest != null && message.hasOwnProperty('storageRenameRequest')) {
        object.storageRenameRequest = $root.PB_Storage.RenameRequest.toObject(message.storageRenameRequest, options)
        if (options.oneofs) { object.content = 'storageRenameRequest' }
      }
      if (message.systemRebootRequest != null && message.hasOwnProperty('systemRebootRequest')) {
        object.systemRebootRequest = $root.PB_System.RebootRequest.toObject(message.systemRebootRequest, options)
        if (options.oneofs) { object.content = 'systemRebootRequest' }
      }
      if (message.systemDeviceInfoRequest != null && message.hasOwnProperty('systemDeviceInfoRequest')) {
        object.systemDeviceInfoRequest = $root.PB_System.DeviceInfoRequest.toObject(message.systemDeviceInfoRequest, options)
        if (options.oneofs) { object.content = 'systemDeviceInfoRequest' }
      }
      if (message.systemDeviceInfoResponse != null && message.hasOwnProperty('systemDeviceInfoResponse')) {
        object.systemDeviceInfoResponse = $root.PB_System.DeviceInfoResponse.toObject(message.systemDeviceInfoResponse, options)
        if (options.oneofs) { object.content = 'systemDeviceInfoResponse' }
      }
      if (message.systemFactoryResetRequest != null && message.hasOwnProperty('systemFactoryResetRequest')) {
        object.systemFactoryResetRequest = $root.PB_System.FactoryResetRequest.toObject(message.systemFactoryResetRequest, options)
        if (options.oneofs) { object.content = 'systemFactoryResetRequest' }
      }
      if (message.systemGetDatetimeRequest != null && message.hasOwnProperty('systemGetDatetimeRequest')) {
        object.systemGetDatetimeRequest = $root.PB_System.GetDateTimeRequest.toObject(message.systemGetDatetimeRequest, options)
        if (options.oneofs) { object.content = 'systemGetDatetimeRequest' }
      }
      if (message.systemGetDatetimeResponse != null && message.hasOwnProperty('systemGetDatetimeResponse')) {
        object.systemGetDatetimeResponse = $root.PB_System.GetDateTimeResponse.toObject(message.systemGetDatetimeResponse, options)
        if (options.oneofs) { object.content = 'systemGetDatetimeResponse' }
      }
      if (message.systemSetDatetimeRequest != null && message.hasOwnProperty('systemSetDatetimeRequest')) {
        object.systemSetDatetimeRequest = $root.PB_System.SetDateTimeRequest.toObject(message.systemSetDatetimeRequest, options)
        if (options.oneofs) { object.content = 'systemSetDatetimeRequest' }
      }
      if (message.systemPlayAudiovisualAlertRequest != null && message.hasOwnProperty('systemPlayAudiovisualAlertRequest')) {
        object.systemPlayAudiovisualAlertRequest = $root.PB_System.PlayAudiovisualAlertRequest.toObject(message.systemPlayAudiovisualAlertRequest, options)
        if (options.oneofs) { object.content = 'systemPlayAudiovisualAlertRequest' }
      }
      if (message.systemProtobufVersionRequest != null && message.hasOwnProperty('systemProtobufVersionRequest')) {
        object.systemProtobufVersionRequest = $root.PB_System.ProtobufVersionRequest.toObject(message.systemProtobufVersionRequest, options)
        if (options.oneofs) { object.content = 'systemProtobufVersionRequest' }
      }
      if (message.systemProtobufVersionResponse != null && message.hasOwnProperty('systemProtobufVersionResponse')) {
        object.systemProtobufVersionResponse = $root.PB_System.ProtobufVersionResponse.toObject(message.systemProtobufVersionResponse, options)
        if (options.oneofs) { object.content = 'systemProtobufVersionResponse' }
      }
      if (message.systemUpdateRequest != null && message.hasOwnProperty('systemUpdateRequest')) {
        object.systemUpdateRequest = $root.PB_System.UpdateRequest.toObject(message.systemUpdateRequest, options)
        if (options.oneofs) { object.content = 'systemUpdateRequest' }
      }
      if (message.storageBackupCreateRequest != null && message.hasOwnProperty('storageBackupCreateRequest')) {
        object.storageBackupCreateRequest = $root.PB_Storage.BackupCreateRequest.toObject(message.storageBackupCreateRequest, options)
        if (options.oneofs) { object.content = 'storageBackupCreateRequest' }
      }
      if (message.storageBackupRestoreRequest != null && message.hasOwnProperty('storageBackupRestoreRequest')) {
        object.storageBackupRestoreRequest = $root.PB_Storage.BackupRestoreRequest.toObject(message.storageBackupRestoreRequest, options)
        if (options.oneofs) { object.content = 'storageBackupRestoreRequest' }
      }
      if (message.systemPowerInfoRequest != null && message.hasOwnProperty('systemPowerInfoRequest')) {
        object.systemPowerInfoRequest = $root.PB_System.PowerInfoRequest.toObject(message.systemPowerInfoRequest, options)
        if (options.oneofs) { object.content = 'systemPowerInfoRequest' }
      }
      if (message.systemPowerInfoResponse != null && message.hasOwnProperty('systemPowerInfoResponse')) {
        object.systemPowerInfoResponse = $root.PB_System.PowerInfoResponse.toObject(message.systemPowerInfoResponse, options)
        if (options.oneofs) { object.content = 'systemPowerInfoResponse' }
      }
      if (message.systemUpdateResponse != null && message.hasOwnProperty('systemUpdateResponse')) {
        object.systemUpdateResponse = $root.PB_System.UpdateResponse.toObject(message.systemUpdateResponse, options)
        if (options.oneofs) { object.content = 'systemUpdateResponse' }
      }
      if (message.appExitRequest != null && message.hasOwnProperty('appExitRequest')) {
        object.appExitRequest = $root.PB_App.AppExitRequest.toObject(message.appExitRequest, options)
        if (options.oneofs) { object.content = 'appExitRequest' }
      }
      if (message.appLoadFileRequest != null && message.hasOwnProperty('appLoadFileRequest')) {
        object.appLoadFileRequest = $root.PB_App.AppLoadFileRequest.toObject(message.appLoadFileRequest, options)
        if (options.oneofs) { object.content = 'appLoadFileRequest' }
      }
      if (message.appButtonPressRequest != null && message.hasOwnProperty('appButtonPressRequest')) {
        object.appButtonPressRequest = $root.PB_App.AppButtonPressRequest.toObject(message.appButtonPressRequest, options)
        if (options.oneofs) { object.content = 'appButtonPressRequest' }
      }
      if (message.appButtonReleaseRequest != null && message.hasOwnProperty('appButtonReleaseRequest')) {
        object.appButtonReleaseRequest = $root.PB_App.AppButtonReleaseRequest.toObject(message.appButtonReleaseRequest, options)
        if (options.oneofs) { object.content = 'appButtonReleaseRequest' }
      }
      if (message.gpioSetPinMode != null && message.hasOwnProperty('gpioSetPinMode')) {
        object.gpioSetPinMode = $root.PB_Gpio.SetPinMode.toObject(message.gpioSetPinMode, options)
        if (options.oneofs) { object.content = 'gpioSetPinMode' }
      }
      if (message.gpioSetInputPull != null && message.hasOwnProperty('gpioSetInputPull')) {
        object.gpioSetInputPull = $root.PB_Gpio.SetInputPull.toObject(message.gpioSetInputPull, options)
        if (options.oneofs) { object.content = 'gpioSetInputPull' }
      }
      if (message.gpioGetPinMode != null && message.hasOwnProperty('gpioGetPinMode')) {
        object.gpioGetPinMode = $root.PB_Gpio.GetPinMode.toObject(message.gpioGetPinMode, options)
        if (options.oneofs) { object.content = 'gpioGetPinMode' }
      }
      if (message.gpioGetPinModeResponse != null && message.hasOwnProperty('gpioGetPinModeResponse')) {
        object.gpioGetPinModeResponse = $root.PB_Gpio.GetPinModeResponse.toObject(message.gpioGetPinModeResponse, options)
        if (options.oneofs) { object.content = 'gpioGetPinModeResponse' }
      }
      if (message.gpioReadPin != null && message.hasOwnProperty('gpioReadPin')) {
        object.gpioReadPin = $root.PB_Gpio.ReadPin.toObject(message.gpioReadPin, options)
        if (options.oneofs) { object.content = 'gpioReadPin' }
      }
      if (message.gpioReadPinResponse != null && message.hasOwnProperty('gpioReadPinResponse')) {
        object.gpioReadPinResponse = $root.PB_Gpio.ReadPinResponse.toObject(message.gpioReadPinResponse, options)
        if (options.oneofs) { object.content = 'gpioReadPinResponse' }
      }
      if (message.gpioWritePin != null && message.hasOwnProperty('gpioWritePin')) {
        object.gpioWritePin = $root.PB_Gpio.WritePin.toObject(message.gpioWritePin, options)
        if (options.oneofs) { object.content = 'gpioWritePin' }
      }
      if (message.appStateResponse != null && message.hasOwnProperty('appStateResponse')) {
        object.appStateResponse = $root.PB_App.AppStateResponse.toObject(message.appStateResponse, options)
        if (options.oneofs) { object.content = 'appStateResponse' }
      }
      if (message.storageTimestampRequest != null && message.hasOwnProperty('storageTimestampRequest')) {
        object.storageTimestampRequest = $root.PB_Storage.TimestampRequest.toObject(message.storageTimestampRequest, options)
        if (options.oneofs) { object.content = 'storageTimestampRequest' }
      }
      if (message.storageTimestampResponse != null && message.hasOwnProperty('storageTimestampResponse')) {
        object.storageTimestampResponse = $root.PB_Storage.TimestampResponse.toObject(message.storageTimestampResponse, options)
        if (options.oneofs) { object.content = 'storageTimestampResponse' }
      }
      if (message.propertyGetRequest != null && message.hasOwnProperty('propertyGetRequest')) {
        object.propertyGetRequest = $root.PB_Property.GetRequest.toObject(message.propertyGetRequest, options)
        if (options.oneofs) { object.content = 'propertyGetRequest' }
      }
      if (message.propertyGetResponse != null && message.hasOwnProperty('propertyGetResponse')) {
        object.propertyGetResponse = $root.PB_Property.GetResponse.toObject(message.propertyGetResponse, options)
        if (options.oneofs) { object.content = 'propertyGetResponse' }
      }
      if (message.appGetErrorRequest != null && message.hasOwnProperty('appGetErrorRequest')) {
        object.appGetErrorRequest = $root.PB_App.GetErrorRequest.toObject(message.appGetErrorRequest, options)
        if (options.oneofs) { object.content = 'appGetErrorRequest' }
      }
      if (message.appGetErrorResponse != null && message.hasOwnProperty('appGetErrorResponse')) {
        object.appGetErrorResponse = $root.PB_App.GetErrorResponse.toObject(message.appGetErrorResponse, options)
        if (options.oneofs) { object.content = 'appGetErrorResponse' }
      }
      if (message.appDataExchangeRequest != null && message.hasOwnProperty('appDataExchangeRequest')) {
        object.appDataExchangeRequest = $root.PB_App.DataExchangeRequest.toObject(message.appDataExchangeRequest, options)
        if (options.oneofs) { object.content = 'appDataExchangeRequest' }
      }
      if (message.desktopIsLockedRequest != null && message.hasOwnProperty('desktopIsLockedRequest')) {
        object.desktopIsLockedRequest = $root.PB_Desktop.IsLockedRequest.toObject(message.desktopIsLockedRequest, options)
        if (options.oneofs) { object.content = 'desktopIsLockedRequest' }
      }
      if (message.desktopUnlockRequest != null && message.hasOwnProperty('desktopUnlockRequest')) {
        object.desktopUnlockRequest = $root.PB_Desktop.UnlockRequest.toObject(message.desktopUnlockRequest, options)
        if (options.oneofs) { object.content = 'desktopUnlockRequest' }
      }
      if (message.desktopStatusSubscribeRequest != null && message.hasOwnProperty('desktopStatusSubscribeRequest')) {
        object.desktopStatusSubscribeRequest = $root.PB_Desktop.StatusSubscribeRequest.toObject(message.desktopStatusSubscribeRequest, options)
        if (options.oneofs) { object.content = 'desktopStatusSubscribeRequest' }
      }
      if (message.desktopStatusUnsubscribeRequest != null && message.hasOwnProperty('desktopStatusUnsubscribeRequest')) {
        object.desktopStatusUnsubscribeRequest = $root.PB_Desktop.StatusUnsubscribeRequest.toObject(message.desktopStatusUnsubscribeRequest, options)
        if (options.oneofs) { object.content = 'desktopStatusUnsubscribeRequest' }
      }
      if (message.desktopStatus != null && message.hasOwnProperty('desktopStatus')) {
        object.desktopStatus = $root.PB_Desktop.Status.toObject(message.desktopStatus, options)
        if (options.oneofs) { object.content = 'desktopStatus' }
      }
      if (message.storageTarExtractRequest != null && message.hasOwnProperty('storageTarExtractRequest')) {
        object.storageTarExtractRequest = $root.PB_Storage.TarExtractRequest.toObject(message.storageTarExtractRequest, options)
        if (options.oneofs) { object.content = 'storageTarExtractRequest' }
      }
      return object
    }

    Main.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Main
  })()

  PB.Region = (function () {
    function Region (properties) {
      this.bands = []
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Region.prototype.countryCode = $util.newBuffer([])
    Region.prototype.bands = $util.emptyArray

    Region.create = function create (properties) {
      return new Region(properties)
    }

    Region.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.countryCode != null && Object.hasOwnProperty.call(message, 'countryCode')) { writer.uint32(10).bytes(message.countryCode) }
      if (message.bands != null && message.bands.length) {
        for (let i = 0; i < message.bands.length; ++i) { $root.PB.Region.Band.encode(message.bands[i], writer.uint32(18).fork()).ldelim() }
      }
      return writer
    }

    Region.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Region.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB.Region()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.countryCode = reader.bytes()
            break
          case 2:
            if (!(message.bands && message.bands.length)) { message.bands = [] }
            message.bands.push($root.PB.Region.Band.decode(reader, reader.uint32()))
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Region.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Region.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.countryCode != null && message.hasOwnProperty('countryCode')) {
        if (!(message.countryCode && typeof message.countryCode.length === 'number' || $util.isString(message.countryCode))) { return 'countryCode: buffer expected' }
      }
      if (message.bands != null && message.hasOwnProperty('bands')) {
        if (!Array.isArray(message.bands)) { return 'bands: array expected' }
        for (let i = 0; i < message.bands.length; ++i) {
          const error = $root.PB.Region.Band.verify(message.bands[i])
          if (error) { return 'bands.' + error }
        }
      }
      return null
    }

    Region.fromObject = function fromObject (object) {
      if (object instanceof $root.PB.Region) { return object }
      const message = new $root.PB.Region()
      if (object.countryCode != null) {
        if (typeof object.countryCode === 'string') { $util.base64.decode(object.countryCode, message.countryCode = $util.newBuffer($util.base64.length(object.countryCode)), 0) } else if (object.countryCode.length) { message.countryCode = object.countryCode }
      }
      if (object.bands) {
        if (!Array.isArray(object.bands)) { throw TypeError('.PB.Region.bands: array expected') }
        message.bands = []
        for (let i = 0; i < object.bands.length; ++i) {
          if (typeof object.bands[i] !== 'object') { throw TypeError('.PB.Region.bands: object expected') }
          message.bands[i] = $root.PB.Region.Band.fromObject(object.bands[i])
        }
      }
      return message
    }

    Region.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.arrays || options.defaults) { object.bands = [] }
      if (options.defaults) {
        if (options.bytes === String) { object.countryCode = '' } else {
          object.countryCode = []
          if (options.bytes !== Array) { object.countryCode = $util.newBuffer(object.countryCode) }
        }
      }
      if (message.countryCode != null && message.hasOwnProperty('countryCode')) { object.countryCode = options.bytes === String ? $util.base64.encode(message.countryCode, 0, message.countryCode.length) : options.bytes === Array ? Array.prototype.slice.call(message.countryCode) : message.countryCode }
      if (message.bands && message.bands.length) {
        object.bands = []
        for (let j = 0; j < message.bands.length; ++j) { object.bands[j] = $root.PB.Region.Band.toObject(message.bands[j], options) }
      }
      return object
    }

    Region.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    Region.Band = (function () {
      function Band (properties) {
        if (properties) {
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
            if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
          }
        }
      }

      Band.prototype.start = 0
      Band.prototype.end = 0
      Band.prototype.powerLimit = 0
      Band.prototype.dutyCycle = 0

      Band.create = function create (properties) {
        return new Band(properties)
      }

      Band.encode = function encode (message, writer) {
        if (!writer) { writer = $Writer.create() }
        if (message.start != null && Object.hasOwnProperty.call(message, 'start')) { writer.uint32(8).uint32(message.start) }
        if (message.end != null && Object.hasOwnProperty.call(message, 'end')) { writer.uint32(16).uint32(message.end) }
        if (message.powerLimit != null && Object.hasOwnProperty.call(message, 'powerLimit')) { writer.uint32(24).int32(message.powerLimit) }
        if (message.dutyCycle != null && Object.hasOwnProperty.call(message, 'dutyCycle')) { writer.uint32(32).uint32(message.dutyCycle) }
        return writer
      }

      Band.encodeDelimited = function encodeDelimited (message, writer) {
        return this.encode(message, writer).ldelim()
      }

      Band.decode = function decode (reader, length) {
        if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
        const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB.Region.Band()
        while (reader.pos < end) {
          const tag = reader.uint32()
          switch (tag >>> 3) {
            case 1:
              message.start = reader.uint32()
              break
            case 2:
              message.end = reader.uint32()
              break
            case 3:
              message.powerLimit = reader.int32()
              break
            case 4:
              message.dutyCycle = reader.uint32()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }
        return message
      }

      Band.decodeDelimited = function decodeDelimited (reader) {
        if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
        return this.decode(reader, reader.uint32())
      }

      Band.verify = function verify (message) {
        if (typeof message !== 'object' || message === null) { return 'object expected' }
        if (message.start != null && message.hasOwnProperty('start')) {
          if (!$util.isInteger(message.start)) { return 'start: integer expected' }
        }
        if (message.end != null && message.hasOwnProperty('end')) {
          if (!$util.isInteger(message.end)) { return 'end: integer expected' }
        }
        if (message.powerLimit != null && message.hasOwnProperty('powerLimit')) {
          if (!$util.isInteger(message.powerLimit)) { return 'powerLimit: integer expected' }
        }
        if (message.dutyCycle != null && message.hasOwnProperty('dutyCycle')) {
          if (!$util.isInteger(message.dutyCycle)) { return 'dutyCycle: integer expected' }
        }
        return null
      }

      Band.fromObject = function fromObject (object) {
        if (object instanceof $root.PB.Region.Band) { return object }
        const message = new $root.PB.Region.Band()
        if (object.start != null) { message.start = object.start >>> 0 }
        if (object.end != null) { message.end = object.end >>> 0 }
        if (object.powerLimit != null) { message.powerLimit = object.powerLimit | 0 }
        if (object.dutyCycle != null) { message.dutyCycle = object.dutyCycle >>> 0 }
        return message
      }

      Band.toObject = function toObject (message, options) {
        if (!options) { options = {} }
        const object = {}
        if (options.defaults) {
          object.start = 0
          object.end = 0
          object.powerLimit = 0
          object.dutyCycle = 0
        }
        if (message.start != null && message.hasOwnProperty('start')) { object.start = message.start }
        if (message.end != null && message.hasOwnProperty('end')) { object.end = message.end }
        if (message.powerLimit != null && message.hasOwnProperty('powerLimit')) { object.powerLimit = message.powerLimit }
        if (message.dutyCycle != null && message.hasOwnProperty('dutyCycle')) { object.dutyCycle = message.dutyCycle }
        return object
      }

      Band.prototype.toJSON = function toJSON () {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
      }

      return Band
    })()

    return Region
  })()

  return PB
})()

export const PB_Storage = $root.PB_Storage = (() => {
  const PB_Storage = {}

  PB_Storage.File = (function () {
    function File (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    File.prototype.type = 0
    File.prototype.name = ''
    File.prototype.size = 0
    File.prototype.data = $util.newBuffer([])
    File.prototype.md5sum = ''

    File.create = function create (properties) {
      return new File(properties)
    }

    File.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.type != null && Object.hasOwnProperty.call(message, 'type')) { writer.uint32(8).int32(message.type) }
      if (message.name != null && Object.hasOwnProperty.call(message, 'name')) { writer.uint32(18).string(message.name) }
      if (message.size != null && Object.hasOwnProperty.call(message, 'size')) { writer.uint32(24).uint32(message.size) }
      if (message.data != null && Object.hasOwnProperty.call(message, 'data')) { writer.uint32(34).bytes(message.data) }
      if (message.md5sum != null && Object.hasOwnProperty.call(message, 'md5sum')) { writer.uint32(42).string(message.md5sum) }
      return writer
    }

    File.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    File.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.File()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.type = reader.int32()
            break
          case 2:
            message.name = reader.string()
            break
          case 3:
            message.size = reader.uint32()
            break
          case 4:
            message.data = reader.bytes()
            break
          case 5:
            message.md5sum = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    File.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    File.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.type != null && message.hasOwnProperty('type')) {
        switch (message.type) {
          default:
            return 'type: enum value expected'
          case 0:
          case 1:
            break
        }
      }
      if (message.name != null && message.hasOwnProperty('name')) {
        if (!$util.isString(message.name)) { return 'name: string expected' }
      }
      if (message.size != null && message.hasOwnProperty('size')) {
        if (!$util.isInteger(message.size)) { return 'size: integer expected' }
      }
      if (message.data != null && message.hasOwnProperty('data')) {
        if (!(message.data && typeof message.data.length === 'number' || $util.isString(message.data))) { return 'data: buffer expected' }
      }
      if (message.md5sum != null && message.hasOwnProperty('md5sum')) {
        if (!$util.isString(message.md5sum)) { return 'md5sum: string expected' }
      }
      return null
    }

    File.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.File) { return object }
      const message = new $root.PB_Storage.File()
      switch (object.type) {
        case 'FILE':
        case 0:
          message.type = 0
          break
        case 'DIR':
        case 1:
          message.type = 1
          break
      }
      if (object.name != null) { message.name = String(object.name) }
      if (object.size != null) { message.size = object.size >>> 0 }
      if (object.data != null) {
        if (typeof object.data === 'string') { $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0) } else if (object.data.length) { message.data = object.data }
      }
      if (object.md5sum != null) { message.md5sum = String(object.md5sum) }
      return message
    }

    File.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.type = options.enums === String ? 'FILE' : 0
        object.name = ''
        object.size = 0
        if (options.bytes === String) { object.data = '' } else {
          object.data = []
          if (options.bytes !== Array) { object.data = $util.newBuffer(object.data) }
        }
        object.md5sum = ''
      }
      if (message.type != null && message.hasOwnProperty('type')) { object.type = options.enums === String ? $root.PB_Storage.File.FileType[message.type] : message.type }
      if (message.name != null && message.hasOwnProperty('name')) { object.name = message.name }
      if (message.size != null && message.hasOwnProperty('size')) { object.size = message.size }
      if (message.data != null && message.hasOwnProperty('data')) { object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data }
      if (message.md5sum != null && message.hasOwnProperty('md5sum')) { object.md5sum = message.md5sum }
      return object
    }

    File.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    File.FileType = (function () {
      const valuesById = {}, values = Object.create(valuesById)
      values[valuesById[0] = 'FILE'] = 0
      values[valuesById[1] = 'DIR'] = 1
      return values
    })()

    return File
  })()

  PB_Storage.InfoRequest = (function () {
    function InfoRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    InfoRequest.prototype.path = ''

    InfoRequest.create = function create (properties) {
      return new InfoRequest(properties)
    }

    InfoRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    InfoRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    InfoRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.InfoRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    InfoRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    InfoRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    InfoRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.InfoRequest) { return object }
      const message = new $root.PB_Storage.InfoRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    InfoRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    InfoRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return InfoRequest
  })()

  PB_Storage.InfoResponse = (function () {
    function InfoResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    InfoResponse.prototype.totalSpace = $util.Long ? $util.Long.fromBits(0, 0, true) : 0
    InfoResponse.prototype.freeSpace = $util.Long ? $util.Long.fromBits(0, 0, true) : 0

    InfoResponse.create = function create (properties) {
      return new InfoResponse(properties)
    }

    InfoResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.totalSpace != null && Object.hasOwnProperty.call(message, 'totalSpace')) { writer.uint32(8).uint64(message.totalSpace) }
      if (message.freeSpace != null && Object.hasOwnProperty.call(message, 'freeSpace')) { writer.uint32(16).uint64(message.freeSpace) }
      return writer
    }

    InfoResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    InfoResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.InfoResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.totalSpace = reader.uint64()
            break
          case 2:
            message.freeSpace = reader.uint64()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    InfoResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    InfoResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.totalSpace != null && message.hasOwnProperty('totalSpace')) {
        if (!$util.isInteger(message.totalSpace) && !(message.totalSpace && $util.isInteger(message.totalSpace.low) && $util.isInteger(message.totalSpace.high))) { return 'totalSpace: integer|Long expected' }
      }
      if (message.freeSpace != null && message.hasOwnProperty('freeSpace')) {
        if (!$util.isInteger(message.freeSpace) && !(message.freeSpace && $util.isInteger(message.freeSpace.low) && $util.isInteger(message.freeSpace.high))) { return 'freeSpace: integer|Long expected' }
      }
      return null
    }

    InfoResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.InfoResponse) { return object }
      const message = new $root.PB_Storage.InfoResponse()
      if (object.totalSpace != null) {
        if ($util.Long) { (message.totalSpace = $util.Long.fromValue(object.totalSpace)).unsigned = true } else if (typeof object.totalSpace === 'string') { message.totalSpace = parseInt(object.totalSpace, 10) } else if (typeof object.totalSpace === 'number') { message.totalSpace = object.totalSpace } else if (typeof object.totalSpace === 'object') { message.totalSpace = new $util.LongBits(object.totalSpace.low >>> 0, object.totalSpace.high >>> 0).toNumber(true) }
      }
      if (object.freeSpace != null) {
        if ($util.Long) { (message.freeSpace = $util.Long.fromValue(object.freeSpace)).unsigned = true } else if (typeof object.freeSpace === 'string') { message.freeSpace = parseInt(object.freeSpace, 10) } else if (typeof object.freeSpace === 'number') { message.freeSpace = object.freeSpace } else if (typeof object.freeSpace === 'object') { message.freeSpace = new $util.LongBits(object.freeSpace.low >>> 0, object.freeSpace.high >>> 0).toNumber(true) }
      }
      return message
    }

    InfoResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        if ($util.Long) {
          const long = new $util.Long(0, 0, true)
          object.totalSpace = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long
        } else { object.totalSpace = options.longs === String ? '0' : 0 }
        if ($util.Long) {
          const long = new $util.Long(0, 0, true)
          object.freeSpace = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long
        } else { object.freeSpace = options.longs === String ? '0' : 0 }
      }
      if (message.totalSpace != null && message.hasOwnProperty('totalSpace')) {
        if (typeof message.totalSpace === 'number') { object.totalSpace = options.longs === String ? String(message.totalSpace) : message.totalSpace } else { object.totalSpace = options.longs === String ? $util.Long.prototype.toString.call(message.totalSpace) : options.longs === Number ? new $util.LongBits(message.totalSpace.low >>> 0, message.totalSpace.high >>> 0).toNumber(true) : message.totalSpace }
      }
      if (message.freeSpace != null && message.hasOwnProperty('freeSpace')) {
        if (typeof message.freeSpace === 'number') { object.freeSpace = options.longs === String ? String(message.freeSpace) : message.freeSpace } else { object.freeSpace = options.longs === String ? $util.Long.prototype.toString.call(message.freeSpace) : options.longs === Number ? new $util.LongBits(message.freeSpace.low >>> 0, message.freeSpace.high >>> 0).toNumber(true) : message.freeSpace }
      }
      return object
    }

    InfoResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return InfoResponse
  })()

  PB_Storage.TimestampRequest = (function () {
    function TimestampRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    TimestampRequest.prototype.path = ''

    TimestampRequest.create = function create (properties) {
      return new TimestampRequest(properties)
    }

    TimestampRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    TimestampRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    TimestampRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.TimestampRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    TimestampRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    TimestampRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    TimestampRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.TimestampRequest) { return object }
      const message = new $root.PB_Storage.TimestampRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    TimestampRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    TimestampRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return TimestampRequest
  })()

  PB_Storage.TimestampResponse = (function () {
    function TimestampResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    TimestampResponse.prototype.timestamp = 0

    TimestampResponse.create = function create (properties) {
      return new TimestampResponse(properties)
    }

    TimestampResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.timestamp != null && Object.hasOwnProperty.call(message, 'timestamp')) { writer.uint32(8).uint32(message.timestamp) }
      return writer
    }

    TimestampResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    TimestampResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.TimestampResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.timestamp = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    TimestampResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    TimestampResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.timestamp != null && message.hasOwnProperty('timestamp')) {
        if (!$util.isInteger(message.timestamp)) { return 'timestamp: integer expected' }
      }
      return null
    }

    TimestampResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.TimestampResponse) { return object }
      const message = new $root.PB_Storage.TimestampResponse()
      if (object.timestamp != null) { message.timestamp = object.timestamp >>> 0 }
      return message
    }

    TimestampResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.timestamp = 0 }
      if (message.timestamp != null && message.hasOwnProperty('timestamp')) { object.timestamp = message.timestamp }
      return object
    }

    TimestampResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return TimestampResponse
  })()

  PB_Storage.StatRequest = (function () {
    function StatRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StatRequest.prototype.path = ''

    StatRequest.create = function create (properties) {
      return new StatRequest(properties)
    }

    StatRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    StatRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StatRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.StatRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StatRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StatRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    StatRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.StatRequest) { return object }
      const message = new $root.PB_Storage.StatRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    StatRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    StatRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StatRequest
  })()

  PB_Storage.StatResponse = (function () {
    function StatResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StatResponse.prototype.file = null

    StatResponse.create = function create (properties) {
      return new StatResponse(properties)
    }

    StatResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.file != null && Object.hasOwnProperty.call(message, 'file')) { $root.PB_Storage.File.encode(message.file, writer.uint32(10).fork()).ldelim() }
      return writer
    }

    StatResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StatResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.StatResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.file = $root.PB_Storage.File.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StatResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StatResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.file != null && message.hasOwnProperty('file')) {
        const error = $root.PB_Storage.File.verify(message.file)
        if (error) { return 'file.' + error }
      }
      return null
    }

    StatResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.StatResponse) { return object }
      const message = new $root.PB_Storage.StatResponse()
      if (object.file != null) {
        if (typeof object.file !== 'object') { throw TypeError('.PB_Storage.StatResponse.file: object expected') }
        message.file = $root.PB_Storage.File.fromObject(object.file)
      }
      return message
    }

    StatResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.file = null }
      if (message.file != null && message.hasOwnProperty('file')) { object.file = $root.PB_Storage.File.toObject(message.file, options) }
      return object
    }

    StatResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StatResponse
  })()

  PB_Storage.ListRequest = (function () {
    function ListRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ListRequest.prototype.path = ''
    ListRequest.prototype.includeMd5 = false
    ListRequest.prototype.filterMaxSize = 0

    ListRequest.create = function create (properties) {
      return new ListRequest(properties)
    }

    ListRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      if (message.includeMd5 != null && Object.hasOwnProperty.call(message, 'includeMd5')) { writer.uint32(16).bool(message.includeMd5) }
      if (message.filterMaxSize != null && Object.hasOwnProperty.call(message, 'filterMaxSize')) { writer.uint32(24).uint32(message.filterMaxSize) }
      return writer
    }

    ListRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ListRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.ListRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          case 2:
            message.includeMd5 = reader.bool()
            break
          case 3:
            message.filterMaxSize = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ListRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ListRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      if (message.includeMd5 != null && message.hasOwnProperty('includeMd5')) {
        if (typeof message.includeMd5 !== 'boolean') { return 'includeMd5: boolean expected' }
      }
      if (message.filterMaxSize != null && message.hasOwnProperty('filterMaxSize')) {
        if (!$util.isInteger(message.filterMaxSize)) { return 'filterMaxSize: integer expected' }
      }
      return null
    }

    ListRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.ListRequest) { return object }
      const message = new $root.PB_Storage.ListRequest()
      if (object.path != null) { message.path = String(object.path) }
      if (object.includeMd5 != null) { message.includeMd5 = Boolean(object.includeMd5) }
      if (object.filterMaxSize != null) { message.filterMaxSize = object.filterMaxSize >>> 0 }
      return message
    }

    ListRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.path = ''
        object.includeMd5 = false
        object.filterMaxSize = 0
      }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      if (message.includeMd5 != null && message.hasOwnProperty('includeMd5')) { object.includeMd5 = message.includeMd5 }
      if (message.filterMaxSize != null && message.hasOwnProperty('filterMaxSize')) { object.filterMaxSize = message.filterMaxSize }
      return object
    }

    ListRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ListRequest
  })()

  PB_Storage.ListResponse = (function () {
    function ListResponse (properties) {
      this.file = []
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ListResponse.prototype.file = $util.emptyArray

    ListResponse.create = function create (properties) {
      return new ListResponse(properties)
    }

    ListResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.file != null && message.file.length) {
        for (let i = 0; i < message.file.length; ++i) { $root.PB_Storage.File.encode(message.file[i], writer.uint32(10).fork()).ldelim() }
      }
      return writer
    }

    ListResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ListResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.ListResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            if (!(message.file && message.file.length)) { message.file = [] }
            message.file.push($root.PB_Storage.File.decode(reader, reader.uint32()))
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ListResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ListResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.file != null && message.hasOwnProperty('file')) {
        if (!Array.isArray(message.file)) { return 'file: array expected' }
        for (let i = 0; i < message.file.length; ++i) {
          const error = $root.PB_Storage.File.verify(message.file[i])
          if (error) { return 'file.' + error }
        }
      }
      return null
    }

    ListResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.ListResponse) { return object }
      const message = new $root.PB_Storage.ListResponse()
      if (object.file) {
        if (!Array.isArray(object.file)) { throw TypeError('.PB_Storage.ListResponse.file: array expected') }
        message.file = []
        for (let i = 0; i < object.file.length; ++i) {
          if (typeof object.file[i] !== 'object') { throw TypeError('.PB_Storage.ListResponse.file: object expected') }
          message.file[i] = $root.PB_Storage.File.fromObject(object.file[i])
        }
      }
      return message
    }

    ListResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.arrays || options.defaults) { object.file = [] }
      if (message.file && message.file.length) {
        object.file = []
        for (let j = 0; j < message.file.length; ++j) { object.file[j] = $root.PB_Storage.File.toObject(message.file[j], options) }
      }
      return object
    }

    ListResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ListResponse
  })()

  PB_Storage.ReadRequest = (function () {
    function ReadRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ReadRequest.prototype.path = ''

    ReadRequest.create = function create (properties) {
      return new ReadRequest(properties)
    }

    ReadRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    ReadRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ReadRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.ReadRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ReadRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ReadRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    ReadRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.ReadRequest) { return object }
      const message = new $root.PB_Storage.ReadRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    ReadRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    ReadRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ReadRequest
  })()

  PB_Storage.ReadResponse = (function () {
    function ReadResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ReadResponse.prototype.file = null

    ReadResponse.create = function create (properties) {
      return new ReadResponse(properties)
    }

    ReadResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.file != null && Object.hasOwnProperty.call(message, 'file')) { $root.PB_Storage.File.encode(message.file, writer.uint32(10).fork()).ldelim() }
      return writer
    }

    ReadResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ReadResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.ReadResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.file = $root.PB_Storage.File.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ReadResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ReadResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.file != null && message.hasOwnProperty('file')) {
        const error = $root.PB_Storage.File.verify(message.file)
        if (error) { return 'file.' + error }
      }
      return null
    }

    ReadResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.ReadResponse) { return object }
      const message = new $root.PB_Storage.ReadResponse()
      if (object.file != null) {
        if (typeof object.file !== 'object') { throw TypeError('.PB_Storage.ReadResponse.file: object expected') }
        message.file = $root.PB_Storage.File.fromObject(object.file)
      }
      return message
    }

    ReadResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.file = null }
      if (message.file != null && message.hasOwnProperty('file')) { object.file = $root.PB_Storage.File.toObject(message.file, options) }
      return object
    }

    ReadResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ReadResponse
  })()

  PB_Storage.WriteRequest = (function () {
    function WriteRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    WriteRequest.prototype.path = ''
    WriteRequest.prototype.file = null

    WriteRequest.create = function create (properties) {
      return new WriteRequest(properties)
    }

    WriteRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      if (message.file != null && Object.hasOwnProperty.call(message, 'file')) { $root.PB_Storage.File.encode(message.file, writer.uint32(18).fork()).ldelim() }
      return writer
    }

    WriteRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    WriteRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.WriteRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          case 2:
            message.file = $root.PB_Storage.File.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    WriteRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    WriteRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      if (message.file != null && message.hasOwnProperty('file')) {
        const error = $root.PB_Storage.File.verify(message.file)
        if (error) { return 'file.' + error }
      }
      return null
    }

    WriteRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.WriteRequest) { return object }
      const message = new $root.PB_Storage.WriteRequest()
      if (object.path != null) { message.path = String(object.path) }
      if (object.file != null) {
        if (typeof object.file !== 'object') { throw TypeError('.PB_Storage.WriteRequest.file: object expected') }
        message.file = $root.PB_Storage.File.fromObject(object.file)
      }
      return message
    }

    WriteRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.path = ''
        object.file = null
      }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      if (message.file != null && message.hasOwnProperty('file')) { object.file = $root.PB_Storage.File.toObject(message.file, options) }
      return object
    }

    WriteRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return WriteRequest
  })()

  PB_Storage.DeleteRequest = (function () {
    function DeleteRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    DeleteRequest.prototype.path = ''
    DeleteRequest.prototype.recursive = false

    DeleteRequest.create = function create (properties) {
      return new DeleteRequest(properties)
    }

    DeleteRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      if (message.recursive != null && Object.hasOwnProperty.call(message, 'recursive')) { writer.uint32(16).bool(message.recursive) }
      return writer
    }

    DeleteRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    DeleteRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.DeleteRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          case 2:
            message.recursive = reader.bool()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    DeleteRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    DeleteRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      if (message.recursive != null && message.hasOwnProperty('recursive')) {
        if (typeof message.recursive !== 'boolean') { return 'recursive: boolean expected' }
      }
      return null
    }

    DeleteRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.DeleteRequest) { return object }
      const message = new $root.PB_Storage.DeleteRequest()
      if (object.path != null) { message.path = String(object.path) }
      if (object.recursive != null) { message.recursive = Boolean(object.recursive) }
      return message
    }

    DeleteRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.path = ''
        object.recursive = false
      }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      if (message.recursive != null && message.hasOwnProperty('recursive')) { object.recursive = message.recursive }
      return object
    }

    DeleteRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return DeleteRequest
  })()

  PB_Storage.MkdirRequest = (function () {
    function MkdirRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    MkdirRequest.prototype.path = ''

    MkdirRequest.create = function create (properties) {
      return new MkdirRequest(properties)
    }

    MkdirRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    MkdirRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    MkdirRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.MkdirRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    MkdirRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    MkdirRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    MkdirRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.MkdirRequest) { return object }
      const message = new $root.PB_Storage.MkdirRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    MkdirRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    MkdirRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return MkdirRequest
  })()

  PB_Storage.Md5sumRequest = (function () {
    function Md5sumRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Md5sumRequest.prototype.path = ''

    Md5sumRequest.create = function create (properties) {
      return new Md5sumRequest(properties)
    }

    Md5sumRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.path != null && Object.hasOwnProperty.call(message, 'path')) { writer.uint32(10).string(message.path) }
      return writer
    }

    Md5sumRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Md5sumRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.Md5sumRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.path = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Md5sumRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Md5sumRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.path != null && message.hasOwnProperty('path')) {
        if (!$util.isString(message.path)) { return 'path: string expected' }
      }
      return null
    }

    Md5sumRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.Md5sumRequest) { return object }
      const message = new $root.PB_Storage.Md5sumRequest()
      if (object.path != null) { message.path = String(object.path) }
      return message
    }

    Md5sumRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.path = '' }
      if (message.path != null && message.hasOwnProperty('path')) { object.path = message.path }
      return object
    }

    Md5sumRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Md5sumRequest
  })()

  PB_Storage.Md5sumResponse = (function () {
    function Md5sumResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    Md5sumResponse.prototype.md5sum = ''

    Md5sumResponse.create = function create (properties) {
      return new Md5sumResponse(properties)
    }

    Md5sumResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.md5sum != null && Object.hasOwnProperty.call(message, 'md5sum')) { writer.uint32(10).string(message.md5sum) }
      return writer
    }

    Md5sumResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    Md5sumResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.Md5sumResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.md5sum = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    Md5sumResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    Md5sumResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.md5sum != null && message.hasOwnProperty('md5sum')) {
        if (!$util.isString(message.md5sum)) { return 'md5sum: string expected' }
      }
      return null
    }

    Md5sumResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.Md5sumResponse) { return object }
      const message = new $root.PB_Storage.Md5sumResponse()
      if (object.md5sum != null) { message.md5sum = String(object.md5sum) }
      return message
    }

    Md5sumResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.md5sum = '' }
      if (message.md5sum != null && message.hasOwnProperty('md5sum')) { object.md5sum = message.md5sum }
      return object
    }

    Md5sumResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Md5sumResponse
  })()

  PB_Storage.RenameRequest = (function () {
    function RenameRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    RenameRequest.prototype.oldPath = ''
    RenameRequest.prototype.newPath = ''

    RenameRequest.create = function create (properties) {
      return new RenameRequest(properties)
    }

    RenameRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.oldPath != null && Object.hasOwnProperty.call(message, 'oldPath')) { writer.uint32(10).string(message.oldPath) }
      if (message.newPath != null && Object.hasOwnProperty.call(message, 'newPath')) { writer.uint32(18).string(message.newPath) }
      return writer
    }

    RenameRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    RenameRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.RenameRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.oldPath = reader.string()
            break
          case 2:
            message.newPath = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    RenameRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    RenameRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.oldPath != null && message.hasOwnProperty('oldPath')) {
        if (!$util.isString(message.oldPath)) { return 'oldPath: string expected' }
      }
      if (message.newPath != null && message.hasOwnProperty('newPath')) {
        if (!$util.isString(message.newPath)) { return 'newPath: string expected' }
      }
      return null
    }

    RenameRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.RenameRequest) { return object }
      const message = new $root.PB_Storage.RenameRequest()
      if (object.oldPath != null) { message.oldPath = String(object.oldPath) }
      if (object.newPath != null) { message.newPath = String(object.newPath) }
      return message
    }

    RenameRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.oldPath = ''
        object.newPath = ''
      }
      if (message.oldPath != null && message.hasOwnProperty('oldPath')) { object.oldPath = message.oldPath }
      if (message.newPath != null && message.hasOwnProperty('newPath')) { object.newPath = message.newPath }
      return object
    }

    RenameRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return RenameRequest
  })()

  PB_Storage.BackupCreateRequest = (function () {
    function BackupCreateRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    BackupCreateRequest.prototype.archivePath = ''

    BackupCreateRequest.create = function create (properties) {
      return new BackupCreateRequest(properties)
    }

    BackupCreateRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.archivePath != null && Object.hasOwnProperty.call(message, 'archivePath')) { writer.uint32(10).string(message.archivePath) }
      return writer
    }

    BackupCreateRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    BackupCreateRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.BackupCreateRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.archivePath = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    BackupCreateRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    BackupCreateRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.archivePath != null && message.hasOwnProperty('archivePath')) {
        if (!$util.isString(message.archivePath)) { return 'archivePath: string expected' }
      }
      return null
    }

    BackupCreateRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.BackupCreateRequest) { return object }
      const message = new $root.PB_Storage.BackupCreateRequest()
      if (object.archivePath != null) { message.archivePath = String(object.archivePath) }
      return message
    }

    BackupCreateRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.archivePath = '' }
      if (message.archivePath != null && message.hasOwnProperty('archivePath')) { object.archivePath = message.archivePath }
      return object
    }

    BackupCreateRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return BackupCreateRequest
  })()

  PB_Storage.BackupRestoreRequest = (function () {
    function BackupRestoreRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    BackupRestoreRequest.prototype.archivePath = ''

    BackupRestoreRequest.create = function create (properties) {
      return new BackupRestoreRequest(properties)
    }

    BackupRestoreRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.archivePath != null && Object.hasOwnProperty.call(message, 'archivePath')) { writer.uint32(10).string(message.archivePath) }
      return writer
    }

    BackupRestoreRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    BackupRestoreRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.BackupRestoreRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.archivePath = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    BackupRestoreRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    BackupRestoreRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.archivePath != null && message.hasOwnProperty('archivePath')) {
        if (!$util.isString(message.archivePath)) { return 'archivePath: string expected' }
      }
      return null
    }

    BackupRestoreRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.BackupRestoreRequest) { return object }
      const message = new $root.PB_Storage.BackupRestoreRequest()
      if (object.archivePath != null) { message.archivePath = String(object.archivePath) }
      return message
    }

    BackupRestoreRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.archivePath = '' }
      if (message.archivePath != null && message.hasOwnProperty('archivePath')) { object.archivePath = message.archivePath }
      return object
    }

    BackupRestoreRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return BackupRestoreRequest
  })()

  PB_Storage.TarExtractRequest = (function () {
    function TarExtractRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    TarExtractRequest.prototype.tarPath = ''
    TarExtractRequest.prototype.outPath = ''

    TarExtractRequest.create = function create (properties) {
      return new TarExtractRequest(properties)
    }

    TarExtractRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.tarPath != null && Object.hasOwnProperty.call(message, 'tarPath')) { writer.uint32(10).string(message.tarPath) }
      if (message.outPath != null && Object.hasOwnProperty.call(message, 'outPath')) { writer.uint32(18).string(message.outPath) }
      return writer
    }

    TarExtractRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    TarExtractRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Storage.TarExtractRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.tarPath = reader.string()
            break
          case 2:
            message.outPath = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    TarExtractRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    TarExtractRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.tarPath != null && message.hasOwnProperty('tarPath')) {
        if (!$util.isString(message.tarPath)) { return 'tarPath: string expected' }
      }
      if (message.outPath != null && message.hasOwnProperty('outPath')) {
        if (!$util.isString(message.outPath)) { return 'outPath: string expected' }
      }
      return null
    }

    TarExtractRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Storage.TarExtractRequest) { return object }
      const message = new $root.PB_Storage.TarExtractRequest()
      if (object.tarPath != null) { message.tarPath = String(object.tarPath) }
      if (object.outPath != null) { message.outPath = String(object.outPath) }
      return message
    }

    TarExtractRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.tarPath = ''
        object.outPath = ''
      }
      if (message.tarPath != null && message.hasOwnProperty('tarPath')) { object.tarPath = message.tarPath }
      if (message.outPath != null && message.hasOwnProperty('outPath')) { object.outPath = message.outPath }
      return object
    }

    TarExtractRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return TarExtractRequest
  })()

  return PB_Storage
})()

export const PB_System = $root.PB_System = (() => {
  const PB_System = {}

  PB_System.PingRequest = (function () {
    function PingRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    PingRequest.prototype.data = $util.newBuffer([])

    PingRequest.create = function create (properties) {
      return new PingRequest(properties)
    }

    PingRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.data != null && Object.hasOwnProperty.call(message, 'data')) { writer.uint32(10).bytes(message.data) }
      return writer
    }

    PingRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    PingRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.PingRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.data = reader.bytes()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    PingRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    PingRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.data != null && message.hasOwnProperty('data')) {
        if (!(message.data && typeof message.data.length === 'number' || $util.isString(message.data))) { return 'data: buffer expected' }
      }
      return null
    }

    PingRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.PingRequest) { return object }
      const message = new $root.PB_System.PingRequest()
      if (object.data != null) {
        if (typeof object.data === 'string') { $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0) } else if (object.data.length) { message.data = object.data }
      }
      return message
    }

    PingRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        if (options.bytes === String) { object.data = '' } else {
          object.data = []
          if (options.bytes !== Array) { object.data = $util.newBuffer(object.data) }
        }
      }
      if (message.data != null && message.hasOwnProperty('data')) { object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data }
      return object
    }

    PingRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return PingRequest
  })()

  PB_System.PingResponse = (function () {
    function PingResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    PingResponse.prototype.data = $util.newBuffer([])

    PingResponse.create = function create (properties) {
      return new PingResponse(properties)
    }

    PingResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.data != null && Object.hasOwnProperty.call(message, 'data')) { writer.uint32(10).bytes(message.data) }
      return writer
    }

    PingResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    PingResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.PingResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.data = reader.bytes()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    PingResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    PingResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.data != null && message.hasOwnProperty('data')) {
        if (!(message.data && typeof message.data.length === 'number' || $util.isString(message.data))) { return 'data: buffer expected' }
      }
      return null
    }

    PingResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.PingResponse) { return object }
      const message = new $root.PB_System.PingResponse()
      if (object.data != null) {
        if (typeof object.data === 'string') { $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0) } else if (object.data.length) { message.data = object.data }
      }
      return message
    }

    PingResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        if (options.bytes === String) { object.data = '' } else {
          object.data = []
          if (options.bytes !== Array) { object.data = $util.newBuffer(object.data) }
        }
      }
      if (message.data != null && message.hasOwnProperty('data')) { object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data }
      return object
    }

    PingResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return PingResponse
  })()

  PB_System.RebootRequest = (function () {
    function RebootRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    RebootRequest.prototype.mode = 0

    RebootRequest.create = function create (properties) {
      return new RebootRequest(properties)
    }

    RebootRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.mode != null && Object.hasOwnProperty.call(message, 'mode')) { writer.uint32(8).int32(message.mode) }
      return writer
    }

    RebootRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    RebootRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.RebootRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.mode = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    RebootRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    RebootRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.mode != null && message.hasOwnProperty('mode')) {
        switch (message.mode) {
          default:
            return 'mode: enum value expected'
          case 0:
          case 1:
          case 2:
            break
        }
      }
      return null
    }

    RebootRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.RebootRequest) { return object }
      const message = new $root.PB_System.RebootRequest()
      switch (object.mode) {
        case 'OS':
        case 0:
          message.mode = 0
          break
        case 'DFU':
        case 1:
          message.mode = 1
          break
        case 'UPDATE':
        case 2:
          message.mode = 2
          break
      }
      return message
    }

    RebootRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.mode = options.enums === String ? 'OS' : 0 }
      if (message.mode != null && message.hasOwnProperty('mode')) { object.mode = options.enums === String ? $root.PB_System.RebootRequest.RebootMode[message.mode] : message.mode }
      return object
    }

    RebootRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    RebootRequest.RebootMode = (function () {
      const valuesById = {}, values = Object.create(valuesById)
      values[valuesById[0] = 'OS'] = 0
      values[valuesById[1] = 'DFU'] = 1
      values[valuesById[2] = 'UPDATE'] = 2
      return values
    })()

    return RebootRequest
  })()

  PB_System.DeviceInfoRequest = (function () {
    function DeviceInfoRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    DeviceInfoRequest.create = function create (properties) {
      return new DeviceInfoRequest(properties)
    }

    DeviceInfoRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    DeviceInfoRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    DeviceInfoRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.DeviceInfoRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    DeviceInfoRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    DeviceInfoRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    DeviceInfoRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.DeviceInfoRequest) { return object }
      return new $root.PB_System.DeviceInfoRequest()
    }

    DeviceInfoRequest.toObject = function toObject () {
      return {}
    }

    DeviceInfoRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return DeviceInfoRequest
  })()

  PB_System.DeviceInfoResponse = (function () {
    function DeviceInfoResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    DeviceInfoResponse.prototype.key = ''
    DeviceInfoResponse.prototype.value = ''

    DeviceInfoResponse.create = function create (properties) {
      return new DeviceInfoResponse(properties)
    }

    DeviceInfoResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.key != null && Object.hasOwnProperty.call(message, 'key')) { writer.uint32(10).string(message.key) }
      if (message.value != null && Object.hasOwnProperty.call(message, 'value')) { writer.uint32(18).string(message.value) }
      return writer
    }

    DeviceInfoResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    DeviceInfoResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.DeviceInfoResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string()
            break
          case 2:
            message.value = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    DeviceInfoResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    DeviceInfoResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.key != null && message.hasOwnProperty('key')) {
        if (!$util.isString(message.key)) { return 'key: string expected' }
      }
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!$util.isString(message.value)) { return 'value: string expected' }
      }
      return null
    }

    DeviceInfoResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.DeviceInfoResponse) { return object }
      const message = new $root.PB_System.DeviceInfoResponse()
      if (object.key != null) { message.key = String(object.key) }
      if (object.value != null) { message.value = String(object.value) }
      return message
    }

    DeviceInfoResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.key = ''
        object.value = ''
      }
      if (message.key != null && message.hasOwnProperty('key')) { object.key = message.key }
      if (message.value != null && message.hasOwnProperty('value')) { object.value = message.value }
      return object
    }

    DeviceInfoResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return DeviceInfoResponse
  })()

  PB_System.FactoryResetRequest = (function () {
    function FactoryResetRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    FactoryResetRequest.create = function create (properties) {
      return new FactoryResetRequest(properties)
    }

    FactoryResetRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    FactoryResetRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    FactoryResetRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.FactoryResetRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    FactoryResetRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    FactoryResetRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    FactoryResetRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.FactoryResetRequest) { return object }
      return new $root.PB_System.FactoryResetRequest()
    }

    FactoryResetRequest.toObject = function toObject () {
      return {}
    }

    FactoryResetRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return FactoryResetRequest
  })()

  PB_System.GetDateTimeRequest = (function () {
    function GetDateTimeRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetDateTimeRequest.create = function create (properties) {
      return new GetDateTimeRequest(properties)
    }

    GetDateTimeRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    GetDateTimeRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetDateTimeRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.GetDateTimeRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetDateTimeRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetDateTimeRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    GetDateTimeRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.GetDateTimeRequest) { return object }
      return new $root.PB_System.GetDateTimeRequest()
    }

    GetDateTimeRequest.toObject = function toObject () {
      return {}
    }

    GetDateTimeRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetDateTimeRequest
  })()

  PB_System.GetDateTimeResponse = (function () {
    function GetDateTimeResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetDateTimeResponse.prototype.datetime = null

    GetDateTimeResponse.create = function create (properties) {
      return new GetDateTimeResponse(properties)
    }

    GetDateTimeResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.datetime != null && Object.hasOwnProperty.call(message, 'datetime')) { $root.PB_System.DateTime.encode(message.datetime, writer.uint32(10).fork()).ldelim() }
      return writer
    }

    GetDateTimeResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetDateTimeResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.GetDateTimeResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.datetime = $root.PB_System.DateTime.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetDateTimeResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetDateTimeResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.datetime != null && message.hasOwnProperty('datetime')) {
        const error = $root.PB_System.DateTime.verify(message.datetime)
        if (error) { return 'datetime.' + error }
      }
      return null
    }

    GetDateTimeResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.GetDateTimeResponse) { return object }
      const message = new $root.PB_System.GetDateTimeResponse()
      if (object.datetime != null) {
        if (typeof object.datetime !== 'object') { throw TypeError('.PB_System.GetDateTimeResponse.datetime: object expected') }
        message.datetime = $root.PB_System.DateTime.fromObject(object.datetime)
      }
      return message
    }

    GetDateTimeResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.datetime = null }
      if (message.datetime != null && message.hasOwnProperty('datetime')) { object.datetime = $root.PB_System.DateTime.toObject(message.datetime, options) }
      return object
    }

    GetDateTimeResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetDateTimeResponse
  })()

  PB_System.SetDateTimeRequest = (function () {
    function SetDateTimeRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    SetDateTimeRequest.prototype.datetime = null

    SetDateTimeRequest.create = function create (properties) {
      return new SetDateTimeRequest(properties)
    }

    SetDateTimeRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.datetime != null && Object.hasOwnProperty.call(message, 'datetime')) { $root.PB_System.DateTime.encode(message.datetime, writer.uint32(10).fork()).ldelim() }
      return writer
    }

    SetDateTimeRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    SetDateTimeRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.SetDateTimeRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.datetime = $root.PB_System.DateTime.decode(reader, reader.uint32())
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    SetDateTimeRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    SetDateTimeRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.datetime != null && message.hasOwnProperty('datetime')) {
        const error = $root.PB_System.DateTime.verify(message.datetime)
        if (error) { return 'datetime.' + error }
      }
      return null
    }

    SetDateTimeRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.SetDateTimeRequest) { return object }
      const message = new $root.PB_System.SetDateTimeRequest()
      if (object.datetime != null) {
        if (typeof object.datetime !== 'object') { throw TypeError('.PB_System.SetDateTimeRequest.datetime: object expected') }
        message.datetime = $root.PB_System.DateTime.fromObject(object.datetime)
      }
      return message
    }

    SetDateTimeRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.datetime = null }
      if (message.datetime != null && message.hasOwnProperty('datetime')) { object.datetime = $root.PB_System.DateTime.toObject(message.datetime, options) }
      return object
    }

    SetDateTimeRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return SetDateTimeRequest
  })()

  PB_System.DateTime = (function () {
    function DateTime (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    DateTime.prototype.hour = 0
    DateTime.prototype.minute = 0
    DateTime.prototype.second = 0
    DateTime.prototype.day = 0
    DateTime.prototype.month = 0
    DateTime.prototype.year = 0
    DateTime.prototype.weekday = 0

    DateTime.create = function create (properties) {
      return new DateTime(properties)
    }

    DateTime.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.hour != null && Object.hasOwnProperty.call(message, 'hour')) { writer.uint32(8).uint32(message.hour) }
      if (message.minute != null && Object.hasOwnProperty.call(message, 'minute')) { writer.uint32(16).uint32(message.minute) }
      if (message.second != null && Object.hasOwnProperty.call(message, 'second')) { writer.uint32(24).uint32(message.second) }
      if (message.day != null && Object.hasOwnProperty.call(message, 'day')) { writer.uint32(32).uint32(message.day) }
      if (message.month != null && Object.hasOwnProperty.call(message, 'month')) { writer.uint32(40).uint32(message.month) }
      if (message.year != null && Object.hasOwnProperty.call(message, 'year')) { writer.uint32(48).uint32(message.year) }
      if (message.weekday != null && Object.hasOwnProperty.call(message, 'weekday')) { writer.uint32(56).uint32(message.weekday) }
      return writer
    }

    DateTime.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    DateTime.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.DateTime()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.hour = reader.uint32()
            break
          case 2:
            message.minute = reader.uint32()
            break
          case 3:
            message.second = reader.uint32()
            break
          case 4:
            message.day = reader.uint32()
            break
          case 5:
            message.month = reader.uint32()
            break
          case 6:
            message.year = reader.uint32()
            break
          case 7:
            message.weekday = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    DateTime.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    DateTime.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.hour != null && message.hasOwnProperty('hour')) {
        if (!$util.isInteger(message.hour)) { return 'hour: integer expected' }
      }
      if (message.minute != null && message.hasOwnProperty('minute')) {
        if (!$util.isInteger(message.minute)) { return 'minute: integer expected' }
      }
      if (message.second != null && message.hasOwnProperty('second')) {
        if (!$util.isInteger(message.second)) { return 'second: integer expected' }
      }
      if (message.day != null && message.hasOwnProperty('day')) {
        if (!$util.isInteger(message.day)) { return 'day: integer expected' }
      }
      if (message.month != null && message.hasOwnProperty('month')) {
        if (!$util.isInteger(message.month)) { return 'month: integer expected' }
      }
      if (message.year != null && message.hasOwnProperty('year')) {
        if (!$util.isInteger(message.year)) { return 'year: integer expected' }
      }
      if (message.weekday != null && message.hasOwnProperty('weekday')) {
        if (!$util.isInteger(message.weekday)) { return 'weekday: integer expected' }
      }
      return null
    }

    DateTime.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.DateTime) { return object }
      const message = new $root.PB_System.DateTime()
      if (object.hour != null) { message.hour = object.hour >>> 0 }
      if (object.minute != null) { message.minute = object.minute >>> 0 }
      if (object.second != null) { message.second = object.second >>> 0 }
      if (object.day != null) { message.day = object.day >>> 0 }
      if (object.month != null) { message.month = object.month >>> 0 }
      if (object.year != null) { message.year = object.year >>> 0 }
      if (object.weekday != null) { message.weekday = object.weekday >>> 0 }
      return message
    }

    DateTime.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.hour = 0
        object.minute = 0
        object.second = 0
        object.day = 0
        object.month = 0
        object.year = 0
        object.weekday = 0
      }
      if (message.hour != null && message.hasOwnProperty('hour')) { object.hour = message.hour }
      if (message.minute != null && message.hasOwnProperty('minute')) { object.minute = message.minute }
      if (message.second != null && message.hasOwnProperty('second')) { object.second = message.second }
      if (message.day != null && message.hasOwnProperty('day')) { object.day = message.day }
      if (message.month != null && message.hasOwnProperty('month')) { object.month = message.month }
      if (message.year != null && message.hasOwnProperty('year')) { object.year = message.year }
      if (message.weekday != null && message.hasOwnProperty('weekday')) { object.weekday = message.weekday }
      return object
    }

    DateTime.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return DateTime
  })()

  PB_System.PlayAudiovisualAlertRequest = (function () {
    function PlayAudiovisualAlertRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    PlayAudiovisualAlertRequest.create = function create (properties) {
      return new PlayAudiovisualAlertRequest(properties)
    }

    PlayAudiovisualAlertRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    PlayAudiovisualAlertRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    PlayAudiovisualAlertRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.PlayAudiovisualAlertRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    PlayAudiovisualAlertRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    PlayAudiovisualAlertRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    PlayAudiovisualAlertRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.PlayAudiovisualAlertRequest) { return object }
      return new $root.PB_System.PlayAudiovisualAlertRequest()
    }

    PlayAudiovisualAlertRequest.toObject = function toObject () {
      return {}
    }

    PlayAudiovisualAlertRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return PlayAudiovisualAlertRequest
  })()

  PB_System.ProtobufVersionRequest = (function () {
    function ProtobufVersionRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ProtobufVersionRequest.create = function create (properties) {
      return new ProtobufVersionRequest(properties)
    }

    ProtobufVersionRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    ProtobufVersionRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ProtobufVersionRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.ProtobufVersionRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ProtobufVersionRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ProtobufVersionRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    ProtobufVersionRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.ProtobufVersionRequest) { return object }
      return new $root.PB_System.ProtobufVersionRequest()
    }

    ProtobufVersionRequest.toObject = function toObject () {
      return {}
    }

    ProtobufVersionRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ProtobufVersionRequest
  })()

  PB_System.ProtobufVersionResponse = (function () {
    function ProtobufVersionResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ProtobufVersionResponse.prototype.major = 0
    ProtobufVersionResponse.prototype.minor = 0

    ProtobufVersionResponse.create = function create (properties) {
      return new ProtobufVersionResponse(properties)
    }

    ProtobufVersionResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.major != null && Object.hasOwnProperty.call(message, 'major')) { writer.uint32(8).uint32(message.major) }
      if (message.minor != null && Object.hasOwnProperty.call(message, 'minor')) { writer.uint32(16).uint32(message.minor) }
      return writer
    }

    ProtobufVersionResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ProtobufVersionResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.ProtobufVersionResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.major = reader.uint32()
            break
          case 2:
            message.minor = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ProtobufVersionResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ProtobufVersionResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.major != null && message.hasOwnProperty('major')) {
        if (!$util.isInteger(message.major)) { return 'major: integer expected' }
      }
      if (message.minor != null && message.hasOwnProperty('minor')) {
        if (!$util.isInteger(message.minor)) { return 'minor: integer expected' }
      }
      return null
    }

    ProtobufVersionResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.ProtobufVersionResponse) { return object }
      const message = new $root.PB_System.ProtobufVersionResponse()
      if (object.major != null) { message.major = object.major >>> 0 }
      if (object.minor != null) { message.minor = object.minor >>> 0 }
      return message
    }

    ProtobufVersionResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.major = 0
        object.minor = 0
      }
      if (message.major != null && message.hasOwnProperty('major')) { object.major = message.major }
      if (message.minor != null && message.hasOwnProperty('minor')) { object.minor = message.minor }
      return object
    }

    ProtobufVersionResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ProtobufVersionResponse
  })()

  PB_System.UpdateRequest = (function () {
    function UpdateRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    UpdateRequest.prototype.updateManifest = ''

    UpdateRequest.create = function create (properties) {
      return new UpdateRequest(properties)
    }

    UpdateRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.updateManifest != null && Object.hasOwnProperty.call(message, 'updateManifest')) { writer.uint32(10).string(message.updateManifest) }
      return writer
    }

    UpdateRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    UpdateRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.UpdateRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.updateManifest = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    UpdateRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    UpdateRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.updateManifest != null && message.hasOwnProperty('updateManifest')) {
        if (!$util.isString(message.updateManifest)) { return 'updateManifest: string expected' }
      }
      return null
    }

    UpdateRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.UpdateRequest) { return object }
      const message = new $root.PB_System.UpdateRequest()
      if (object.updateManifest != null) { message.updateManifest = String(object.updateManifest) }
      return message
    }

    UpdateRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.updateManifest = '' }
      if (message.updateManifest != null && message.hasOwnProperty('updateManifest')) { object.updateManifest = message.updateManifest }
      return object
    }

    UpdateRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return UpdateRequest
  })()

  PB_System.UpdateResponse = (function () {
    function UpdateResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    UpdateResponse.prototype.code = 0

    UpdateResponse.create = function create (properties) {
      return new UpdateResponse(properties)
    }

    UpdateResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.code != null && Object.hasOwnProperty.call(message, 'code')) { writer.uint32(8).int32(message.code) }
      return writer
    }

    UpdateResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    UpdateResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.UpdateResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.code = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    UpdateResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    UpdateResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.code != null && message.hasOwnProperty('code')) {
        switch (message.code) {
          default:
            return 'code: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10:
            break
        }
      }
      return null
    }

    UpdateResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.UpdateResponse) { return object }
      const message = new $root.PB_System.UpdateResponse()
      switch (object.code) {
        case 'OK':
        case 0:
          message.code = 0
          break
        case 'ManifestPathInvalid':
        case 1:
          message.code = 1
          break
        case 'ManifestFolderNotFound':
        case 2:
          message.code = 2
          break
        case 'ManifestInvalid':
        case 3:
          message.code = 3
          break
        case 'StageMissing':
        case 4:
          message.code = 4
          break
        case 'StageIntegrityError':
        case 5:
          message.code = 5
          break
        case 'ManifestPointerError':
        case 6:
          message.code = 6
          break
        case 'TargetMismatch':
        case 7:
          message.code = 7
          break
        case 'OutdatedManifestVersion':
        case 8:
          message.code = 8
          break
        case 'IntFull':
        case 9:
          message.code = 9
          break
        case 'UnspecifiedError':
        case 10:
          message.code = 10
          break
      }
      return message
    }

    UpdateResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.code = options.enums === String ? 'OK' : 0 }
      if (message.code != null && message.hasOwnProperty('code')) { object.code = options.enums === String ? $root.PB_System.UpdateResponse.UpdateResultCode[message.code] : message.code }
      return object
    }

    UpdateResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    UpdateResponse.UpdateResultCode = (function () {
      const valuesById = {}, values = Object.create(valuesById)
      values[valuesById[0] = 'OK'] = 0
      values[valuesById[1] = 'ManifestPathInvalid'] = 1
      values[valuesById[2] = 'ManifestFolderNotFound'] = 2
      values[valuesById[3] = 'ManifestInvalid'] = 3
      values[valuesById[4] = 'StageMissing'] = 4
      values[valuesById[5] = 'StageIntegrityError'] = 5
      values[valuesById[6] = 'ManifestPointerError'] = 6
      values[valuesById[7] = 'TargetMismatch'] = 7
      values[valuesById[8] = 'OutdatedManifestVersion'] = 8
      values[valuesById[9] = 'IntFull'] = 9
      values[valuesById[10] = 'UnspecifiedError'] = 10
      return values
    })()

    return UpdateResponse
  })()

  PB_System.PowerInfoRequest = (function () {
    function PowerInfoRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    PowerInfoRequest.create = function create (properties) {
      return new PowerInfoRequest(properties)
    }

    PowerInfoRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    PowerInfoRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    PowerInfoRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.PowerInfoRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    PowerInfoRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    PowerInfoRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    PowerInfoRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.PowerInfoRequest) { return object }
      return new $root.PB_System.PowerInfoRequest()
    }

    PowerInfoRequest.toObject = function toObject () {
      return {}
    }

    PowerInfoRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return PowerInfoRequest
  })()

  PB_System.PowerInfoResponse = (function () {
    function PowerInfoResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    PowerInfoResponse.prototype.key = ''
    PowerInfoResponse.prototype.value = ''

    PowerInfoResponse.create = function create (properties) {
      return new PowerInfoResponse(properties)
    }

    PowerInfoResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.key != null && Object.hasOwnProperty.call(message, 'key')) { writer.uint32(10).string(message.key) }
      if (message.value != null && Object.hasOwnProperty.call(message, 'value')) { writer.uint32(18).string(message.value) }
      return writer
    }

    PowerInfoResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    PowerInfoResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_System.PowerInfoResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string()
            break
          case 2:
            message.value = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    PowerInfoResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    PowerInfoResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.key != null && message.hasOwnProperty('key')) {
        if (!$util.isString(message.key)) { return 'key: string expected' }
      }
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!$util.isString(message.value)) { return 'value: string expected' }
      }
      return null
    }

    PowerInfoResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_System.PowerInfoResponse) { return object }
      const message = new $root.PB_System.PowerInfoResponse()
      if (object.key != null) { message.key = String(object.key) }
      if (object.value != null) { message.value = String(object.value) }
      return message
    }

    PowerInfoResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.key = ''
        object.value = ''
      }
      if (message.key != null && message.hasOwnProperty('key')) { object.key = message.key }
      if (message.value != null && message.hasOwnProperty('value')) { object.value = message.value }
      return object
    }

    PowerInfoResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return PowerInfoResponse
  })()

  return PB_System
})()

export const PB_Gui = $root.PB_Gui = (() => {
  const PB_Gui = {}

  PB_Gui.InputKey = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'UP'] = 0
    values[valuesById[1] = 'DOWN'] = 1
    values[valuesById[2] = 'RIGHT'] = 2
    values[valuesById[3] = 'LEFT'] = 3
    values[valuesById[4] = 'OK'] = 4
    values[valuesById[5] = 'BACK'] = 5
    return values
  })()

  PB_Gui.InputType = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'PRESS'] = 0
    values[valuesById[1] = 'RELEASE'] = 1
    values[valuesById[2] = 'SHORT'] = 2
    values[valuesById[3] = 'LONG'] = 3
    values[valuesById[4] = 'REPEAT'] = 4
    return values
  })()

  PB_Gui.ScreenOrientation = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'HORIZONTAL'] = 0
    values[valuesById[1] = 'HORIZONTAL_FLIP'] = 1
    values[valuesById[2] = 'VERTICAL'] = 2
    values[valuesById[3] = 'VERTICAL_FLIP'] = 3
    return values
  })()

  PB_Gui.ScreenFrame = (function () {
    function ScreenFrame (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ScreenFrame.prototype.data = $util.newBuffer([])
    ScreenFrame.prototype.orientation = 0

    ScreenFrame.create = function create (properties) {
      return new ScreenFrame(properties)
    }

    ScreenFrame.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.data != null && Object.hasOwnProperty.call(message, 'data')) { writer.uint32(10).bytes(message.data) }
      if (message.orientation != null && Object.hasOwnProperty.call(message, 'orientation')) { writer.uint32(16).int32(message.orientation) }
      return writer
    }

    ScreenFrame.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ScreenFrame.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.ScreenFrame()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.data = reader.bytes()
            break
          case 2:
            message.orientation = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ScreenFrame.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ScreenFrame.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.data != null && message.hasOwnProperty('data')) {
        if (!(message.data && typeof message.data.length === 'number' || $util.isString(message.data))) { return 'data: buffer expected' }
      }
      if (message.orientation != null && message.hasOwnProperty('orientation')) {
        switch (message.orientation) {
          default:
            return 'orientation: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
            break
        }
      }
      return null
    }

    ScreenFrame.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.ScreenFrame) { return object }
      const message = new $root.PB_Gui.ScreenFrame()
      if (object.data != null) {
        if (typeof object.data === 'string') { $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0) } else if (object.data.length) { message.data = object.data }
      }
      switch (object.orientation) {
        case 'HORIZONTAL':
        case 0:
          message.orientation = 0
          break
        case 'HORIZONTAL_FLIP':
        case 1:
          message.orientation = 1
          break
        case 'VERTICAL':
        case 2:
          message.orientation = 2
          break
        case 'VERTICAL_FLIP':
        case 3:
          message.orientation = 3
          break
      }
      return message
    }

    ScreenFrame.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        if (options.bytes === String) { object.data = '' } else {
          object.data = []
          if (options.bytes !== Array) { object.data = $util.newBuffer(object.data) }
        }
        object.orientation = options.enums === String ? 'HORIZONTAL' : 0
      }
      if (message.data != null && message.hasOwnProperty('data')) { object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data }
      if (message.orientation != null && message.hasOwnProperty('orientation')) { object.orientation = options.enums === String ? $root.PB_Gui.ScreenOrientation[message.orientation] : message.orientation }
      return object
    }

    ScreenFrame.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ScreenFrame
  })()

  PB_Gui.StartScreenStreamRequest = (function () {
    function StartScreenStreamRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StartScreenStreamRequest.create = function create (properties) {
      return new StartScreenStreamRequest(properties)
    }

    StartScreenStreamRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StartScreenStreamRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StartScreenStreamRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.StartScreenStreamRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StartScreenStreamRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StartScreenStreamRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StartScreenStreamRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.StartScreenStreamRequest) { return object }
      return new $root.PB_Gui.StartScreenStreamRequest()
    }

    StartScreenStreamRequest.toObject = function toObject () {
      return {}
    }

    StartScreenStreamRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StartScreenStreamRequest
  })()

  PB_Gui.StopScreenStreamRequest = (function () {
    function StopScreenStreamRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StopScreenStreamRequest.create = function create (properties) {
      return new StopScreenStreamRequest(properties)
    }

    StopScreenStreamRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StopScreenStreamRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StopScreenStreamRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.StopScreenStreamRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StopScreenStreamRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StopScreenStreamRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StopScreenStreamRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.StopScreenStreamRequest) { return object }
      return new $root.PB_Gui.StopScreenStreamRequest()
    }

    StopScreenStreamRequest.toObject = function toObject () {
      return {}
    }

    StopScreenStreamRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StopScreenStreamRequest
  })()

  PB_Gui.SendInputEventRequest = (function () {
    function SendInputEventRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    SendInputEventRequest.prototype.key = 0
    SendInputEventRequest.prototype.type = 0

    SendInputEventRequest.create = function create (properties) {
      return new SendInputEventRequest(properties)
    }

    SendInputEventRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.key != null && Object.hasOwnProperty.call(message, 'key')) { writer.uint32(8).int32(message.key) }
      if (message.type != null && Object.hasOwnProperty.call(message, 'type')) { writer.uint32(16).int32(message.type) }
      return writer
    }

    SendInputEventRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    SendInputEventRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.SendInputEventRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.key = reader.int32()
            break
          case 2:
            message.type = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    SendInputEventRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    SendInputEventRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.key != null && message.hasOwnProperty('key')) {
        switch (message.key) {
          default:
            return 'key: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break
        }
      }
      if (message.type != null && message.hasOwnProperty('type')) {
        switch (message.type) {
          default:
            return 'type: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            break
        }
      }
      return null
    }

    SendInputEventRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.SendInputEventRequest) { return object }
      const message = new $root.PB_Gui.SendInputEventRequest()
      switch (object.key) {
        case 'UP':
        case 0:
          message.key = 0
          break
        case 'DOWN':
        case 1:
          message.key = 1
          break
        case 'RIGHT':
        case 2:
          message.key = 2
          break
        case 'LEFT':
        case 3:
          message.key = 3
          break
        case 'OK':
        case 4:
          message.key = 4
          break
        case 'BACK':
        case 5:
          message.key = 5
          break
      }
      switch (object.type) {
        case 'PRESS':
        case 0:
          message.type = 0
          break
        case 'RELEASE':
        case 1:
          message.type = 1
          break
        case 'SHORT':
        case 2:
          message.type = 2
          break
        case 'LONG':
        case 3:
          message.type = 3
          break
        case 'REPEAT':
        case 4:
          message.type = 4
          break
      }
      return message
    }

    SendInputEventRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.key = options.enums === String ? 'UP' : 0
        object.type = options.enums === String ? 'PRESS' : 0
      }
      if (message.key != null && message.hasOwnProperty('key')) { object.key = options.enums === String ? $root.PB_Gui.InputKey[message.key] : message.key }
      if (message.type != null && message.hasOwnProperty('type')) { object.type = options.enums === String ? $root.PB_Gui.InputType[message.type] : message.type }
      return object
    }

    SendInputEventRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return SendInputEventRequest
  })()

  PB_Gui.StartVirtualDisplayRequest = (function () {
    function StartVirtualDisplayRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StartVirtualDisplayRequest.prototype.firstFrame = null
    StartVirtualDisplayRequest.prototype.sendInput = false

    StartVirtualDisplayRequest.create = function create (properties) {
      return new StartVirtualDisplayRequest(properties)
    }

    StartVirtualDisplayRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.firstFrame != null && Object.hasOwnProperty.call(message, 'firstFrame')) { $root.PB_Gui.ScreenFrame.encode(message.firstFrame, writer.uint32(10).fork()).ldelim() }
      if (message.sendInput != null && Object.hasOwnProperty.call(message, 'sendInput')) { writer.uint32(16).bool(message.sendInput) }
      return writer
    }

    StartVirtualDisplayRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StartVirtualDisplayRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.StartVirtualDisplayRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.firstFrame = $root.PB_Gui.ScreenFrame.decode(reader, reader.uint32())
            break
          case 2:
            message.sendInput = reader.bool()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StartVirtualDisplayRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StartVirtualDisplayRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.firstFrame != null && message.hasOwnProperty('firstFrame')) {
        const error = $root.PB_Gui.ScreenFrame.verify(message.firstFrame)
        if (error) { return 'firstFrame.' + error }
      }
      if (message.sendInput != null && message.hasOwnProperty('sendInput')) {
        if (typeof message.sendInput !== 'boolean') { return 'sendInput: boolean expected' }
      }
      return null
    }

    StartVirtualDisplayRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.StartVirtualDisplayRequest) { return object }
      const message = new $root.PB_Gui.StartVirtualDisplayRequest()
      if (object.firstFrame != null) {
        if (typeof object.firstFrame !== 'object') { throw TypeError('.PB_Gui.StartVirtualDisplayRequest.firstFrame: object expected') }
        message.firstFrame = $root.PB_Gui.ScreenFrame.fromObject(object.firstFrame)
      }
      if (object.sendInput != null) { message.sendInput = Boolean(object.sendInput) }
      return message
    }

    StartVirtualDisplayRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.firstFrame = null
        object.sendInput = false
      }
      if (message.firstFrame != null && message.hasOwnProperty('firstFrame')) { object.firstFrame = $root.PB_Gui.ScreenFrame.toObject(message.firstFrame, options) }
      if (message.sendInput != null && message.hasOwnProperty('sendInput')) { object.sendInput = message.sendInput }
      return object
    }

    StartVirtualDisplayRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StartVirtualDisplayRequest
  })()

  PB_Gui.StopVirtualDisplayRequest = (function () {
    function StopVirtualDisplayRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    StopVirtualDisplayRequest.create = function create (properties) {
      return new StopVirtualDisplayRequest(properties)
    }

    StopVirtualDisplayRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      return writer
    }

    StopVirtualDisplayRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    StopVirtualDisplayRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gui.StopVirtualDisplayRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    StopVirtualDisplayRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    StopVirtualDisplayRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      return null
    }

    StopVirtualDisplayRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gui.StopVirtualDisplayRequest) { return object }
      return new $root.PB_Gui.StopVirtualDisplayRequest()
    }

    StopVirtualDisplayRequest.toObject = function toObject () {
      return {}
    }

    StopVirtualDisplayRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return StopVirtualDisplayRequest
  })()

  return PB_Gui
})()

export const PB_Gpio = $root.PB_Gpio = (() => {
  const PB_Gpio = {}

  PB_Gpio.GpioPin = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'PC0'] = 0
    values[valuesById[1] = 'PC1'] = 1
    values[valuesById[2] = 'PC3'] = 2
    values[valuesById[3] = 'PB2'] = 3
    values[valuesById[4] = 'PB3'] = 4
    values[valuesById[5] = 'PA4'] = 5
    values[valuesById[6] = 'PA6'] = 6
    values[valuesById[7] = 'PA7'] = 7
    return values
  })()

  PB_Gpio.GpioPinMode = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'OUTPUT'] = 0
    values[valuesById[1] = 'INPUT'] = 1
    return values
  })()

  PB_Gpio.GpioInputPull = (function () {
    const valuesById = {}, values = Object.create(valuesById)
    values[valuesById[0] = 'NO'] = 0
    values[valuesById[1] = 'UP'] = 1
    values[valuesById[2] = 'DOWN'] = 2
    return values
  })()

  PB_Gpio.SetPinMode = (function () {
    function SetPinMode (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    SetPinMode.prototype.pin = 0
    SetPinMode.prototype.mode = 0

    SetPinMode.create = function create (properties) {
      return new SetPinMode(properties)
    }

    SetPinMode.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.pin != null && Object.hasOwnProperty.call(message, 'pin')) { writer.uint32(8).int32(message.pin) }
      if (message.mode != null && Object.hasOwnProperty.call(message, 'mode')) { writer.uint32(16).int32(message.mode) }
      return writer
    }

    SetPinMode.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    SetPinMode.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.SetPinMode()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.pin = reader.int32()
            break
          case 2:
            message.mode = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    SetPinMode.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    SetPinMode.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.pin != null && message.hasOwnProperty('pin')) {
        switch (message.pin) {
          default:
            return 'pin: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            break
        }
      }
      if (message.mode != null && message.hasOwnProperty('mode')) {
        switch (message.mode) {
          default:
            return 'mode: enum value expected'
          case 0:
          case 1:
            break
        }
      }
      return null
    }

    SetPinMode.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.SetPinMode) { return object }
      const message = new $root.PB_Gpio.SetPinMode()
      switch (object.pin) {
        case 'PC0':
        case 0:
          message.pin = 0
          break
        case 'PC1':
        case 1:
          message.pin = 1
          break
        case 'PC3':
        case 2:
          message.pin = 2
          break
        case 'PB2':
        case 3:
          message.pin = 3
          break
        case 'PB3':
        case 4:
          message.pin = 4
          break
        case 'PA4':
        case 5:
          message.pin = 5
          break
        case 'PA6':
        case 6:
          message.pin = 6
          break
        case 'PA7':
        case 7:
          message.pin = 7
          break
      }
      switch (object.mode) {
        case 'OUTPUT':
        case 0:
          message.mode = 0
          break
        case 'INPUT':
        case 1:
          message.mode = 1
          break
      }
      return message
    }

    SetPinMode.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.pin = options.enums === String ? 'PC0' : 0
        object.mode = options.enums === String ? 'OUTPUT' : 0
      }
      if (message.pin != null && message.hasOwnProperty('pin')) { object.pin = options.enums === String ? $root.PB_Gpio.GpioPin[message.pin] : message.pin }
      if (message.mode != null && message.hasOwnProperty('mode')) { object.mode = options.enums === String ? $root.PB_Gpio.GpioPinMode[message.mode] : message.mode }
      return object
    }

    SetPinMode.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return SetPinMode
  })()

  PB_Gpio.SetInputPull = (function () {
    function SetInputPull (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    SetInputPull.prototype.pin = 0
    SetInputPull.prototype.pullMode = 0

    SetInputPull.create = function create (properties) {
      return new SetInputPull(properties)
    }

    SetInputPull.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.pin != null && Object.hasOwnProperty.call(message, 'pin')) { writer.uint32(8).int32(message.pin) }
      if (message.pullMode != null && Object.hasOwnProperty.call(message, 'pullMode')) { writer.uint32(16).int32(message.pullMode) }
      return writer
    }

    SetInputPull.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    SetInputPull.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.SetInputPull()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.pin = reader.int32()
            break
          case 2:
            message.pullMode = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    SetInputPull.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    SetInputPull.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.pin != null && message.hasOwnProperty('pin')) {
        switch (message.pin) {
          default:
            return 'pin: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            break
        }
      }
      if (message.pullMode != null && message.hasOwnProperty('pullMode')) {
        switch (message.pullMode) {
          default:
            return 'pullMode: enum value expected'
          case 0:
          case 1:
          case 2:
            break
        }
      }
      return null
    }

    SetInputPull.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.SetInputPull) { return object }
      const message = new $root.PB_Gpio.SetInputPull()
      switch (object.pin) {
        case 'PC0':
        case 0:
          message.pin = 0
          break
        case 'PC1':
        case 1:
          message.pin = 1
          break
        case 'PC3':
        case 2:
          message.pin = 2
          break
        case 'PB2':
        case 3:
          message.pin = 3
          break
        case 'PB3':
        case 4:
          message.pin = 4
          break
        case 'PA4':
        case 5:
          message.pin = 5
          break
        case 'PA6':
        case 6:
          message.pin = 6
          break
        case 'PA7':
        case 7:
          message.pin = 7
          break
      }
      switch (object.pullMode) {
        case 'NO':
        case 0:
          message.pullMode = 0
          break
        case 'UP':
        case 1:
          message.pullMode = 1
          break
        case 'DOWN':
        case 2:
          message.pullMode = 2
          break
      }
      return message
    }

    SetInputPull.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.pin = options.enums === String ? 'PC0' : 0
        object.pullMode = options.enums === String ? 'NO' : 0
      }
      if (message.pin != null && message.hasOwnProperty('pin')) { object.pin = options.enums === String ? $root.PB_Gpio.GpioPin[message.pin] : message.pin }
      if (message.pullMode != null && message.hasOwnProperty('pullMode')) { object.pullMode = options.enums === String ? $root.PB_Gpio.GpioInputPull[message.pullMode] : message.pullMode }
      return object
    }

    SetInputPull.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return SetInputPull
  })()

  PB_Gpio.GetPinMode = (function () {
    function GetPinMode (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetPinMode.prototype.pin = 0

    GetPinMode.create = function create (properties) {
      return new GetPinMode(properties)
    }

    GetPinMode.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.pin != null && Object.hasOwnProperty.call(message, 'pin')) { writer.uint32(8).int32(message.pin) }
      return writer
    }

    GetPinMode.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetPinMode.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.GetPinMode()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.pin = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetPinMode.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetPinMode.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.pin != null && message.hasOwnProperty('pin')) {
        switch (message.pin) {
          default:
            return 'pin: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            break
        }
      }
      return null
    }

    GetPinMode.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.GetPinMode) { return object }
      const message = new $root.PB_Gpio.GetPinMode()
      switch (object.pin) {
        case 'PC0':
        case 0:
          message.pin = 0
          break
        case 'PC1':
        case 1:
          message.pin = 1
          break
        case 'PC3':
        case 2:
          message.pin = 2
          break
        case 'PB2':
        case 3:
          message.pin = 3
          break
        case 'PB3':
        case 4:
          message.pin = 4
          break
        case 'PA4':
        case 5:
          message.pin = 5
          break
        case 'PA6':
        case 6:
          message.pin = 6
          break
        case 'PA7':
        case 7:
          message.pin = 7
          break
      }
      return message
    }

    GetPinMode.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.pin = options.enums === String ? 'PC0' : 0 }
      if (message.pin != null && message.hasOwnProperty('pin')) { object.pin = options.enums === String ? $root.PB_Gpio.GpioPin[message.pin] : message.pin }
      return object
    }

    GetPinMode.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetPinMode
  })()

  PB_Gpio.GetPinModeResponse = (function () {
    function GetPinModeResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetPinModeResponse.prototype.mode = 0

    GetPinModeResponse.create = function create (properties) {
      return new GetPinModeResponse(properties)
    }

    GetPinModeResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.mode != null && Object.hasOwnProperty.call(message, 'mode')) { writer.uint32(8).int32(message.mode) }
      return writer
    }

    GetPinModeResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetPinModeResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.GetPinModeResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.mode = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetPinModeResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetPinModeResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.mode != null && message.hasOwnProperty('mode')) {
        switch (message.mode) {
          default:
            return 'mode: enum value expected'
          case 0:
          case 1:
            break
        }
      }
      return null
    }

    GetPinModeResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.GetPinModeResponse) { return object }
      const message = new $root.PB_Gpio.GetPinModeResponse()
      switch (object.mode) {
        case 'OUTPUT':
        case 0:
          message.mode = 0
          break
        case 'INPUT':
        case 1:
          message.mode = 1
          break
      }
      return message
    }

    GetPinModeResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.mode = options.enums === String ? 'OUTPUT' : 0 }
      if (message.mode != null && message.hasOwnProperty('mode')) { object.mode = options.enums === String ? $root.PB_Gpio.GpioPinMode[message.mode] : message.mode }
      return object
    }

    GetPinModeResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetPinModeResponse
  })()

  PB_Gpio.ReadPin = (function () {
    function ReadPin (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ReadPin.prototype.pin = 0

    ReadPin.create = function create (properties) {
      return new ReadPin(properties)
    }

    ReadPin.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.pin != null && Object.hasOwnProperty.call(message, 'pin')) { writer.uint32(8).int32(message.pin) }
      return writer
    }

    ReadPin.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ReadPin.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.ReadPin()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.pin = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ReadPin.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ReadPin.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.pin != null && message.hasOwnProperty('pin')) {
        switch (message.pin) {
          default:
            return 'pin: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            break
        }
      }
      return null
    }

    ReadPin.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.ReadPin) { return object }
      const message = new $root.PB_Gpio.ReadPin()
      switch (object.pin) {
        case 'PC0':
        case 0:
          message.pin = 0
          break
        case 'PC1':
        case 1:
          message.pin = 1
          break
        case 'PC3':
        case 2:
          message.pin = 2
          break
        case 'PB2':
        case 3:
          message.pin = 3
          break
        case 'PB3':
        case 4:
          message.pin = 4
          break
        case 'PA4':
        case 5:
          message.pin = 5
          break
        case 'PA6':
        case 6:
          message.pin = 6
          break
        case 'PA7':
        case 7:
          message.pin = 7
          break
      }
      return message
    }

    ReadPin.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.pin = options.enums === String ? 'PC0' : 0 }
      if (message.pin != null && message.hasOwnProperty('pin')) { object.pin = options.enums === String ? $root.PB_Gpio.GpioPin[message.pin] : message.pin }
      return object
    }

    ReadPin.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ReadPin
  })()

  PB_Gpio.ReadPinResponse = (function () {
    function ReadPinResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    ReadPinResponse.prototype.value = 0

    ReadPinResponse.create = function create (properties) {
      return new ReadPinResponse(properties)
    }

    ReadPinResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.value != null && Object.hasOwnProperty.call(message, 'value')) { writer.uint32(16).uint32(message.value) }
      return writer
    }

    ReadPinResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    ReadPinResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.ReadPinResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 2:
            message.value = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    ReadPinResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    ReadPinResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!$util.isInteger(message.value)) { return 'value: integer expected' }
      }
      return null
    }

    ReadPinResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.ReadPinResponse) { return object }
      const message = new $root.PB_Gpio.ReadPinResponse()
      if (object.value != null) { message.value = object.value >>> 0 }
      return message
    }

    ReadPinResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.value = 0 }
      if (message.value != null && message.hasOwnProperty('value')) { object.value = message.value }
      return object
    }

    ReadPinResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return ReadPinResponse
  })()

  PB_Gpio.WritePin = (function () {
    function WritePin (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    WritePin.prototype.pin = 0
    WritePin.prototype.value = 0

    WritePin.create = function create (properties) {
      return new WritePin(properties)
    }

    WritePin.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.pin != null && Object.hasOwnProperty.call(message, 'pin')) { writer.uint32(8).int32(message.pin) }
      if (message.value != null && Object.hasOwnProperty.call(message, 'value')) { writer.uint32(16).uint32(message.value) }
      return writer
    }

    WritePin.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    WritePin.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Gpio.WritePin()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.pin = reader.int32()
            break
          case 2:
            message.value = reader.uint32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    WritePin.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    WritePin.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.pin != null && message.hasOwnProperty('pin')) {
        switch (message.pin) {
          default:
            return 'pin: enum value expected'
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            break
        }
      }
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!$util.isInteger(message.value)) { return 'value: integer expected' }
      }
      return null
    }

    WritePin.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Gpio.WritePin) { return object }
      const message = new $root.PB_Gpio.WritePin()
      switch (object.pin) {
        case 'PC0':
        case 0:
          message.pin = 0
          break
        case 'PC1':
        case 1:
          message.pin = 1
          break
        case 'PC3':
        case 2:
          message.pin = 2
          break
        case 'PB2':
        case 3:
          message.pin = 3
          break
        case 'PB3':
        case 4:
          message.pin = 4
          break
        case 'PA4':
        case 5:
          message.pin = 5
          break
        case 'PA6':
        case 6:
          message.pin = 6
          break
        case 'PA7':
        case 7:
          message.pin = 7
          break
      }
      if (object.value != null) { message.value = object.value >>> 0 }
      return message
    }

    WritePin.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.pin = options.enums === String ? 'PC0' : 0
        object.value = 0
      }
      if (message.pin != null && message.hasOwnProperty('pin')) { object.pin = options.enums === String ? $root.PB_Gpio.GpioPin[message.pin] : message.pin }
      if (message.value != null && message.hasOwnProperty('value')) { object.value = message.value }
      return object
    }

    WritePin.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return WritePin
  })()

  return PB_Gpio
})()

export const PB_Property = $root.PB_Property = (() => {
  const PB_Property = {}

  PB_Property.GetRequest = (function () {
    function GetRequest (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetRequest.prototype.key = ''

    GetRequest.create = function create (properties) {
      return new GetRequest(properties)
    }

    GetRequest.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.key != null && Object.hasOwnProperty.call(message, 'key')) { writer.uint32(10).string(message.key) }
      return writer
    }

    GetRequest.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetRequest.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Property.GetRequest()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetRequest.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetRequest.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.key != null && message.hasOwnProperty('key')) {
        if (!$util.isString(message.key)) { return 'key: string expected' }
      }
      return null
    }

    GetRequest.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Property.GetRequest) { return object }
      const message = new $root.PB_Property.GetRequest()
      if (object.key != null) { message.key = String(object.key) }
      return message
    }

    GetRequest.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) { object.key = '' }
      if (message.key != null && message.hasOwnProperty('key')) { object.key = message.key }
      return object
    }

    GetRequest.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetRequest
  })()

  PB_Property.GetResponse = (function () {
    function GetResponse (properties) {
      if (properties) {
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
          if (properties[keys[i]] != null) { this[keys[i]] = properties[keys[i]] }
        }
      }
    }

    GetResponse.prototype.key = ''
    GetResponse.prototype.value = ''

    GetResponse.create = function create (properties) {
      return new GetResponse(properties)
    }

    GetResponse.encode = function encode (message, writer) {
      if (!writer) { writer = $Writer.create() }
      if (message.key != null && Object.hasOwnProperty.call(message, 'key')) { writer.uint32(10).string(message.key) }
      if (message.value != null && Object.hasOwnProperty.call(message, 'value')) { writer.uint32(18).string(message.value) }
      return writer
    }

    GetResponse.encodeDelimited = function encodeDelimited (message, writer) {
      return this.encode(message, writer).ldelim()
    }

    GetResponse.decode = function decode (reader, length) {
      if (!(reader instanceof $Reader)) { reader = $Reader.create(reader) }
      const end = length === undefined ? reader.len : reader.pos + length, message = new $root.PB_Property.GetResponse()
      while (reader.pos < end) {
        const tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.key = reader.string()
            break
          case 2:
            message.value = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    GetResponse.decodeDelimited = function decodeDelimited (reader) {
      if (!(reader instanceof $Reader)) { reader = new $Reader(reader) }
      return this.decode(reader, reader.uint32())
    }

    GetResponse.verify = function verify (message) {
      if (typeof message !== 'object' || message === null) { return 'object expected' }
      if (message.key != null && message.hasOwnProperty('key')) {
        if (!$util.isString(message.key)) { return 'key: string expected' }
      }
      if (message.value != null && message.hasOwnProperty('value')) {
        if (!$util.isString(message.value)) { return 'value: string expected' }
      }
      return null
    }

    GetResponse.fromObject = function fromObject (object) {
      if (object instanceof $root.PB_Property.GetResponse) { return object }
      const message = new $root.PB_Property.GetResponse()
      if (object.key != null) { message.key = String(object.key) }
      if (object.value != null) { message.value = String(object.value) }
      return message
    }

    GetResponse.toObject = function toObject (message, options) {
      if (!options) { options = {} }
      const object = {}
      if (options.defaults) {
        object.key = ''
        object.value = ''
      }
      if (message.key != null && message.hasOwnProperty('key')) { object.key = message.key }
      if (message.value != null && message.hasOwnProperty('value')) { object.value = message.value }
      return object
    }

    GetResponse.prototype.toJSON = function toJSON () {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return GetResponse
  })()

  return PB_Property
})()

export { $root as default }
