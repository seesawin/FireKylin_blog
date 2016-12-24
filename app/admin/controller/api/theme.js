'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var THEME_DIR = _path2.default.join(think.RESOURCE_PATH, 'theme');

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.getAction = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var themes, result, _iterator, _isArray, _i, _ref2, theme, infoFile, stat;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return think.promisify(_fs2.default.readdir)(THEME_DIR);

            case 2:
              themes = _context.sent;
              result = [];
              _iterator = themes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);

            case 5:
              if (!_isArray) {
                _context.next = 11;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('break', 29);

            case 8:
              _ref2 = _iterator[_i++];
              _context.next = 15;
              break;

            case 11:
              _i = _iterator.next();

              if (!_i.done) {
                _context.next = 14;
                break;
              }

              return _context.abrupt('break', 29);

            case 14:
              _ref2 = _i.value;

            case 15:
              theme = _ref2;
              infoFile = _path2.default.join(THEME_DIR, theme, 'package.json');
              _context.prev = 17;
              _context.next = 20;
              return think.promisify(_fs2.default.stat)(infoFile);

            case 20:
              stat = _context.sent;

              result.push(think.extend({ id: theme }, think.require(infoFile)));
              _context.next = 27;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context['catch'](17);

              console.log(_context.t0);

            case 27:
              _context.next = 5;
              break;

            case 29:
              return _context.abrupt('return', this.success(result));

            case 30:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[17, 24]]);
    }));

    function getAction() {
      return _ref.apply(this, arguments);
    }

    return getAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;