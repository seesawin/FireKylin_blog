'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WP_POST_STATUS = {
  publish: 3, //发布
  future: 3, //未来发布
  draft: 0, //草稿
  pending: 1, //待审核
  private: 3, //私密文章对应 is_public 字段为 false, 发布状态为已发布
  trash: 2 };

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.formatArray = function formatArray(obj) {
    for (var i in obj) {
      if (Array.isArray(obj[i]) && obj[i].length === 1) {
        obj[i] = obj[i][0];
      } else if ((0, _typeof3.default)(obj[i]) === 'object') {
        obj[i] = this.formatArray(obj[i]);
      }
    }
    return obj;
  };

  /**
   * 导入用户
   */


  _class.prototype.user = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(channel) {
      var _this2 = this;

      var authors, authorsPromise;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (channel.hasOwnProperty('wp:author')) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', 0);

            case 2:
              authors = channel['wp:author'];
              authorsPromise = authors.map(function (author) {
                return _this2.userModelInstance.addUser({
                  username: author['wp:author_login'][0],
                  email: author['wp:author_email'][0],
                  display_name: author['wp:author_display_name'][0],
                  password: _base2.default.DEFAULT_USER_PWD,
                  type: 2, //默认导入用户都为编辑
                  status: 2 }, '127.0.0.1');
              });
              _context.next = 6;
              return _promise2.default.all(authorsPromise);

            case 6:
              return _context.abrupt('return', authors.length);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function user(_x) {
      return _ref.apply(this, arguments);
    }

    return user;
  }();

  /**
   * 导入文章
   */


  _class.prototype.post = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(channel) {
      var _this3 = this;

      var posts, postsPromise;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (Array.isArray('item')) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt('return', 0);

            case 2:
              posts = channel.item.filter(function (item) {
                return item['wp:post_type'][0] === 'post';
              });
              postsPromise = posts.map(function () {
                var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(item) {
                  var user, cate, cates, summary, _post;

                  return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.prev = 0;
                          _context2.next = 3;
                          return _this3.userModelInstance.where({ name: item['dc:creator'][0] }).find();

                        case 3:
                          user = _context2.sent;

                          //查询分类 ID
                          cate = [];

                          if (!item.hasOwnProperty('category')) {
                            _context2.next = 12;
                            break;
                          }

                          cates = item.category.filter(function (item) {
                            return item.$.domain === 'category';
                          }).map(function (item) {
                            return item._;
                          });

                          if (!(Array.isArray(cates) && cates.length > 0)) {
                            _context2.next = 12;
                            break;
                          }

                          _context2.next = 10;
                          return _this3.cateModelInstance.setRelation(false).field('id').where({ name: ['IN', cates] }).select();

                        case 10:
                          cate = _context2.sent;

                          cate = cate.map(function (item) {
                            return item.id;
                          });

                        case 12:

                          //摘要有可能是空
                          summary = void 0;

                          if (item.hasOwnProperty('excerpt:encoded') && item['excerpt:encoded'][0] !== '') {
                            summary = item['excerpt:encoded'][0];
                          } else {
                            summary = item['content:encoded'][0];
                          }

                          _post = {
                            title: item.title[0],
                            pathname: decodeURIComponent(item['wp:post_name'][0]),
                            content: item['content:encoded'][0],
                            summary: summary,
                            create_time: _this3.formatDate(new Date(item.pubDate[0])),
                            update_time: item['wp:post_date'][0],
                            status: WP_POST_STATUS[item['wp:status'][0]] || 0,
                            user_id: user.id,
                            comment_num: 0,
                            allow_comment: Number(item['wp:comment_status'][0] === 'open'),
                            is_public: Number(item['wp:status'][0] !== 'private'),
                            tag: item.hasOwnProperty('category') ? item.category.filter(function (item) {
                              return item.$.domain === 'post_tag';
                            }).map(function (item) {
                              return item._;
                            }) : [],
                            cate: cate
                          };


                          _post.markdown_content = _this3.toMarkdown(_post.content);
                          _context2.next = 18;
                          return _this3.postModelInstance.addPost(_post);

                        case 18:
                          _context2.next = 23;
                          break;

                        case 20:
                          _context2.prev = 20;
                          _context2.t0 = _context2['catch'](0);
                          console.log(_context2.t0);
                        case 23:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this3, [[0, 20]]);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }());
              _context3.next = 6;
              return _promise2.default.all(postsPromise);

            case 6:
              return _context3.abrupt('return', posts.length);

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function post(_x2) {
      return _ref2.apply(this, arguments);
    }

    return post;
  }();

  /**
   * 导入页面
   */


  _class.prototype.page = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(channel) {
      var _this4 = this;

      var pages, pagesPromise;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (channel.hasOwnProperty('item')) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt('return', 0);

            case 2:
              pages = channel.item.filter(function (item) {
                return item['wp:post_type'][0] === 'page';
              });
              pagesPromise = pages.map(function () {
                var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(item) {
                  var user, summary, page;
                  return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return _this4.userModelInstance.where({ name: item['dc:creator'][0] }).find();

                        case 2:
                          user = _context4.sent;
                          summary = item['excerpt:encoded'][0];

                          if (summary === '') {
                            summary = item['content:encoded'][0];
                          }

                          page = {
                            title: item.title[0],
                            pathname: decodeURIComponent(item['wp:post_name'][0]),
                            content: item['content:encoded'][0],
                            summary: summary,
                            create_time: _this4.formatDate(new Date(item.pubDate[0])),
                            update_time: item['wp:post_date'][0],
                            status: postStatus[item['wp:status'][0]] || 0,
                            user_id: user.id,
                            comment_num: 0,
                            allow_comment: item['wp:comment_status'][0] === 'open',
                            is_public: item['wp:status'][0] !== 'private'
                          };

                          page.markdown_content = _this4.toMarkdown(page.content);
                          _context4.next = 9;
                          return _this4.pageModelInstance.addPost(page);

                        case 9:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this4);
                }));

                return function (_x5) {
                  return _ref5.apply(this, arguments);
                };
              }());

              _promise2.default.all(pagesPromise);

              return _context5.abrupt('return', pages.length);

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function page(_x4) {
      return _ref4.apply(this, arguments);
    }

    return page;
  }();

  /**
   * 导入标签
   */


  _class.prototype.tag = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(channel) {
      var _this5 = this;

      var tags, tagsPromise;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (channel.hasOwnProperty('wp:tag')) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt('return', 0);

            case 2:
              tags = channel['wp:tag'];
              tagsPromise = tags.map(function (tag) {
                return _this5.tagModelInstance.addTag({
                  name: tag['wp:tag_name'][0],
                  pathname: decodeURIComponent(tag['wp:tag_slug'][0])
                });
              });
              _context6.next = 6;
              return _promise2.default.all(tagsPromise);

            case 6:
              return _context6.abrupt('return', tags.length);

            case 7:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function tag(_x6) {
      return _ref6.apply(this, arguments);
    }

    return tag;
  }();

  /**
   * 导入分类
   * 为了简单不支持子分类导入，默认所有分类为一级分类
   */


  _class.prototype.category = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(channel) {
      var _this6 = this;

      var categories, categoriesPromise;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!channel.hasOwnProperty('wp:category')) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt('return', 0);

            case 2:
              categories = channel['wp:category'];
              categoriesPromise = categories.map(function (cate) {
                return _this6.cateModelInstance.addCate({
                  name: cate['wp:cat_name'][0],
                  pathname: decodeURIComponent(cate['wp:category_nicename'][0]),
                  pid: 0
                });
              });
              _context7.next = 6;
              return _promise2.default.all(categoriesPromise);

            case 6:
              return _context7.abrupt('return', categories.length);

            case 7:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function category(_x7) {
      return _ref7.apply(this, arguments);
    }

    return category;
  }();

  /**
   * 处理上传文件获取导入数据
   */


  _class.prototype.parseFile = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(file) {
      var data, parser, parseString, wxrJSON;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              data = _fs2.default.readFileSync(file.path, { encoding: 'utf-8' });
              parser = new _xml2js2.default.Parser();
              parseString = think.promisify(parser.parseString, parser);
              _context8.next = 5;
              return parseString(data);

            case 5:
              wxrJSON = _context8.sent;
              return _context8.abrupt('return', this.formatArray(wxrJSON).rss.channel);

            case 7:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function parseFile(_x8) {
      return _ref8.apply(this, arguments);
    }

    return parseFile;
  }();

  /**
   * 执行导入
   */


  _class.prototype.run = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(file) {
      var channel;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.parseFile(file);

            case 2:
              channel = _context9.sent;
              _context9.next = 5;
              return this.importData(channel);

            case 5:
              return _context9.abrupt('return', _context9.sent);

            case 6:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function run(_x9) {
      return _ref9.apply(this, arguments);
    }

    return run;
  }();

  return _class;
}(_base2.default);

exports.default = _class;