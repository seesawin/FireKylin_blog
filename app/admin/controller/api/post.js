'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _markedToc = require('marked-toc');

var _markedToc2 = _interopRequireDefault(_markedToc);

var _highlight = require('highlight.js');

var _highlight2 = _interopRequireDefault(_highlight);

var _pushToFirekylin = require('push-to-firekylin');

var _pushToFirekylin2 = _interopRequireDefault(_pushToFirekylin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _Base.call.apply(_Base, [this].concat(args))), _this), _this.modelInstance = _this.modelInstance.where({ type: 0 }), _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * get
   * @return {[type]} [description]
   */
  _class.prototype.getAction = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(self) {
      var data, where, keywords, field;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // this.modelInstance.field('id,user_id,type,status,title,pathname,create_time,update_time');
              data = void 0;

              if (!this.id) {
                _context.next = 10;
                break;
              }

              if (!(this.id === 'lastest')) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', this.lastest());

            case 4:
              _context.next = 6;
              return this.modelInstance.where({ id: this.id }).find();

            case 6:
              data = _context.sent;

              //文章选项
              if (data.options) {
                data.options = JSON.parse(data.options) || {};
              } else {
                data.options = {};
              }
              _context.next = 18;
              break;

            case 10:
              where = {};
              //不是管理员，只显示个人的文章

              if (this.userInfo.type !== 1) {
                where.user_id = this.userInfo.id;
              }

              if (this.get('status')) {
                where.status = this.get('status');
              }

              if (this.get('keyword')) {
                keywords = this.get('keyword').split(/\s+/g);

                if (keywords.indexOf(':public') > -1 || keywords.indexOf(':private') > -1) {
                  where.is_public = Number(keywords.indexOf(':public') > -1);
                  keywords = keywords.filter(function (word) {
                    return word !== ':public' && word !== ':private';
                  });
                }
                if (keywords.length > 0) {
                  where.title = ["like", keywords.map(function (word) {
                    return '%' + word + '%';
                  })];
                }
              }

              field = ['id', 'title', 'user_id', 'create_time', 'update_time', 'status', 'pathname'];
              _context.next = 17;
              return this.modelInstance.where(where).field(field).order('id DESC').page(this.get('page'), 15).countSelect();

            case 17:
              data = _context.sent;

            case 18:
              return _context.abrupt('return', this.success(data));

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getAction(_x) {
      return _ref.apply(this, arguments);
    }

    return getAction;
  }();

  _class.prototype.getBaseAction = function getBaseAction(self) {
    return _Base.prototype.getAction.call(this, self);
  };
  /**
   * add user
   * @return {[type]} [description]
   */


  _class.prototype.postAction = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var data, post, insertId;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              data = this.post();
              //check pathname

              _context2.next = 3;
              return this.modelInstance.where({ pathname: data.pathname }).select();

            case 3:
              post = _context2.sent;

              if (!(post.length > 0)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt('return', this.fail('PATHNAME_EXIST'));

            case 6:

              /** 如果是编辑发布文章的话默认状态改为审核中 **/
              if (data.status == 3 && this.userInfo.type != 1) {
                data.status = 1;
              }

              /** 推送文章 **/
              this.pushPost(data);

              _context2.next = 10;
              return this.getTagIds(data.tag);

            case 10:
              data.tag = _context2.sent;

              data = this.getContentAndSummary(data);
              data.user_id = this.userInfo.id;
              data = this.getPostTime(data);
              data.options = data.options ? (0, _stringify2.default)(data.options) : '';

              _context2.next = 17;
              return this.modelInstance.addPost(data);

            case 17:
              insertId = _context2.sent;
              return _context2.abrupt('return', this.success({ id: insertId }));

            case 19:
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
  /**
   * update user info
   * @return {[type]} [description]
   */


  _class.prototype.putAction = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
      var data, rows;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (this.id) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt('return', this.fail('PARAMS_ERROR'));

            case 2:
              data = this.post();

              data.id = this.id;

              /** 判断接收的参数中是否有 markdown_content 来区别审核通过的状态修改和普通的文章更新 */

              if (!data.markdown_content) {
                _context3.next = 13;
                break;
              }

              /** 推送文章 */
              this.pushPost(data);

              data = this.getPostTime(data);
              data = this.getContentAndSummary(data);
              data.options = data.options ? (0, _stringify2.default)(data.options) : '';

              if (!data.tag) {
                _context3.next = 13;
                break;
              }

              _context3.next = 12;
              return this.getTagIds(data.tag);

            case 12:
              data.tag = _context3.sent;

            case 13:
              _context3.next = 15;
              return this.modelInstance.savePost(data);

            case 15:
              rows = _context3.sent;
              return _context3.abrupt('return', this.success({ affectedRows: rows }));

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function putAction() {
      return _ref3.apply(this, arguments);
    }

    return putAction;
  }();

  _class.prototype.deleteAction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
      var post;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (this.id) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt('return', this.fail('PARAMS_ERROR'));

            case 2:
              if (!(this.userInfo.type !== 1)) {
                _context4.next = 8;
                break;
              }

              _context4.next = 5;
              return this.modelInstance.where({ id: this.id }).find();

            case 5:
              post = _context4.sent;

              if (!(post.user_id != this.userInfo.id)) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt('return', this.fail('USER_NO_PERMISSION'));

            case 8:
              _context4.next = 10;
              return this.modelInstance.deletePost(this.id);

            case 10:
              return _context4.abrupt('return', this.success());

            case 11:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function deleteAction() {
      return _ref4.apply(this, arguments);
    }

    return deleteAction;
  }();

  _class.prototype.pushPost = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(post) {
      var postOpt, canPush, options, push_sites, push_sites_keys, _options, site_url, pushes, result;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              postOpt = JSON.parse(post.options);
              canPush = Array.isArray(postOpt.push_sites) && postOpt.push_sites.length > 0;

              if (!(post.status != 3 && post.is_public != 1 && !canPush)) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt('return');

            case 4:
              post = think.extend({}, post);

              _context5.next = 7;
              return this.model('options').getOptions();

            case 7:
              options = _context5.sent;
              push_sites = options.push_sites;
              push_sites_keys = postOpt.push_sites;

              if (!(post.markdown_content.slice(0, 5) !== '> 原文：')) {
                _context5.next = 16;
                break;
              }

              _context5.next = 13;
              return this.model('options').getOptions();

            case 13:
              _options = _context5.sent;
              site_url = _options.hasOwnProperty('site_url') ? _options.site_url : 'http://' + this.http.host;

              post.markdown_content = '> \u539F\u6587\uFF1A' + site_url + '/post/' + post.pathname + '.html\n\n' + post.markdown_content;

            case 16:
              delete post.cate;
              delete post.options;

              if (!Array.isArray(push_sites_keys)) {
                push_sites_keys = [push_sites_keys];
              }
              pushes = push_sites_keys.map(function (key) {
                var _push_sites$key = push_sites[key],
                    appKey = _push_sites$key.appKey,
                    appSecret = _push_sites$key.appSecret,
                    url = _push_sites$key.url;

                var p2fk = new _pushToFirekylin2.default(url, appKey, appSecret);
                return p2fk.push(post);
              });
              _context5.next = 22;
              return _promise2.default.all(pushes);

            case 22:
              result = _context5.sent;

              console.log('push result for debug: ', result);

            case 24:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function pushPost(_x2) {
      return _ref5.apply(this, arguments);
    }

    return pushPost;
  }();

  _class.prototype.lastest = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var userId, data;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              userId = this.userInfo.type !== 1 ? this.userInfo.id : null;
              _context6.next = 3;
              return this.modelInstance.getLatest(userId, 6);

            case 3:
              data = _context6.sent;
              return _context6.abrupt('return', this.success(data));

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function lastest() {
      return _ref6.apply(this, arguments);
    }

    return lastest;
  }();

  _class.prototype.getPostTime = function getPostTime(data) {
    data.update_time = think.datetime();
    /**草稿可以没有创建时间**/
    if (!data.create_time) {
      data.create_time = data.status != 0 ? data.update_time : null;
    } else {
      data.create_time = think.datetime(data.create_time);
    }
    return data;
  };

  /**
   * 渲染 markdown 
   * 摘要为部分内容时不展示 TOC
   */


  _class.prototype.getContentAndSummary = function getContentAndSummary(data) {
    data.content = this.markdownToHtml(data.markdown_content);

    data.summary = data.markdown_content.split('<!--more-->')[0];
    if (data.summary === data.markdown_content) {
      data.summary = data.content;
    } else {
      data.summary = this.markdownToHtml(data.summary, { toc: false });
    }
    data.summary.replace(/<[>]*>/g, '');

    return data;
  };

  _class.prototype.getTagIds = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(tags) {
      var modelInstance, tagIds, promises;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (tags) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt('return', []);

            case 2:
              if (!think.isArray(tags)) {
                tags = [tags];
              }
              modelInstance = this.model('tag').setRelation(false), tagIds = [];
              promises = tags.map(function (name) {
                return modelInstance.where({ name: name }).thenAdd({ name: name, pathname: encodeURIComponent(name) }).then(function (data) {
                  return tagIds.push({ tag_id: data.id, name: name });
                });
              });
              _context7.next = 7;
              return _promise2.default.all(promises);

            case 7:
              return _context7.abrupt('return', tagIds);

            case 8:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function getTagIds(_x3) {
      return _ref7.apply(this, arguments);
    }

    return getTagIds;
  }();

  /**
   * generate toc name
   * @param  {String} name []
   * @return {String}      []
   */


  _class.prototype.generateTocName = function generateTocName(name) {
    name = name.trim().replace(/\s+/g, '').replace(/\)/g, '').replace(/[\(\,]/g, '-').toLowerCase();
    if (/^[\w\-]+$/.test(name)) {
      return name;
    }
    return 'toc-' + think.md5(name).slice(0, 3);
  };
  /**
   * markdown to html
   * @return {} []
   */


  _class.prototype.markdownToHtml = function markdownToHtml(content) {
    var _this2 = this;

    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { toc: true, highlight: true };

    var markedContent = (0, _marked2.default)(content);

    /**
     * 增加 TOC 目录
     */
    if (option.toc) {
      var tocContent = (0, _marked2.default)((0, _markedToc2.default)(content)).replace(/<a\s+href="#([^\"]+)">([^<>]+)<\/a>/g, function (a, b, c) {
        return '<a href="#' + _this2.generateTocName(c) + '">' + c + '</a>';
      });

      markedContent = markedContent.replace(/<h(\d)[^<>]*>(.*?)<\/h\1>/g, function (a, b, c) {
        if (b == 2) {
          return '<h' + b + ' id="' + _this2.generateTocName(c) + '">' + c + '</h' + b + '>';
        }
        return '<h' + b + ' id="' + _this2.generateTocName(c) + '"><a class="anchor" href="#' + _this2.generateTocName(c) + '"></a>' + c + '</h' + b + '>';
      });
      markedContent = '<div class="toc">' + tocContent + '</div>' + markedContent;
    }

    /**
     * 增加代码高亮
     */
    if (option.highlight) {
      markedContent = markedContent.replace(/<pre><code\s*(?:class="lang-(\w+)")?>([\s\S]+?)<\/code><\/pre>/mg, function (a, language, text) {
        text = text.replace(/&#39;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\&quot;/g, '"').replace(/\&amp;/g, "&");
        var result = _highlight2.default.highlightAuto(text, language ? [language] : undefined);
        return '<pre><code class="hljs lang-' + result.language + '">' + result.value + '</code></pre>';
      });
    }

    return markedContent;
  };

  return _class;
}(_base2.default);

exports.default = _class;