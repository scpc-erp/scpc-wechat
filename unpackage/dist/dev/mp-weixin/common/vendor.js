(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!***********************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/pages.json ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    packName = uni.getAccountInfoSync().miniProgram.appId || '';
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23320190923002","_inBundle":false,"_integrity":"sha512-MnftsvgOac3q1FCOBPzivbFn8GNQFo7D2DY325HeEZyFCWgx5GEwHpGYjT1PQU6v7DaDn0ruxa3ObdpUIYbmZw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23320190923002.tgz","_shasum":"0c400c140ca0b3c05f52d25f11583cf05a0c4e9a","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"fed4c73fb9142a1b277dd79313939cad90693d3e","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23320190923002"};

/***/ }),
/* 7 */
/*!****************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/pages.json?{"type":"style"} ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/login/login": { "navigationStyle": "custom" }, "pages/task/task": { "navigationBarTitleText": "今日任务", "enablePullDownRefresh": true }, "pages/task/taskDesc": { "navigationBarTitleText": "任务详情" }, "pages/mine/mine": { "navigationBarTitleText": "我的" } }, "globalStyle": { "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#27B39D", "backgroundColor": "#27B39D" } };exports.default = _default;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/pages.json?{"type":"stat"} ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__A0DE0D1" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */
/*!***************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/store/index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    /**
            * 是否需要强制登录
            */
    forcedLogin: false,
    hasLogin: false,
    userName: "" },

  mutations: {
    login: function login(state, userName) {
      state.userName = userName || '新用户';
      state.hasLogin = true;
    },
    logout: function logout(state) {
      state.userName = "";
      state.hasLogin = false;
    } } });var _default =



store;exports.default = _default;

/***/ }),
/* 16 */
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 24);


/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 25);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),
/* 25 */
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),
/* 26 */
/*!*******************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/util/md5.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_RESULT__; /**
               * [js-md5]{@link https://github.com/emn178/js-md5}
               *
               * @namespace md5
               * @version 0.7.3
               * @author Chen, Yi-Cyuan [emn178@gmail.com]
               * @copyright Chen, Yi-Cyuan 2014-2017
               * @license MIT
               */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_MD5_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD =  true && __webpack_require__(/*! !webpack amd options */ 29);
  var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
  var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  var blocks = [],buffer8;
  if (ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
  /**
         * @method digest
         * @memberof md5
         * @description Output hash as bytes array
         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
         * @returns {Array} Bytes array
         * @example
         * md5.digest('The quick brown fox jumps over the lazy dog');
         */
  /**
             * @method array
             * @memberof md5
             * @description Output hash as bytes array
             * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
             * @returns {Array} Bytes array
             * @example
             * md5.array('The quick brown fox jumps over the lazy dog');
             */
  /**
                 * @method arrayBuffer
                 * @memberof md5
                 * @description Output hash as ArrayBuffer
                 * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                 * @returns {ArrayBuffer} ArrayBuffer
                 * @example
                 * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
                 */
  /**
                     * @method buffer
                     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
                     * @memberof md5
                     * @description Output hash as ArrayBuffer
                     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                     * @returns {ArrayBuffer} ArrayBuffer
                     * @example
                     * md5.buffer('The quick brown fox jumps over the lazy dog');
                     */
  /**
                         * @method base64
                         * @memberof md5
                         * @description Output hash as base64 string
                         * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
                         * @returns {String} base64 string
                         * @example
                         * md5.base64('The quick brown fox jumps over the lazy dog');
                         */
  var createOutputMethod = function createOutputMethod(outputType) {
    return function (message) {
      return new Md5(true).update(message)[outputType]();
    };
  };

  /**
      * @method create
      * @memberof md5
      * @description Create Md5 object
      * @returns {Md5} Md5 object.
      * @example
      * var hash = md5.create();
      */
  /**
          * @method update
          * @memberof md5
          * @description Create and update Md5 object
          * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
          * @returns {Md5} Md5 object.
          * @example
          * var hash = md5.update('The quick brown fox jumps over the lazy dog');
          * // equal to
          * var hash = md5.create();
          * hash.update('The quick brown fox jumps over the lazy dog');
          */
  var createMethod = function createMethod() {
    var method = createOutputMethod('hex');
    if (NODE_JS) {
      method = nodeWrap(method);
    }
    method.create = function () {
      return new Md5();
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type);
    }
    return method;
  };

  var nodeWrap = function nodeWrap(method) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var nodeMethod = function nodeMethod(message) {
      if (typeof message === 'string') {
        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw ERROR;
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
      message.constructor === Buffer) {
        return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  /**
      * Md5 class
      * @class Md5
      * @description This is internal class.
      * @see {@link md5.create}
      */
  function Md5(sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
      this.buffer8 = buffer8;
    } else {
      if (ARRAY_BUFFER) {
        var buffer = new ArrayBuffer(68);
        this.buffer8 = new Uint8Array(buffer);
        this.blocks = new Uint32Array(buffer);
      } else {
        this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    }
    this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
  }

  /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
  Md5.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }

    var notString,type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw ERROR;
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw ERROR;
          }
        }
      } else {
        throw ERROR;
      }
      notString = true;
    }
    var code,index = 0,i,length = message.length,blocks = this.blocks;
    var buffer8 = this.buffer8;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if (ARRAY_BUFFER) {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              buffer8[i++] = code;
            } else if (code < 0x800) {
              buffer8[i++] = 0xc0 | code >> 6;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else if (code < 0xd800 || code >= 0xe000) {
              buffer8[i++] = 0xe0 | code >> 12;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              buffer8[i++] = 0xf0 | code >> 18;
              buffer8[i++] = 0x80 | code >> 12 & 0x3f;
              buffer8[i++] = 0x80 | code >> 6 & 0x3f;
              buffer8[i++] = 0x80 | code & 0x3f;
            }
          }
        } else {
          for (i = this.start; index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | code >> 6) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | code >> 12) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + ((code & 0x3ff) << 10 | message.charCodeAt(++index) & 0x3ff);
              blocks[i >> 2] |= (0xf0 | code >> 18) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 12 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code >> 6 & 0x3f) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | code & 0x3f) << SHIFT[i++ & 3];
            }
          }
        }
      }
      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Md5.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks,i = this.lastByteIndex;
    blocks[i >> 2] |= EXTRA[i & 3];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.bytes << 3;
    blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
    this.hash();
  };

  Md5.prototype.hash = function () {
    var a,b,c,d,bc,da,blocks = this.blocks;

    if (this.first) {
      a = blocks[0] - 680876937;
      a = (a << 7 | a >>> 25) - 271733879 << 0;
      d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
      d = (d << 12 | d >>> 20) + a << 0;
      c = (-271733879 ^ d & (a ^ -271733879)) + blocks[2] - 1126478375;
      c = (c << 17 | c >>> 15) + d << 0;
      b = (a ^ c & (d ^ a)) + blocks[3] - 1316259209;
      b = (b << 22 | b >>> 10) + c << 0;
    } else {
      a = this.h0;
      b = this.h1;
      c = this.h2;
      d = this.h3;
      a += (d ^ b & (c ^ d)) + blocks[0] - 680876936;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ a & (b ^ c)) + blocks[1] - 389564586;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ d & (a ^ b)) + blocks[2] + 606105819;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ c & (d ^ a)) + blocks[3] - 1044525330;
      b = (b << 22 | b >>> 10) + c << 0;
    }

    a += (d ^ b & (c ^ d)) + blocks[4] - 176418897;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[5] + 1200080426;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[6] - 1473231341;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[7] - 45705983;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[8] + 1770035416;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[9] - 1958414417;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[10] - 42063;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[11] - 1990404162;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (d ^ b & (c ^ d)) + blocks[12] + 1804603682;
    a = (a << 7 | a >>> 25) + b << 0;
    d += (c ^ a & (b ^ c)) + blocks[13] - 40341101;
    d = (d << 12 | d >>> 20) + a << 0;
    c += (b ^ d & (a ^ b)) + blocks[14] - 1502002290;
    c = (c << 17 | c >>> 15) + d << 0;
    b += (a ^ c & (d ^ a)) + blocks[15] + 1236535329;
    b = (b << 22 | b >>> 10) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[1] - 165796510;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[6] - 1069501632;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[11] + 643717713;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[0] - 373897302;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[5] - 701558691;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[10] + 38016083;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[15] - 660478335;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[4] - 405537848;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[9] + 568446438;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[14] - 1019803690;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[3] - 187363961;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[8] + 1163531501;
    b = (b << 20 | b >>> 12) + c << 0;
    a += (c ^ d & (b ^ c)) + blocks[13] - 1444681467;
    a = (a << 5 | a >>> 27) + b << 0;
    d += (b ^ c & (a ^ b)) + blocks[2] - 51403784;
    d = (d << 9 | d >>> 23) + a << 0;
    c += (a ^ b & (d ^ a)) + blocks[7] + 1735328473;
    c = (c << 14 | c >>> 18) + d << 0;
    b += (d ^ a & (c ^ d)) + blocks[12] - 1926607734;
    b = (b << 20 | b >>> 12) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[5] - 378558;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[8] - 2022574463;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[11] + 1839030562;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[14] - 35309556;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[1] - 1530992060;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[4] + 1272893353;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[7] - 155497632;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[10] - 1094730640;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[13] + 681279174;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[0] - 358537222;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[3] - 722521979;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[6] + 76029189;
    b = (b << 23 | b >>> 9) + c << 0;
    bc = b ^ c;
    a += (bc ^ d) + blocks[9] - 640364487;
    a = (a << 4 | a >>> 28) + b << 0;
    d += (bc ^ a) + blocks[12] - 421815835;
    d = (d << 11 | d >>> 21) + a << 0;
    da = d ^ a;
    c += (da ^ b) + blocks[15] + 530742520;
    c = (c << 16 | c >>> 16) + d << 0;
    b += (da ^ c) + blocks[2] - 995338651;
    b = (b << 23 | b >>> 9) + c << 0;
    a += (c ^ (b | ~d)) + blocks[0] - 198630844;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[5] - 57434055;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[10] - 1051523;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[15] - 30611744;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
    b = (b << 21 | b >>> 11) + c << 0;
    a += (c ^ (b | ~d)) + blocks[4] - 145523070;
    a = (a << 6 | a >>> 26) + b << 0;
    d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
    d = (d << 10 | d >>> 22) + a << 0;
    c += (a ^ (d | ~b)) + blocks[2] + 718787259;
    c = (c << 15 | c >>> 17) + d << 0;
    b += (d ^ (c | ~a)) + blocks[9] - 343485551;
    b = (b << 21 | b >>> 11) + c << 0;

    if (this.first) {
      this.h0 = a + 1732584193 << 0;
      this.h1 = b - 271733879 << 0;
      this.h2 = c - 1732584194 << 0;
      this.h3 = d + 271733878 << 0;
      this.first = false;
    } else {
      this.h0 = this.h0 + a << 0;
      this.h1 = this.h1 + b << 0;
      this.h2 = this.h2 + c << 0;
      this.h3 = this.h3 + d << 0;
    }
  };

  /**
      * @method hex
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.hex();
      */
  Md5.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;

    return HEX_CHARS[h0 >> 4 & 0x0F] + HEX_CHARS[h0 & 0x0F] +
    HEX_CHARS[h0 >> 12 & 0x0F] + HEX_CHARS[h0 >> 8 & 0x0F] +
    HEX_CHARS[h0 >> 20 & 0x0F] + HEX_CHARS[h0 >> 16 & 0x0F] +
    HEX_CHARS[h0 >> 28 & 0x0F] + HEX_CHARS[h0 >> 24 & 0x0F] +
    HEX_CHARS[h1 >> 4 & 0x0F] + HEX_CHARS[h1 & 0x0F] +
    HEX_CHARS[h1 >> 12 & 0x0F] + HEX_CHARS[h1 >> 8 & 0x0F] +
    HEX_CHARS[h1 >> 20 & 0x0F] + HEX_CHARS[h1 >> 16 & 0x0F] +
    HEX_CHARS[h1 >> 28 & 0x0F] + HEX_CHARS[h1 >> 24 & 0x0F] +
    HEX_CHARS[h2 >> 4 & 0x0F] + HEX_CHARS[h2 & 0x0F] +
    HEX_CHARS[h2 >> 12 & 0x0F] + HEX_CHARS[h2 >> 8 & 0x0F] +
    HEX_CHARS[h2 >> 20 & 0x0F] + HEX_CHARS[h2 >> 16 & 0x0F] +
    HEX_CHARS[h2 >> 28 & 0x0F] + HEX_CHARS[h2 >> 24 & 0x0F] +
    HEX_CHARS[h3 >> 4 & 0x0F] + HEX_CHARS[h3 & 0x0F] +
    HEX_CHARS[h3 >> 12 & 0x0F] + HEX_CHARS[h3 >> 8 & 0x0F] +
    HEX_CHARS[h3 >> 20 & 0x0F] + HEX_CHARS[h3 >> 16 & 0x0F] +
    HEX_CHARS[h3 >> 28 & 0x0F] + HEX_CHARS[h3 >> 24 & 0x0F];
  };

  /**
      * @method toString
      * @memberof Md5
      * @instance
      * @description Output hash as hex string
      * @returns {String} Hex string
      * @see {@link md5.hex}
      * @example
      * hash.toString();
      */
  Md5.prototype.toString = Md5.prototype.hex;

  /**
                                               * @method digest
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as bytes array
                                               * @returns {Array} Bytes array
                                               * @see {@link md5.digest}
                                               * @example
                                               * hash.digest();
                                               */
  Md5.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0,h1 = this.h1,h2 = this.h2,h3 = this.h3;
    return [
    h0 & 0xFF, h0 >> 8 & 0xFF, h0 >> 16 & 0xFF, h0 >> 24 & 0xFF,
    h1 & 0xFF, h1 >> 8 & 0xFF, h1 >> 16 & 0xFF, h1 >> 24 & 0xFF,
    h2 & 0xFF, h2 >> 8 & 0xFF, h2 >> 16 & 0xFF, h2 >> 24 & 0xFF,
    h3 & 0xFF, h3 >> 8 & 0xFF, h3 >> 16 & 0xFF, h3 >> 24 & 0xFF];

  };

  /**
      * @method array
      * @memberof Md5
      * @instance
      * @description Output hash as bytes array
      * @returns {Array} Bytes array
      * @see {@link md5.array}
      * @example
      * hash.array();
      */
  Md5.prototype.array = Md5.prototype.digest;

  /**
                                               * @method arrayBuffer
                                               * @memberof Md5
                                               * @instance
                                               * @description Output hash as ArrayBuffer
                                               * @returns {ArrayBuffer} ArrayBuffer
                                               * @see {@link md5.arrayBuffer}
                                               * @example
                                               * hash.arrayBuffer();
                                               */
  Md5.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(16);
    var blocks = new Uint32Array(buffer);
    blocks[0] = this.h0;
    blocks[1] = this.h1;
    blocks[2] = this.h2;
    blocks[3] = this.h3;
    return buffer;
  };

  /**
      * @method buffer
      * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
      * @memberof Md5
      * @instance
      * @description Output hash as ArrayBuffer
      * @returns {ArrayBuffer} ArrayBuffer
      * @see {@link md5.buffer}
      * @example
      * hash.buffer();
      */
  Md5.prototype.buffer = Md5.prototype.arrayBuffer;

  /**
                                                     * @method base64
                                                     * @memberof Md5
                                                     * @instance
                                                     * @description Output hash as base64 string
                                                     * @returns {String} base64 string
                                                     * @see {@link md5.base64}
                                                     * @example
                                                     * hash.base64();
                                                     */
  Md5.prototype.base64 = function () {
    var v1,v2,v3,base64Str = '',bytes = this.array();
    for (var i = 0; i < 15;) {
      v1 = bytes[i++];
      v2 = bytes[i++];
      v3 = bytes[i++];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
      BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
      BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
      BASE64_ENCODE_CHAR[v3 & 63];
    }
    v1 = bytes[i];
    base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
    BASE64_ENCODE_CHAR[v1 << 4 & 63] +
    '==';
    return base64Str;
  };

  var exports = createMethod();

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    /**
           * @method md5
           * @description Md5 hash function, export to global in browsers.
           * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
           * @returns {String} md5 hashes
           * @example
           * md5(''); // d41d8cd98f00b204e9800998ecf8427e
           * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
           * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
           *
           * // It also supports UTF-8 encoding
           * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
           *
           * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
           * md5([]); // d41d8cd98f00b204e9800998ecf8427e
           * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
           */
    root.md5 = exports;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return exports;
      }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 27), __webpack_require__(/*! ./../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3)))

/***/ }),
/* 27 */
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
	setTimeout(fn, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 28);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),
/* 28 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 27)))

/***/ }),
/* 29 */
/*!****************************************!*\
  !*** (webpack)/buildin/amd-options.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 30 */
/*!******************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/img/login/Login-bg.png ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 31 */
/*!**************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/service/service.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _index = _interopRequireDefault(__webpack_require__(/*! ../util/request/index.js */ 32));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
// 管理账号信息
var USERS_KEY = 'USERS_KEY';
var STATE_KEY = 'STATE_KEY';

/***************************************** 用户 ******************************************/
// 用户
var login = function login(user_name, user_pwd, user_icon, wechat_code) {
  return _index.default.ajax('/wechat/user/login', { username: user_name, password: user_pwd, wxavatar: user_icon, wxcode: wechat_code });
};

/***************************************** 任务模块 ******************************************/
// 任务列表
var taskList = function taskList(params) {
  return _index.default.ajax('/tableData/queryTableData', params, 'GET');
};

// 任务列表搜索
var taskListSearch = function taskListSearch(params) {
  return _index.default.ajax('/tableData/queryTableData', params, 'GET');
};

// 获取客户列表
var _default = {
  login: login,
  taskList: taskList,
  taskListSearch: taskListSearch };exports.default = _default;

/***/ }),
/* 32 */
/*!*****************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/util/request/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _index = _interopRequireDefault(__webpack_require__(/*! ../../../store/index */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var request = {};

var headers = {
  'Content-Type': 'application/x-www-form-urlencoded' };


var PORT1 = '/baseinfo';

var BASE_URL =  true ? 'http://192.168.0.116:8360' : undefined;

request.ajax = function (url, data) {var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';var power = arguments.length > 3 ? arguments[3] : undefined;
  /*     
                                                                                                                                                                                          	权限判断 因为有的接口请求头可能需要添加的参数不一样，所以这里做了区分
                                                                                                                                                                                          	  == 不通过access_token校验的接口
                                                                                                                                                                                          	  == 文件下载接口列表
                                                                                                                                                                                          	  == 验证码登录 
                                                                                                                                                                                          */
  switch (power) {
    case 1:
      headers['Authorization'] = 'Basic a3N1ZGk6a3N1ZGk=';
      break;
    case 2:
      headers['Authorization'] = 'Basic a3N1ZGlfcGM6a3N1ZGlfcGM=';
      break;
    case 3:
      responseType = 'blob';
      break;
    default:
      // headers['Authorization'] = `Bearer ${
      //     this.$store.getters.userInfo
      // }`
      var token = uni.getStorageSync('token');
      if (token) {
        console.log('token===' + token);
        headers['token'] = token;
      }
      break;}


  return uni.request({
    url: BASE_URL + url,
    method: method,
    data: data,
    dataType: 'json',
    header: headers }).
  then(function (res) {
    console.log(res);
    console.log(res[1].data.errno);
    if (res[1].data.errno || res[1].data.errno == 0) {
      return res[1].data;
    } else {
      throw res[1].data;
    }
  }).catch(function (parmas) {
    switch (parmas.code) {
      case 401:
        uni.clearStorageSync();
        break;
      default:
        uni.showToast({
          title: parmas.info,
          icon: 'none' });

        return Promise.reject();
        break;}


  });
};var _default =

request;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/*!************************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/img/task/task-desc-topBG.png ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/*!*******************************************************************************!*\
  !*** /Users/chenwuzheng/Code/swby/scpc-wechat/static/img/mine/mine-topBG.png ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map