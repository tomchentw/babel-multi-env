"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babelCoreOpts = exports.babelPluginTransformRuntimeOpts = exports.babelPresetEnvOpts = exports.babelMultiEnvOpts = exports.filenameWithParentList = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(
  require("babel-runtime/helpers/taggedTemplateLiteral")
);

var _lodash = _interopRequireDefault(require("lodash"));

var _semver = _interopRequireDefault(require("semver"));

var _glob = _interopRequireDefault(require("glob"));

var _globParent = _interopRequireDefault(require("glob-parent"));

var _yargs = _interopRequireDefault(require("yargs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _templateObject = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{green [babel-multi-env]}"],
    ["{green [babel-multi-env]}"]
  ),
  _templateObject2 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{blue [babel-preset-env]}"],
    ["{blue [babel-preset-env]}"]
  ),
  _templateObject3 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{magenta [babel-plugin-transform-runtime]}"],
    ["{magenta [babel-plugin-transform-runtime]}"]
  ),
  _templateObject4 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{cyan [babel-core]}"],
    ["{cyan [babel-core]}"]
  ),
  _templateObject5 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["--multi-versions {red ", "} ", " invalid semver version", ""],
    ["--multi-versions {red ", "} ", " invalid semver version", ""]
  );

var BABEL_MULTI_ENV_GROUP = (0, _chalk.default)(_templateObject);
var BABEL_PRESET_ENV_GROUP = (0, _chalk.default)(_templateObject2);
var BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP = (0, _chalk.default)(
  _templateObject3
);
var BABEL_CORE_GROUP = (0, _chalk.default)(_templateObject4);

var argv = _yargs.default
  .help("help")
  .alias("help", "h")
  .version()
  .alias("version", "v")
  .options({
    // --- BABEL_MULTI_ENV_GROUP ---
    "multi-versions": {
      demandOption: true,
      type: "array",
      description:
        "list of supported semver versions. Example: 8.0.0 6.0.0 4.0.0",
      group: BABEL_MULTI_ENV_GROUP,
      coerce: function coerce(arg) {
        var iv = arg.filter(function(it) {
          return !_semver.default.valid(it);
        }); // iv = invalidVersions

        if (iv.length > 0) {
          throw new Error(
            (0, _chalk.default)(
              _templateObject5,
              iv.join(", "),
              iv.length > 1 ? "are" : "is",
              iv.length > 1 ? "s" : ""
            )
          );
        } else {
          arg.sort(_semver.default.compare).reverse();
          return arg;
        }
      }
    },
    given: {
      demandOption: true,
      type: "array",
      description: "source glob patterns",
      group: BABEL_MULTI_ENV_GROUP
    },
    "out-dir": {
      demandOption: true,
      type: "string",
      description: "compile into an output directory",
      group: BABEL_MULTI_ENV_GROUP
    },
    // --- BABEL_PRESET_ENV_GROUP ---
    "use-built-ins": {
      type: "string",
      description:
        'apply babel-preset-env for polyfills with "useBuiltIns": "usage" (via babel-polyfill)',
      group: BABEL_PRESET_ENV_GROUP,
      choices: ["usage"]
    },
    // --- BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP ---
    helpers: {
      type: "boolean",
      description:
        "Enables inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to moduleName",
      defaultDescription: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    polyfill: {
      type: "boolean",
      description:
        "Enables new built-ins (Promise, Set, Map, etc.) are transformed to use a non-global polluting polyfill",
      defaultDescription: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    regenerator: {
      type: "boolean",
      description:
        "Enables generator functions are transformed to use a regenerator runtime that does not pollute the global scope",
      defaultDescription: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    "module-name": {
      type: "string",
      description:
        "sets the name/path of the module used when importing helpers",
      defaultDescription: "babel-runtime",
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    // --- BABEL_CORE_GROUP ---
    presets: {
      type: "array",
      description: "list of preset names",
      group: BABEL_CORE_GROUP
    },
    plugins: {
      type: "array",
      description: "list of plugins names",
      group: BABEL_CORE_GROUP
    }
  })
  .strict()
  .parse();

var GLOB_OPTIONS = {};

var filenameWithParentList = _lodash.default.flowRight(
  _lodash.default.uniq,
  _lodash.default.flatten,
  _lodash.default.partial(_lodash.default.map, _lodash.default, function(
    input
  ) {
    var output = _glob.default.sync(input, GLOB_OPTIONS);

    if (!output.length) {
      output = [input];
    }

    var parent = (0, _globParent.default)(input);
    return _lodash.default.map(output, function(filename) {
      return {
        parent: parent,
        filename: filename
      };
    });
  })
)(argv.given);

exports.filenameWithParentList = filenameWithParentList;

var babelMultiEnvOpts = _lodash.default.pick(argv, ["multiVersions", "outDir"]);

exports.babelMultiEnvOpts = babelMultiEnvOpts;

var babelPresetEnvOpts = _lodash.default.pick(argv, ["useBuiltIns"]);

exports.babelPresetEnvOpts = babelPresetEnvOpts;

var babelPluginTransformRuntimeOpts = _lodash.default.pick(argv, [
  "helpers",
  "polyfill",
  "regenerator",
  "moduleName"
]);

exports.babelPluginTransformRuntimeOpts = babelPluginTransformRuntimeOpts;

var babelCoreOpts = _lodash.default.pick(argv, ["presets", "plugins"]);

exports.babelCoreOpts = babelCoreOpts;
