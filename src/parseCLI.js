import _ from "lodash";
import semver from "semver";
import glob from "glob";
import globParent from "glob-parent";
import yargs from "yargs";
import chalk from "chalk";

const BABEL_MULTI_ENV_GROUP = chalk`{green [babel-multi-env]}`;
const BABEL_PRESET_ENV_GROUP = chalk`{blue [babel-preset-env]}`;
const BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP = chalk`{magenta [babel-plugin-transform-runtime]}`;
const BABEL_CORE_GROUP = chalk`{cyan [babel-core]}`;

const argv = yargs
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
      coerce(arg) {
        const iv = arg.filter(it => !semver.valid(it)); // iv = invalidVersions
        if (iv.length > 0) {
          throw new Error(
            chalk`--multi-versions {red ${iv.join(", ")}} ${iv.length > 1
              ? "are"
              : "is"} invalid semver version${iv.length > 1 ? "s" : ""}`
          );
        } else {
          arg.sort(semver.compare).reverse();
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
      default: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    polyfill: {
      type: "boolean",
      description:
        "Enables new built-ins (Promise, Set, Map, etc.) are transformed to use a non-global polluting polyfill",
      default: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    regenerator: {
      type: "boolean",
      description:
        "Enables generator functions are transformed to use a regenerator runtime that does not pollute the global scope",
      default: true,
      group: BABEL_PLUGIN_TRANSFORM_RUNTIME_GROUP
    },
    "module-name": {
      type: "string",
      description:
        "sets the name/path of the module used when importing helpers",
      example: "babel-runtime",
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

const GLOB_OPTIONS = {};

export const filenameWithParentList = _.flowRight(
  _.uniq,
  _.flatten,
  _.partial(_.map, _, input => {
    let output = glob.sync(input, GLOB_OPTIONS);
    if (!output.length) {
      output = [input];
    }
    const parent = globParent(input);
    return _.map(output, filename => ({
      parent,
      filename
    }));
  })
)(argv.given);

export const babelMultiEnvOpts = _.pick(argv, ["multiVersions", "outDir"]);
export const babelPresetEnvOpts = _.pick(argv, ["useBuiltIns"]);
export const babelPluginTransformRuntimeOpts = _.pick(argv, [
  "helpers",
  "polyfill",
  "regenerator",
  "moduleName"
]);
export const babelCoreOpts = _.pick(argv, ["presets", "plugins"]);
