import fs from "fs";
import promisify from "util.promisify";

export async function demoBumpVersion(nextVersion = "1.0.0") {
  const content = await promisify(fs.readFile)("package.json", "utf8");
  const json = JSON.parse(content);
  json.version = nextVersion;
  await promisify(fs.writeFile)(
    "package.json",
    JSON.stringify(json, null, 4),
    "utf8"
  );
  return () => console.log(`Successfully bumped version to: ${nextVersion}`);
}
