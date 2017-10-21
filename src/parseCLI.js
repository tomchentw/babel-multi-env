import _ from "lodash";
import semver from "semver";
import glob from "glob";
import commander from "commander";
import chalk from "chalk";
import figures from "figures";
import taggedTemplateLiteral from "babel-runtime/helpers/taggedTemplateLiteral";

(function enableChalkCommanderOptionFlags(scoped) {
  /** https://github.com/tj/commander.js/blob/master/index.js#L1088
   * Pad `str` to `width`.
   *
   * @param {String} str
   * @param {Number} width
   * @return {String}
   * @api private
   */
  function coloredPad(str, width, coloredStr = str) {
    var len = Math.max(0, width - str.length);
    return coloredStr + Array(len + 1).join(" ");
  }
  const { Command } = commander;
  const nativeOptionFn = Command.prototype.option;

  Command.prototype.option = function(...args) {
    const [flags] = args;
    args[0] = flags.replace(/{\S+ (.+)}/, "$1");
    const returnValue = nativeOptionFn.apply(this, args);
    // https://github.com/tj/commander.js/blob/master/index.js#L39
    // https://github.com/tj/commander.js/blob/master/index.js#L394
    _.last(this.options).coloredFlags = chalk(
      taggedTemplateLiteral([flags], [flags])
    );
    return returnValue;
  };

  Command.prototype.optionHelp = function() {
    // https://github.com/tj/commander.js/blob/master/index.js#L949
    var width = this.largestOptionLength();
    // Append the help information
    return this.options
      .map(
        option =>
          coloredPad(option.flags, width, option.coloredFlags) +
          "  " +
          option.description +
          (option.defaultValue !== undefined
            ? " (default: " + option.defaultValue + ")"
            : "")
      )
      .concat([
        coloredPad("-h, --help", width) + "  " + "output usage information"
      ])
      .join("\n");
  };
})();

(function setupBabelMultiEnvOptions() {
  commander.option(
    `-x, {green --multi-versions} <list>`,
    chalk`{green [babel-multi-env]} comma-separated list of supported semver versions`,
    collect,
    []
  );
  commander.option(
    `-d, {green --out-dir} <outDir>`,
    chalk`{green [babel-multi-env]} Compile an input directory of modules into an output directory`,
    _.toString
  );
})();

(function setupBabelPresetEnvOptions() {
  commander.option(
    `{blue --use-built-ins-usage}`,
    chalk`{blue [babel-preset-env]} Apply @babel/preset-env for polyfills with "useBuiltIns": "usage" (via @babel/polyfill)`,
    booleanify
  );
})();

(function setupBabelPluginTransformRuntimeOptions() {
  commander.option(
    `{magenta --no-helpers}`,
    chalk`{magenta [babel-plugin-transform-runtime]} Disables inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to moduleName`,
    booleanify,
    false
  );
  commander.option(
    `{magenta --no-polyfill}`,
    chalk`{magenta [babel-plugin-transform-runtime]} Disables new built-ins (Promise, Set, Map, etc.) are transformed to use a non-global polluting polyfill`,
    booleanify,
    false
  );
  commander.option(
    `{magenta --no-regenerator}`,
    chalk`{magenta [babel-plugin-transform-runtime]} Disables generator functions are transformed to use a regenerator runtime that does not pollute the global scope`,
    booleanify,
    false
  );
  commander.option(
    `{magenta --moduleName} [moduleName]`,
    chalk`{magenta [babel-plugin-transform-runtime]} Sets the name/path of the module used when importing helpers`,
    _.toString,
    "babel-runtime"
  );
})();

(function setupBabelCoreOptions() {
  commander.option(
    `{cyan --presets} [list]`,
    chalk`{cyan [babel-core]} comma-separated list of preset names`,
    collect,
    []
  );

  commander.option(
    `{cyan --plugins} [list]`,
    chalk`{cyan [babel-core]} comma-separated list of plugins names`,
    collect,
    []
  );
})();

commander.usage(chalk`[options] {green <files ...>}`);
commander.parse(process.argv);

const errors = [];

const GLOB_OPTIONS = {
  absolute: true
};

export const filenames = _.flowRight(
  _.uniq,
  _.partial(
    _.reduce,
    _,
    (globbed, input) => {
      let output = glob.sync(input, GLOB_OPTIONS);
      if (!output.length) output = [input];
      return globbed.concat(output);
    },
    []
  )
)(commander.args);

if (_.isEmpty(filenames)) {
  errors.push(chalk`at least one {green <file>} required`);
}

const opts = commander.opts();

export const babelMultiEnvOpts = _.pick(opts, ["multiVersions", "outDir"]);
export const babelPresetEnvOpts = {
  useBuiltIns: opts.useBuiltInsUsage // use-built-ins-usage
};
export const babelPluginTransformRuntimeOpts = _.pick(opts, [
  "helpers",
  "polyfill",
  "regenerator",
  "moduleName"
]);
export const babelCoreOpts = _.omit(opts, [
  "useBuiltInsUsage",
  ..._.keys(babelMultiEnvOpts),
  ..._.keys(babelPresetEnvOpts),
  ..._.keys(babelPluginTransformRuntimeOpts)
]);

if (_.isEmpty(babelMultiEnvOpts.multiVersions)) {
  errors.push(chalk`{green --multi-versions} required`);
} else {
  const allValid = babelMultiEnvOpts.multiVersions.reduce((acc, it) => {
    if (!semver.valid(it)) {
      errors.push(
        chalk`{green --multi-versions} {red ${it}} invalid semver version`
      );
      return false;
    }
    return acc;
  }, true);
  if (allValid) {
    babelMultiEnvOpts.multiVersions.sort(semver.compare).reverse();
  }
}

if (
  !_.isString(babelMultiEnvOpts.outDir) ||
  babelMultiEnvOpts.outDir.length === 0
) {
  errors.push(chalk`{green --out-dir} required`);
}

if (!_.isEmpty(errors)) {
  errors.forEach(it => console.error(chalk`{red ${figures.cross} } ${it}`));
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
  if (_.isString(value)) {
    const values = value.split(",");
    return previousValue ? previousValue.concat(values) : values;
  }
  // If the user passed the option with no value, like "babel file.js --presets", do nothing.
  return previousValue;
}
