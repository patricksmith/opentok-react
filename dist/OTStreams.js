"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = OTStreams;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _OTSubscriberContext = _interopRequireDefault(require("./OTSubscriberContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function OTStreams(props, context) {
  var session = props.session || context.session || null;
  var streams = props.streams || context.streams || null;

  if (!session) {
    return _react["default"].createElement("div", null);
  }

  var child = _react.Children.only(props.children);

  var childrenWithContextWrapper = Array.isArray(streams) ? streams.map(function (stream) {
    return child ? _react["default"].createElement(_OTSubscriberContext["default"], {
      stream: stream,
      key: stream.id
    }, (0, _react.cloneElement)(child)) : child;
  }) : null;
  return _react["default"].createElement("div", null, childrenWithContextWrapper);
}

OTStreams.propTypes = {
  children: _propTypes["default"].element.isRequired,
  session: _propTypes["default"].shape({
    publish: _propTypes["default"].func,
    subscribe: _propTypes["default"].func
  }),
  streams: _propTypes["default"].arrayOf(_propTypes["default"].object)
};
OTStreams.defaultProps = {
  session: null,
  streams: null
};
OTStreams.contextTypes = {
  session: _propTypes["default"].shape({
    publish: _propTypes["default"].func,
    subscribe: _propTypes["default"].func
  }),
  streams: _propTypes["default"].arrayOf(_propTypes["default"].object)
};