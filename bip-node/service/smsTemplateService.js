var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

/**
 * 查询营销模板
 * param: storeId
 */
function findByCondition(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/findByCondition", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 新增营销模板
 * param: smsTemplate bean
 */
function saveSmsTemplate(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/saveSmsTemplate", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 修改营销模板
 */
function updateTemplateById(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/updateTemplateById", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}


/**
 * 删除营销模板
 */
function deleteTemplateById(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/deleteTemplateById", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 根据模板id查询营销模板
 */
function findTemplateById(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/findTemplateById", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 禁用/启用营销模板
 * param: id,userName, enabledState
 */
function updateEnabledState(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/updateEnabledState", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 营销短信链接查询模板详情
 * @param obj
 */
function showModule(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/showModule", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

/**
 * 营销短信链接修改高意向
 * @param obj
 */
function updateCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/smsTemplate/updateCustomer", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

exports.findByCondition = findByCondition;
exports.saveSmsTemplate = saveSmsTemplate;
exports.updateTemplateById = updateTemplateById;
exports.deleteTemplateById = deleteTemplateById;
exports.findTemplateById = findTemplateById;
exports.updateEnabledState = updateEnabledState;
exports.showModule = showModule;
exports.updateCustomer = updateCustomer;