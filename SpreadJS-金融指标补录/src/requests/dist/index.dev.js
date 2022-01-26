"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = getUsers;
exports.deleteSummaryTemplates = exports.updateSummaryTemplates = exports.saveSummaryTemplates = exports.getSummaryTemplateByKey = exports.getSummaryTemplates = exports.updateJob = exports.getJobs = exports.getJobByKey = exports.saveJob = exports.getStaffs = exports.getDepartments = exports.getTemplateByKey = exports.getAllTemplates = exports.deleteTemplate = exports.updateTemplate = exports.saveTemplate = void 0;

var _http = _interopRequireDefault(require("../utils/http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 获取用户列表
 */
function getUsers() {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/users').then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
}
/**
 * 保存模板
 */


var saveTemplate = function saveTemplate(template) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("post", '/templates', template).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 修改模板
 */


exports.saveTemplate = saveTemplate;

var updateTemplate = function updateTemplate(template) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("put", '/templates/' + template.key, template).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 删除模板
 */


exports.updateTemplate = updateTemplate;

var deleteTemplate = function deleteTemplate(templateKey) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("delete", '/templates/' + templateKey).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取模板列表
 */


exports.deleteTemplate = deleteTemplate;

var getAllTemplates = function getAllTemplates() {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/templates').then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取指定模板对象
 */


exports.getAllTemplates = getAllTemplates;

var getTemplateByKey = function getTemplateByKey(tempKey) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/templates', {
      key: tempKey
    }).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取部门信息
 */


exports.getTemplateByKey = getTemplateByKey;

var getDepartments = function getDepartments() {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/departmentTree').then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取人员信息
 */


exports.getDepartments = getDepartments;

var getStaffs = function getStaffs() {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/staffs').then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 保存Job
 */


exports.getStaffs = getStaffs;

var saveJob = function saveJob(job) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("post", '/jobs', job).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 查询指定Job
 */


exports.saveJob = saveJob;

var getJobByKey = function getJobByKey(jobKey) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/jobs', jobKey).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 查询Job
 */


exports.getJobByKey = getJobByKey;

var getJobs = function getJobs(condition) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/jobs', condition).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 修改Job
 */


exports.getJobs = getJobs;

var updateJob = function updateJob(job) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("put", '/jobs/' + job.key, job).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取汇总模板
 */


exports.updateJob = updateJob;

var getSummaryTemplates = function getSummaryTemplates() {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/summaryTemplates').then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 获取指定汇总模板
 */


exports.getSummaryTemplates = getSummaryTemplates;

var getSummaryTemplateByKey = function getSummaryTemplateByKey(key) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("get", '/summaryTemplates', key).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 保存汇总模板
 */


exports.getSummaryTemplateByKey = getSummaryTemplateByKey;

var saveSummaryTemplates = function saveSummaryTemplates(summaryTemplate) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("post", '/summaryTemplates', summaryTemplate).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 修改汇总模板
 */


exports.saveSummaryTemplates = saveSummaryTemplates;

var updateSummaryTemplates = function updateSummaryTemplates(summaryTemplate) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("put", '/summaryTemplates/' + summaryTemplate.key, summaryTemplate).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};
/**
 * 删除汇总模板
 */


exports.updateSummaryTemplates = updateSummaryTemplates;

var deleteSummaryTemplates = function deleteSummaryTemplates(summaryTemplateKey) {
  return new Promise(function (resolve, reject) {
    (0, _http["default"])("put", '/summaryTemplates/' + summaryTemplateKey).then(function (res) {
      resolve(res);
    }, function (error) {
      console.log("网络异常~", error);
      reject(error);
    });
  });
};

exports.deleteSummaryTemplates = deleteSummaryTemplates;