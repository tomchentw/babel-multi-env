import promisify from "util.promisify";
import _ from "lodash";

import {
  filenames,
  babelMultiEnvOpts,
  babelPresetEnvOpts,
  babelPluginTransformRuntimeOpts,
  babelCoreOpts
} from "./parseCLI";
import { buildAndOutputSwitcher } from "./buildSwitcher";
import { buildAndOutputVersions } from "./buildVersions";

const pMap = _.flowRight(Promise.all.bind(Promise), _.map);
pMap(filenames, async filename => {
  await buildAndOutputVersions(
    babelMultiEnvOpts,
    babelPresetEnvOpts,
    babelPluginTransformRuntimeOpts,
    babelCoreOpts,
    filename
  );
  await buildAndOutputSwitcher(babelMultiEnvOpts, babelCoreOpts, filename);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
