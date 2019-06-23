"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _once = _interopRequireDefault(require("lodash/once"));

var _fp = require("lodash/fp");

var _uuid = _interopRequireDefault(require("uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OTPublisher =
/*#__PURE__*/
function (_Component) {
  _inherits(OTPublisher, _Component);

  function OTPublisher(props, context) {
    var _this;

    _classCallCheck(this, OTPublisher);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OTPublisher).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "sessionConnectedHandler", function () {
      _this.publishToSession(_this.state.publisher);
    });

    _defineProperty(_assertThisInitialized(_this), "streamCreatedHandler", function (event) {
      _this.setState({
        lastStreamId: event.stream.id
      });
    });

    _this.state = {
      publisher: null,
      lastStreamId: '',
      session: props.session || context.session || null
    };
    return _this;
  }

  _createClass(OTPublisher, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.createPublisher();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var useDefault = function useDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
      };

      var shouldUpdate = function shouldUpdate(key, defaultValue) {
        var previous = useDefault(prevProps.properties[key], defaultValue);
        var current = useDefault(_this2.props.properties[key], defaultValue);
        return previous !== current;
      };

      var updatePublisherProperty = function updatePublisherProperty(key, defaultValue) {
        if (shouldUpdate(key, defaultValue)) {
          var value = useDefault(_this2.props.properties[key], defaultValue);

          _this2.state.publisher[key](value);
        }
      };

      if (shouldUpdate('videoSource', undefined)) {
        this.destroyPublisher();
        this.createPublisher();
        return;
      }

      updatePublisherProperty('publishAudio', true);
      updatePublisherProperty('publishVideo', true);

      if (this.state.session !== prevState.session) {
        this.destroyPublisher(prevState.session);
        this.createPublisher();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.session) {
        this.state.session.off('sessionConnected', this.sessionConnectedHandler);
      }

      this.destroyPublisher();
    }
  }, {
    key: "getPublisher",
    value: function getPublisher() {
      return this.state.publisher;
    }
  }, {
    key: "destroyPublisher",
    value: function destroyPublisher() {
      var _this3 = this;

      var session = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.session;
      delete this.publisherId;

      if (this.state.publisher) {
        this.state.publisher.off('streamCreated', this.streamCreatedHandler);

        if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
          this.state.publisher.once('destroyed', function () {
            _this3.state.publisher.off(_this3.props.eventHandlers);
          });
        }

        if (session) {
          session.unpublish(this.state.publisher);
        }

        this.state.publisher.destroy();
      }
    }
  }, {
    key: "publishToSession",
    value: function publishToSession(publisher) {
      var _this4 = this;

      var publisherId = this.publisherId;
      this.state.session.publish(publisher, function (err) {
        if (publisherId !== _this4.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }

        if (err) {
          _this4.errorHandler(err);
        } else if (typeof _this4.props.onPublish === 'function') {
          _this4.props.onPublish();
        }
      });
    }
  }, {
    key: "createPublisher",
    value: function createPublisher() {
      var _this5 = this;

      if (!this.state.session) {
        this.setState({
          publisher: null,
          lastStreamId: ''
        });
        return;
      }

      var properties = this.props.properties || {};
      var container;

      if (properties.insertDefaultUI !== false) {
        container = document.createElement('div');
        container.setAttribute('class', 'OTPublisherContainer');
        this.node.appendChild(container);
      }

      this.publisherId = (0, _uuid["default"])();
      var publisherId = this.publisherId;
      this.errorHandler = (0, _once["default"])(function (err) {
        if (publisherId !== _this5.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }

        if (typeof _this5.props.onError === 'function') {
          _this5.props.onError(err);
        }
      });
      var publisher = OT.initPublisher(container, properties, function (err) {
        if (publisherId !== _this5.publisherId) {
          // Either this publisher has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }

        if (err) {
          _this5.errorHandler(err);
        } else if (typeof _this5.props.onInit === 'function') {
          _this5.props.onInit();
        }
      });
      publisher.on('streamCreated', this.streamCreatedHandler);

      if (this.props.eventHandlers && _typeof(this.props.eventHandlers) === 'object') {
        var handles = (0, _fp.omitBy)(_fp.isNil)(this.props.eventHandlers);
        publisher.on(handles);
      }

      if (this.state.session.connection) {
        this.publishToSession(publisher);
      } else {
        this.state.session.once('sessionConnected', this.sessionConnectedHandler);
      }

      this.setState({
        publisher: publisher,
        lastStreamId: ''
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      return _react["default"].createElement("div", {
        ref: function ref(node) {
          _this6.node = node;
        }
      });
    }
  }]);

  return OTPublisher;
}(_react.Component);

exports["default"] = OTPublisher;
OTPublisher.propTypes = {
  session: _propTypes["default"].shape({
    connection: _propTypes["default"].shape({
      connectionId: _propTypes["default"].string
    }),
    once: _propTypes["default"].func,
    off: _propTypes["default"].func,
    publish: _propTypes["default"].func,
    unpublish: _propTypes["default"].func
  }),
  properties: _propTypes["default"].object,
  // eslint-disable-line react/forbid-prop-types
  eventHandlers: _propTypes["default"].objectOf(_propTypes["default"].func),
  onInit: _propTypes["default"].func,
  onPublish: _propTypes["default"].func,
  onError: _propTypes["default"].func
};
OTPublisher.defaultProps = {
  session: null,
  properties: {},
  eventHandlers: null,
  onInit: null,
  onPublish: null,
  onError: null
};
OTPublisher.contextTypes = {
  session: _propTypes["default"].shape({
    connection: _propTypes["default"].shape({
      connectionId: _propTypes["default"].string
    }),
    once: _propTypes["default"].func,
    off: _propTypes["default"].func,
    publish: _propTypes["default"].func,
    unpublish: _propTypes["default"].func
  })
};