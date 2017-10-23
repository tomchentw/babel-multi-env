import path from "path";
import promisify from "util.promisify";
import _ from "lodash";
import nativeMkdirp from "mkdirp";

import {
  filenameWithParentList,
  babelMultiEnvOpts,
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts
} from "./parseCLI";
import { buildAndOutputSwitcher } from "./buildSwitcher";
import { buildAndOutputVersions } from "./buildVersions";

const pMap = _.flowRight(_.bind(Promise.all, Promise), _.map);
const mkdirp = promisify(nativeMkdirp);

const { outDir } = babelMultiEnvOpts;

_.reduce(
  filenameWithParentList,
  async (acc, { filename, parent }) => {
    // Ensure directory sequentially comes out first
    await acc;
    const dirname = path.dirname(filename).replace(parent, "");
    return mkdirp(path.join(outDir, dirname));
  },
  Promise.resolve()
)
  .then(() =>
    pMap(filenameWithParentList, async filenameWithParent => {
      await buildAndOutputSwitcher(
        babelMultiEnvOpts,
        babelCoreOpts,
        filenameWithParent
      );
      await buildAndOutputVersions(
        babelMultiEnvOpts,
        babelPresetEnvOpts,
        babelPluginTransformRuntimeOpts,
        babelCoreOpts,
        filenameWithParent
      );
    })
  )
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
