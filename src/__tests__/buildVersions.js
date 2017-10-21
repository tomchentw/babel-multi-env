import path from "path";
import fs from "fs";
import promisify from "util.promisify";

const readFile = promisify(fs.readFile);

describe("buildVersions module", () => {
  const { buildAndOutputVersions } = require("../buildVersions");
  const multiVersions = ["8.7", "7.6", "6.0", "4.0", "0.12"];
  const outDir = path.join(__dirname, "../../tmp/buildVersions");

  describe("buildAndOutputVersions function", () => {
    const VERSIONS = ["8.7", "7.6", "6.0", "4.0", "0.12"];

    it("should compile to multiple files", async () => {
      await buildAndOutputVersions(
        { multiVersions, outDir },
        {},
        {},
        {},
        path.join(
          __dirname,
          "../__fixtures__/buildAndOutputVersions.fixture.js"
        )
      );
      const content = await Promise.all(
        VERSIONS.map(it =>
          readFile(
            path.join(outDir, `buildAndOutputVersions.fixture__${it}__.js`),
            "utf8"
          )
        )
      );
      expect(content).toMatchSnapshot();
    });
  });
});
