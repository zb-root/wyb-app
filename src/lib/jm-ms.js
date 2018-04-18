(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var ms = new _jmMsCore2.default(opts);
    ms.use(_browser2.default.moduleClient).use(_browser4.default.moduleClient);
    return ms;
  };

  var _jmMsCore = require('jm-ms-core');

  var _jmMsCore2 = _interopRequireDefault(_jmMsCore);

  var _browser = require('jm-ms-http/lib/browser');

  var _browser2 = _interopRequireDefault(_browser);

  var _browser3 = require('jm-ms-ws/lib/browser');

  var _browser4 = _interopRequireDefault(_browser3);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  ;
  module.exports = exports['default'];
},{"jm-ms-core":4,"jm-ms-http/lib/browser":17,"jm-ms-ws/lib/browser":26}],2:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * event module.
     * @module event
     */

    /**
     * Class representing an eventEmitter.
     *
     * ```javascript
     * // es6
     * let eventEmitter = new EventEmitter();
     * eventEmitter.on('test', (info) => {
 *      console.log(info);
 * });
     * eventEmitter.once('test', (info) => {
 *      // this will be called only one time
 *      console.log(info);
 * });
     * eventEmitter.one('test', (info) => {
 *      // this will be called first
 *      console.log(info);
 * }, true);
     *
     * eventEmitter.emit('test', 'hello eventEmitter');
     * eventEmitter.off('test');
     * ```
     */
    var EventEmitter = function () {

      /**
       * Create an eventEmitter.
       */
      function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this._events = {};
      }

      /**
       * Adds the listener function to the end of the listeners array for the event named eventName.
       * No checks are made to see if the listener has already been added.
       * Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
       *
       * @param {*} eventName - event name
       * @param {Function} fn - listener function
       * @param {boolean} [prepend] - Adds to the beginning of the listeners array if true
       * @return {EventEmitter} - for chaining
       */


      _createClass(EventEmitter, [{
        key: 'on',
        value: function on(eventName, fn, prepend) {
          this._events[eventName] || (this._events[eventName] = []);
          if (prepend) {
            this._events[eventName].unshift(fn);
          } else {
            this._events[eventName].push(fn);
          }
          return this;
        }

        /**
         * Adds a one time listener function for the event named eventName.
         * The next time eventName is triggered, this listener is removed and then invoked.
         *
         * @param {*} eventName - event name
         * @param {Function} fn - listener function
         * @param {boolean} [prepend] - Adds to the beginning of the listeners array if true
         * @return {EventEmitter} - for chaining
         */

      }, {
        key: 'once',
        value: function once(eventName, fn, prepend) {
          var _this = this;

          var on = function on(arg1, arg2, arg3, arg4, arg5) {
            _this.off(eventName, on);
            fn(arg1, arg2, arg3, arg4, arg5);
          };
          return this.on(eventName, on, prepend);
        }

        /**
         * Removes a listener for the event named eventName.
         * Removes all listeners from the listener array for event named eventName if fn is null
         * Removes all listeners from the listener array if eventName is null
         *
         * @param {*} [eventName] - event name
         * @param {Function} [fn] - listener function
         * @return {EventEmitter} - for chaining
         */

      }, {
        key: 'off',
        value: function off(eventName, fn) {
          if (!fn) {
            if (eventName === undefined) {
              this._events = {};
            } else if (this._events && this._events[eventName]) {
              delete this._events[eventName];
            }
          } else if (this._events && this._events[eventName]) {
            var list = this._events[eventName];
            for (var i = 0; i < list.length; i++) {
              if (fn === list[i]) {
                list.splice(i, 1);
                if (!list.length) {
                  delete this._events[eventName];
                }
                break;
              }
            }
          }
          return this;
        }

        /**
         * Synchronously calls each of the listeners registered for the event named eventName,
         * in the order they were registered, passing the supplied arguments to each.
         *
         * to break the calls, just return false on listener function.
         * ```javascript
         * // es6
         * let eventEmitter = new EventEmitter();
         * eventEmitter.on('test', (info) => {
         *      // this will be called
         *      console.log(info);
         * });
         * eventEmitter.on('test', (info) => {
         *      // this will be called
         *      return false;  // this break the calls
         * });
         * eventEmitter.on('test', (info) => {
         *      // this will not be called.
         *      console.log(info);
         * });
         * eventEmitter.emit('test', 'hello eventEmitter');
         * ```
         * tip: use arg1...arg5 instead of arguments for performance consider.
         *
         * @param {*} eventName - event name
         * @param {*} arg1
         * @param {*} arg2
         * @param {*} arg3
         * @param {*} arg4
         * @param {*} arg5
         * @return {EventEmitter} - for chaining
         */

      }, {
        key: 'emit',
        value: function emit(eventName, arg1, arg2, arg3, arg4, arg5) {
          // using a copy to avoid error when listener array changed
          var listeners = this.listeners(eventName);
          for (var i = 0; i < listeners.length; i++) {
            var fn = listeners[i];
            if (fn(arg1, arg2, arg3, arg4, arg5) === false) break;
          }
          return this;
        }

        /**
         * Returns an array listing the events for which the emitter has registered listeners.
         * The values in the array will be strings or Symbols.
         * @return {Array}
         */

      }, {
        key: 'eventNames',
        value: function eventNames() {
          return Object.keys(this._events);
        }

        /**
         * Returns a copy of the array of listeners for the event named eventName.
         * @param {*} eventName - event name
         * @return {Array} - listener array
         */

      }, {
        key: 'listeners',
        value: function listeners(eventName) {
          var v = this._events[eventName];
          if (!v) return [];
          var listeners = new Array(v.length);
          for (var i = 0; i < v.length; i++) {
            listeners[i] = v[i];
          }
          return listeners;
        }
      }]);

      return EventEmitter;
    }();

    var prototype = EventEmitter.prototype;
    var EM = {
      _events: {},
      on: prototype.on,
      once: prototype.once,
      off: prototype.off,
      emit: prototype.emit,
      eventNames: prototype.eventNames,
      listeners: prototype.listeners
    };

    var enableEvent = function enableEvent(obj) {
      if (obj.emit !== undefined) return false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(EM)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          obj[key] = EM[key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      obj._events = {};
      return true;
    };

    var disableEvent = function disableEvent(obj) {
      if (obj.emit === undefined) return;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(EM)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          delete obj[key];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    };

    var moduleEvent = function moduleEvent() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'event';

      var obj = this;
      obj.enableEvent = enableEvent;
      obj.disableEvent = disableEvent;

      return {
        name: name,
        unuse: function unuse() {
          delete obj.enableEvent;
          delete obj.disableEvent;
        }
      };
    };

    var $ = {
      EventEmitter: EventEmitter,
      enableEvent: enableEvent,
      disableEvent: disableEvent,
      moduleEvent: moduleEvent
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.EventEmitter) {
        for (var key in $) {
          jm[key] = $[key];
        }
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ERRCODE = 900;

  exports.default = {
    FA_INVALIDTYPE: {
      err: ERRCODE++,
      msg: 'invalid type'
    }
  };
  module.exports = exports['default'];
},{}],4:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _jmErr = require('jm-err');

    var _jmErr2 = _interopRequireDefault(_jmErr);

    var _jmEvent = require('jm-event');

    var _jmEvent2 = _interopRequireDefault(_jmEvent);

    var _jmModule = require('jm-module');

    var _jmModule2 = _interopRequireDefault(_jmModule);

    var _utils = require('./utils');

    var _utils2 = _interopRequireDefault(_utils);

    var _router = require('./router');

    var _router2 = _interopRequireDefault(_router);

    var _err = require('./err');

    var _err2 = _interopRequireDefault(_err);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * Class representing a root.
     */
    var Root = function () {
      /**
       * create a root
       */
      function Root() {
        _classCallCheck(this, Root);

        _jmErr2.default.enableErr(this);
        _jmModule2.default.enableModule(this);
        this.utils = _utils2.default;
        this.clientModules = {};
        this.serverModules = {};
      }

      /**
       * create a router
       * @param {Object} opts
       * @return {Router}
       */


      _createClass(Root, [{
        key: 'router',
        value: function router() {
          var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          var self = this;
          var app = new _router2.default(opts);

          /**
           * 添加代理
           * 支持多种参数格式, 例如
           * proxy({uri:uri, target:target, changeOrigin:true}, cb)
           * proxy(uri, target, changeOrigin, cb)
           * proxy(uri, target, cb)
           * 可以没有回调函数cb
           * proxy({uri:uri, target:target, changeOrigin:true})
           * proxy(uri, target, changeOrigin)
           * proxy(uri, target)
           * @param {String} uri
           * @param {String} target
           * @param {boolean} changeOrigin 是否改变原始uri
           * @param {function} cb 回调cb(err,doc)
           */
          app.proxy = function (uri, target, changeOrigin, cb) {
            var opts = uri;
            if (typeof uri === 'string') {
              opts = {
                uri: uri,
                target: target
              };
              if (typeof changeOrigin === 'boolean') {
                opts.changeOrigin = changeOrigin;
              } else if (changeOrigin && typeof changeOrigin === 'function') {
                cb = changeOrigin;
              }
            } else {
              cb = target;
            }
            opts || (opts = {});
            cb || (cb = function cb(err, doc) {
              if (err) throw err;
            });
            if (!opts.target) {
              var doc = _jmErr2.default.Err.FA_PARAMS;
              var err = _jmErr2.default.err(doc);
              cb(err, doc);
            }
            this.emit('proxy', opts);
            if (typeof opts.target === 'string') {
              opts.target = { uri: opts.target };
            }
            if (opts.changeOrigin) {
              self.client(opts.target, function (err, client) {
                if (err) return cb(err, client);
                app.use(opts.uri, function (opts, cb) {
                  client.request(opts, cb);
                });
                cb(err, client);
              });
            } else {
              self.proxy(opts.target, function (err, doc) {
                if (err) return cb(err, doc);
                app.use(opts.uri, doc);
                cb(err, doc);
              });
            }
          };
          return app;
        }

        /**
         * create a client
         * @param {Object} opts
         * @example
         * opts参数:{
       *  type: 类型(可选, 默认http)
       *  uri: uri(可选, 默认http://127.0.0.1)
       *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
       * }
         * @param {function} cb 回调cb(err,doc)
         * @return {Root} - for chaining
         */

      }, {
        key: 'client',
        value: function client() {
          var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          var err = null;
          var doc = null;
          var type = 'http';
          opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
          opts.type && (type = opts.type);
          type = type.toLowerCase();
          var fn = this.clientModules[type];
          if (!fn) {
            doc = _err2.default.FA_INVALIDTYPE;
            err = _jmErr2.default.err(doc);
            if (cb) cb(err, doc);
          } else {
            fn(opts, function (err, doc) {
              if (!err) _utils2.default.enableType(doc, ['get', 'post', 'put', 'delete']);
              if (cb) cb(err, doc);
            });
          }
          return this;
        }

        /**
         * create a server
         * @param {Object} app
         * @param {Object} opts
         * @example
         * opts参数:{
       *  uri: 网址(可选)
       *  type: 类型(可选, 默认http)
       *  host: 主机(可选, 默认127.0.0.1)
       *  port: 端口(可选, 默认80, 根据type不同默认值也不同)
       * }
         * @param {function} cb 回调cb(err,doc)
         * @return {Root} - for chaining
         */

      }, {
        key: 'server',
        value: function server() {
          var app = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

          var err = null;
          var doc = null;
          var type = 'http';
          opts.uri && (type = _utils2.default.getUriProtocol(opts.uri));
          opts.type && (type = opts.type);
          type = type.toLowerCase();
          var fn = this.serverModules[type];
          if (!fn) {
            doc = _err2.default.FA_INVALIDTYPE;
            err = _jmErr2.default.err(doc);
            if (cb) cb(err, doc);
          } else {
            app.emit('server', opts);
            fn(app, opts, cb);
          }
          return this;
        }

        /**
         * 创建一个代理路由
         * 支持多种参数格式, 例如
         * proxy({uri:uri}, cb)
         * proxy(uri, cb)
         * 可以没有回调函数cb
         * proxy({uri:uri})
         * proxy(uri)
         * @param {Object} opts 参数
         * @example
         * opts参数:{
       *  uri: 目标uri(必填)
       * }
         * @param {function} cb 回调cb(err,doc)
         * @return {Router}
         */

      }, {
        key: 'proxy',
        value: function proxy() {
          var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          var err = null;
          var doc = null;
          if (typeof opts === 'string') {
            opts = { uri: opts };
          }
          if (!opts.uri) {
            doc = _jmErr2.default.Err.FA_PARAMS;
            err = _jmErr2.default.err(doc);
            if (!cb) throw err;
          }
          var app = this.router();
          this.client(opts, function (err, client) {
            if (err) return cb(err, client);
            app.use(function (opts, cb) {
              client.request(opts, cb);
            });
            app.client = client;
            if (cb) cb(null, app);
          });
          return app;
        }
      }]);

      return Root;
    }();

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.ms) {
        var root = new Root();
        jm.ms = function (opts) {
          return root.router(opts);
        };
        var ms = jm.ms;
        _jmEvent2.default.enableEvent(ms);
        ms.root = root;

        ms.proxy = function (opts, cb) {
          root.proxy(opts, cb);
          return ms;
        };

        ms.client = function (opts, cb) {
          root.client(opts, cb);
          return ms;
        };

        ms.server = function (opts, cb) {
          root.server(opts, cb);
          return ms;
        };
      }
    }

    exports.default = Root;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./err":3,"./router":6,"./utils":7,"jm-err":8,"jm-event":11,"jm-module":12}],5:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _pathToRegexp = require('path-to-regexp');

  var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * Class representing a route.
   */
  var Route = function () {
    /**
     * create a route.
     * @param {Object} opts params
     * @example
     * opts:{
     *  uri: 接口路径(必填)
     *  type: 请求类型(可选)
     *  fn: 接口处理函数 function(opts, cb, next){}(必填)
     *
     * }
     */
    function Route() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Route);

      this.uri = opts.uri || '/';
      this.type = opts.type;
      this._fns = [];
      this.keys = [];
      opts.router && (this.router = opts.router);

      this.regexp = (0, _pathToRegexp2.default)(this.uri, this.keys, opts);

      if (this.uri === '/' && opts.end === false) {
        this.regexp.fast_slash = true;
      }

      if (this.type === undefined) {
        this.allType = true;
      }

      var fns = opts.fn;
      if (!Array.isArray(fns)) {
        fns = [fns];
      }

      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];
        if (typeof fn !== 'function') {
          var type = toString.call(fn);
          var msg = 'requires callback functions but got a ' + type;
          throw new TypeError(msg);
        }

        this._fns.push(fn);
      }
    }

    _createClass(Route, [{
      key: 'handle',
      value: function handle(opts, cb, next) {
        var idx = 0;
        var fns = this.fns;
        if (fns.length === 0) {
          return next();
        }
        _next();
        function _next(err, doc) {
          if (err) {
            if (err === 'route') {
              return next();
            } else {
              return cb(err, doc);
            }
          }
          var fn = fns[idx++];
          if (!fn) {
            return next(err);
          }
          try {
            fn(opts, cb, _next);
          } catch (err) {
            _next(err);
          }
        }
      }

      /**
       * Check if this route matches `uri`, if so
       * populate `.params`.
       *
       * @param {String} uri
       * @return {Boolean}
       * @api private
       */

    }, {
      key: 'match',
      value: function match(uri, type) {
        this.params = undefined;
        this.uri = undefined;

        type && (type = type.toLowerCase());
        if (type !== this.type && !this.allType) {
          return false;
        }

        if (uri === null || uri === undefined) {
          // no uri, nothing matches
          return false;
        }

        if (this.regexp.fast_slash) {
          // fast uri non-ending match for / (everything matches)
          this.params = {};
          this.uri = '';
          return true;
        }

        var m = this.regexp.exec(uri);

        if (!m) {
          return false;
        }

        // store values
        this.params = {};
        this.uri = m[0];

        var keys = this.keys;
        var params = this.params;

        for (var i = 1; i < m.length; i++) {
          var key = keys[i - 1];
          var prop = key.name;
          params[prop] = m[i];
        }

        return true;
      }
    }, {
      key: 'fns',
      get: function get() {
        return this._fns;
      }
    }]);

    return Route;
  }();

  exports.default = Route;
  module.exports = exports['default'];
},{"path-to-regexp":14}],6:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  var _route = require('./route');

  var _route2 = _interopRequireDefault(_route);

  var _utils = require('./utils');

  var _utils2 = _interopRequireDefault(_utils);

  var _jmErr = require('jm-err');

  var _jmErr2 = _interopRequireDefault(_jmErr);

  var _jmEvent = require('jm-event');

  var _jmEvent2 = _interopRequireDefault(_jmEvent);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Err = _jmErr2.default.Err;

  var errNotfound = _jmErr2.default.err(Err.FA_NOTFOUND);
  var cbDefault = function cbDefault(err, doc) {};

  var slice = Array.prototype.slice;

  /**
   * Class representing a router.
   */

  var Router = function () {
    /**
     * create a router.
     * @param {Object} opts 参数
     * @example
     * opts参数:{
     *  mergeParams: 是否合并参数(可选)
     *  sensitive: 是否大小写敏感(可选)
     *  strict: 是否检查末尾的分隔符(可选)
     * }
     */
    function Router() {
      var _this = this;

      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Router);

      this._routes = [];
      ['mergeParams', 'sensitive', 'strict'].forEach(function (key) {
        opts[key] && (_this[key] = opts[key]);
      });
      // alias methods
      _utils2.default.enableType(this, ['get', 'post', 'put', 'delete']);
      _jmEvent2.default.enableEvent(this);
    }

    _createClass(Router, [{
      key: 'clear',


      /**
       * clear all routes.
       * @return {Router} for chaining
       */
      value: function clear() {
        this._routes = [];
        return this;
      }

      /**
       * 添加接口定义
       * @function Router#_add
       * @param {Object} opts 参数
       * @example
       * opts参数:{
           *  uri: 接口路径(必填)
           *  type: 请求类型(可选)
           *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
           * }
       * @param cb 回调cb(err,doc)
       * @return {Router} for chaining
       */

    }, {
      key: '_add',
      value: function _add(opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (!opts.uri || !opts.fn) {
          doc = Err.FA_PARAMS;
          err = _jmErr2.default.err(doc);
          if (!cb) throw err;
        } else {
          this.emit('add', opts);
          var o = {};
          for (var key in opts) {
            o[key] = opts[key];
          }
          if (o.mergeParams === undefined) o.mergeParams = this.mergeParams;
          if (o.sensitive === undefined) o.sensitive = this.sensitive;
          if (o.strict === undefined) o.strict = this.strict;
          this._routes.push(new _route2.default(o));
        }
        if (cb) cb(err, doc);
        return this;
      }

      /**
       * 添加接口定义
       * 支持多种参数格式, 例如
       * add({uri:uri, type:type, fn:fn}, cb)
       * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]}, cb)
       * 可以没有回调函数cb
       * add({uri:uri, type:type, fn:fn})
       * add({uri:uri, type:type, fn:[fn1, fn2, ..., fnn]})
       * 以下用法不能包含cb
       * add(uri, fn)
       * add(uri, fn1, fn2, ..., fnn)
       * add(uri, [fn1, fn2, ..,fnn])
       * add(uri, type, fn)
       * add(uri, type, fn1, fn2, ..., fnn)
       * add(uri, type, [fn1, fn2, ..,fnn])
       * @function Router#add
       * @param {Object} opts 参数
       * @example
       * opts参数:{
       *  uri: 接口路径(必填)
       *  type: 请求类型(可选)
       *  fn: 接口处理函数 function(opts, cb){}, 支持数组(必填)
       * }
       * @param cb 回调cb(err,doc)
       * @return {Router} for chaining
       */

    }, {
      key: 'add',
      value: function add(opts, cb) {
        if (typeof opts === 'string') {
          opts = {
            uri: opts
          };
          if (typeof cb === 'string') {
            opts.type = cb;
            if (Array.isArray(arguments[2])) {
              opts.fn = arguments[2];
            } else {
              opts.fn = slice.call(arguments, 2);
            }
          } else if (Array.isArray(cb)) {
            opts.fn = cb;
          } else {
            opts.fn = slice.call(arguments, 1);
          }
          cb = null;
        }
        return this._add(opts, cb);
      }

      /**
       * 引用路由定义
       * @function Router#_use
       * @param {Object} opts 参数
       * @example
       * opts参数:{
       *  uri: 接口路径(可选)
       *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(支持函数数组) 或者含有request或handle函数的对象(必填)
       * }
       * @param cb 回调cb(err,doc)
       * @return {Router} for chaining
       */

    }, {
      key: '_use',
      value: function _use(opts, cb) {
        opts = opts || {};
        var err = null;
        var doc = null;
        if (opts && opts instanceof Router) {
          opts = {
            fn: opts
          };
        }
        if (!opts.fn) {
          doc = Err.FA_PARAMS;
          err = _jmErr2.default.err(doc);
          if (!cb) throw err;
        } else {
          this.emit('use', opts);
          opts.strict = false;
          opts.end = false;
          opts.uri = opts.uri || '/';
          if (opts.fn instanceof Router) {
            var router = opts.fn;
            opts.router = router;
            opts.fn = function (opts, cb, next) {
              router.handle(opts, cb, next);
            };
          } else if (_typeof(opts.fn) === 'object') {
            var _router = opts.fn;
            if (_router.request) {
              opts.router = _router;
              opts.fn = function (opts, cb, next) {
                _router.request(opts, function (err, doc) {
                  cb(err, doc);
                  next();
                });
              };
            } else if (_router.handle) {
              opts.router = _router;
              opts.fn = function (opts, cb, next) {
                _router.handle(opts, cb, next);
              };
            }
          }
          return this._add(opts, cb);
        }
        if (cb) cb(err, doc);
        return this;
      }

      /**
       * 引用路由定义
       * 支持多种参数格式, 例如
       * use({uri:uri, fn:fn}, cb)
       * use({uri:uri, fn:[fn1, fn2, ..., fnn]}, cb)
       * use({uri:uri, fn:router}, cb)
       * use({uri:uri, fn:obj}, cb)
       * use(router, cb)
       * 可以没有回调函数cb
       * use({uri:uri, fn:fn})
       * use({uri:uri, fn:[fn1, fn2, ..., fnn]})
       * use({uri:uri, fn:router})
       * use({uri:uri, fn:obj})
       * use(router)
       * use(obj) obj必须实现了request或者handle函数之一，优先使用request
       * 以下用法不能包含cb
       * use(uri, fn)
       * use(uri, fn1, fn2, ..., fnn)
       * use(uri, [fn1, fn2, ..,fnn])
       * use(uri, router)
       * use(uri, obj)
       * use(uri, fn)
       * use(fn1, fn2, ..., fnn)
       * use([fn1, fn2, ..,fnn])
       * @function Router#use
       * @param {Object} opts 参数
       * @example
       * opts参数:{
       *  uri: 接口路径(可选)
       *  fn: 接口处理函数 router实例 或者 function(opts, cb){}(必填)
       * }
       * @param cb 回调cb(err,doc)
       * @return {Router} for chaining
       */

    }, {
      key: 'use',
      value: function use(opts, cb) {
        if (typeof opts === 'string') {
          opts = {
            uri: opts
          };
          if ((typeof cb === 'undefined' ? 'undefined' : _typeof(cb)) === 'object') {
            // object 或者 数组
            opts.fn = cb;
          } else {
            opts.fn = slice.call(arguments, 1);
          }
          cb = null;
        } else if (typeof opts === 'function') {
          opts = {
            fn: slice.call(arguments, 0)
          };
          cb = null;
        } else if (Array.isArray(opts)) {
          opts = {
            fn: opts
          };
          cb = null;
        } else if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
          if (!opts.fn) {
            opts = {
              fn: opts
            };
          }
        }

        return this._use(opts, cb);
      }

      /**
       * 请求
       * 支持多种参数格式, 例如
       * request({uri:uri, type:type, data:data, params:params, timeout:timeout}, cb)
       * request({uri:uri, type:type, data:data, params:params, timeout:timeout})
       * request(uri, type, data, params, timeout, cb)
       * request(uri, type, data, params, cb)
       * request(uri, type, data, cb)
       * request(uri, type, cb)
       * request(uri, cb)
       * request(uri, type, data, params, timeout)
       * request(uri, type, data, params)
       * request(uri, type, data)
       * request(uri, type)
       * request(uri)
       * request(uri, type, data, timeout, cb)
       * request(uri, type, timeout, cb)
       * request(uri, timeout, cb)
       * request(uri, type, data, timeout)
       * request(uri, type, timeout)
       * request(uri, timeout)
       * request(uri, data, params, timeout, cb)
       * request(uri, data, params, cb)
       * request(uri, data, cb)
       * @param {Object} opts 参数
       * @example
       * opts参数:{
       *  uri: 接口路径(必填)
       *  type: 请求类型(可选)
       *  data: 请求数据(可选)
       *  params: 请求参数(可选)
       *  timeout: 请求超时(可选, 单位毫秒, 默认0表示不检测超时)
       * }
       * @param cb 回调(可选)cb(err,doc)
       * @return {Object}
       */

    }, {
      key: 'request',
      value: function request(opts, cb) {
        if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object') {
          return this.handle(opts, cb || cbDefault);
        }
        var r = _utils2.default.preRequest.apply(this, arguments);
        return this.handle(r.opts, r.cb || cbDefault);
      }
    }, {
      key: 'handle',
      value: function handle(opts, _cb2, next) {
        if (!next) {
          // is a request
          var _opts = opts;
          var _cb = _cb2;
          opts = {};
          for (var key in _opts) {
            opts[key] = _opts[key];
          }
          _cb2 = function cb(err, doc) {
            if (_cb2.done) return;
            _cb2.done = true;
            _cb(err, doc);
          };
          next = function next(err, doc) {
            _cb2(err || errNotfound, doc || Err.FA_NOTFOUND);
          };
        }

        var self = this;
        var idx = 0;
        var routes = self.routes;
        var parentParams = opts.params;
        var parentUri = opts.baseUri || '';
        var done = restore(next, opts, opts.baseUri, opts.params);
        opts.originalUri || (opts.originalUri = opts.uri);
        var uri = opts.uri;
        _next();
        return self;
        function _next(err, doc) {
          if (err) {
            if (err === 'route') {
              return next();
            } else {
              return done(err, doc);
            }
          }
          if (_cb2.done) {
            return done();
          }
          opts.baseUri = parentUri;
          opts.uri = uri;
          // no more matching layers
          if (idx >= routes.length) {
            return done();
          }
          var match = false;
          var route = void 0;
          while (!match && idx < routes.length) {
            route = routes[idx++];
            if (!route) {
              continue;
            }
            try {
              match = route.match(opts.uri, opts.type);
            } catch (err) {
              return done(err, Err.FA_BADREQUEST);
            }
          }
          if (!match) {
            return done();
          }
          opts.params = {};
          for (var _key in parentParams) {
            opts.params[_key] = parentParams[_key];
          }
          for (var _key2 in route.params) {
            opts.params[_key2] = route.params[_key2];
          }

          if (route.router) {
            opts.baseUri = parentUri + route.uri;
            opts.uri = opts.uri.replace(route.uri, '');
          }
          route.handle(opts, _cb2, _next);
        }

        // restore obj props after function
        function restore(fn, obj, baseUri, params) {
          return function (err, doc) {
            // restore vals
            obj.baseUri = baseUri;
            obj.params = params;
            fn && fn(err, doc);
            return self;
          };
        }
      }
    }, {
      key: 'routes',
      get: function get() {
        return this._routes;
      }
    }]);

    return Router;
  }();

  exports.default = Router;
  module.exports = exports['default'];
},{"./route":5,"./utils":7,"jm-err":8,"jm-event":11}],7:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var _jmUtils = require('jm-utils');

  var _jmUtils2 = _interopRequireDefault(_jmUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var utils = _jmUtils2.default.utils;
  utils.enableType = function (obj, types) {
    if (!Array.isArray(types)) {
      types = [types];
    }
    types.forEach(function (type) {
      if (typeof Promise !== 'undefined') {
        obj[type] = function (uri, data, params, timeout, cb) {
          var opts = uri;
          if (typeof uri === 'string') {
            var r = utils.preRequest.apply(this, arguments);
            opts = r.opts;
            cb = r.cb;
          } else {
            cb = data;
          }
          opts.type = type;

          if (cb) {
            this[type](opts).then(function (doc) {
              cb(null, doc);
            }).catch(function (err) {
              cb(err);
            });
            return this;
          }

          return new Promise(function (resolve, reject) {
            obj.request(opts, function (err, doc) {
              if (err) {
                return reject(err);
              }
              resolve(doc);
            });
          });
        };
      } else {
        obj[type] = function (uri, data, params, timeout, cb) {
          if (typeof uri === 'string') {
            return obj.request(uri, type, data, params, timeout, cb);
          }
          uri.type = type;
          return obj.request(uri, data);
        };
      }
    });
  };

  utils.preRequest = function (uri, type, data, params, timeout, cb) {
    // uri为对象时直接返回
    if (typeof uri !== 'string') {
      return {
        opts: uri,
        cb: type
      };
    }

    var opts = {
      uri: uri
    };

    var r = {
      opts: opts

      // 第2个参数可能为空，cb，timeout, data
    };if (type === undefined) {
      return r;
    }
    if (typeof type === 'function') {
      r.cb = type;
      return r;
    }
    if (typeof type === 'number') {
      return utils.preRequest(uri, null, null, null, type, data);
    } else if (type && (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
      return utils.preRequest(uri, null, type, data, params, timeout);
    } else if (typeof type === 'string') {
      opts.type = type;
    }

    // 第3个参数可能为空，cb，timeout, data
    if (data === undefined) {
      return r;
    }
    if (typeof data === 'function') {
      r.cb = data;
      return r;
    }
    if (typeof data === 'number') {
      return utils.preRequest(uri, type, null, null, data, params);
    } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      opts.data = data;
    }

    // 第4个参数可能为空，cb，timeout, params
    if (params === undefined) {
      return r;
    }
    if (typeof params === 'function') {
      r.cb = params;
      return r;
    }
    if (typeof params === 'number') {
      return utils.preRequest(uri, type, data, null, params, timeout);
    } else if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
      opts.params = params;
    }

    // 第5个参数可能为空，cb，timeout
    if (timeout === undefined) {
      return r;
    }
    if (typeof timeout === 'function') {
      r.cb = timeout;
      return r;
    }
    if (typeof timeout === 'number') {
      opts.timeout = timeout;
    }

    // 第6个参数可能为空，cb
    if (cb === undefined) {
      return r;
    }
    if (typeof cb === 'function') {
      r.cb = cb;
      return r;
    }

    return r;
  };

  exports.default = utils;
  module.exports = exports['default'];
},{"jm-utils":13}],8:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _locale = require('./locale');

    var _locale2 = _interopRequireDefault(_locale);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * common error defines
     *
     */
    var Err = {
      SUCCESS: {
        err: 0,
        msg: 'Success'
      },

      FAIL: {
        err: 1,
        msg: 'Fail'
      },

      FA_SYS: {
        err: 2,
        msg: 'System Error'
      },

      FA_NETWORK: {
        err: 3,
        msg: 'Network Error'
      },

      FA_PARAMS: {
        err: 4,
        msg: 'Parameter Error'
      },

      FA_BUSY: {
        err: 5,
        msg: 'Busy'
      },

      FA_TIMEOUT: {
        err: 6,
        msg: 'Time Out'
      },

      FA_ABORT: {
        err: 7,
        msg: 'Abort'
      },

      FA_NOTREADY: {
        err: 8,
        msg: 'Not Ready'
      },

      FA_NOTEXISTS: {
        err: 9,
        msg: 'Not Exists'
      },

      FA_EXISTS: {
        err: 8,
        msg: 'Already Exists'
      },

      OK: {
        err: 200,
        msg: 'OK'
      },

      FA_BADREQUEST: {
        err: 400,
        msg: 'Bad Request'
      },

      FA_NOAUTH: {
        err: 401,
        msg: 'Unauthorized'
      },

      FA_NOPERMISSION: {
        err: 403,
        msg: 'Forbidden'
      },

      FA_NOTFOUND: {
        err: 404,
        msg: 'Not Found'
      },

      FA_INTERNALERROR: {
        err: 500,
        msg: 'Internal Server Error'
      },

      FA_UNAVAILABLE: {
        err: 503,
        msg: 'Service Unavailable'
      }
    }; /**
     * err module.
     * @module err
     */

    Err.t = _locale2.default;

    /**
     * return message from template
     *
     * ```javascript
     * errMsg('sampe ${name} ${value}', {name: 'jeff', value: 123});
     * // return 'sample jeff 123'
     * ```
     *
     * @param {String} msg message template
     * @param {Object} opts params
     * @return {String} final message
     */
    var errMsg = function errMsg(msg, opts) {
      if (opts) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(opts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            msg = msg.split('${' + key + '}').join(opts[key]);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return msg;
    };

    /**
     * return an Error Object
     * @param {Object|String} E Err object or a message template
     * @param {Object} [opts] params
     * @return {Error}
     */
    var err = function err(E, opts) {
      if (typeof E === 'string') {
        E = {
          msg: E
        };
      }
      var msg = errMsg(E.msg, opts);
      var e = new Error(msg);
      E.err && (e.code = E.err);
      return e;
    };

    /**
     * enable Err Object, errMsg and err function for obj
     * @param {Object} obj target object
     * @param {String} [name] name to bind
     * @return {boolean}
     */
    var enableErr = function enableErr(obj) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';

      if (obj[name]) return false;
      obj[name] = Err;
      obj.err = err;
      obj.errMsg = errMsg;
      return true;
    };

    /**
     * disable Err Object, errMsg and err function for obj
     * @param {Object} obj target object
     * @param {String} [name] name to bind
     */
    var disableErr = function disableErr(obj) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Err';

      if (!obj[name]) return;
      delete obj[name];
      delete obj.err;
      delete obj.errMsg;
    };

    var $ = {
      Err: Err,
      errMsg: errMsg,
      err: err,
      enableErr: enableErr,
      disableErr: disableErr
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.enableErr) {
        enableErr(jm);
        for (var key in $) {
          jm[key] = $[key];
        }
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./locale":9}],9:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (msg, lng) {
    if (!lng || !lngs[lng]) return null;
    return lngs[lng][msg];
  };

  var _zh_CN = require('./zh_CN');

  var _zh_CN2 = _interopRequireDefault(_zh_CN);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var lngs = {
    zh_CN: _zh_CN2.default
  };

  /**
   * translate
   * @param {string} msg - msg to be translate
   * @param {string} lng - language
   * @return {String | null}
   */
  ;
  module.exports = exports['default'];
},{"./zh_CN":10}],10:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    'Success': '成功',
    'Fail': '失败',
    'System Error': '系统错误',
    'Network Error': '网络错误',
    'Parameter Error': '参数错误',
    'Busy': '忙',
    'Time Out': '超时',
    'Abort': '中止',
    'Not Ready': '未准备好',
    'Not Exists': '不存在',
    'Already Exists': '已存在',
    'OK': 'OK',
    'Bad Request': '错误请求',
    'Unauthorized': '未验证',
    'Forbidden': '无权限',
    'Not Found': '未找到',
    'Internal Server Error': '服务器内部错误',
    'Service Unavailable': '无效服务'
  };
  module.exports = exports['default'];
},{}],11:[function(require,module,exports){
  module.exports=require(2)
},{}],12:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * module.
     * @module module
     */

    /**
     * Class representing a modulable object.
     *
     */
    var Modulable = function () {

      /**
       * Create an modulable object.
       */
      function Modulable() {
        _classCallCheck(this, Modulable);

        this._modules = {};
      }

      /**
       * modules
       * @return {Object}
       */


      _createClass(Modulable, [{
        key: 'use',


        /**
         * use a module
         * @param {Function} fn module function
         * @param {Object} [opts] params
         * @param {Function} [cb] callback function
         * @return {Modulable} for chaining
         */
        value: function use(fn) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var m = fn.apply(this, args);
          if (m && m.name) {
            this._modules[m.name] = m;
          }
          return this;
        }

        /**
         * unuse a module
         * @param {Object|String} nameOrModule module or name to be unused
         * @return {Modulable} for chaining
         */

      }, {
        key: 'unuse',
        value: function unuse(nameOrModule) {
          var m = nameOrModule;
          if (typeof m === 'string') m = this._modules[m];
          if (m && m.unuse) {
            if (m.name) {
              delete this._modules[m.name];
            }
            m.unuse();
          }
          return this;
        }
      }, {
        key: 'modules',
        get: function get() {
          return this._modules;
        }
      }]);

      return Modulable;
    }();

    var prototype = Modulable.prototype;
    var M = {
      _modules: {},
      use: prototype.use,
      unuse: prototype.unuse
    };

    /**
     * enable modulable support for obj
     * @param {Object} obj target object
     * @return {boolean}
     */
    var enableModule = function enableModule(obj) {
      if (obj.use !== undefined) return false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(M)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          obj[key] = M[key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      obj._modules = {};

      Object.defineProperty(obj, 'modules', {
        value: obj._modules,
        writable: false
      });

      return true;
    };

    /**
     * disable modulable support for obj
     * @param {Object} obj target object
     */
    var disableModule = function disableModule(obj) {
      if (obj.use === undefined) return;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(M)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          delete obj[key];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    };

    var $ = {
      Modulable: Modulable,
      enableModule: enableModule,
      disableModule: disableModule
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.enableModule) {
        for (var key in $) {
          jm[key] = $[key];
        }enableModule(jm);
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var utils = {
      // 高效slice
      slice: function slice(a, start, end) {
        start = start || 0;
        end = end || a.length;
        if (start < 0) start += a.length;
        if (end < 0) end += a.length;
        var r = new Array(end - start);
        for (var i = start; i < end; i++) {
          r[i - start] = a[i];
        }
        return r;
      },

      formatJSON: function formatJSON(obj) {
        return JSON.stringify(obj, null, 2);
      },

      getUriProtocol: function getUriProtocol(uri) {
        if (!uri) return null;
        return uri.substring(0, uri.indexOf(':'));
      },

      getUriPath: function getUriPath(uri) {
        var idx = uri.indexOf('//');
        if (idx == -1) return '';
        idx = uri.indexOf('/', idx + 2);
        if (idx == -1) return '';
        uri = uri.substr(idx);
        idx = uri.indexOf('#');
        if (idx == -1) idx = uri.indexOf('?');
        if (idx != -1) uri = uri.substr(0, idx);
        return uri;
      }
    };

    var moduleUtils = function moduleUtils() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'utils';

      var app = this;
      app[name] = utils;

      return {
        name: name,
        unuse: function unuse() {
          delete app[name];
        }
      };
    };

    var $ = {
      utils: utils,
      moduleUtils: moduleUtils
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.utils) {
        for (var key in $) {
          jm[key] = $[key];
        }
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
  var isarray = require('isarray')

  /**
   * Expose `pathToRegexp`.
   */
  module.exports = pathToRegexp
  module.exports.parse = parse
  module.exports.compile = compile
  module.exports.tokensToFunction = tokensToFunction
  module.exports.tokensToRegExp = tokensToRegExp

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g')

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */
  function parse (str, options) {
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var defaultDelimiter = options && options.delimiter || '/'
    var res

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0]
      var escaped = res[1]
      var offset = res.index
      path += str.slice(index, offset)
      index = offset + m.length

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1]
        continue
      }

      var next = str[index]
      var prefix = res[2]
      var name = res[3]
      var capture = res[4]
      var group = res[5]
      var modifier = res[6]
      var asterisk = res[7]

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path)
        path = ''
      }

      var partial = prefix != null && next != null && next !== prefix
      var repeat = modifier === '+' || modifier === '*'
      var optional = modifier === '?' || modifier === '*'
      var delimiter = res[2] || defaultDelimiter
      var pattern = capture || group

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
      })
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index)
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path)
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */
  function compile (str, options) {
    return tokensToFunction(parse(str, options))
  }

  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeURIComponentPretty (str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */
  function encodeAsterisk (str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length)

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
      }
    }

    return function (obj, opts) {
      var path = ''
      var data = obj || {}
      var options = opts || {}
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
          path += token

          continue
        }

        var value = data[token.name]
        var segment

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix
            }

            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j])

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment
          }

          continue
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value)

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */
  function flags (options) {
    return options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g)

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        })
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = []

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source)
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */
  function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */
  function tokensToRegExp (tokens, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options)
      keys = []
    }

    options = options || {}

    var strict = options.strict
    var end = options.end !== false
    var route = ''

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        route += escapeString(token)
      } else {
        var prefix = escapeString(token.prefix)
        var capture = '(?:' + token.pattern + ')'

        keys.push(token)

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*'
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?'
          } else {
            capture = prefix + '(' + capture + ')?'
          }
        } else {
          capture = prefix + '(' + capture + ')'
        }

        route += capture
      }
    }

    var delimiter = escapeString(options.delimiter || '/')
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
    }

    if (end) {
      route += '$'
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys)
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */
  function pathToRegexp (path, keys, options) {
    if (!isarray(keys)) {
      options = /** @type {!Object} */ (keys || options)
      keys = []
    }

    options = options || {}

    if (path instanceof RegExp) {
      return regexpToRegexp(path, /** @type {!Array} */ (keys))
    }

    if (isarray(path)) {
      return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
    }

    return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
  }

},{"isarray":15}],15:[function(require,module,exports){
  module.exports = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

},{}],16:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _browser = require('jm-ajax/lib/browser');

  var _browser2 = _interopRequireDefault(_browser);

  var _fnclient = require('../fnclient');

  var _fnclient2 = _interopRequireDefault(_fnclient);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var client = (0, _fnclient2.default)(_browser2.default);

  exports.default = client;
  module.exports = exports['default'];
},{"../fnclient":18,"jm-ajax/lib/browser":19}],17:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _client = require('./client');

    var _client2 = _interopRequireDefault(_client);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    var moduleClient = function moduleClient() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-http-client';

      var app = this;
      app.clientModules.http = _client2.default;
      app.clientModules.https = _client2.default;

      return {
        name: name,
        unuse: function unuse() {
          delete app.clientModules.http;
        }
      };
    };

    var $ = {
      moduleClient: moduleClient
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (jm.ms) {
        for (var key in $) {
          jm.ms.root.use($[key]);
        }
      }
    }

    $.client = _client2.default;
    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./client":16}],18:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jmEvent = require('jm-event');

  var _jmEvent2 = _interopRequireDefault(_jmEvent);

  var _utils = require('jm-ms-core/lib/utils');

  var _utils2 = _interopRequireDefault(_utils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var defaultPort = 3000;
  var defaultUri = 'http://localhost:' + defaultPort;

  var fnclient = function fnclient(ajax) {
    var $ = {};
    ajax.enableAjax($);

    return function () {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var err = null;
      var doc = null;
      var uri = opts.uri || defaultUri;
      var timeout = opts.timeout || 0;

      doc = {
        request: function request(opts, cb) {
          var r = _utils2.default.preRequest.apply(this, arguments);
          opts = r.opts;
          cb = r.cb;
          var type = opts.type || 'get';
          var headers = opts.headers || {};
          var noHeaders = ['host', 'if-none-match', 'content-type', 'content-length', 'connection'];
          noHeaders.forEach(function (key) {
            if (headers[key]) delete headers[key];
          });
          if (opts.ips) {
            headers['x-forwarded-for'] = opts.ips.toString();
          }
          if (opts.lng) {
            headers['lng'] = opts.lng;
          }

          $[type]({
            url: uri + opts.uri,
            timeout: opts.timeout || timeout,
            data: opts.data,
            headers: headers
          }, r.cb);
        }
      };
      _jmEvent2.default.enableEvent(doc);

      if (cb) cb(err, doc);
      doc.emit('open');
    };
  };

  exports.default = fnclient;
  module.exports = exports['default'];
},{"jm-event":2,"jm-ms-core/lib/utils":7}],19:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _enableajax = require('./enableajax');

    var _enableajax2 = _interopRequireDefault(_enableajax);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    var $ = {};
    (function ($) {
      var utils = {
        extend: function extend(o) {
          utils.each(Array.prototype.slice.call(arguments, 1), function (a) {
            for (var p in a) {
              if (a[p] !== void 0) o[p] = a[p];
            }
          });
          return o;
        },

        each: function each(o, fn, ctx) {
          if (o === null) return;
          if (nativeForEach && o.forEach === nativeForEach) {
            o.forEach(fn, ctx);
          } else if (o.length === +o.length) {
            for (var i = 0, l = o.length; i < l; i++) {
              if (i in o && fn.call(ctx, o[i], i, o) === breaker) return;
            }
          } else {
            for (var key in o) {
              if (hasOwnProperty.call(o, key)) {
                if (fn.call(ctx, o[key], key, o) === breaker) return;
              }
            }
          }
        }

      };

      var Ajax = {};
      var nativeForEach = Array.prototype.forEach;
      var _extend = utils.extend;

      Ajax.xhr = function () {
        return new XMLHttpRequest();
      };
      Ajax._xhrResp = function (xhr) {
        switch (xhr.getResponseHeader('Content-Type').split(';')[0]) {
          case 'text/xml':
            return xhr.responseXML;
          case 'text/json':
          case 'application/json':
          case 'text/javascript':
          case 'application/javascript':
          case 'application/x-javascript':
            return JSON.parse(xhr.responseText);
          default:
            return xhr.responseText;
        }
      };
      Ajax._formData = function (o) {
        var kvps = [];
        var regEx = /%20/g;
        for (var k in o) {
          if (o[k] != undefined && o[k] != null) {
            kvps.push(encodeURIComponent(k).replace(regEx, '+') + '=' + encodeURIComponent(o[k].toString()).replace(regEx, '+'));
          }
        }
        return kvps.join('&');
      };
      Ajax.ajax = function (o) {
        var xhr = Ajax.xhr();
        var timer = null;
        var n = 0;
        if (typeof xhr.open !== 'function') return;
        o = _extend({
          userAgent: 'XMLHttpRequest',
          lang: 'en',
          type: 'GET',
          data: null,
          contentType: 'application/x-www-form-urlencoded'
        }, o);
        if (o.timeout) {
          timer = setTimeout(function () {
            o.error.timeout = true;
            xhr.abort();
            if (o.timeoutFn) o.timeoutFn(o.url);
          }, o.timeout);
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (timer != null) {
              clearTimeout(timer);
              timer = null;
            }
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
              if (o.success) o.success(Ajax._xhrResp(xhr));
            } else if (o.error) o.error(xhr, xhr.status, xhr.statusText);
            if (o.complete) o.complete(Ajax._xhrResp(xhr), xhr, xhr.statusText);
          } else if (o.progress) o.progress(++n);
        };
        var url = o.url;
        var data = null;
        o.type = (o.type || 'GET').toUpperCase();
        var isPost = o.type === 'POST' || o.type === 'PUT';
        if (!isPost && o.data) url += '?' + Ajax._formData(o.data);
        xhr.open(o.type, url);
        if (o.headers) {
          for (var key in o.headers) {
            o.headers[key] && xhr.setRequestHeader(key, o.headers[key]);
          }
        }
        if (isPost) {
          var isJson = o.contentType.indexOf('json') >= 0;
          data = isJson ? JSON.stringify(o.data) : Ajax._formData(o.data);
          xhr.setRequestHeader('Content-Type', isJson ? 'application/json' : 'application/x-www-form-urlencoded');
        }
        if (data) {
          xhr.send(data);
        } else {
          xhr.send();
        }
      };
      $.ajax = Ajax.ajax;
    })($);

    $.enableAjax = (0, _enableajax2.default)($);

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.ajax) {
        jm.ajax = $.ajax;
        jm.enableAjax = $.enableAjax;
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./enableajax":20}],20:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function ($) {
    return function (obj) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var types = opts.types || ['get', 'post', 'put', 'delete'];
      var timeout = opts.timeout || 0;
      if (!Array.isArray(types)) {
        types = [types];
      }
      types.forEach(function (method) {
        if (typeof Promise !== 'undefined') {
          obj[method] = function (opts, cb) {
            if (cb) {
              this[method](opts).then(function (doc) {
                cb(null, doc);
              }).catch(function (err) {
                cb(err);
              });
              return this;
            }
            return new Promise(function (resolve, reject) {
              var params = {};
              for (var key in opts) {
                params[key] = opts[key];
              }
              params.type = method.toUpperCase();
              params.contentType = params.contentType || 'application/json';
              params.dataType = params.dataType || 'json';
              params.timeout = params.timeout || timeout;
              params.success = params.success || function (doc) {
                if (doc && doc.err) {
                  var s = method.toUpperCase() + ' ' + opts.url;
                  logger.debug(s + ' failed. request: ' + JSON.stringify(opts) + ' response: ' + JSON.stringify(doc));
                }
                resolve(doc);
              };
              params.error = params.error || function (XMLHttpRequest, textStatus, errorThrown) {
                var s = method.toUpperCase() + ' ' + opts.url;
                if (params.error.timeout) {
                  errorThrown = new Error(Err.FA_TIMEOUT.msg);
                  errorThrown.code = Err.FA_TIMEOUT.err;
                }
                errorThrown || (errorThrown = new Error(s));
                logger.debug(s + ' failed. request: ' + JSON.stringify(opts));
                reject(errorThrown);
              };
              $.ajax(params);
            });
          };
        } else {
          obj[method] = function (opts, cb) {
            var params = {};
            for (var key in opts) {
              params[key] = opts[key];
            }
            params.type = method.toUpperCase();
            params.contentType = params.contentType || 'application/json';
            params.dataType = params.dataType || 'json';
            params.timeout = params.timeout || timeout;
            params.success = params.success || function (doc) {
              if (!cb) return;
              if (doc && doc.err) {
                var s = method.toUpperCase() + ' ' + opts.url;
                logger.debug(s + ' failed. request: ' + JSON.stringify(opts) + ' response: ' + JSON.stringify(doc));
              }
              cb(null, doc);
            };
            params.error = params.error || function (XMLHttpRequest, textStatus, errorThrown) {
              var s = method.toUpperCase() + ' ' + opts.url;
              var doc = Err.FA_NETWORK;
              if (params.error.timeout) {
                errorThrown = new Error(Err.FA_TIMEOUT.msg);
                errorThrown.code = Err.FA_TIMEOUT.err;
                doc = Err.FA_TIMEOUT;
              }
              errorThrown || (errorThrown = new Error(s));
              logger.debug(s + ' failed. request: ' + JSON.stringify(opts) + ' response: ' + JSON.stringify(doc));
              if (cb) cb(errorThrown, doc);
            };
            $.ajax(params);
          };
        }
      });
    };
  };

  var _jmErr = require('jm-err');

  var _jmErr2 = _interopRequireDefault(_jmErr);

  var _jmLogger = require('jm-logger');

  var _jmLogger2 = _interopRequireDefault(_jmLogger);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Err = _jmErr2.default.Err;
  var logger = _jmLogger2.default.getLogger('jm-ajax');

  /**
   * 为obj对象增加快捷ajax接口
   * @param {Object} obj 对象
   * @param {Object} [opts={}] 参数
   * @example
   * opts参数:{
         *  types: 支持的请求类型, 默认['get', 'post', 'put', 'delete']
         *  timeout: 设置默认超时检测, 单位毫秒, 默认0代表不检测超时
         * }
   */
  ;
  module.exports = exports['default'];
},{"jm-err":21,"jm-logger":24}],21:[function(require,module,exports){
  module.exports=require(8)
},{"./locale":22}],22:[function(require,module,exports){
  module.exports=require(9)
},{"./zh_CN":23}],23:[function(require,module,exports){
  module.exports=require(10)
},{}],24:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /**
     * logger module.
     * @module logger
     */

    var getLogger = function getLogger(loggerCategoryName) {
      console.debug || (console.debug = console.log);
      return console;
    };

    var moduleLogger = function moduleLogger() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'logger';

      var obj = this;
      obj.getLogger = getLogger;
      obj.logger = getLogger();
      return {
        name: name,
        unuse: function unuse() {
          delete obj.logger;
          delete obj.getLogger;
        }
      };
    };

    var $ = {
      logger: getLogger(),
      getLogger: getLogger,
      moduleLogger: moduleLogger
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (!jm.logger) {
        for (var key in $) {
          jm[key] = $[key];
        }
      }
    }

    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _fnclient = require('../fnclient');

  var _fnclient2 = _interopRequireDefault(_fnclient);

  var _ws = require('./ws');

  var _ws2 = _interopRequireDefault(_ws);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var client = (0, _fnclient2.default)(_ws2.default);
  exports.default = client;
  module.exports = exports['default'];
},{"../fnclient":28,"./ws":27}],26:[function(require,module,exports){
  (function (global){
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _client = require('./client');

    var _client2 = _interopRequireDefault(_client);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    var moduleClient = function moduleClient() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ms-ws-client';

      var app = this;
      app.clientModules.ws = _client2.default;

      return {
        name: name,
        unuse: function unuse() {
          delete app.clientModules.ws;
        }
      };
    };

    var $ = {
      moduleClient: moduleClient
    };

    if (typeof global !== 'undefined' && global) {
      global.jm || (global.jm = {});
      var jm = global.jm;
      if (jm.ms) {
        for (var key in $) {
          jm.ms.root.use($[key]);
        }
      }
    }

    $.client = _client2.default;
    exports.default = $;
    module.exports = exports['default'];
  }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./client":25}],27:[function(require,module,exports){
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (uri, onmessage) {
    var ws = new WebSocket(uri);
    ws.onmessage = function (event) {
      onmessage(event.data);
    };
    return ws;
  };

  ;
  module.exports = exports["default"];
},{}],28:[function(require,module,exports){
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jmEvent = require('jm-event');

  var _jmEvent2 = _interopRequireDefault(_jmEvent);

  var _utils = require('jm-ms-core/lib/utils');

  var _utils2 = _interopRequireDefault(_utils);

  var _jmErr = require('jm-err');

  var _jmErr2 = _interopRequireDefault(_jmErr);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var Err = _jmErr2.default.Err;

  var MAXID = 999999;
  var defaultPort = 3100;
  var defaultUri = 'ws://localhost:' + defaultPort;
  var errNetwork = _jmErr2.default.err(Err.FA_NETWORK);

  var fnclient = function fnclient(fnCreateWS) {
    return function () {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var err = null;
      var doc = null;
      var uri = opts.uri || defaultUri;
      var timeout = opts.timeout || 0;
      var id = 0;
      var cbs = {};
      var path = _utils2.default.getUriPath(uri);
      var prefix = opts.prefix || '';
      prefix = path + prefix;
      var ws = null;
      var connected = false;
      var autoReconnect = true;
      if (opts.reconnect === false) autoReconnect = false;
      var reconnectTimer = null;
      var reconnect = false;
      var reconnectAttempts = 0;
      var reconnectionDelay = opts.reconnectionDelay || 5000;
      var DEFAULT_MAX_RECONNECT_ATTEMPTS = 0; // 默认重试次数0 表示无限制
      var maxReconnectAttempts = opts.maxReconnectAttempts || DEFAULT_MAX_RECONNECT_ATTEMPTS;

      doc = {
        request: function request(opts, cb) {
          var r = _utils2.default.preRequest.apply(this, arguments);
          opts = r.opts;
          cb = r.cb;
          if (!connected) return cb(errNetwork, Err.FA_NETWORK);
          opts.uri = prefix + (opts.uri || '');
          if (cb) {
            if (id >= MAXID) id = 0;
            id++;
            cbs[id] = cb;
            opts.id = id;
          }
          ws.send(JSON.stringify(opts));
        },

        close: function close() {
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
          };
          reconnect = false;
          reconnectAttempts = 0;
          if (!connected) return;
          ws.close();
          ws = null;
        }
      };
      _jmEvent2.default.enableEvent(doc);

      var onmessage = function onmessage(message) {
        doc.emit('message', message);
        var json = null;
        try {
          json = JSON.parse(message);
        } catch (err) {
          return;
        }
        if (json.id) {
          if (cbs[json.id]) {
            var _err = null;
            var _doc = json.data;
            if (_doc.err) {
              _err = new Error(_doc.msg);
            }
            cbs[json.id](_err, _doc);
            delete cbs[json.id];
          }
        }
      };

      doc.connect = function () {
        if (connected) return;
        doc.emit('connect', uri);
        var self = doc;
        var onopen = function onopen(event) {
          connected = true;
          if (!!reconnect) {
            self.emit('reconnect');
          }
          self.emit('open', event);
        };
        var onclose = function onclose(event) {
          connected = false;
          self.emit('close', event);
          if (!!autoReconnect && (!maxReconnectAttempts || reconnectAttempts < maxReconnectAttempts)) {
            reconnect = true;
            reconnectAttempts++;
            reconnectTimer = setTimeout(function () {
              reconnectTimer = null;
              self.connect();
            }, reconnectionDelay);
          }
        };
        var onerror = function onerror(event) {
          doc.emit('error', event);
        };
        ws = fnCreateWS(uri, onmessage);
        ws.onopen = onopen;
        ws.onerror = onerror;
        ws.onclose = onclose;
      };

      doc.connect();
      if (cb) cb(err, doc);
    };
  };

  exports.default = fnclient;
  module.exports = exports['default'];
},{"jm-err":29,"jm-event":32,"jm-ms-core/lib/utils":7}],29:[function(require,module,exports){
  module.exports=require(8)
},{"./locale":30}],30:[function(require,module,exports){
  module.exports=require(9)
},{"./zh_CN":31}],31:[function(require,module,exports){
  module.exports=require(10)
},{}],32:[function(require,module,exports){
  module.exports=require(2)
},{}]},{},[1])

export default jm
