"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util.promisify"));

var _lodash = _interopRequireDefault(require("lodash"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _parseCLI = require("./parseCLI");

var _buildSwitcher = require("./buildSwitcher");

var _buildVersions = require("./buildVersions");

const pMap = _lodash.default.flowRight(
  _lodash.default.bind(_promise.default.all, _promise.default),
  _lodash.default.map
);

const mkdirp = (0, _util.default)(_mkdirp.default);
const { outDir } = _parseCLI.babelMultiEnvOpts;

_lodash.default
  .reduce(
    _parseCLI.filenameWithParentList,
    async (acc, { filename, parent }) => {
      // Ensure directory sequentially comes out first
      await acc;

      const dirname = _path.default.dirname(filename).replace(parent, "");

      return mkdirp(_path.default.join(outDir, dirname));
    },
    _promise.default.resolve()
  )
  .then(() =>
    pMap(_parseCLI.filenameWithParentList, async filenameWithParent => {
      await (0, _buildSwitcher.buildAndOutputSwitcher)(
        _parseCLI.babelMultiEnvOpts,
        _parseCLI.babelCoreOpts,
        filenameWithParent
      );
      await (0, _buildVersions.buildAndOutputVersions)(
        _parseCLI.babelMultiEnvOpts,
        _parseCLI.babelPresetEnvOpts,
        _parseCLI.babelPluginTransformRuntimeOpts,
        _parseCLI.babelCoreOpts,
        filenameWithParent
      );
    })
  )
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
