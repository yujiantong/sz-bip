var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;


function  findAllCoverType(){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findAllCoverType")
            .then(function (body) {
                console.log(body);
                resolve(body);
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据用户查询数量(应跟踪/未接收/待审批/将脱保/已脱保)
function  findCountByUserId(userId,storeId,roleId,bspStoreId,bangStatu){
    var param = {"_method":"SELECT" ,userId:userId, storeId:storeId,roleId:roleId,bspStoreId:bspStoreId,bangStatu:bangStatu};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findCountByUserId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据用户id查询未读消息
function  findMessage(userId,roleId){
    var param = {"_method":"SELECT" ,userId:userId, roleId:roleId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findMessage", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询系统消息
function  findSysMessage(userId){
    var param = {"_method":"SELECT",userId:userId };
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findSysMessage", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//新增系统消息
function  insertSysMessage(content){
    var param = {"_method":"INSERT" ,content:content};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/insertSysMessage", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除系统消息
function  deleteSysMessage(sysMessageId){
    var param = {"_method":"DELETE" ,sysMessageId:sysMessageId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/deleteSysMessage", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据店id查询店信息
function  findStoreById(storeId){
    var param = {storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findStoreById", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//APP首页查询各业务的数量(今日到店/今日出单/回退待审批/延期待审批/未接收/应跟踪/发起邀约/到店未出单/将脱保/已脱保)
function  findHomePageCount(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/common/findHomePageCount", param)
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

exports.findAllCoverType  = findAllCoverType;
exports.findCountByUserId  = findCountByUserId;
exports.findMessage  = findMessage;
exports.findStoreById  = findStoreById;
exports.findSysMessage  = findSysMessage;
exports.insertSysMessage  = insertSysMessage;
exports.deleteSysMessage  = deleteSysMessage;
exports.findHomePageCount = findHomePageCount;

