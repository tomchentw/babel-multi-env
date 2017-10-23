import path from "path";
import fs from "fs";
import promisify from "util.promisify";
import pathCompleteExtname from "path-complete-extname";
import _ from "lodash";
import { transformFile as nativeTransformFile } from "babel-core";

const writeFile = promisify(fs.writeFile);
const transformFile = promisify(nativeTransformFile);

const pMap = _.flowRight(_.bind(Promise.all, Promise), _.map);

export async function buildAndOutputVersions(
  { multiVersions, outDir },
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts,
  { filename, parent }
) {
  const dirname = path.dirname(filename).replace(parent, "");
  const extname = pathCompleteExtname(filename);
  const basename = path.basename(filename, extname);

  await pMap(multiVersions, async version => {
    const versionOpts = makeOptsForVersion(
      babelPresetEnvOpts,
      babelPluginTransformRuntimeOpts,
      babelCoreOpts,
      version
    );
    const result = await compile(filename, versionOpts);
    const dest = path.join(
      outDir,
      dirname,
      `${basename}__${version}__${extname}`
    );
    await writeFile(dest, result.code);
  });
}

export function makeOptsForVersion(
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts,
  version
) {
  return _.assign({}, babelCoreOpts, {
    presets: [
      ..._.reject(babelCoreOpts.presets, it =>
        _.includes(["env", "babel-preset-env"], _.first(it) || it)
      ),
      [
        "babel-preset-env",
        _.assign({}, babelPresetEnvOpts, {
          targets: {
            node: version
          }
        })
      ]
    ],
    plugins: [
      ..._.reject(babelCoreOpts.plugins, it =>
        _.includes(
          ["transform-runtime", "babel-plugin-transform-runtime"],
          _.first(it) || it
        )
      ),
      ["transform-runtime", babelPluginTransformRuntimeOpts]
    ]
  });
}

export async function compile(filename, versionOpts, watch = false) {
  try {
    return await transformFile(filename, versionOpts);
  } catch (err) {
    if (watch) {
      console.error(err);
      return { ignored: true };
    } else {
      throw err;
    }
  }
}
