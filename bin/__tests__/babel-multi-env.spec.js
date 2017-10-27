import path from "path";
import { execSync } from "child_process";

describe("babel-multi-env bin", () => {
  it("should compile runnable script on the platform", () => {
    execSync(
      "node bin/babel-multi-env.js --multi-versions 8.0.0 6.0.0 4.0.0 0.12.0 0.10.0 --given bin/__fixtures__/arrayJoin.fixture.js --out-dir tmp"
    );
    const result = execSync("node tmp/arrayJoin.fixture.js");
    expect(result.toString("utf8")).toMatchSnapshot();
  });
});
