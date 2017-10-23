import path from "path";
import fs from "fs";
import promisify from "util.promisify";
import nativeMkdirp from "mkdirp";

const readFile = promisify(fs.readFile);
const mkdirp = promisify(nativeMkdirp);

describe("buildSwitcher module", () => {
  const { buildAndOutputSwitcher } = require("../buildSwitcher");
  const multiVersions = ["8.7", "7.6", "6.0", "4.0", "0.12"];
  const outDir = path.join(__dirname, "../../tmp/buildSwitcher");

  beforeAll(async () => {
    await mkdirp(outDir);
  });

  describe("buildAndOutputSwitcher function", () => {
    it("should compile file", async () => {
      await buildAndOutputSwitcher(
        { multiVersions, outDir },
        {
          babelrc: false
        },
        {
          filename: "buildAndOutputSwitcher.js",
          parent: ""
        }
      );
      const content = await readFile(
        path.join(outDir, "buildAndOutputSwitcher.js"),
        "utf8"
      );
      expect(content).toMatchSnapshot();
    });
  });
});
