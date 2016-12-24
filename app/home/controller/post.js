'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * index action
   * @return {[type]} [description]
   */
  _class.prototype.indexAction = function indexAction() {
    return this.listAction();
  };
  /**
   * post list
   * @return {Promise} []
   */


  _class.prototype.listAction = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var model, where, user, list, data, pagination;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              model = this.model('post');
              where = {
                tag: this.get('tag'),
                cate: this.get('cate')
              };

              if (!this.get('name')) {
                _context.next = 7;
                break;
              }

              _context.next = 5;
              return this.model('user').where({ name: this.get('name') }).find();

            case 5:
              user = _context.sent;

              if (!think.isEmpty(user)) {
                where.where = { user_id: user.id };
              }

            case 7:
              _context.next = 9;
              return model.getPostList(this.get('page'), where);

            case 9:
              list = _context.sent;

              list.data.forEach(function (post) {
                return post.pathname = encodeURIComponent(post.pathname);
              });
              data = list.data, pagination = (0, _objectWithoutProperties3.default)(list, ['data']);

              this.assign({
                posts: data,
                pagination: pagination,
                tag: this.get('tag'),
                cate: this.get('cate')
              });
              return _context.abrupt('return', this.displayView('index'));

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function listAction() {
      return _ref.apply(this, arguments);
    }

    return listAction;
  }();
  /**
   * post detail
   * @return {[type]} [description]
   */


  _class.prototype.detailAction = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var pathname, detail;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.http.url = decodeURIComponent(this.http.url);
              pathname = this.get('pathname');
              _context2.next = 4;
              return this.model('post').getPostDetail(pathname);

            case 4:
              detail = _context2.sent;

              if (!think.isEmpty(detail)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', this.redirect('/'));

            case 7:
              detail.pathname = encodeURIComponent(detail.pathname);
              this.assign('post', detail);

              return _context2.abrupt('return', this.displayView('post'));

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function detailAction() {
      return _ref2.apply(this, arguments);
    }

    return detailAction;
  }();

  _class.prototype.pageAction = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var pathname, detail;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              pathname = this.get('pathname');
              _context3.next = 3;
              return this.model('post').setRelation(false).where({
                pathname: pathname,
                is_public: 1, //公开
                type: 1, //文章
                status: 3 //已经发布
              }).find();

            case 3:
              detail = _context3.sent;

              detail.pathname = encodeURIComponent(detail.pathname);
              this.assign('page', detail);
              this.assign('pathname', pathname);

              return _context3.abrupt('return', this.displayView('page'));

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function pageAction() {
      return _ref3.apply(this, arguments);
    }

    return pageAction;
  }();
  /**
   * post archive
   * @return {[type]} [description]
   */


  _class.prototype.archiveAction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var model, data, i;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              model = this.model('post');
              _context4.next = 3;
              return model.getPostArchive();

            case 3:
              data = _context4.sent;

              for (i in data) {
                data[i].map(function (post) {
                  return post.pathname = encodeURIComponent(post.pathname);
                });
              };
              this.assign('list', data);
              return _context4.abrupt('return', this.displayView('archive'));

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function archiveAction() {
      return _ref4.apply(this, arguments);
    }

    return archiveAction;
  }();

  _class.prototype.tagAction = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      var model, data;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              model = this.model('tag');
              _context5.next = 3;
              return model.getTagArchive();

            case 3:
              data = _context5.sent;

              data.map(function (post) {
                return post.pathname = encodeURIComponent(post.pathname);
              });
              this.assign('list', data);
              return _context5.abrupt('return', this.displayView('tag'));

            case 7:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function tagAction() {
      return _ref5.apply(this, arguments);
    }

    return tagAction;
  }();
  /**
   * search action
   * @return {[type]} [description]
   */


  _class.prototype.searchAction = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var keyword, postModel, searchResultPromise, tagModel, hotTagsPromise;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              keyword = this.get('keyword').trim();

              if (keyword) {
                postModel = this.model('post');
                searchResultPromise = postModel.getPostSearch(keyword, this.get('page'));

                this.assign('searchData', searchResultPromise);
              }

              //热门标签
              tagModel = this.model('tag');
              hotTagsPromise = tagModel.getHotTags();

              this.assign('hotTags', hotTagsPromise);

              this.assign('keyword', keyword);
              return _context6.abrupt('return', this.displayView('search'));

            case 7:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function searchAction() {
      return _ref6.apply(this, arguments);
    }

    return searchAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;