# babel-multi-env
> `babel` CLI replacement with multiple node version support by `babel-preset-env` and `babel-plugin-transform-runtime`. Useful for node.js libraries/modules

[![Version][npm-image]][npm-url] [![Travis CI][travis-image]][travis-url] [![Quality][codeclimate-image]][codeclimate-url] [![Coverage][codeclimate-coverage-image]][codeclimate-coverage-url] [![Dependencies][gemnasium-image]][gemnasium-url] [![Gitter][gitter-image]][gitter-url]


## Usage

Transforms:

### src/__fixtures__/buildAndOutputVersions.fixture.js

```js
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
```

with the command:

```sh
yarn babel-multi-env --multi-versions 8.0.0 6.0.0 4.0.0 0.12.0 0.10.0 --given src/__fixtures__/buildAndOutputVersions.fixture.js --out-dir tmp
```

and output these files:

```sh
tmp/buildAndOutputVersions.fixture.js
tmp/buildAndOutputVersions.fixture__0.10.0__.js
tmp/buildAndOutputVersions.fixture__0.12.0__.js
tmp/buildAndOutputVersions.fixture__4.0.0__.js
tmp/buildAndOutputVersions.fixture__6.0.0__.js
tmp/buildAndOutputVersions.fixture__8.0.0__.js
```

where

### tmp/buildAndOutputVersions.fixture.js

```js
var gte = require("semver").gte;
var version = process.version;

if (gte(version, "8.0.0")) {
  module.exports = require("./buildAndOutputVersions.fixture__8.0.0__.js");
} else if (gte(version, "6.0.0")) {
  module.exports = require("./buildAndOutputVersions.fixture__6.0.0__.js");
} else if (gte(version, "4.0.0")) {
  module.exports = require("./buildAndOutputVersions.fixture__4.0.0__.js");
} else if (gte(version, "0.12.0")) {
  module.exports = require("./buildAndOutputVersions.fixture__0.12.0__.js");
} else {
  module.exports = require("./buildAndOutputVersions.fixture__0.10.0__.js");
}
```


### tmp/buildAndOutputVersions.fixture__8.0.0__.js

```js
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = demoBumpVersion;
var _stringify = _interopRequireDefault(require("babel-runtime/core-js/json/stringify"));
var _fs = _interopRequireDefault(require("fs"));
var _util = _interopRequireDefault(require("util.promisify"));

async function demoBumpVersion(nextVersion = "1.0.0") {
  const content = await (0, _util.default)(_fs.default.readFile)("package.json", "utf8");
  const json = JSON.parse(content);
  json.version = nextVersion;
  await (0, _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");
  return () => console.log(`Successfully bumped version to: ${nextVersion}`);
}
```


### tmp/buildAndOutputVersions.fixture__6.0.0__.js

```js
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;
var _stringify = _interopRequireDefault(require("babel-runtime/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("babel-runtime/helpers/asyncToGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _util = _interopRequireDefault(require("util.promisify"));

let demoBumpVersion = (() => {
  var _ref = (0, _asyncToGenerator2.default)(function* (nextVersion = "1.0.0") {
    const content = yield (0, _util.default)(_fs.default.readFile)("package.json", "utf8");
    const json = JSON.parse(content);
    json.version = nextVersion;
    yield (0, _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");
    return () => console.log(`Successfully bumped version to: ${nextVersion}`);
  });

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
})();

exports.demoBumpVersion = demoBumpVersion;
```

……and you get the idea.

<details>
  <summary>More sample code for node@4, node@0.12 and node@0.10</summary>

```js
/* tmp/buildAndOutputVersions.fixture__4.0.0__.js */
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;
var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));
var _stringify = _interopRequireDefault(require("babel-runtime/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("babel-runtime/helpers/asyncToGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _util = _interopRequireDefault(require("util.promisify"));

var demoBumpVersion = function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var nextVersion,
        content,
        json,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nextVersion = _args.length > 0 && _args[0] !== undefined ? _args[0] : "1.0.0";
            _context.next = 3;
            return (0, _util.default)(_fs.default.readFile)("package.json", "utf8");

          case 3:
            content = _context.sent;
            json = JSON.parse(content);
            json.version = nextVersion;
            _context.next = 8;
            return (0, _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");

          case 8:
            return _context.abrupt("return", function () {
              return console.log(`Successfully bumped version to: ${nextVersion}`);
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
}();

exports.demoBumpVersion = demoBumpVersion;
```


```js
/* tmp/buildAndOutputVersions.fixture__0.12.0__.js */
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;
var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));
var _stringify = _interopRequireDefault(require("babel-runtime/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("babel-runtime/helpers/asyncToGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _util = _interopRequireDefault(require("util.promisify"));

var demoBumpVersion = function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var nextVersion,
        content,
        json,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nextVersion = _args.length > 0 && _args[0] !== undefined ? _args[0] : "1.0.0";
            _context.next = 3;
            return (0, _util.default)(_fs.default.readFile)("package.json", "utf8");

          case 3:
            content = _context.sent;
            json = JSON.parse(content);
            json.version = nextVersion;
            _context.next = 8;
            return (0, _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");

          case 8:
            return _context.abrupt("return", function () {
              return console.log("Successfully bumped version to: ".concat(nextVersion));
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
}();

exports.demoBumpVersion = demoBumpVersion;
```


```js
/* tmp/buildAndOutputVersions.fixture__0.10.0__.js */
"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;
var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));
var _stringify = _interopRequireDefault(require("babel-runtime/core-js/json/stringify"));
var _asyncToGenerator2 = _interopRequireDefault(require("babel-runtime/helpers/asyncToGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _util = _interopRequireDefault(require("util.promisify"));

var demoBumpVersion = function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var nextVersion,
        content,
        json,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nextVersion = _args.length > 0 && _args[0] !== undefined ? _args[0] : "1.0.0";
            _context.next = 3;
            return (0, _util.default)(_fs.default.readFile)("package.json", "utf8");

          case 3:
            content = _context.sent;
            json = JSON.parse(content);
            json.version = nextVersion;
            _context.next = 8;
            return (0, _util.default)(_fs.default.writeFile)("package.json", (0, _stringify.default)(json, null, 4), "utf8");

          case 8:
            return _context.abrupt("return", function () {
              return console.log("Successfully bumped version to: ".concat(nextVersion));
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
}();

exports.demoBumpVersion = demoBumpVersion;
```

</details>


## Installation

```sh
npm i --save-dev babel-multi-env
# or
yarn add --dev babel-multi-env
```

### Note on your `peerDependencies`

There are currently five peerDependencies listed under the _package.json_ for `babel-multi-env`. Be sure not to screw up their versions sicne `babel@^7` are currently in **beta** and can be found under the _next_ dist-tags on npm.

#### `dependencies`

Your library should depends on these two:

* "babel-runtime": "^7.0.0-beta.3"
* "semver": "^5.4.1"

since they'll be used during the runtime.

#### `devDependencies`

For the code generation only:

* "babel-core": "^7.0.0-beta.3",
* "babel-plugin-transform-runtime": "^7.0.0-beta.3",
* "babel-preset-env": "^7.0.0-beta.3",  


## Options

<img width="889" alt="screen shot 2017-10-27 at 11 20 38 am" src="https://user-images.githubusercontent.com/922234/32086588-e8bae1be-bb08-11e7-98e0-436392094b14.png">

```sh
[babel-multi-env]
  --multi-versions  list of supported semver versions. Example: 8.0.0 6.0.0
                    4.0.0                                     [array] [required]
  --given           source glob patterns                      [array] [required]
  --out-dir         compile into an output directory         [string] [required]

[babel-preset-env]
  --use-built-ins  apply babel-preset-env for polyfills with "useBuiltIns":
                   "usage" (via babel-polyfill)      [string] [choices: "usage"]

[babel-plugin-transform-runtime]
  --helpers      Enables inlined Babel helpers (classCallCheck, extends, etc.)
                 are replaced with calls to moduleName [boolean] [default: true]
  --polyfill     Enables new built-ins (Promise, Set, Map, etc.) are transformed
                 to use a non-global polluting polyfill[boolean] [default: true]
  --regenerator  Enables generator functions are transformed to use a
                 regenerator runtime that does not pollute the global scope
                                                       [boolean] [default: true]
  --module-name  sets the name/path of the module used when importing helpers
                                                                        [string]

[babel-core]
  --presets  list of preset names                                        [array]
  --plugins  list of plugins names                                       [array]

Options:
  --help, -h     Show help                                             [boolean]
  --version, -v  Show version number                                   [boolean]
```


## Examples

* [unused-files-webpack-plugin](https://github.com/tomchentw/unused-files-webpack-plugin)
* [npm-auto-install-webpack-plugin](https://github.com/tomchentw/npm-auto-install-webpack-plugin)
* ……and, [babel-multi-env](https://github.com/tomchentw/babel-multi-env)


[npm-image]: https://img.shields.io/npm/v/babel-multi-env.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/babel-multi-env

[travis-image]: https://img.shields.io/travis/tomchentw/babel-multi-env.svg?style=flat-square
[travis-url]: https://travis-ci.org/tomchentw/babel-multi-env
[codeclimate-image]: https://img.shields.io/codeclimate/github/tomchentw/babel-multi-env.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/tomchentw/babel-multi-env
[codeclimate-coverage-image]: https://img.shields.io/codeclimate/coverage/github/tomchentw/babel-multi-env.svg?style=flat-square
[codeclimate-coverage-url]: https://codeclimate.com/github/tomchentw/babel-multi-env
[gemnasium-image]: https://img.shields.io/gemnasium/tomchentw/babel-multi-env.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/tomchentw/babel-multi-env
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/tomchentw/babel-multi-env?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
