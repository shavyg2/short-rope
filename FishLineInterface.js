"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FishLineInterface = function () {
    function FishLineInterface(start, end) {
        (0, _classCallCheck3.default)(this, FishLineInterface);

        this.start = start;
        this.end = end;
    }

    (0, _createClass3.default)(FishLineInterface, [{
        key: "boot",
        value: function boot(cb) {
            var _this = this;

            this.loadStart();
            this.loadEnd();
            this.createStart(function () {
                _this.loadGlobs();
                _this.transfer(function () {
                    if (_lodash2.default.isFunction(_this.done)) {
                        _this.done();
                    }
                    cb();
                });
            });
        }
    }, {
        key: "loadStart",
        value: function loadStart() {
            throw new Error("loadStart Interface needs to be implemented");
        }
    }, {
        key: "loadEnd",
        value: function loadEnd() {
            this.end = this.end || process.cwd();
            this.end = _path2.default.resolve(this.end);
        }
    }, {
        key: "createStart",
        value: function createStart(cb) {
            cb();
        }
    }, {
        key: "readStart",
        value: function readStart() {
            var rope_path = _path2.default.resolve(this.start, ".rope");
            this._start_rope_content = _fs2.default.readFileSync(rope_path, "utf8");
            this._start_rope = JSON.parse(this._start_rope_content);
        }
    }, {
        key: "loadGlobs",
        value: function loadGlobs() {
            var _this2 = this;

            var total_files = [];

            if (!this._start_rope || !this._start_rope_content) {
                this.readStart();
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this._start_rope), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var pathsearch = _step.value;

                    pathsearch = _path2.default.join(this.start, pathsearch);
                    var files = _glob2.default.sync(pathsearch);
                    total_files = _lodash2.default.concat(total_files, files);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.total_files = (0, _lodash2.default)(total_files).map(function (x) {
                return _path2.default.resolve(x).replace(_path2.default.resolve(_this2.start), "");
            }).value();
        }
    }, {
        key: "transfer",
        value: function transfer(cb) {
            var _this3 = this;

            var async_func = (0, _lodash2.default)(this.total_files).map(function (x) {
                return {
                    from: _path2.default.join(_this3.start, x),
                    to: _path2.default.join(_this3.end, x)
                };
            }).sort(function (x) {
                return x.from.length;
            }).map(function (x) {
                return function (next) {
                    var transfer_function = function transfer_function(x) {
                        var _from, _to;

                        function handleError(e) {
                            console.log(e.stack);
                        }

                        try {
                            _from = _fs2.default.createReadStream(x.from);
                            _to = _fs2.default.createWriteStream(x.to);
                            _from.pipe(_to);
                        } catch (e) {
                            console.log(x);
                            console.log(e.stack);
                            process.exit(1);
                        }

                        _from.on("end", function () {
                            console.log("transferred " + x.to);
                        });

                        _from.on("error", handleError);

                        _to.on("error", handleError);

                        _from.on("end", next);
                    };

                    var stat_from = _fs2.default.statSync(x.from);

                    if (stat_from.isFile()) {
                        (0, _mkdirp2.default)(_path2.default.dirname(x.to), function () {
                            transfer_function(x);
                        });
                    } else {
                        return next();
                    }
                };
            }).value();
            _async2.default.parallel(async_func, cb);
        }
    }]);
    return FishLineInterface;
}();

exports.default = FishLineInterface;