"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _util = _interopRequireDefault(require("util.promisify"));

var _lodash = _interopRequireDefault(require("lodash"));

var _parseCLI = require("./parseCLI");

var _buildSwitcher = require("./buildSwitcher");

var _buildVersions = require("./buildVersions");

const pMap = _lodash.default.flowRight(
  _promise.default.all.bind(_promise.default),
  _lodash.default.map
);

pMap(
  _parseCLI.filenameWithParentList,
  (() => {
    var _ref = (0, _asyncToGenerator2.default)(function*(filenameWithParent) {
      yield (0,
      _buildVersions.buildAndOutputVersions)(_parseCLI.babelMultiEnvOpts, _parseCLI.babelPresetEnvOpts, _parseCLI.babelPluginTransformRuntimeOpts, _parseCLI.babelCoreOpts, filenameWithParent);
      yield (0,
      _buildSwitcher.buildAndOutputSwitcher)(_parseCLI.babelMultiEnvOpts, _parseCLI.babelCoreOpts, filenameWithParent);
    });

    return function(_x) {
      return _ref.apply(this, arguments);
    };
  })()
).catch(e => {
  console.error(e);
  process.exit(1);
});
