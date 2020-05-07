"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authorize;

var _sha256Base64UrlEncode = require("./sha256-base64-url-encode");

var _createCodeVerifier = _interopRequireDefault(require("./create-code-verifier"));

var _hashed = _interopRequireDefault(require("./hashed"));

var _getEncodedVerifierKey = _interopRequireDefault(require("./getEncodedVerifierKey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authorize(_ref) {
  var provider = _ref.provider,
      clientId = _ref.clientId,
      scopes = _ref.scopes,
      redirectUri = _ref.redirectUri || window.location,
      _ref$storage = _ref.storage,
      storage = _ref$storage === void 0 ? sessionStorage : _ref$storage;
  var encodedVerifier = (0, _sha256Base64UrlEncode.base64URLEncode)((0, _createCodeVerifier.default)());
  storage.setItem((0, _getEncodedVerifierKey.default)(clientId), encodedVerifier);
  var query = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge: (0, _sha256Base64UrlEncode.base64URLEncode)((0, _sha256Base64UrlEncode.sha256)(encodedVerifier)),
    code_challenge_method: 'S256'
  };

  if (scopes && scopes.length > 0) {
    query.scope = scopes.join(' ');
  }

  var url = "".concat(provider, "/authorize?").concat((0, _hashed.default)(query));
  window.location.replace(url);
}
//# sourceMappingURL=authorize.js.map