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

var path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moveFile = think.promisify(_fs2.default.rename, _fs2.default);

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.uploadMethod = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file, _ref2) {
      var name = _ref2.name;
      var basename, destDir, destPath;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              basename = name ? name + path.extname(file) : path.basename(file);
              destDir = this.formatNow();
              destPath = path.join(think.UPLOAD_PATH, destDir);

              if (!think.isDir(destPath)) {
                think.mkdir(destPath);
              }

              _context.prev = 4;
              _context.next = 7;
              return moveFile(file, path.join(destPath, basename));

            case 7:
              return _context.abrupt('return', path.join('/static/upload', destDir, basename));

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](4);
              throw Error('FILE_UPLOAD_MOVE_ERROR');

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 10]]);
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