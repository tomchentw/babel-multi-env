"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeOptsForVersion = makeOptsForVersion;
exports.compile = exports.buildAndOutputVersions = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/toConsumableArray")
);

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util.promisify"));

var _pathCompleteExtname = _interopRequireDefault(
  require("path-complete-extname")
);

var _outputFile = _interopRequireDefault(require("output-file"));

var _lodash = _interopRequireDefault(require("lodash"));

var _babelCore = require("babel-core");

var transformFile = (0, _util.default)(_babelCore.transformFile);
var outputFile = (0, _util.default)(_outputFile.default);

var pMap = _lodash.default.flowRight(
  _lodash.default.bind(_promise.default.all, _promise.default),
  _lodash.default.map
);

var buildAndOutputVersions = (function() {
  var _ref3 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(
      _ref,
      babelPresetEnvOpts,
      babelPluginTransformRuntimeOpts,
      babelCoreOpts,
      _ref2
    ) {
      var multiVersions, outDir, filename, parent, dirname, extname, basename;
      return _regenerator.default.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (multiVersions = _ref.multiVersions), (outDir = _ref.outDir);
                (filename = _ref2.filename), (parent = _ref2.parent);
                dirname = _path.default.dirname(filename).replace(parent, "");
                extname = (0, _pathCompleteExtname.default)(filename);
                basename = _path.default.basename(filename, extname);
                _context2.next = 7;
                return pMap(
                  multiVersions,
                  (function() {
                    var _ref4 = (0, _asyncToGenerator2.default)(
                      /*#__PURE__*/
                      _regenerator.default.mark(function _callee(version) {
                        var versionOpts, result, dest;
                        return _regenerator.default.wrap(
                          function _callee$(_context) {
                            while (1) {
                              switch ((_context.prev = _context.next)) {
                                case 0:
                                  versionOpts = makeOptsForVersion(
                                    babelPresetEnvOpts,
                                    babelPluginTransformRuntimeOpts,
                                    babelCoreOpts,
                                    version
                                  );
                                  _context.next = 3;
                                  return compile(filename, versionOpts);

                                case 3:
                                  result = _context.sent;
                                  dest = _path.default.join(
                                    outDir,
                                    dirname,
                                    `${basename}__${version}__${extname}`
                                  );
                                  _context.next = 7;
                                  return outputFile(dest, result.code);

                                case 7:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          },
                          _callee,
                          this
                        );
                      })
                    );

                    return function(_x6) {
                      return _ref4.apply(this, arguments);
                    };
                  })()
                );

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        },
        _callee2,
        this
      );
    })
  );

  return function buildAndOutputVersions(_x, _x2, _x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
})();

exports.buildAndOutputVersions = buildAndOutputVersions;

function makeOptsForVersion(
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts,
  version
) {
  return _lodash.default.assign({}, babelCoreOpts, {
    presets: [].concat(
      (0, _toConsumableArray2.default)(
        _lodash.default.reject(babelCoreOpts.presets, function(it) {
          return _lodash.default.includes(
            ["env", "babel-preset-env"],
            _lodash.default.first(it) || it
          );
        })
      ),
      [
        [
          "babel-preset-env",
          _lodash.default.assign({}, babelPresetEnvOpts, {
            targets: {
              node: version
            }
          })
        ]
      ]
    ),
    plugins: [].concat(
      (0, _toConsumableArray2.default)(
        _lodash.default.reject(babelCoreOpts.plugins, function(it) {
          return _lodash.default.includes(
            ["transform-runtime", "babel-plugin-transform-runtime"],
            _lodash.default.first(it) || it
          );
        })
      ),
      [["transform-runtime", babelPluginTransformRuntimeOpts]]
    )
  });
}

var compile = (function() {
  var _ref5 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3(filename, versionOpts) {
      var watch,
        _args3 = arguments;
      return _regenerator.default.wrap(
        function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                watch =
                  _args3.length > 2 && _args3[2] !== undefined
                    ? _args3[2]
                    : false;
                _context3.prev = 1;
                _context3.next = 4;
                return transformFile(filename, versionOpts);

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](1);

                if (!watch) {
                  _context3.next = 14;
                  break;
                }

                console.error(_context3.t0);
                return _context3.abrupt("return", {
                  ignored: true
                });

              case 14:
                throw _context3.t0;

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        },
        _callee3,
        this,
        [[1, 7]]
      );
    })
  );

  return function compile(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
})();

exports.compile = compile;
