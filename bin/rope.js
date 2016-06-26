"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _GitHubLine = require("../GitHubLine");

var _GitHubLine2 = _interopRequireDefault(_GitHubLine);

var _FileLine = require("../FileLine");

var _FileLine2 = _interopRequireDefault(_FileLine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = Array.prototype.slice.call(process.argv, 0);
var commands = (0, _lodash2.default)(args.slice(2)).map(function (x) {
  return x.toLowerCase();
}).value();
var type = commands[0];
var param = commands[1];

var Line = void 0;
switch (type) {
  case "github":
    Line = _GitHubLine2.default;
    break;
  default:
    Line = _FileLine2.default;
}

var line = new Line(param);
line.boot(function () {
  console.log("Completed");
});