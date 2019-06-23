"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = preloadScript;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDisplayName = _interopRequireDefault(require("react-display-name"));

var _scriptjs = _interopRequireDefault(require("scriptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_SCRIPT_URL = 'https://static.opentok.com/v2/js/opentok.min.js';
/*
This higher-order component will load the OpenTok client thru a script tag.
It will render its inner component only when the OpenTok client has loaded.
In the meantime, it will render a loading element chosen by the developer.
*/

function preloadScript(InnerComponent) {
  var PreloadScript =
  /*#__PURE__*/
  function (_Component) {
    _inherits(PreloadScript, _Component);

    function PreloadScript(props) {
      var _this;

      _classCallCheck(this, PreloadScript);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PreloadScript).call(this, props));

      _defineProperty(_assertThisInitialized(_this), "onScriptLoad", function () {
        if (_this.isPresent) {
          _this.setState({
            scriptLoaded: true
          });
        }
      });

      _this.state = {
        scriptLoaded: typeof OT !== 'undefined'
      };
      _this.isPresent = false;
      return _this;
    }

    _createClass(PreloadScript, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.isPresent = true;

        if (this.scriptLoading || this.state.scriptLoaded) {
          return;
        }

        this.scriptLoading = true;
        var scriptUrl = this.props.opentokClientUrl;
        (0, _scriptjs["default"])(scriptUrl, this.onScriptLoad);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.isPresent = false;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            opentokClientUrl = _this$props.opentokClientUrl,
            loadingDelegate = _this$props.loadingDelegate,
            restProps = _objectWithoutProperties(_this$props, ["opentokClientUrl", "loadingDelegate"]);

        if (this.state.scriptLoaded) {
          return _react["default"].createElement(InnerComponent, restProps);
        }

        return loadingDelegate;
      }
    }]);

    return PreloadScript;
  }(_react.Component);

  PreloadScript.displayName = "preloadScript(".concat((0, _reactDisplayName["default"])(InnerComponent), ")");
  PreloadScript.propTypes = {
    opentokClientUrl: _propTypes["default"].string,
    loadingDelegate: _propTypes["default"].node
  };
  PreloadScript.defaultProps = {
    opentokClientUrl: DEFAULT_SCRIPT_URL,
    loadingDelegate: _react["default"].createElement("div", null)
  };
  return PreloadScript;
}