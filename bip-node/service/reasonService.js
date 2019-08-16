var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

/**
 * 新增回退失销原因
 * param: reason bean
 */
function addReason(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/reason/addReason", obj)
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
 * 删除回退失销原因
 * param: id
 */
function deleteById(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/reason/deleteById", obj)
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
 * 修改原因
 * params: reason bean
 */
function updateReason(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/reason/updateReason", obj)
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
 * 查询原因列表
 * params: storeId
 */
function findAllReason(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/reason/findAllReason", obj)
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
 * 查询回退失销原因的下拉框
 * params: storeId
 */
function findForSelectData(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/reason/findForSelectData", obj)
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



exports.addReason = addReason;
exports.deleteById = deleteById;
exports.updateReason = updateReason;
exports.findAllReason = findAllReason;
exports.findForSelectData = findForSelectData;

