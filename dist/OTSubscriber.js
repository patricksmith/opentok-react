"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _uuid = _interopRequireDefault(require("uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OTSubscriber =
/*#__PURE__*/
function (_Component) {
  _inherits(OTSubscriber, _Component);

  function OTSubscriber(props, context) {
    var _this;

    _classCallCheck(this, OTSubscriber);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OTSubscriber).call(this, props));
    _this.state = {
      subscriber: null,
      stream: props.stream || context.stream || null,
      session: props.session || context.session || null
    };
    return _this;
  }

  _createClass(OTSubscriber, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createSubscriber();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var cast = function cast(value, Type, defaultValue) {
        return value === undefined ? defaultValue : Type(value);
      };

      var updateSubscriberProperty = function updateSubscriberProperty(key) {
        var previous = cast(prevProps.properties[key], Boolean, true);
        var current = cast(_this2.props.properties[key], Boolean, true);

        if (previous !== current) {
          _this2.state.subscriber[key](current);
        }
      };

      updateSubscriberProperty('subscribeToAudio');
      updateSubscriberProperty('subscribeToVideo');

      if (prevState.session !== this.state.session || prevState.stream !== this.state.stream) {
        this.destroySubscriber(prevState.session);
        this.createSubscriber();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.destroySubscriber();
    }
  }, {
    key: "getSubscriber",
    value: function getSubscriber() {
      return this.state.subscriber;
    }
  }, {
    key: "createSubscriber",
    value: function createSubscriber() {
      var _this3 = this;

      if (!this.state.session || !this.state.stream) {
        this.setState({
          subscriber: null
        });
        return;
      }

      var container = document.createElement('div');
      container.setAttribute('class', 'OTSubscriberContainer');
      this.node.appendChild(container);
      this.subscriberId = (0, _uuid["default"])();
      var subscriberId = this.subscriberId;
      var subscriber = this.state.session.subscribe(this.state.stream, container, this.props.properties, function (err) {
        if (subscriberId !== _this3.subscriberId) {
          // Either this subscriber has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }

        if (err && typeof _this3.props.onError === 'function') {
          _this3.props.onError(err);
        } else if (!err && typeof _this3.props.onSubscribe === 'function') {
          _this3.props.onSubscribe();
        }
      });

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        subscriber.on(this.props.eventHandlers);
      }

      this.setState({
        subscriber: subscriber
      });
    }
  }, {
    key: "destroySubscriber",
    value: function destroySubscriber() {
      var _this4 = this;

      var session = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.session;
      delete this.subscriberId;

      if (this.state.subscriber) {
        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.subscriber.once('destroyed', function () {
            _this4.state.subscriber.off(_this4.props.eventHandlers);
          });
        }

        if (session) {
          session.unsubscribe(this.state.subscriber);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return _react["default"].createElement("div", {
        ref: function ref(node) {
          _this5.node = node;
        }
      });
    }
  }]);

  return OTSubscriber;
}(_react.Component);

exports["default"] = OTSubscriber;
OTSubscriber.propTypes = {
  stream: _propTypes["default"].shape({
    streamId: _propTypes["default"].string
  }),
  session: _propTypes["default"].shape({
    subscribe: _propTypes["default"].func,
    unsubscribe: _propTypes["default"].func
  }),
  properties: _propTypes["default"].object,
  // eslint-disable-line react/forbid-prop-types
  eventHandlers: _propTypes["default"].objectOf(_propTypes["default"].func),
  onSubscribe: _propTypes["default"].func,
  onError: _propTypes["default"].func
};
OTSubscriber.defaultProps = {
  stream: null,
  session: null,
  properties: {},
  eventHandlers: null,
  onSubscribe: null,
  onError: null
};
OTSubscriber.contextTypes = {
  stream: _propTypes["default"].shape({
    streamId: _propTypes["default"].string
  }),
  session: _propTypes["default"].shape({
    subscribe: _propTypes["default"].func,
    unsubscribe: _propTypes["default"].func
  })
};