"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _util = _interopRequireDefault(require("util.promisify"));

var _lodash = _interopRequireDefault(require("lodash"));

var _parseCLI = require("./parseCLI");

var _buildSwitcher = require("./buildSwitcher");

var _buildVersions = require("./buildVersions");

var pMap = _lodash.default.flowRight(
  _promise.default.all.bind(_promise.default),
  _lodash.default.map
);

pMap(
  _parseCLI.filenameWithParentList,
  (function() {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(filenameWithParent) {
        return _regenerator.default.wrap(
          function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.next = 2;
                  return (0, _buildVersions.buildAndOutputVersions)(
                    _parseCLI.babelMultiEnvOpts,
                    _parseCLI.babelPresetEnvOpts,
                    _parseCLI.babelPluginTransformRuntimeOpts,
                    _parseCLI.babelCoreOpts,
                    filenameWithParent
                  );

                case 2:
                  _context.next = 4;
                  return (0, _buildSwitcher.buildAndOutputSwitcher)(
                    _parseCLI.babelMultiEnvOpts,
                    _parseCLI.babelCoreOpts,
                    filenameWithParent
                  );

                case 4:
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

    return function(_x) {
      return _ref.apply(this, arguments);
    };
  })()
).catch(function(e) {
  console.error(e);
  process.exit(1);
});
