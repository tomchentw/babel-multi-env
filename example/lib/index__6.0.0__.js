"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;

var _stringify = _interopRequireDefault(
  require("babel-runtime/core-js/json/stringify")
);

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util.promisify"));

let demoBumpVersion = (() => {
  var _ref = (0, _asyncToGenerator2.default)(function*(nextVersion = "1.0.0") {
    const content = yield (0, _util.default)(_fs.default.readFile)(
      "package.json",
      "utf8"
    );
    const json = JSON.parse(content);
    json.version = nextVersion;
    yield (0,
    _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");
    return () => console.log(`Successfully bumped version to: ${nextVersion}`);
  });

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
})();

exports.demoBumpVersion = demoBumpVersion;
