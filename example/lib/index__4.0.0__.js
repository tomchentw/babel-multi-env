"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demoBumpVersion = void 0;

var _regenerator = _interopRequireDefault(require("babel-runtime/regenerator"));

var _stringify = _interopRequireDefault(
  require("babel-runtime/core-js/json/stringify")
);

var _asyncToGenerator2 = _interopRequireDefault(
  require("babel-runtime/helpers/asyncToGenerator")
);

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util.promisify"));

var demoBumpVersion = (function() {
  var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var nextVersion,
        content,
        json,
        _args = arguments;
      return _regenerator.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                nextVersion =
                  _args.length > 0 && _args[0] !== undefined
                    ? _args[0]
                    : "1.0.0";
                _context.next = 3;
                return (0, _util.default)(_fs.default.readFile)(
                  "package.json",
                  "utf8"
                );

              case 3:
                content = _context.sent;
                json = JSON.parse(content);
                json.version = nextVersion;
                _context.next = 8;
                return (0, _util.default)(_fs.default.writeFile)(
                  "package.json",
                  (0, _stringify.default)(json, null, 4),
                  "utf8"
                );

              case 8:
                return _context.abrupt("return", function() {
                  return console.log(
                    `Successfully bumped version to: ${nextVersion}`
                  );
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        },
        _callee,
        this
      );
    })
  );

  return function demoBumpVersion() {
    return _ref.apply(this, arguments);
  };
})();

exports.demoBumpVersion = demoBumpVersion;
