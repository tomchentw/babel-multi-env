"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAndOutputSwitcher = buildAndOutputSwitcher;
exports.makeRequireMultiVersions = makeRequireMultiVersions;
exports.compileAst = compileAst;

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util.promisify"));

var _outputFile = _interopRequireDefault(require("output-file"));

var _lodash = _interopRequireDefault(require("lodash"));

var _babelCore = require("babel-core");

var _astTypes = _interopRequireDefault(require("ast-types"));

const outputFile = (0, _util.default)(_outputFile.default);
const { builders } = _astTypes.default;

async function buildAndOutputSwitcher(
  { multiVersions, outDir },
  babelCoreOpts,
  { filename, parent }
) {
  const dirname = _path.default.dirname(filename).replace(parent, "");

  const extname = _path.default.extname(filename);

  const basename = _path.default.basename(filename, extname);

  const indexDest = _path.default.join(
    outDir,
    dirname,
    `${basename}${extname}`
  );

  const multiVersionsAst = makeRequireMultiVersions(
    multiVersions,
    basename,
    extname
  );
  const multiVersionsResult = compileAst(multiVersionsAst, babelCoreOpts);
  await outputFile(indexDest, multiVersionsResult.code);
}

function makeRequireMultiVersions(multiVersions, basename, extname) {
  return builders.program([
    builders.variableDeclaration("var", [
      builders.variableDeclarator(
        builders.identifier("gte"),
        builders.memberExpression(
          builders.callExpression(builders.identifier("require"), [
            builders.stringLiteral("semver")
          ]),
          builders.identifier("gte")
        )
      )
    ]),
    builders.variableDeclaration("var", [
      builders.variableDeclarator(
        builders.identifier("version"),
        builders.memberExpression(
          builders.identifier("process"),
          builders.identifier("version")
        )
      )
    ]), // TODO: Assume multiVersions in descending order
    multiVersions.reduceRight((acc, version) => {
      const current = builders.blockStatement([
        builders.expressionStatement(
          builders.assignmentExpression(
            "=",
            builders.memberExpression(
              builders.identifier("module"),
              builders.identifier("exports")
            ),
            builders.callExpression(builders.identifier("require"), [
              builders.stringLiteral(`./${basename}__${version}__${extname}`)
            ])
          )
        )
      ]);

      if (_lodash.default.isUndefined(acc)) {
        return current;
      } else {
        return builders.ifStatement(
          builders.callExpression(builders.identifier("gte"), [
            builders.identifier("version"),
            builders.stringLiteral(version)
          ]),
          current,
          acc
        );
      }
    }, undefined)
  ]);
}

function compileAst(ast, babelCoreOpts, watch = false) {
  try {
    return (0, _babelCore.transformFromAst)(ast, babelCoreOpts);
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
