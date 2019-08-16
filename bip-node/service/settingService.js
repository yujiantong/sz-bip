/**
 * Created by qiumingyu on 2016/6/3.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');



function  initInsuranceComp(fourSId){
    var parm = {"_method":"SEARCH",fourSId:fourSId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/initInsuranceComp",parm)
            .then(function (body) {
                resolve(body);
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

function  updateInsuranceComp(insuranceCompIds, fourSId){
    var parm = {"_method":"UPDATE" ,insuranceCompIds:insuranceCompIds, fourSId:fourSId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/updateInsuranceComp", parm)
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

function  findByFourSId(fourSId){
    var parm = {"_method":"SEARCH" ,fourSId:fourSId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/findByFourSId", parm)
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

function  findModuleSet(storeId){
    var param = {"_method":"SELECT" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/findModuleSet",param)
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
function  findTraceDaySet(storeId){
     var param = {"_method":"SELECT" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/findTraceDaySet", param)
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
//更新模块开启设置
function  updateModuleSet(moduleSetInfo){
    var param = {"_method":"UPDATE" ,moduleSetInfo:moduleSetInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/updateModuleSet", param)
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

//更新级别跟踪天数设置
function  updateTraceDaySet(traceDaySetInfo){
    var param = {"_method":"UPDATE" ,traceDaySetInfo:traceDaySetInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/updateTraceDaySet", param)
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
//查询手续费设置
function  findFactorage(compPreId,storeId){
     var param = {"_method":"SEARCH" ,compPreId:compPreId,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/findFactorage", param)
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

//更新手续费设置
function  updateFactorage(factorageInfo,userId,userName){
    var param = {factorageInfo:factorageInfo,userId:userId,userName:userName};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/updateFactorage", param)
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

//保存手续费设置
function  insertFactorage(factorageInfo){
    var param = {"_method":"INSERT" ,factorageInfo:factorageInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/insertFactorage", param)
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

//保存模块开启设置
function  insertModuleSet(moduleSetInfo){
    var param = {"_method":"INSERT" ,moduleSetInfo:moduleSetInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/insertModuleSet", param)
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

//保存级别跟踪天数设置
function  insertTraceDaySet(traceDaySetInfo){
    var param = {"_method":"INSERT" ,traceDaySetInfo:traceDaySetInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/insertTraceDaySet", param)
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

//根据4s店id查询保险公司信息
function  findCompInfoByStoreId(storeId){
    var param = {"_method":"SEARCH" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/findCompInfoByStoreId", param)
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

//总经理设置锁死客户级别
function updateStoreLockLevel(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/setting/updateStoreLockLevel", param)
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

exports.initInsuranceComp  = initInsuranceComp;
exports.updateInsuranceComp  = updateInsuranceComp;
exports.findByFourSId  = findByFourSId;
exports.findModuleSet  = findModuleSet;
exports.findTraceDaySet  = findTraceDaySet;
exports.updateModuleSet  = updateModuleSet;
exports.updateTraceDaySet  = updateTraceDaySet;

exports.findFactorage  = findFactorage;
exports.updateFactorage  = updateFactorage;
exports.insertFactorage  = insertFactorage;
exports.insertModuleSet  = insertModuleSet;
exports.insertTraceDaySet  = insertTraceDaySet;

exports.findCompInfoByStoreId  = findCompInfoByStoreId;
exports.updateStoreLockLevel = updateStoreLockLevel;