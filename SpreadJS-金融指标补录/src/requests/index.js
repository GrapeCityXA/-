import http from "../utils/http"

/**
 * 获取用户列表
 */
function getUsers(){
  return new Promise((resolve, reject) => {
    http("get",'/users').then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
}

/**
 * 保存模板
 */
const saveTemplate = (template) => {
  return new Promise((resolve, reject) => {
    http("post",'/templates', template).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 修改模板
 */
const updateTemplate = (template) => {
  return new Promise((resolve, reject) => {
    http("put",'/templates/'+template.key, template).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 删除模板
 */
const deleteTemplate = (templateKey) => {
  return new Promise((resolve, reject) => {
    http("delete",'/templates/' + templateKey).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取模板列表
 */
 const getAllTemplates = () => {
  return new Promise((resolve, reject) => {
    http("get",'/templates').then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取指定模板对象
 */
 const getTemplateByKey = (tempKey) => {
  return new Promise((resolve, reject) => {
    http("get",'/templates', {key: tempKey}).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取部门信息
 */
 const getDepartments = () => {
  return new Promise((resolve, reject) => {
    http("get",'/departmentTree' ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取人员信息
 */
 const getStaffs = () => {
  return new Promise((resolve, reject) => {
    http("get",'/staffs' ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 保存Job
 */
 const saveJob = (job) => {
  return new Promise((resolve, reject) => {
    http("post",'/jobs', job ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 查询指定Job
 */
 const getJobByKey = (jobKey) => {
  return new Promise((resolve, reject) => {
    http("get",'/jobs', jobKey ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 查询Job
 */
 const getJobs = (condition) => {
  return new Promise((resolve, reject) => {
    http("get",'/jobs', condition ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 修改Job
 */
 const updateJob = (job) => {
  return new Promise((resolve, reject) => {
    http("put",'/jobs/'+job.key, job ).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取汇总模板
 */
 const getSummaryTemplates = () => {
  return new Promise((resolve, reject) => {
    http("get",'/summaryTemplates').then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 获取指定汇总模板
 */
 const getSummaryTemplateByKey = (key) => {
  return new Promise((resolve, reject) => {
    http("get",'/summaryTemplates', key).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 保存汇总模板
 */
 const saveSummaryTemplates = (summaryTemplate) => {
  return new Promise((resolve, reject) => {
    http("post",'/summaryTemplates', summaryTemplate).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 修改汇总模板
 */
 const updateSummaryTemplates = (summaryTemplate) => {
  return new Promise((resolve, reject) => {
    http("put",'/summaryTemplates/'+summaryTemplate.key, summaryTemplate).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

/**
 * 删除汇总模板
 */
 const deleteSummaryTemplates = (summaryTemplateKey) => {
  return new Promise((resolve, reject) => {
    http("put",'/summaryTemplates/'+summaryTemplateKey).then(res => {
      resolve (res);
    },error => {
      console.log("网络异常~",error);
      reject(error)
    })
  }) 
};

export {
   getUsers,
   saveTemplate,
   updateTemplate,
   deleteTemplate,
   getAllTemplates,
   getTemplateByKey,
   getDepartments,
   getStaffs,
   saveJob,
   getJobByKey,
   getJobs,
   updateJob,
   getSummaryTemplates,
   getSummaryTemplateByKey,
   saveSummaryTemplates,
   updateSummaryTemplates,
   deleteSummaryTemplates
}