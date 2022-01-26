"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
exports.patch = patch;
exports.put = put;
exports._delete = _delete;
exports["default"] = http;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 网络请求配置
 */
_axios["default"].defaults.timeout = 10000;
_axios["default"].defaults.baseURL = "http://localhost:3000/";
/**
 * http request 拦截器
 */

_axios["default"].interceptors.request.use(function (config) {
  config.data = JSON.stringify(config.data);
  config.headers = {
    "Content-Type": "application/json"
  };
  return config;
}, function (error) {
  return Promise.reject(error);
});
/**
 * http response 拦截器
 */


_axios["default"].interceptors.response.use(function (response) {
  if (response.data.errCode === 2) {
    console.log("http response 拦截器：过期");
  }

  return response;
}, function (error) {
  console.log("http response 拦截器：请求出错：", error);
});
/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */


function get(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    _axios["default"].get(url, {
      params: params
    }).then(function (response) {
      landing(url, params, response.data);
      resolve(response.data);
    })["catch"](function (error) {
      reject(error);
    });
  });
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */


function post(url, data) {
  return new Promise(function (resolve, reject) {
    _axios["default"].post(url, data).then(function (response) {
      //关闭进度条
      resolve(response.data);
    }, function (err) {
      reject(err);
    });
  });
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */


function patch(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    _axios["default"].patch(url, data).then(function (response) {
      resolve(response.data);
    }, function (err) {
      msag(err);
      reject(err);
    });
  });
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */


function put(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    _axios["default"].put(url, data).then(function (response) {
      resolve(response.data);
    }, function (err) {
      msag(err);
      reject(err);
    });
  });
}
/**
 * 封装delete请求
 * @param url
 * @returns {Promise}
 */


function _delete(url) {
  return new Promise(function (resolve, reject) {
    _axios["default"].put(url).then(function (response) {
      resolve(response.data);
    }, function (err) {
      msag(err);
      reject(err);
    });
  });
} //统一接口处理，返回数据


function http(fecth, url, param) {
  return new Promise(function (resolve, reject) {
    switch (fecth) {
      case "get":
        console.log("begin a get request,and url:", url);
        get(url, param).then(function (response) {
          resolve(response);
        })["catch"](function (error) {
          console.log("get request GET failed.", error);
          reject(error);
        });
        break;

      case "post":
        post(url, param).then(function (response) {
          resolve(response);
        })["catch"](function (error) {
          console.log("get request POST failed.", error);
          reject(error);
        });
        break;

      case "put":
        put(url, param).then(function (response) {
          resolve(response);
        })["catch"](function (error) {
          console.log("get request PUT failed.", error);
          reject(error);
        });
        break;

      case "patch":
        patch(url, param).then(function (response) {
          resolve(response);
        })["catch"](function (error) {
          console.log("get request PATCH failed.", error);
          reject(error);
        });
        break;

      case "delete":
        _delete(url).then(function (response) {
          resolve(response);
        })["catch"](function (error) {
          console.log("get request DELETE failed.", error);
          reject(error);
        });

        break;

      default:
        break;
    }
  });
} //失败提示


function msag(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        alert(err.response.data.error.details);
        break;

      case 401:
        alert("未授权，请登录");
        break;

      case 403:
        alert("拒绝访问");
        break;

      case 404:
        alert("请求地址出错");
        break;

      case 408:
        alert("请求超时");
        break;

      case 500:
        alert("服务器内部错误");
        break;

      case 501:
        alert("服务未实现");
        break;

      case 502:
        alert("网关错误");
        break;

      case 503:
        alert("服务不可用");
        break;

      case 504:
        alert("网关超时");
        break;

      case 505:
        alert("HTTP版本不受支持");
        break;

      default:
    }
  }
}
/**
 * 查看返回的数据
 * @param url
 * @param params
 * @param data
 */


function landing(url, params, data) {
  if (data.code === -1) {}
}