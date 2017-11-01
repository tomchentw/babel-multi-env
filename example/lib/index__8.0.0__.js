"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = demoBumpVersion;

var _stringify = _interopRequireDefault(
  require("babel-runtime/core-js/json/stringify")
);

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util.promisify"));

async function demoBumpVersion(nextVersion = "1.0.0") {
  const content = await (0, _util.default)(_fs.default.readFile)(
    "package.json",
    "utf8"
  );
  const json = JSON.parse(content);
  json.version = nextVersion;
  await (0, _util.default)(_fs.default.writeFile)(
    "package.json",
    (0, _stringify.default)(json, null, 4),
    "utf8"
  );
  return () => console.log(`Successfully bumped version to: ${nextVersion}`);
}
