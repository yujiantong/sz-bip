/**
 * Created by chenrunlin on 2017/06/21.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

/**
 * 根据条件查询维修记录
 * @param param
 */
function  findByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/maintenance/findByCondition",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

/**
 * 根据施工单号和店ID查询维修项目以及维修配件
 * @param param
 */
function  findByMaintainNumber(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/maintenance/findByMaintainNumber",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

/**
 * 新增推送修记录
 * @param param
 */
function  addPushMaintenance(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/pushMaintenance/addPushMaintenance",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

/**
 * 根据条件查询推送修记录
 * @param param
 */
function  findByConditionTSX(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/pushMaintenance/findByCondition",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

/**
 * 根据报案号以及店ID查询推送修记录
 * @param param
 */
function  findPMaintenanceByRNumber(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/pushMaintenance/findPMaintenanceByRNumber",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

/**
 * 台帐的推送修查询
 * @param param
 */
function  findTzPushMaintenance(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/pushMaintenance/findTzPushMaintenance",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

exports.findByCondition = findByCondition;
exports.findByMaintainNumber = findByMaintainNumber;
exports.addPushMaintenance = addPushMaintenance;
exports.findByConditionTSX = findByConditionTSX;
exports.findPMaintenanceByRNumber = findPMaintenanceByRNumber;
exports.findTzPushMaintenance = findTzPushMaintenance;