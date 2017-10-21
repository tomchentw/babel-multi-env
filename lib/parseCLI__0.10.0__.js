"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.babelCoreOpts = exports.babelPluginTransformRuntimeOpts = exports.babelPresetEnvOpts = exports.babelMultiEnvOpts = exports.filenameWithParentList = void 0;

var _toConsumableArray2 = _interopRequireDefault(
  require("babel-runtime/helpers/toConsumableArray")
);

var _taggedTemplateLiteral2 = _interopRequireDefault(
  require("babel-runtime/helpers/taggedTemplateLiteral")
);

var _lodash = _interopRequireDefault(require("lodash"));

var _semver = _interopRequireDefault(require("semver"));

var _glob = _interopRequireDefault(require("glob"));

var _globParent = _interopRequireDefault(require("glob-parent"));

var _commander = _interopRequireDefault(require("commander"));

var _chalk = _interopRequireDefault(require("chalk"));

var _figures = _interopRequireDefault(require("figures"));

var _templateObject = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{green [babel-multi-env]} comma-separated list of supported semver versions"
    ],
    [
      "{green [babel-multi-env]} comma-separated list of supported semver versions"
    ]
  ),
  _templateObject2 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{green [babel-multi-env]} Compile an input directory of modules into an output directory"
    ],
    [
      "{green [babel-multi-env]} Compile an input directory of modules into an output directory"
    ]
  ),
  _templateObject3 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      '{blue [babel-preset-env]} Apply @babel/preset-env for polyfills with "useBuiltIns": "usage" (via @babel/polyfill)'
    ],
    [
      '{blue [babel-preset-env]} Apply @babel/preset-env for polyfills with "useBuiltIns": "usage" (via @babel/polyfill)'
    ]
  ),
  _templateObject4 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{magenta [babel-plugin-transform-runtime]} Disables inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to moduleName"
    ],
    [
      "{magenta [babel-plugin-transform-runtime]} Disables inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to moduleName"
    ]
  ),
  _templateObject5 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{magenta [babel-plugin-transform-runtime]} Disables new built-ins (Promise, Set, Map, etc.) are transformed to use a non-global polluting polyfill"
    ],
    [
      "{magenta [babel-plugin-transform-runtime]} Disables new built-ins (Promise, Set, Map, etc.) are transformed to use a non-global polluting polyfill"
    ]
  ),
  _templateObject6 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{magenta [babel-plugin-transform-runtime]} Disables generator functions are transformed to use a regenerator runtime that does not pollute the global scope"
    ],
    [
      "{magenta [babel-plugin-transform-runtime]} Disables generator functions are transformed to use a regenerator runtime that does not pollute the global scope"
    ]
  ),
  _templateObject7 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    [
      "{magenta [babel-plugin-transform-runtime]} Sets the name/path of the module used when importing helpers"
    ],
    [
      "{magenta [babel-plugin-transform-runtime]} Sets the name/path of the module used when importing helpers"
    ]
  ),
  _templateObject8 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{cyan [babel-core]} comma-separated list of preset names"],
    ["{cyan [babel-core]} comma-separated list of preset names"]
  ),
  _templateObject9 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{cyan [babel-core]} comma-separated list of plugins names"],
    ["{cyan [babel-core]} comma-separated list of plugins names"]
  ),
  _templateObject10 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["[options] {green <files ...>}"],
    ["[options] {green <files ...>}"]
  ),
  _templateObject11 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["at least one {green <file>} required"],
    ["at least one {green <file>} required"]
  ),
  _templateObject12 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{green --multi-versions} required"],
    ["{green --multi-versions} required"]
  ),
  _templateObject13 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{green --multi-versions} {red ", "} invalid semver version"],
    ["{green --multi-versions} {red ", "} invalid semver version"]
  ),
  _templateObject14 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{green --out-dir} required"],
    ["{green --out-dir} required"]
  ),
  _templateObject15 = /*#__PURE__*/ (0, _taggedTemplateLiteral2.default)(
    ["{red ", " } ", ""],
    ["{red ", " } ", ""]
  );

(function enableChalkCommanderOptionFlags(scoped) {
  /** https://github.com/tj/commander.js/blob/master/index.js#L1088
   * Pad `str` to `width`.
   *
   * @param {String} str
   * @param {Number} width
   * @return {String}
   * @api private
   */
  function coloredPad(str, width) {
    var coloredStr =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str;
    var len = Math.max(0, width - str.length);
    return coloredStr + Array(len + 1).join(" ");
  }

  var Command = _commander.default.Command;
  var nativeOptionFn = Command.prototype.option;

  Command.prototype.option = function() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    var flags = args[0];
    args[0] = flags.replace(/{\S+ (.+)}/, "$1");
    var returnValue = nativeOptionFn.apply(this, args); // https://github.com/tj/commander.js/blob/master/index.js#L39
    // https://github.com/tj/commander.js/blob/master/index.js#L394

    _lodash.default.last(this.options).coloredFlags = (0, _chalk.default)(
      (0, _taggedTemplateLiteral2.default)([flags], [flags])
    );
    return returnValue;
  };

  Command.prototype.optionHelp = function() {
    // https://github.com/tj/commander.js/blob/master/index.js#L949
    var width = this.largestOptionLength(); // Append the help information

    return this.options
      .map(function(option) {
        return (
          coloredPad(option.flags, width, option.coloredFlags) +
          "  " +
          option.description +
          (option.defaultValue !== undefined
            ? " (default: " + option.defaultValue + ")"
            : "")
        );
      })
      .concat([
        coloredPad("-h, --help", width) + "  " + "output usage information"
      ])
      .join("\n");
  };
})();

(function setupBabelMultiEnvOptions() {
  _commander.default.option(
    "-x, {green --multi-versions} <list>",
    (0, _chalk.default)(_templateObject),
    collect,
    []
  );

  _commander.default.option(
    "-d, {green --out-dir} <outDir>",
    (0, _chalk.default)(_templateObject2),
    _lodash.default.toString
  );
})();

(function setupBabelPresetEnvOptions() {
  _commander.default.option(
    "{blue --use-built-ins-usage}",
    (0, _chalk.default)(_templateObject3),
    booleanify
  );
})();

(function setupBabelPluginTransformRuntimeOptions() {
  _commander.default.option(
    "{magenta --no-helpers}",
    (0, _chalk.default)(_templateObject4),
    booleanify,
    false
  );

  _commander.default.option(
    "{magenta --no-polyfill}",
    (0, _chalk.default)(_templateObject5),
    booleanify,
    false
  );

  _commander.default.option(
    "{magenta --no-regenerator}",
    (0, _chalk.default)(_templateObject6),
    booleanify,
    false
  );

  _commander.default.option(
    "{magenta --moduleName} [moduleName]",
    (0, _chalk.default)(_templateObject7),
    _lodash.default.toString,
    "babel-runtime"
  );
})();

(function setupBabelCoreOptions() {
  _commander.default.option(
    "{cyan --presets} [list]",
    (0, _chalk.default)(_templateObject8),
    collect,
    []
  );

  _commander.default.option(
    "{cyan --plugins} [list]",
    (0, _chalk.default)(_templateObject9),
    collect,
    []
  );
})();

_commander.default.usage((0, _chalk.default)(_templateObject10));

_commander.default.parse(process.argv);

var errors = [];
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
)(_commander.default.args);

exports.filenameWithParentList = filenameWithParentList;

if (_lodash.default.isEmpty(filenameWithParentList)) {
  errors.push((0, _chalk.default)(_templateObject11));
}

var opts = _commander.default.opts();

var babelMultiEnvOpts = _lodash.default.pick(opts, ["multiVersions", "outDir"]);

exports.babelMultiEnvOpts = babelMultiEnvOpts;
var babelPresetEnvOpts = {
  useBuiltIns: opts.useBuiltInsUsage // use-built-ins-usage
};
exports.babelPresetEnvOpts = babelPresetEnvOpts;

var babelPluginTransformRuntimeOpts = _lodash.default.pick(opts, [
  "helpers",
  "polyfill",
  "regenerator",
  "moduleName"
]);

exports.babelPluginTransformRuntimeOpts = babelPluginTransformRuntimeOpts;

var babelCoreOpts = _lodash.default.omit(
  opts,
  ["useBuiltInsUsage"].concat(
    (0, _toConsumableArray2.default)(_lodash.default.keys(babelMultiEnvOpts)),
    (0, _toConsumableArray2.default)(_lodash.default.keys(babelPresetEnvOpts)),
    (0, _toConsumableArray2.default)(
      _lodash.default.keys(babelPluginTransformRuntimeOpts)
    )
  )
);

exports.babelCoreOpts = babelCoreOpts;

if (_lodash.default.isEmpty(babelMultiEnvOpts.multiVersions)) {
  errors.push((0, _chalk.default)(_templateObject12));
} else {
  var allValid = babelMultiEnvOpts.multiVersions.reduce(function(acc, it) {
    if (!_semver.default.valid(it)) {
      errors.push((0, _chalk.default)(_templateObject13, it));
      return false;
    }

    return acc;
  }, true);

  if (allValid) {
    babelMultiEnvOpts.multiVersions.sort(_semver.default.compare).reverse();
  }
}

if (
  !_lodash.default.isString(babelMultiEnvOpts.outDir) ||
  babelMultiEnvOpts.outDir.length === 0
) {
  errors.push((0, _chalk.default)(_templateObject14));
}

if (!_lodash.default.isEmpty(errors)) {
  errors.forEach(function(it) {
    return console.error(
      (0, _chalk.default)(_templateObject15, _figures.default.cross, it)
    );
  });
  process.exit(2);
}

function booleanify(val) {
  if (val === "true" || val == 1) {
    return true;
  }

  if (val === "false" || val == 0 || !val) {
    return false;
  }

  return val;
}

function collect(value, previousValue) {
  if (_lodash.default.isString(value)) {
    var values = value.split(",");
    return previousValue ? previousValue.concat(values) : values;
  } // If the user passed the option with no value, like "babel file.js --presets", do nothing.

  return previousValue;
}
