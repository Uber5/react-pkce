"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _authorize = _interopRequireDefault(require("./helpers/authorize"));

var _getCodeFromLocation = require("./helpers/getCodeFromLocation");

var _fetchToken = require("./helpers/fetchToken");

var _removeCodeFromLocation = require("./helpers/removeCodeFromLocation");

var _getVerifierFromStorage = require("./helpers/getVerifierFromStorage");

var _removeVerifierFromStorage = require("./helpers/removeVerifierFromStorage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = function _default(_ref) {
  var clientId = _ref.clientId,
      clientSecret = _ref.clientSecret,
      provider = _ref.provider,
      redirectUri = _ref.redirectUri,
      useUrlEncodedForm = _ref.useUrlEncodedForm,
      _ref$scopes = _ref.scopes,
      scopes = _ref$scopes === void 0 ? [] : _ref$scopes,
      _ref$tokenEndpoint = _ref.tokenEndpoint,
      tokenEndpoint = _ref$tokenEndpoint === void 0 ? "".concat(provider, "/token") : _ref$tokenEndpoint,
      _ref$storage = _ref.storage,
      storage = _ref$storage === void 0 ? sessionStorage : _ref$storage,
      _ref$fetch = _ref.fetch,
      fetch = _ref$fetch === void 0 ? window.fetch : _ref$fetch,
      _ref$busyIndicator = _ref.busyIndicator,
      busyIndicator = _ref$busyIndicator === void 0 ? _react.default.createElement(_react.default.Fragment, null, "logging in...") : _ref$busyIndicator;
  var context = (0, _react.createContext)({});
  var Provider = context.Provider;

  var Authenticated =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Authenticated, _React$Component);

    function Authenticated() {
      _classCallCheck(this, Authenticated);

      return _possibleConstructorReturn(this, _getPrototypeOf(Authenticated).apply(this, arguments));
    }

    _createClass(Authenticated, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var ensureAuthenticated = this.context.ensureAuthenticated;
        ensureAuthenticated();
      }
    }, {
      key: "render",
      value: function render() {
        var token = this.context.token;
        var children = this.props.children;

        if (!token) {
          return busyIndicator;
        } else {
          return children;
        }
      }
    }]);

    return Authenticated;
  }(_react.default.Component);

  _defineProperty(Authenticated, "contextType", context);

  var useToken = function useToken() {
    var _useContext = (0, _react.useContext)(context),
        token = _useContext.token;

    if (!token) {
      console.warn("Trying to useToken() while not being authenticated.\nMake sure to useToken() only inside of an <Authenticated /> component.");
    }

    return token;
  };

  return {
    AuthContext: function AuthContext(_ref2) {
      var children = _ref2.children;

      var _useState = (0, _react.useState)(null),
          _useState2 = _slicedToArray(_useState, 2),
          token = _useState2[0],
          setToken = _useState2[1]; // if we have no token, but code and verifier are present,
      // then we try to swap code for token


      (0, _react.useEffect)(function () {
        if (!token) {
          var code = (0, _getCodeFromLocation.getCodeFromLocation)({
            location: window.location
          });
          var verifier = (0, _getVerifierFromStorage.getVerifierFromStorage)({
            clientId: clientId,
            storage: storage
          });

          if (code && verifier) {
            (0, _fetchToken.fetchToken)({
              clientId: clientId,
              clientSecret: clientSecret,
              tokenEndpoint: tokenEndpoint,
              redirectUri: redirectUri,
              code: code,
              verifier: verifier,
              useUrlEncodedForm: useUrlEncodedForm,
              fetch: fetch
            }).then(setToken).then(function () {
              (0, _removeCodeFromLocation.removeCodeFromLocation)();
              (0, _removeVerifierFromStorage.removeVerifierFromStorage)({
                clientId: clientId,
                storage: storage
              });
            }).catch(function (e) {
              console.error(e);
              alert("Error fetching auth token: ".concat(e.message));
            });
          }
        }
      }, [token]);

      var ensureAuthenticated = function ensureAuthenticated() {
        var code = (0, _getCodeFromLocation.getCodeFromLocation)({
          location: window.location
        });

        if (!token && !code) {
          (0, _authorize.default)({
            provider: provider,
            clientId: clientId,
            scopes: scopes,
            redirectUri: redirectUri
          });
        }
      };

      return _react.default.createElement(Provider, {
        value: {
          token: token,
          ensureAuthenticated: ensureAuthenticated
        }
      }, children);
    },
    Authenticated: Authenticated,
    useToken: useToken
  };
};

exports.default = _default;
//# sourceMappingURL=createAuthContext.js.map