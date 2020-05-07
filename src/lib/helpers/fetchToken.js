"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchToken = void 0;

var fetchToken = function fetchToken(_ref) {
  var clientId = _ref.clientId,
      clientSecret = _ref.clientSecret,
      code = _ref.code,
      verifier = _ref.verifier,
      tokenEndpoint = _ref.tokenEndpoint,
      _ref$fetch = _ref.fetch,
      redirectUri = _ref.redirectUri || window.location,
      useUrlEncodedForm = _ref.useUrlEncodedForm,
      fetch = _ref$fetch === void 0 ? window.fetch : _ref$fetch;
  var payload = {
    client_id: clientId,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code_verifier: verifier
  };

  var body = useUrlEncodedForm ? Object.keys(payload).map(key => key + '=' + payload[key]).join('&') : JSON.stringify(payload);

  if (clientSecret) {
    payload.client_secret = clientSecret;
  }

  return fetch(tokenEndpoint, {
    headers: {
      'Content-Type': useUrlEncodedForm ? 'application/x-www-form-urlencoded' : 'application/json'
    },
    method: 'POST',
    body: body
  }).then(function (r) {
    if (!r.ok) {
      throw new Error("Token response not ok, status is ".concat(r.status, ", check the react-u5auth configuration (wrong provider or token endpoint?)"));
    }

    return r.json();
  }).then(function (token) {
    var expires_in = token.expires_in;

    if (expires_in && Number.isFinite(expires_in)) {
      var slackSeconds = 10; // add 'expires_at', with the given slack

      token.expires_at = new Date(new Date().getTime() + expires_in * 1000 - slackSeconds * 1000);
    }

    return token;
  }).catch(function (err) {
    console.error('ERR (fetch)', err);
    throw err;
  });
};

exports.fetchToken = fetchToken;
//# sourceMappingURL=fetchToken.js.map