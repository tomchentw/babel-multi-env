"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

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

pMap(_parseCLI.filenames, async filename => {
  await (0, _buildVersions.buildAndOutputVersions)(
    _parseCLI.babelMultiEnvOpts,
    _parseCLI.babelPresetEnvOpts,
    _parseCLI.babelPluginTransformRuntimeOpts,
    _parseCLI.babelCoreOpts,
    filename
  );
  await (0, _buildSwitcher.buildAndOutputSwitcher)(
    _parseCLI.babelMultiEnvOpts,
    _parseCLI.babelCoreOpts,
    filename
  );
}).catch(e => {
  console.error(e);
  process.exit(1);
});
