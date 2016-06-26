"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _FishLineInterface2 = require("./FishLineInterface");

var _FishLineInterface3 = _interopRequireDefault(_FishLineInterface2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FileLine = function (_FishLineInterface) {
  (0, _inherits3.default)(FileLine, _FishLineInterface);

  function FileLine(start, end) {
    (0, _classCallCheck3.default)(this, FileLine);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FileLine).call(this, start, end));
  }

  (0, _createClass3.default)(FileLine, [{
    key: "loadStart",
    value: function loadStart() {
      this.start = _path2.default.resolve(this.start);
    }
  }]);
  return FileLine;
}(_FishLineInterface3.default);

exports.default = FileLine;