import promisify from "util.promisify";
import _ from "lodash";

import {
  filenameWithParentList,
  babelMultiEnvOpts,
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts
} from "./parseCLI";
import { buildAndOutputSwitcher } from "./buildSwitcher";
import { buildAndOutputVersions } from "./buildVersions";

const pMap = _.flowRight(Promise.all.bind(Promise), _.map);
pMap(filenameWithParentList, async filenameWithParent => {
  // Ensure directory comes out first
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
}).catch(e => {
  console.error(e);
  process.exit(1);
});
