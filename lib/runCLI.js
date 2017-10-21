var gte = require("semver").gte;

var version = process.version;

if (gte(version, "8.0.0")) {
  module.exports = require("./runCLI__8.0.0__.js");
} else if (gte(version, "6.0.0")) {
  module.exports = require("./runCLI__6.0.0__.js");
} else if (gte(version, "4.0.0")) {
  module.exports = require("./runCLI__4.0.0__.js");
} else if (gte(version, "0.12.0")) {
  module.exports = require("./runCLI__0.12.0__.js");
} else {
  module.exports = require("./runCLI__0.10.0__.js");
}
