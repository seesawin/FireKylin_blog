'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_request2.default.defaults({
  strictSSL: false,
  rejectUnauthorized: false
});

var getFileContent = think.promisify(_request2.default.get, _request2.default);
var putFileContent = think.promisify(_fs2.default.writeFile, _fs2.default);

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.uploadMethod = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, _ref2) {
      var name = _ref2.name;
      var result, destDir, basename, destPath;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getFileContent({
                url: url,
                headers: {
                  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) Chrome/47.0.2526.111 Safari/537.36"
                },
                strictSSL: false,
                timeout: 1000,
                encoding: 'binary'
              }).catch(function () {
                throw Error("UPLOAD_URL_ERROR");
              });

            case 2:
              result = _context.sent;

              if (!(result.headers["content-type"].indexOf('image') === -1)) {
                _context.next = 5;
                break;
              }

              throw Error('UPLOAD_TYPE_ERROR');

            case 5:
              destDir = this.formatNow();
              basename = (name ? name : think.md5(result.body)) + path.extname(url);
              destPath = path.join(think.UPLOAD_PATH, destDir);


              if (!think.isDir(destPath)) {
                think.mkdir(destPath);
              }

              _context.next = 11;
              return putFileContent(path.join(destPath, basename), result.body, 'binary');

            case 11:
              result = _context.sent;
              return _context.abrupt('return', path.join('/static/upload', destDir, basename));

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function uploadMethod(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return uploadMethod;
  }();

  _class.prototype.run = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(file, config) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.uploadMethod(file, config);

            case 2:
              return _context2.abrupt('return', _context2.sent);

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function run(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return run;
  }();

  return _class;
}(_base2.default);

exports.default = _class;