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

var _FileLine2 = require("./FileLine");

var _FileLine3 = _interopRequireDefault(_FileLine2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _isGitUrl = require("is-git-url");

var _isGitUrl2 = _interopRequireDefault(_isGitUrl);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _tmp = require("tmp");

var _tmp2 = _interopRequireDefault(_tmp);

var _unzip = require("unzip");

var _unzip2 = _interopRequireDefault(_unzip);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

var _replaceExt = require("replace-ext");

var _replaceExt2 = _interopRequireDefault(_replaceExt);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gitshort = /^[^/]+\/[^/]+$/;

var GithubLine = function (_FileLine) {
  (0, _inherits3.default)(GithubLine, _FileLine);

  function GithubLine(start, end) {
    (0, _classCallCheck3.default)(this, GithubLine);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GithubLine).call(this, start, end));
  }

  (0, _createClass3.default)(GithubLine, [{
    key: "loadStart",
    value: function loadStart() {
      if (this.isGitShort(this.start)) {
        this.start = this.parseGitShort(this.start);
      }
      this.start = this.start.replace(/\.git$/, "");

      this.start = this.parseTag(this.start);
    }
  }, {
    key: "createStart",
    value: function createStart(cb) {
      this.start = this.transformToZip(this.start);
      this.download(this.start, cb);
    }
  }, {
    key: "transformToZip",
    value: function transformToZip(url) {
      //Example
      //https://github.com/some/repo#master

      var repo = url.split("#");
      var download_url = repo[0] + "/archive/" + repo[1] + ".zip";
      return download_url;
    }
  }, {
    key: "download",
    value: function download(url, cb) {
      var _this2 = this;

      var pkg = (0, _request2.default)({
        url: url,
        method: "get"
      });

      var temp_file = _tmp2.default.fileSync();
      var temp_dir = _tmp2.default.dirSync();
      temp_file.name = (0, _replaceExt2.default)(temp_file.name, ".zip");
      temp_file.removeCallback = function () {
        _fs2.default.unlink(temp_file.name);
      };

      this.done = function () {
        // temp_file.removeCallback();
        // temp_dir.removeCallback();
      };

      var out = _fs2.default.createWriteStream(temp_file.name);
      pkg.pipe(out);

      pkg.on("end", function () {
        var extract = require('extract-zip');
        extract(temp_file.name, {
          dir: temp_dir.name
        }, function (err) {
          if (err) {
            console.log(err);
          }

          var rope_file = _path2.default.join(temp_dir.name, "**/.rope");
          var glob_result = _glob2.default.sync(rope_file);
          rope_file = glob_result[0];
          _this2.start = _path2.default.dirname(rope_file);
          cb();
        });
      });
    }
  }, {
    key: "parseTag",
    value: function parseTag(url) {
      url = url.split("#");
      return url.length > 1 ? url.join("#") : url[0] + "#master";
    }
  }, {
    key: "isGitShort",
    value: function isGitShort(url) {
      return gitshort.test(url);
    }
  }, {
    key: "parseGitShort",
    value: function parseGitShort(short) {
      return _path2.default.join("https://github.com/", this.parseTag(short));
    }
  }]);
  return GithubLine;
}(_FileLine3.default);

exports.default = GithubLine;