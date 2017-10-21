import path from "path";
import promisify from "util.promisify";
import nativeOutputFile from "output-file";
import _ from "lodash";
import { transformFromAst } from "babel-core";
import astTypes from "ast-types";

const outputFile = promisify(nativeOutputFile);

const { builders } = astTypes;

export async function buildAndOutputSwitcher(
  { multiVersions, outDir },
  babelCoreOpts,
  { filename, parent }
) {
  const dirname = path.dirname(filename).replace(parent, "");
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);
  const indexDest = path.join(outDir, dirname, `${basename}${extname}`);

  const multiVersionsAst = makeRequireMultiVersions(
    multiVersions,
    basename,
    extname
  );
  const multiVersionsResult = compileAst(multiVersionsAst, babelCoreOpts);
  await outputFile(indexDest, multiVersionsResult.code);
}

export function makeRequireMultiVersions(multiVersions, basename, extname) {
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
    ]),
    // TODO: Assume multiVersions in descending order
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
      if (_.isUndefined(acc)) {
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

export function compileAst(ast, babelCoreOpts, watch = false) {
  try {
    return transformFromAst(ast, babelCoreOpts);
  } catch (err) {
    if (watch) {
      console.error(err);
      return { ignored: true };
    } else {
      throw err;
    }
  }
}
