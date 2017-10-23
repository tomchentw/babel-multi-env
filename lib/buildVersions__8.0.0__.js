"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAndOutputVersions = buildAndOutputVersions;
exports.makeOptsForVersion = makeOptsForVersion;
exports.compile = compile;

var _promise = _interopRequireDefault(require("babel-runtime/core-js/promise"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util.promisify"));

var _pathCompleteExtname = _interopRequireDefault(
  require("path-complete-extname")
);

var _lodash = _interopRequireDefault(require("lodash"));

var _babelCore = require("babel-core");

const writeFile = (0, _util.default)(_fs.default.writeFile);
const transformFile = (0, _util.default)(_babelCore.transformFile);

const pMap = _lodash.default.flowRight(
  _lodash.default.bind(_promise.default.all, _promise.default),
  _lodash.default.map
);

async function buildAndOutputVersions(
  { multiVersions, outDir },
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts,
  { filename, parent }
) {
  const dirname = _path.default.dirname(filename).replace(parent, "");

  const extname = (0, _pathCompleteExtname.default)(filename);

  const basename = _path.default.basename(filename, extname);

  await pMap(multiVersions, async version => {
    const versionOpts = makeOptsForVersion(
      babelPresetEnvOpts,
      babelPluginTransformRuntimeOpts,
      babelCoreOpts,
      version
    );
    const result = await compile(filename, versionOpts);

    const dest = _path.default.join(
      outDir,
      dirname,
      `${basename}__${version}__${extname}`
    );

    await writeFile(dest, result.code);
  });
}

function makeOptsForVersion(
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts,
  version
) {
  return _lodash.default.assign({}, babelCoreOpts, {
    presets: [
      ..._lodash.default.reject(babelCoreOpts.presets, it =>
        _lodash.default.includes(
          ["env", "babel-preset-env"],
          _lodash.default.first(it) || it
        )
      ),
      [
        "babel-preset-env",
        _lodash.default.assign({}, babelPresetEnvOpts, {
          targets: {
            node: version
          }
        })
      ]
    ],
    plugins: [
      ..._lodash.default.reject(babelCoreOpts.plugins, it =>
        _lodash.default.includes(
          ["transform-runtime", "babel-plugin-transform-runtime"],
          _lodash.default.first(it) || it
        )
      ),
      ["transform-runtime", babelPluginTransformRuntimeOpts]
    ]
  });
}

async function compile(filename, versionOpts, watch = false) {
  try {
    return await transformFile(filename, versionOpts);
  } catch (err) {
    if (watch) {
      console.error(err);
      return {
        ignored: true
      };
    } else {
      throw err;
    }
  }
}
