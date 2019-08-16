/**
 * Created by hlq on 2017/03/13.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

/*
* 查询更新密码记录
* param: storeId,operateTime
*/
function findByStoreAndTime(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/updatePasswordRecord/findByStoreAndTime",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

/*
 * 新增更新密码记录
 * param: property of UpdatePasswordRecord bean
 */
function addUpdateRecord(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/updatePasswordRecord/addUpdateRecord",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
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
 * 查询最近的更新密码操作记录
 * param: storeId
 */
function findLatestRecordByStore(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/updatePasswordRecord/findLatestRecordByStore",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    })
    return promise;
}

exports.findByStoreAndTime = findByStoreAndTime;
exports.addUpdateRecord = addUpdateRecord;
exports.findLatestRecordByStore = findLatestRecordByStore;

