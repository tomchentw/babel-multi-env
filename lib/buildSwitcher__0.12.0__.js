"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRequireMultiVersions = makeRequireMultiVersions;
exports.compileAst = compileAst;
exports.buildAndOutputSwitcher = void 0;

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _path = _interopRequireDefault(require("path"));

var _util = _interopRequireDefault(require("util.promisify"));

var _pathCompleteExtname = _interopRequireDefault(
  require("path-complete-extname")
);

var _outputFile = _interopRequireDefault(require("output-file"));

var _lodash = _interopRequireDefault(require("lodash"));

var _babelCore = require("babel-core");

var _astTypes = _interopRequireDefault(require("ast-types"));

var outputFile = (0, _util.default)(_outputFile.default);
var builders = _astTypes.default.builders;

var buildAndOutputSwitcher = (function() {
  var _ref3 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(_ref, babelCoreOpts, _ref2) {
      var multiVersions,
        outDir,
        filename,
        parent,
        dirname,
        extname,
        basename,
        indexDest,
        multiVersionsAst,
        multiVersionsResult;
      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                (multiVersions = _ref.multiVersions), (outDir = _ref.outDir);
                (filename = _ref2.filename), (parent = _ref2.parent);
                dirname = _path.default.dirname(filename).replace(parent, "");
                extname = (0, _pathCompleteExtname.default)(filename);
                basename = _path.default.basename(filename, extname);
                indexDest = _path.default.join(
                  outDir,
                  dirname,
                  "".concat(basename).concat(extname)
                );
                multiVersionsAst = makeRequireMultiVersions(
                  multiVersions,
                  basename,
                  extname
                );
                multiVersionsResult = compileAst(
                  multiVersionsAst,
                  babelCoreOpts
                );
                _context.next = 10;
                return outputFile(indexDest, multiVersionsResult.code);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function buildAndOutputSwitcher(_x, _x2, _x3) {
    return _ref3.apply(this, arguments);
  };
})();

exports.buildAndOutputSwitcher = buildAndOutputSwitcher;

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
    multiVersions.reduceRight(function(acc, version) {
      var current = builders.blockStatement([
        builders.expressionStatement(
          builders.assignmentExpression(
            "=",
            builders.memberExpression(
              builders.identifier("module"),
              builders.identifier("exports")
            ),
            builders.callExpression(builders.identifier("require"), [
              builders.stringLiteral(
                "./"
                  .concat(basename, "__")
                  .concat(version, "__")
                  .concat(extname)
              )
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

function compileAst(ast, babelCoreOpts) {
  var watch =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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
