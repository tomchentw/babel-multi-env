"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util.promisify"));

var _lodash = _interopRequireDefault(require("lodash"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _parseCLI = require("./parseCLI");

var _buildSwitcher = require("./buildSwitcher");

var _buildVersions = require("./buildVersions");

var pMap = _lodash.default.flowRight(
  _lodash.default.bind(_promise.default.all, _promise.default),
  _lodash.default.map
);

var mkdirp = (0, _util.default)(_mkdirp.default);
var outDir = _parseCLI.babelMultiEnvOpts.outDir;

_lodash.default
  .reduce(
    _parseCLI.filenameWithParentList,
    (function() {
      var _ref2 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee(acc, _ref) {
          var filename, parent, dirname;
          return _regenerator.default.wrap(
            function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    (filename = _ref.filename), (parent = _ref.parent);
                    _context.next = 3;
                    return acc;

                  case 3:
                    dirname = _path.default
                      .dirname(filename)
                      .replace(parent, "");
                    return _context.abrupt(
                      "return",
                      mkdirp(_path.default.join(outDir, dirname))
                    );

                  case 5:
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

      return function(_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })(),
    _promise.default.resolve()
  )
  .then(function() {
    return pMap(
      _parseCLI.filenameWithParentList,
      (function() {
        var _ref3 = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee2(filenameWithParent) {
            return _regenerator.default.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      _context2.next = 2;
                      return (0, _buildSwitcher.buildAndOutputSwitcher)(
                        _parseCLI.babelMultiEnvOpts,
                        _parseCLI.babelCoreOpts,
                        filenameWithParent
                      );

                    case 2:
                      _context2.next = 4;
                      return (0, _buildVersions.buildAndOutputVersions)(
                        _parseCLI.babelMultiEnvOpts,
                        _parseCLI.babelPresetEnvOpts,
                        _parseCLI.babelPluginTransformRuntimeOpts,
                        _parseCLI.babelCoreOpts,
                        filenameWithParent
                      );

                    case 4:
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

        return function(_x3) {
          return _ref3.apply(this, arguments);
        };
      })()
    );
  })
  .catch(function(e) {
    console.error(e);
    process.exit(1);
  });
