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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Base.call.apply(_Base, [this].concat(args))), _this), _this.uploadConfig = {}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  _class.prototype.__before = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.getUploadConfig();

            case 2:
              this.uploadConfig = _context.sent;

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function __before() {
      return _ref.apply(this, arguments);
    }

    return __before;
  }();

  _class.prototype.postAction = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var file, type, config;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.post('fileUrl')) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', this.serviceUpload('remote', this.post('fileUrl'), { name: this.post('name') }));

            case 2:
              file = this.file('file');

              if (file) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', this.fail('FILE_UPLOAD_ERROR'));

            case 5:
              if (!this.post('importor')) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', this.serviceImport(this.post('importor'), file));

            case 7:

              /** 检查文件类型 */
              // let contentType = file.headers['content-type']; 

              // 处理其它上传
              type = this.uploadConfig.type;
              config = this.uploadConfig;

              if (type) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt('return', this.fail());

            case 11:
              if (type == 'local') {
                config = { name: this.post('name') };
              }

              return _context2.abrupt('return', this.serviceUpload(type, file.path, config));

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function postAction() {
      return _ref2.apply(this, arguments);
    }

    return postAction;
  }();

  // 获取上传设置


  _class.prototype.getUploadConfig = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var options;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.model('options').getOptions();

            case 2:
              options = _context3.sent;
              return _context3.abrupt('return', options.upload);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function getUploadConfig() {
      return _ref3.apply(this, arguments);
    }

    return getUploadConfig;
  }();

  /**
   * 上传文件
   */


  _class.prototype.serviceUpload = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(service, file, config) {
      var uploader, result;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              uploader = think.service('upload/' + service, 'admin');
              _context4.next = 4;
              return new uploader().run(file, config);

            case 4:
              result = _context4.sent;
              return _context4.abrupt('return', this.success(result));

            case 8:
              _context4.prev = 8;
              _context4.t0 = _context4['catch'](0);
              return _context4.abrupt('return', this.fail(_context4.t0 || 'FILE_UPLOAD_ERROR'));

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[0, 8]]);
    }));

    function serviceUpload(_x, _x2, _x3) {
      return _ref4.apply(this, arguments);
    }

    return serviceUpload;
  }();

  /**
   * 从其他平台导入数据
   */


  _class.prototype.serviceImport = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(service, file) {
      var importor, _ref6, post, page, category, tag;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              importor = think.service('import/' + service, 'admin');
              _context5.next = 4;
              return new importor().run(file);

            case 4:
              _ref6 = _context5.sent;
              post = _ref6.post;
              page = _ref6.page;
              category = _ref6.category;
              tag = _ref6.tag;
              return _context5.abrupt('return', this.success('\u5171\u5BFC\u5165\u6587\u7AE0 ' + post + ' \u7BC7\uFF0C\u9875\u9762 ' + page + ' \u9875\uFF0C\u5206\u7C7B ' + category + ' \u4E2A\uFF0C\u6807\u7B7E ' + tag + ' \u4E2A'));

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5['catch'](0);
              return _context5.abrupt('return', this.fail(_context5.t0));

            case 15:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[0, 12]]);
    }));

    function serviceImport(_x4, _x5) {
      return _ref5.apply(this, arguments);
    }

    return serviceImport;
  }();

  return _class;
}(_base2.default);

exports.default = _class;