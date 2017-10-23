"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

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

const pMap = _lodash.default.flowRight(
  _lodash.default.bind(_promise.default.all, _promise.default),
  _lodash.default.map
);

const mkdirp = (0, _util.default)(_mkdirp.default);
const outDir = _parseCLI.babelMultiEnvOpts.outDir;

_lodash.default
  .reduce(
    _parseCLI.filenameWithParentList,
    (() => {
      var _ref = (0, _asyncToGenerator2.default)(function*(
        acc,
        { filename, parent }
      ) {
        // Ensure directory sequentially comes out first
        yield acc;

        const dirname = _path.default.dirname(filename).replace(parent, "");

        return mkdirp(_path.default.join(outDir, dirname));
      });

      return function(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    })(),
    _promise.default.resolve()
  )
  .then(() =>
    pMap(
      _parseCLI.filenameWithParentList,
      (() => {
        var _ref2 = (0, _asyncToGenerator2.default)(function*(
          filenameWithParent
        ) {
          yield (0, _buildSwitcher.buildAndOutputSwitcher)(
            _parseCLI.babelMultiEnvOpts,
            _parseCLI.babelCoreOpts,
            filenameWithParent
          );
          yield (0, _buildVersions.buildAndOutputVersions)(
            _parseCLI.babelMultiEnvOpts,
            _parseCLI.babelPresetEnvOpts,
            _parseCLI.babelPluginTransformRuntimeOpts,
            _parseCLI.babelCoreOpts,
            filenameWithParent
          );
        });

        return function(_x3) {
          return _ref2.apply(this, arguments);
        };
      })()
    )
  )
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
